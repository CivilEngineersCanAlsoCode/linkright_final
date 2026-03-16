# 05 — Source of Truth & File-to-Vector Sync

> Phase 1: DATA LAYER | Research Question #7 from research-plan.md
> Researched: 2026-03-16

---

## Problem Statement

LinkRight stores all content as **markdown, YAML, and CSV files in a git repo**. These files must be embedded as vectors in a vector DB (ChromaDB, currently configured at `setup/chromadb/`). The fundamental question:

**Files are the source of truth. Vectors are a derived index. How do we keep them in sync — reliably, cheaply, and without manual babysitting?**

If sync breaks silently, AI agents retrieve stale context → produce wrong outputs → user loses trust. This is a critical reliability concern for the two pillars (Vector DB + Beads).

---

## 1. Source of Truth Models

### Model A: Files → Vectors (One-Way, Files Authoritative) ✅ RECOMMENDED

```
Git repo (markdown/YAML/CSV)  ──embed──►  Vector DB (ChromaDB)
         SOURCE                              DERIVED INDEX
```

- Files are the **single producer** of truth
- Vectors are a **read-only projection** — can be fully rebuilt from files at any time
- Aligns with LinkRight's existing data flow contracts (each artifact has exactly one producer)
- Aligns with git-based workflow (version history, rollback, blame, PR review all work on files)
- If vector DB corrupts or drifts: `nuke + re-embed` is always safe

**This is the correct model for LinkRight.** The rest of this document assumes one-way file→vector sync.

### Model B: Vectors → Files (Vector DB Authoritative)

- Unusual. Used when AI generates content that doesn't need human-readable file representation
- Breaks git workflow, loses version history, makes collaboration harder
- **Not applicable to LinkRight**

### Model C: Bidirectional Sync

- Needed when both humans edit files AND AI writes back to vector DB independently
- Requires conflict resolution, merge strategies, consistency guarantees
- Massive complexity. Only justified for real-time collaborative editing (Google Docs-style)
- **Not needed.** LinkRight's write path should go: AI → file edit → commit → re-embed. Never AI → vector DB directly.

---

## 2. Change Detection Strategies

### Comparison Table

| Strategy | How It Works | Latency | Complexity | Reliability | Best For |
|----------|-------------|---------|------------|-------------|----------|
| **Content hashing** | SHA-256 of file contents, compare to stored hash per vector | On-demand | Low | High — deterministic | Primary strategy |
| **Git diff** | `git diff --name-only HEAD~1` or `git status` to find changed files | On-demand | Low | High — git is authoritative | Pre/post-commit hooks |
| **File mtime** | Check file modification timestamps | On-demand | Trivial | Medium — mtime can lie (touch, clone) | Not recommended alone |
| **FS watcher** | inotify (Linux) / fswatch (macOS) detects changes in real-time | Real-time | Medium | Medium — misses changes during downtime | Dev-time hot reload |
| **Manual trigger** | CLI command: `lr reindex` or `lr embed --changed` | Manual | Trivial | High — user-controlled | Always available as fallback |
| **Scheduled scan** | Cron/timer scans all files periodically | Periodic | Low | High | Catch-all safety net |

### Recommended: Content Hashing + Git Diff (Hybrid)

**Primary path (automated):** Git hooks detect changed files → content hash confirms actual change → re-embed only changed files.

**Fallback path (manual):** `lr reindex --full` nukes all vectors and re-embeds everything. Used for recovery, initial setup, or schema changes.

**Why hybrid?** Git diff is fast for finding *which* files changed. Content hash is the ground truth for *whether* a file's content actually changed (handles `git checkout`, reverts, whitespace-only changes).

---

## 3. LlamaIndex Ingestion Pipeline

LlamaIndex provides the most mature incremental ingestion system.

### Core Concept: IngestionPipeline + DocStore

```python
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb

# 1. Set up ChromaDB
chroma_client = chromadb.HttpClient(host="localhost", port=8000)
chroma_collection = chroma_client.get_or_create_collection("linkright")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

# 2. DocStore for change detection
docstore = SimpleDocumentStore()

# 3. Build pipeline with deduplication
pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=512, chunk_overlap=50),
        OpenAIEmbedding(model="text-embedding-3-small"),
    ],
    vector_store=vector_store,
    docstore=docstore,           # <-- enables change detection
    docstore_strategy="upserts", # "upserts" | "duplicates_only" | "upserts_and_delete"
)
```

### How Change Detection Works

1. **First run:** All documents are new → all get chunked, embedded, stored
2. **Subsequent runs:** Pipeline hashes each document's content (`doc.hash`)
3. **Comparison:** If `doc.hash` matches what's in docstore → **skip** (no re-embed)
4. **Changed docs:** If hash differs → re-chunk, re-embed, **upsert** into vector store
5. **Deleted docs:** With `"upserts_and_delete"` strategy → vectors for removed files get cleaned up

### DocStore Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| `upserts` | Re-embed changed docs, skip unchanged | Default — good for most cases |
| `duplicates_only` | Skip exact duplicates, allow similar | When same content appears in multiple files |
| `upserts_and_delete` | Upsert changed + **delete vectors for removed files** | **Recommended for LinkRight** — handles file deletions |

### Loading LinkRight Files

```python
from llama_index.core import SimpleDirectoryReader

# Load all content files
documents = SimpleDirectoryReader(
    input_dir="./context/linkright/_lr/",
    recursive=True,
    required_exts=[".md", ".yaml", ".yml", ".csv"],
    filename_as_id=True,  # Use file path as document ID — critical for tracking
).load_data()

# Add custom metadata
for doc in documents:
    # Extract module from path: context/linkright/_lr/sync/... → "sync"
    parts = doc.metadata.get("file_path", "").split("/")
    if "_lr" in parts:
        lr_idx = parts.index("_lr")
        if lr_idx + 1 < len(parts):
            doc.metadata["module"] = parts[lr_idx + 1]
    doc.metadata["source"] = "linkright-files"

# Run pipeline — only changed files get re-embedded
nodes = pipeline.run(documents=documents, show_progress=True)
print(f"Processed {len(nodes)} new/changed nodes")
```

### Persisting DocStore

```python
# Save docstore to disk (for cross-session change detection)
docstore.persist("./data/docstore.json")

# Load on next run
docstore = SimpleDocumentStore.from_persist_path("./data/docstore.json")
```

**Key insight:** The docstore JSON file should be committed to git alongside the vector DB data, or stored in a known location. It's the "memory" of what's already been embedded.

---

## 4. LangChain Document Loaders & Indexing API

### DirectoryLoader with File Type Detection

```python
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import (
    UnstructuredMarkdownLoader,
    CSVLoader,
    TextLoader,
)

# Map file extensions to loaders
loader = DirectoryLoader(
    "./context/linkright/_lr/",
    glob="**/*.md",
    loader_cls=UnstructuredMarkdownLoader,
    show_progress=True,
    use_multithreading=True,
    recursive=True,
)
md_docs = loader.load()

csv_loader = DirectoryLoader(
    "./context/linkright/_lr/",
    glob="**/*.csv",
    loader_cls=CSVLoader,
    recursive=True,
)
csv_docs = csv_loader.load()

all_docs = md_docs + csv_docs
```

### LangChain Indexing API (Deduplication)

LangChain's `index()` function provides record-level dedup similar to LlamaIndex's docstore:

```python
from langchain.indexes import index
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.indexes import SQLRecordManager

# Record manager tracks what's been indexed
record_manager = SQLRecordManager(
    namespace="linkright",
    db_url="sqlite:///data/record_manager.db",
)
record_manager.create_schema()

vectorstore = Chroma(
    collection_name="linkright",
    embedding_function=OpenAIEmbeddings(model="text-embedding-3-small"),
    persist_directory="./data/chroma",
)

# index() handles: skip unchanged, update changed, delete removed
result = index(
    all_docs,
    record_manager,
    vectorstore,
    cleanup="full",        # "full" = delete vectors for docs no longer present
    source_id_key="source", # metadata field identifying the source file
)
print(result)
# {'num_added': 5, 'num_updated': 2, 'num_skipped': 150, 'num_deleted': 1}
```

### Cleanup Modes

| Mode | Behavior | Safe? |
|------|----------|-------|
| `None` | Never delete, only add/update | Safe but accumulates stale vectors |
| `"incremental"` | Delete vectors for docs explicitly re-indexed | Safe, but won't catch file deletions |
| `"full"` | Delete ALL vectors not in current batch | **Use this** — handles deletions properly |

---

## 5. Incremental vs Full Re-Embed

### When to Use Incremental

- **Normal workflow:** File edited → commit → re-embed only that file
- **Cost:** ~$0.0001 per file (text-embedding-3-small at $0.02/1M tokens, avg file ~2K tokens)
- **Speed:** Seconds for a few files
- **Use case:** 95% of daily operations

### When to Use Full Re-Embed

| Trigger | Why |
|---------|-----|
| Embedding model change | All vectors use new model's dimensions |
| Chunking strategy change | Different chunk sizes = different vectors |
| Metadata schema change | Need to re-populate metadata fields |
| Vector DB corruption/reset | Recovery from data loss |
| Initial setup | First-time population |
| Major refactor | Many files moved/renamed simultaneously |

### Cost Analysis for Full Re-Embed

```
LinkRight current state:
- ~200 files in _lr/ directories
- Average ~3KB per file → ~750 tokens
- Total: ~150K tokens
- Cost with text-embedding-3-small: ~$0.003 (three tenths of a cent)
- Time: ~30 seconds

At scale (1000 files):
- ~750K tokens
- Cost: ~$0.015
- Time: ~2 minutes

Verdict: Full re-embed is CHEAP. Don't over-optimize incremental sync.
```

### Stale Vector Cleanup

**Problem:** File deleted or renamed → old vectors linger → AI retrieves outdated content.

**Solutions:**
1. **LlamaIndex `upserts_and_delete`:** Automatically removes vectors for docs not in current batch
2. **LangChain `cleanup="full"`:** Same behavior
3. **Manual:** Track file→vector mapping, delete orphaned vectors on each sync
4. **Nuclear option:** Drop collection + full re-embed (cheap enough to be viable)

**Recommended:** Use framework-level cleanup (`upserts_and_delete` or `cleanup="full"`). If that fails, nuclear option is fine given cost analysis above.

---

## 6. Git Hook Based Sync

### Post-Commit Hook (Recommended)

```bash
#!/usr/bin/env bash
# .git/hooks/post-commit
# Auto-embed changed files after each commit

set -euo pipefail

# Get files changed in the last commit
CHANGED_FILES=$(git diff-tree --no-commit-id --name-only -r HEAD | \
    grep -E '\.(md|yaml|yml|csv)$' | \
    grep -E '^context/linkright/_lr/' || true)

if [ -z "$CHANGED_FILES" ]; then
    echo "[lr-sync] No embeddable files changed. Skipping."
    exit 0
fi

echo "[lr-sync] Re-embedding $(echo "$CHANGED_FILES" | wc -l) changed files..."

# Run the embedding script (non-blocking — don't slow down git)
python3 scripts/embed-changed.py --files $CHANGED_FILES &
EMBED_PID=$!

# Don't block the commit — let embedding run in background
echo "[lr-sync] Embedding started (PID: $EMBED_PID). Will complete in background."
```

### The Embedding Script

```python
#!/usr/bin/env python3
# scripts/embed-changed.py
"""Embed specific changed files into ChromaDB."""

import argparse
import sys
from pathlib import Path

from llama_index.core import SimpleDirectoryReader, Document
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb


def embed_files(file_paths: list[str]):
    """Embed specific files (incremental)."""
    # Connect to ChromaDB
    client = chromadb.HttpClient(host="localhost", port=8000)
    collection = client.get_or_create_collection("linkright")
    vector_store = ChromaVectorStore(chroma_collection=collection)

    # Load persisted docstore
    docstore_path = Path("data/docstore.json")
    if docstore_path.exists():
        docstore = SimpleDocumentStore.from_persist_path(str(docstore_path))
    else:
        docstore = SimpleDocumentStore()

    # Load only the changed files
    documents = []
    for fp in file_paths:
        if Path(fp).exists():
            docs = SimpleDirectoryReader(
                input_files=[fp],
                filename_as_id=True,
            ).load_data()
            documents.extend(docs)

    if not documents:
        print("[lr-sync] No valid files to embed.")
        return

    # Run pipeline
    pipeline = IngestionPipeline(
        transformations=[
            SentenceSplitter(chunk_size=512, chunk_overlap=50),
            OpenAIEmbedding(model="text-embedding-3-small"),
        ],
        vector_store=vector_store,
        docstore=docstore,
        docstore_strategy="upserts",
    )

    nodes = pipeline.run(documents=documents, show_progress=True)
    docstore.persist(str(docstore_path))
    print(f"[lr-sync] Embedded {len(nodes)} nodes from {len(documents)} files.")


def full_reindex():
    """Nuclear option: drop and rebuild everything."""
    client = chromadb.HttpClient(host="localhost", port=8000)
    client.delete_collection("linkright")
    collection = client.create_collection("linkright")
    # ... load all files and embed
    print("[lr-sync] Full re-index complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--files", nargs="+", help="Specific files to embed")
    parser.add_argument("--full", action="store_true", help="Full re-index")
    args = parser.parse_args()

    if args.full:
        full_reindex()
    elif args.files:
        embed_files(args.files)
    else:
        print("Usage: embed-changed.py --files <paths...> | --full")
        sys.exit(1)
```

### CI/CD Integration

```yaml
# .github/workflows/embed-on-push.yml
name: Sync Vectors
on:
  push:
    branches: [main]
    paths:
      - 'context/linkright/_lr/**/*.md'
      - 'context/linkright/_lr/**/*.yaml'
      - 'context/linkright/_lr/**/*.yml'
      - 'context/linkright/_lr/**/*.csv'

jobs:
  embed:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install llama-index chromadb-client openai
      - run: python scripts/embed-changed.py --full
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          CHROMA_HOST: ${{ secrets.CHROMA_HOST }}
```

### Performance Impact of Git Hooks

| Hook Type | Blocking? | Impact | Recommendation |
|-----------|-----------|--------|----------------|
| `pre-commit` | Yes — blocks commit | **Bad** — embedding takes seconds, annoying in flow | Don't embed here |
| `post-commit` | Semi — runs after commit | OK if backgrounded | **Use this** with `&` |
| `post-merge` | Runs after pull/merge | Good for catching upstream changes | Use alongside post-commit |
| CI/CD on push | Async — separate process | **Best** — no local impact | Use for production vector DB |

**Recommended setup:**
1. **Local dev:** Post-commit hook (backgrounded) for fast feedback
2. **Production:** CI/CD pipeline on push to main for authoritative sync

---

## 7. Version Tracking

### Tracking Which File Version a Vector Came From

Store git metadata alongside each vector:

```python
import subprocess

def get_git_metadata(file_path: str) -> dict:
    """Get git version info for a file."""
    commit_hash = subprocess.check_output(
        ["git", "log", "-1", "--format=%H", "--", file_path],
        text=True,
    ).strip()
    commit_date = subprocess.check_output(
        ["git", "log", "-1", "--format=%aI", "--", file_path],
        text=True,
    ).strip()
    return {
        "git_commit": commit_hash,
        "git_date": commit_date,
        "file_path": file_path,
        "content_hash": hashlib.sha256(
            Path(file_path).read_bytes()
        ).hexdigest()[:16],
    }

# Attach to documents before embedding
for doc in documents:
    git_meta = get_git_metadata(doc.metadata["file_path"])
    doc.metadata.update(git_meta)
```

### Querying Version Info

```python
# After retrieval, check freshness
results = vector_store.query("job description optimization", top_k=5)
for result in results:
    print(f"  Source: {result.metadata['file_path']}")
    print(f"  From commit: {result.metadata['git_commit'][:8]}")
    print(f"  Date: {result.metadata['git_date']}")
```

### Rollback Support

Since files are the source of truth:

```bash
# Rollback a file to previous version
git checkout abc123 -- context/linkright/_lr/sync/workflows/jd-optimize/workflow.md

# Re-embed the rolled-back file
python scripts/embed-changed.py --files context/linkright/_lr/sync/workflows/jd-optimize/workflow.md

# Or nuclear: rollback everything and re-embed
git checkout abc123
python scripts/embed-changed.py --full
```

**No special vector rollback needed.** Git handles version history; vectors are always derivable from the current file state.

---

## 8. Architecture Recommendation for LinkRight

### The Sync Architecture

```
┌─────────────────────────────────────────────────────┐
│                    GIT REPO (Source of Truth)        │
│  context/linkright/_lr/**/*.{md,yaml,csv}           │
└──────────────┬──────────────────────────────────────┘
               │
               │ post-commit hook OR manual CLI
               │
               ▼
┌─────────────────────────────────────────────────────┐
│              INGESTION PIPELINE                      │
│  1. Git diff → identify changed files               │
│  2. Content hash → confirm actual change             │
│  3. LlamaIndex IngestionPipeline                     │
│     - SentenceSplitter (512 tokens, 50 overlap)      │
│     - OpenAI text-embedding-3-small                  │
│     - DocStore for dedup (upserts_and_delete)        │
│  4. Metadata: module, file_path, git_commit, hash    │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│              CHROMADB (Derived Index)                 │
│  Collection: "linkright"                             │
│  Metadata filters: module, file_path, source         │
│  Rebuild: always possible via `--full`               │
└─────────────────────────────────────────────────────┘
```

### CLI Commands (Proposed)

```bash
# Embed only changed files (incremental)
lr embed --changed

# Full re-index (nuclear option — cheap enough to use freely)
lr embed --full

# Check sync status
lr embed --status
# Output: "157/160 files synced. 3 files changed since last embed."

# Embed specific files
lr embed --files path/to/file1.md path/to/file2.yaml
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Source of truth | Files (one-way) | Git gives us versioning, collaboration, rollback for free |
| Change detection | Content hash + git diff | Hash is ground truth; git diff is fast filter |
| Ingestion framework | LlamaIndex IngestionPipeline | Best incremental support, native docstore, ChromaDB integration |
| Stale cleanup | `upserts_and_delete` strategy | Automatic orphan removal |
| Hook trigger | post-commit (background) | No commit-flow disruption |
| Full re-embed cost | ~$0.003 for current size | Cheap enough that nuclear option is always viable |
| Version tracking | Git commit hash in vector metadata | Free provenance without extra infrastructure |

---

## 9. Open Questions / Decisions Needed

1. **DocStore persistence location:** Commit `docstore.json` to git? Or store alongside ChromaDB data in `~/.autonomous-dev/chromadb/`?
2. **Embedding model lock-in:** text-embedding-3-small (1536 dims) vs nomic-embed-text (768 dims, local). Local = free but slower. Cloud = fast but costs.
3. **Hook installation:** Auto-install via `setup/bootstrap.sh`? Or manual setup?
4. **Multi-device sync:** If ChromaDB runs locally, vectors are device-specific. Re-embed on each device? Or share via Docker volume?
5. **Write-back path:** When AI generates new content (e.g., cover letter), does it: (a) write file → git commit → auto-embed, or (b) write directly to vector DB? Model A says (a).

---

## 10. What NOT to Build

- **Bidirectional sync** — unnecessary complexity for this use case
- **Real-time FS watchers** — git hooks are sufficient and more reliable
- **Custom change detection** — LlamaIndex's docstore handles this well
- **Vector versioning** — git already versions the source files; vectors are ephemeral
- **Complex conflict resolution** — one-way sync means no conflicts possible

---

## Latest Findings (March 2026 — External Research)

> **Source:** Gemini Deep Research output, verified March 17, 2026
> **Scope:** LlamaIndex/LangChain sync updates, new tools, git-native patterns, ChromaDB sync, production lessons

### LlamaIndex IngestionPipeline — 2026 State

The three `docstore_strategy` modes remain unchanged (`UPSERTS`, `DUPLICATES_ONLY`, `UPSERTS_AND_DELETE`), but execution has been drastically improved:

- **Parallelized ingestion** with remote caching (e.g., `RedisKVStore` as `IngestionCache`) for distributed worker clusters
- **New persistence pattern:** `pipeline.persist()` / `pipeline.load()` replaces manual docstore serialization. Saves entire pipeline state (transformation cache + docstore mapping) to `./pipeline_storage/` by default
- **ChromaDB atomic updates:** When docstore detects content change, pipeline handles deletion of old Chroma vectors before inserting new ones — prevents the "duplicate result" problem
- **Agentic Document Processing:** LlamaIndex has evolved into a platform supporting durable workflows that survive crashes (DBOS integration)

**Impact for LinkRight:** The `pipeline.persist()` pattern simplifies our proposed docstore management. No need to manually commit `docstore.json` to git — the pipeline handles its own state.

### LangChain Indexing API — New `scoped_full` Cleanup Mode

A significant addition in `langchain-core 0.3.25`:

| Cleanup Mode | Scope of Deletion | Use Case |
|---|---|---|
| `None` | No automatic deletions | Archival ingestion |
| `incremental` | Deletes old versions of updated docs based on hash | High-frequency updates without source removal |
| `full` | Deletes anything not in current batch | Complete directory mirroring (requires full sweep) |
| **`scoped_full`** (NEW) | Deletes absent docs **only within the source IDs in current batch** | **Partial re-indexing of specific folders/projects** |

**Why this matters:** `scoped_full` solves the "Loader Amnesia" problem — you can re-index just a subset of files (e.g., one module's docs) while correctly cleaning up deleted files within that subset, without affecting other modules' vectors.

**Consistency note:** Production teams report that the distributed nature (separate record manager + vector store) can cause consistency issues if a write succeeds in one but fails in the other. Standard mitigation: periodic "repair runs" in `full` mode.

### New Tools & Frameworks for File→Vector Sync

**Unstructured.io:**
- Evolved from open-source parsing library to comprehensive **ETL+ platform**
- Supports 1,250+ ingestion pipelines across 64+ file types
- Connector architecture linking cloud sources (Azure Blob, GCS, S3, Salesforce) to vector destinations
- Sync via hashed pointers and UUIDs — minimal database footprint
- ~10% aggregate latency improvement in 2026 through optimized partitioning

**Cognee (Memory-First Architecture):**
- Builds a **property graph alongside the vector index** — entity extraction + relationship detection
- v0.3 uses "clean and replace" strategy: deletes document's entire subgraph + vectors before re-ingesting
- Rationale: even single-character changes can shift semantic alignment of subsequent chunks, making incremental chunk updates semantically inconsistent
- Best for: systems needing entity resolution across documents

**Ragflow 0.21.0:**
- Orchestrated offline ingestion with decoupled upload/parsing stages
- LLMs generate summaries, keywords, metadata during ingestion itself
- Customizable RAG data pipelines within unified framework

**Verdict for LinkRight:** Unstructured.io is overkill for our markdown/YAML corpus. Cognee's graph approach is interesting for future career signal entity linking but premature now. Stick with LlamaIndex IngestionPipeline.

### Git-Native Sync Patterns — "Shadow Index" CI/CD

A production pattern has emerged in 2026 for documentation-heavy repos:

1. **Commit Detection:** GitHub Action triggers on push to main, identifies changed directories
2. **Differential Embedding:** Containerized script loads only changed files, using git commit hash as version metadata
3. **Sync-to-Vector:** Push new vectors to vector store (often using a **staging collection** to verify retrieval quality before production swap)
4. **State Persistence:** Latest successfully indexed commit hash stored in persistent store (Redis/file) — next CI run only processes delta

**Key insight:** The "staging collection" pattern prevents bad embeddings from reaching production. Swap is atomic — old collection replaced only after quality verification.

### ChromaDB — Native Sync Capabilities

**Chroma Sync (March 2026)** eliminates need for custom sync scripts for supported sources:

- **GitHub integration:** Target specific branches/commits, diff-based incremental updates using Tree-sitter for code-aware chunking
- **S3 integration:** Auto-sync on file updates with queue-based ingestion at scale
- **Web sources:** Crawl and sync web content directly
- Automatically generates dense + sparse embeddings using open models (no external API keys needed)
- Data searchable within minutes of upload

**Impact for LinkRight:** If we move to Chroma Cloud, Chroma Sync's GitHub integration could replace our entire custom post-commit hook + IngestionPipeline for the git→vector sync path. Worth evaluating for simplicity.

### Production Lessons — "Split Truth" Problem

A critical failure pattern documented in 2025-2026 production RAG systems:

**The "Split Truth" / "Split Reality" problem:** Vector store and transactional database fall out of sync. Example: recruiting AI recommended candidate based on 3-year-old resume from vector store, while Postgres correctly showed candidate was no longer job-seeking.

**Root cause:** "Vector Drift" — the time lag between a profile update and its re-embedding/indexing.

**Solution — Deterministic Middleware Layer:**
- Before retrieved context reaches LLM, middleware pulls latest state from SQL/primary DB
- Injects hard constraints into system prompt (e.g., "Current Status: NOT LOOKING FOR DEV ROLES")
- Forces LLM to override "rich but outdated" semantic data with "sparse but accurate" structured data

**Production Rebuild Strategies:**
- **Shadow Indexing:** Parallel index backfill while primary serves live traffic
- **Traffic Ramping:** Gradually shift query % to new index to warm caches
- **Resource Partitioning:** Partition by time/tenant for incremental rebuilds

**Impact for LinkRight:** Our one-way file→vector model (Section 1, Model A) already avoids the worst "Split Truth" scenarios since files are the single source of truth. But we should still implement a freshness check — when retrieving vectors, verify the `git_commit` metadata matches the current file state.

---

## Final External Research (March 2026)

> **Source:** Comprehensive external research answers (21 questions), verified March 2026
> **Scope:** Q10 git-native vector sync tools, Q11 LlamaIndex vs LangChain ingestion, Q12 webhook architecture

### Q10: Git-Native Vector Sync — Chroma Sync Is the Only Turnkey Tool

**Chroma Sync (Chroma Cloud):** The only production-ready turnkey tool for git→vector sync:
- Connects GitHub (public or private repos) to ChromaDB Cloud
- **Diff-based incremental ingestion** — only re-embeds changed files
- Syntax-aware code chunking via Tree-sitter
- Markdown-aware chunking with frontmatter extraction
- Auto-generates dense + sparse embeddings using open models (no external API keys needed)
- Pricing: $0.04/GiB usage-based
- **Limitation:** Only works with Chroma Cloud, not self-hosted ChromaDB or other vector DBs

**No widely used open-source equivalent exists.** Teams typically roll custom scripts or CI pipelines:
- GitHub Actions that `git pull`, compute diffs, upsert only changed docs via vector store API
- LangChain/LangChain can help (by tracking hashes/timestamps) but lack built-in Git watchers
- "CocoIndex" (historical) had Git support but is defunct

**For other DBs:** Implement a similar pipeline — on git webhook, enqueue changed-file processing. No single OSS tool does all of this.

### Q11: LlamaIndex vs LangChain for Ingestion

| Capability | LlamaIndex (v1.x, 2026) | LangChain (~v0.3, 2026) |
|---|---|---|
| **Incremental inserts** | `index.insert(Document)`, `index.delete()` | `.add_documents()`, `.delete()` (store-dependent) |
| **Deletion tracking** | Delete by `doc_id`, version via metadata | Depends on underlying store (Qdrant, Milvus support delete by ID) |
| **YAML frontmatter** | Not auto-extracted — use `python-frontmatter` + custom metadata | Not auto-extracted — use custom loaders |
| **Multi-store support** | Mature — Qdrant, Weaviate, Pinecone, Chroma, PGVector, Milvus, etc. | Mature — same breadth of backends |
| **Git watching** | None built-in | None built-in |
| **Production readiness** | Specialized for doc ingestion (tree/vector indices) with built-in insert/delete | More general (chains, agents) but document loaders widely used |

**Key takeaway:** Both are mature. Neither automatically watches git. You must call their APIs in your code. Use whichever fits your code style. LlamaIndex is specialized for doc ingestion; LangChain is more general-purpose.

### Q12: Webhook-Triggered Re-Indexing Architecture

The standard SaaS pattern for vector sync:

```
GitHub Webhook → Message Queue → Worker → Embed → Upsert
```

**Detailed flow:**
1. **Webhook:** On `git push`, GitHub calls your webhook endpoint
2. **Queue:** Service enqueues a job (AWS SQS, Kafka, Redis Streams)
3. **Worker:** Kubernetes pods dequeue, `git clone/fetch`, compute diffs
4. **Chunk & Embed:** Worker chunks changed files, calls embedding API
5. **Upsert:** Bulk-upsert into vector DB via SDK

**Shadow index (blue-green) strategy** — recommended for large re-indexes:
- Build new index in parallel while serving from old one
- Swap an alias when new index is complete and verified
- Prevents bad embeddings from reaching production

**Key features to implement:**
- Checkpointing progress (resume on failure)
- Idempotency (same webhook processed twice = same result)
- Logging and observability
- Bulk APIs for efficiency

**For LinkRight at current scale:** The full webhook→queue→worker architecture is overkill. A simple post-commit hook or CI/CD pipeline is sufficient. Scale to the full pattern only when approaching multi-user SaaS with >10K docs.

---

## Deep Research Prompt for External AI

> Use this prompt with a model that has web access to get the latest information:

Research the current state (2025-2026) of file-to-vector synchronization in AI/RAG systems. Specifically:

1. **LlamaIndex IngestionPipeline** — What is the latest API for incremental ingestion with docstore-based change detection? Has the `docstore_strategy` parameter changed? Are there new strategies beyond `upserts`, `duplicates_only`, and `upserts_and_delete`? What is the recommended way to persist docstore state across sessions? Any new integrations with ChromaDB specifically?

2. **LangChain Indexing API** — What is the current status of `langchain.indexes.index()` function and `SQLRecordManager`? Has the API stabilized or changed significantly? Are there new cleanup modes? How does it handle partial re-indexing (only specific files)?

3. **New tools/frameworks** — Are there any new open-source tools (2025-2026) specifically designed for file→vector sync? Examples: Unstructured.io ingestion pipelines, Cognee, Ragflow, or others. How do they handle change detection and incremental updates?

4. **Git-native approaches** — Are there any projects that use git hooks or git metadata natively for vector sync? For example, tools that watch a git repo and auto-embed on commit? Any GitHub Actions or CI/CD patterns for this?

5. **Embedding model considerations** — For a system that re-embeds frequently, what are the cost/performance tradeoffs of OpenAI text-embedding-3-small vs text-embedding-3-large vs local models (nomic-embed-text, BGE-M3) as of 2025-2026? Has pricing changed?

6. **ChromaDB-specific patterns** — ChromaDB's latest approach to document updates and deletions. Does ChromaDB now support native change detection or content hashing? Any new features for incremental updates?

7. **Production patterns** — Real-world examples of teams running file→vector sync in production. What went wrong? What patterns emerged? Any blog posts, case studies, or open-source implementations?

Please provide specific version numbers, API examples, and links to documentation or source code where possible. Flag anything that may have changed since your training cutoff.

Sources requested: Official docs, GitHub repos, blog posts from LlamaIndex/LangChain teams, and any relevant conference talks or papers.
