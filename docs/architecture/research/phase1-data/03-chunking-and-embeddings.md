# 03 — Chunking Strategies & Embedding Models

> **Research Agent 3** | Phase 1 — Data Layer | 2026-03-16
> **Scope**: Optimal chunking and embedding for LinkRight's vector DB (ChromaDB)

---

## Table of Contents

1. [Content Type Analysis](#1-content-type-analysis)
2. [LlamaIndex Chunking Strategies](#2-llamaindex-chunking-strategies)
3. [LangChain Text Splitters](#3-langchain-text-splitters)
4. [Optimal Chunk Strategy per Content Type](#4-optimal-chunk-strategy-per-content-type)
5. [Embedding Models Comparison](#5-embedding-models-comparison)
6. [Multilingual & Hinglish Handling](#6-multilingual--hinglish-handling)
7. [Cost Projections](#7-cost-projections)
8. [Local vs API-Based Embeddings](#8-local-vs-api-based-embeddings)
9. [Recommendations](#9-recommendations)
10. [Deep Research Prompt for External AI](#deep-research-prompt-for-external-ai)

---

## 1. Content Type Analysis

LinkRight has 746 files (~5.2 MB), heavily markdown-based. Key content types:

| Content Type | Count | Avg Size | Structure | Language |
|---|---|---|---|---|
| Agent `.md` files | 31 | 1-2 KB (40-70 lines) | YAML frontmatter + XML tags | English |
| Workflow YAML | 22 | 3-15 KB (5-30 lines) | Pure YAML, step references | English |
| Config YAML | 20+ | 2-5 KB (25-70 lines) | Nested YAML | English |
| Knowledge base `.md` | 40+ | 5-50 KB (50-500 lines) | Markdown with `##` sections | English |
| Module docs `.md` | 15+ | 30-100 KB (700-1500 lines) | Deep markdown, tables, code blocks | English |
| CSV manifests | 3 | 4-88 KB (32-2000 rows) | Tabular, typed columns | English |
| Agent sidecars | 29 | 0.5-1.5 KB | Unstructured markdown | English + Hinglish (user-facing) |

**Key observations**:
- Most files are small (<2 KB). Only module docs and CSVs are large.
- Agent files have a unique YAML frontmatter + XML body pattern.
- Hinglish content is primarily in user-facing communication, not stored content. The CLAUDE.md directive says "Communicate in Romanized Hindi (Hinglish)" but actual codebase content is English.
- ChromaDB is already configured: `text-embedding-3-small`, 1536 dimensions, cosine similarity.

---

## 2. LlamaIndex Chunking Strategies

### 2.1 MarkdownNodeParser

Parses markdown by heading hierarchy, preserving document structure.

```python
from llama_index.core.node_parser import MarkdownNodeParser

parser = MarkdownNodeParser()
nodes = parser.get_nodes_from_documents(documents)

# Each node gets metadata:
# - header_path: ["## Section", "### Subsection"]
# - Preserves heading hierarchy as parent-child relationships
```

**Strengths for LinkRight**:
- Perfect for knowledge base docs (40+ files with `##`-structured content)
- Preserves section hierarchy — critical for module docs (700-1500 lines)
- Automatically extracts heading path as metadata for filtered retrieval

**Weaknesses**:
- Does not handle YAML frontmatter extraction natively — needs preprocessing
- XML-structured agent files won't parse well with this alone
- No control over maximum chunk size — a 500-line section stays as one chunk

### 2.2 SentenceSplitter

Fixed-size chunking with sentence-boundary awareness.

```python
from llama_index.core.node_parser import SentenceSplitter

splitter = SentenceSplitter(
    chunk_size=512,       # tokens
    chunk_overlap=50,     # token overlap between chunks
    paragraph_separator="\n\n",
    secondary_chunking_regex="[.!?]\\s+"
)
nodes = splitter.get_nodes_from_documents(documents)
```

**Strengths**:
- Predictable chunk sizes — good for embedding model token limits
- Sentence-boundary awareness prevents mid-sentence splits
- Works well for unstructured prose (knowledge base, sidecar memories)

**Weaknesses**:
- Structure-unaware — splits YAML mid-block, breaks XML tags
- Doesn't leverage document hierarchy
- For structured content, produces semantically incoherent chunks

### 2.3 SemanticSplitter

Uses embedding similarity to find natural topic boundaries.

```python
from llama_index.core.node_parser import SemanticSplitterNodeParser
from llama_index.embeddings.openai import OpenAIEmbedding

splitter = SemanticSplitterNodeParser(
    embed_model=OpenAIEmbedding(model="text-embedding-3-small"),
    buffer_size=1,            # sentences to group
    breakpoint_percentile_threshold=95  # similarity drop = split point
)
nodes = splitter.get_nodes_from_documents(documents)
```

**Strengths**:
- Finds natural topic boundaries — ideal for long module docs
- Adapts to content rather than using fixed sizes
- Best retrieval quality for heterogeneous content

**Weaknesses**:
- **Expensive**: Requires embedding every sentence to compute similarities
- Slow for large corpora (500+ files)
- Non-deterministic — same content may chunk differently on re-run
- Overkill for small files (<2 KB) which are most of LinkRight's content

### 2.4 Metadata Extraction from YAML Frontmatter

LlamaIndex supports custom metadata extractors:

```python
import yaml
from llama_index.core import Document

def parse_agent_file(file_path: str) -> Document:
    with open(file_path) as f:
        content = f.read()

    # Split YAML frontmatter from body
    if content.startswith("---"):
        parts = content.split("---", 2)
        frontmatter = yaml.safe_load(parts[1])
        body = parts[2].strip()
    else:
        frontmatter = {}
        body = content

    return Document(
        text=body,
        metadata={
            "source": file_path,
            "agent_name": frontmatter.get("name", ""),
            "description": frontmatter.get("description", ""),
            "content_type": "agent",
            "module": _extract_module(file_path),  # core/sync/flex/squick
        }
    )
```

**Recommendation**: Always extract YAML frontmatter as metadata rather than embedding it inline. This enables filtered retrieval (e.g., "find all sync module agents").

### 2.5 Hierarchy-Aware Chunking

LlamaIndex's `HierarchicalNodeParser` creates parent-child chunk relationships:

```python
from llama_index.core.node_parser import HierarchicalNodeParser, get_leaf_nodes

hierarchical_parser = HierarchicalNodeParser.from_defaults(
    chunk_sizes=[2048, 512, 128]  # parent → child → leaf
)
nodes = hierarchical_parser.get_nodes_from_documents(documents)
leaf_nodes = get_leaf_nodes(nodes)

# Use with AutoMergingRetriever for smart context expansion
from llama_index.core.retrievers import AutoMergingRetriever
retriever = AutoMergingRetriever(
    vector_retriever,
    storage_context,
    simple_ratio_thresh=0.4  # merge to parent if 40%+ children match
)
```

**Why this matters for LinkRight**: Module docs (1500 lines) benefit from multi-resolution retrieval — find a specific subsection, then expand to parent context if needed.

---

## 3. LangChain Text Splitters

### 3.1 RecursiveCharacterTextSplitter

The workhorse splitter — tries multiple separators in order:

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # characters
    chunk_overlap=200,
    separators=["\n\n", "\n", ". ", " ", ""],
    length_function=len,
)
chunks = splitter.split_text(text)
```

**For YAML files** — use YAML-aware separators:

```python
yaml_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
    separators=["\n---\n", "\n\n", "\n", " ", ""],  # YAML doc separator first
)
```

### 3.2 MarkdownHeaderTextSplitter

Splits by markdown headers and preserves header hierarchy as metadata:

```python
from langchain_text_splitters import MarkdownHeaderTextSplitter

headers_to_split_on = [
    ("#", "h1"),
    ("##", "h2"),
    ("###", "h3"),
]
splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=headers_to_split_on,
    strip_headers=False,  # keep headers in chunk text
)
chunks = splitter.split_text(markdown_text)
# Each chunk has metadata: {"h1": "Title", "h2": "Section", "h3": "Subsection"}
```

**Pipeline pattern** — combine header splitting with size limiting:

```python
# Step 1: Split by headers (semantic boundaries)
md_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
md_chunks = md_splitter.split_text(text)

# Step 2: Limit chunk sizes within each section
char_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
final_chunks = char_splitter.split_documents(md_chunks)
```

### 3.3 LangChain Semantic Chunking

```python
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

chunker = SemanticChunker(
    OpenAIEmbeddings(model="text-embedding-3-small"),
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=95,
)
chunks = chunker.split_text(text)
```

### 3.4 LlamaIndex vs LangChain Comparison

| Feature | LlamaIndex | LangChain |
|---|---|---|
| Markdown-aware | `MarkdownNodeParser` (heading hierarchy) | `MarkdownHeaderTextSplitter` (header metadata) |
| Semantic splitting | `SemanticSplitterNodeParser` | `SemanticChunker` (experimental) |
| Hierarchical chunks | `HierarchicalNodeParser` + `AutoMergingRetriever` | Not natively supported |
| YAML frontmatter | Custom extractor needed | Custom extractor needed |
| Metadata propagation | First-class (node metadata) | Via `Document.metadata` dict |
| Retrieval integration | Tight (index → retriever → query engine) | Looser (splitter → vectorstore → retriever) |
| **Best for LinkRight** | **Knowledge base + module docs** (hierarchy) | **Simple chunking + custom pipelines** |

**Verdict**: LlamaIndex has stronger hierarchy-aware chunking (critical for LinkRight's nested markdown). LangChain's `MarkdownHeaderTextSplitter` + `RecursiveCharacterTextSplitter` pipeline is simpler and sufficient for most cases. Both need custom code for YAML frontmatter.

---

## 4. Optimal Chunk Strategy per Content Type

### 4.1 Strategy Matrix

| Content Type | Chunking Strategy | Chunk Size | Overlap | Rationale |
|---|---|---|---|---|
| **Agent `.md`** | **Whole file** (no splitting) | Entire file (1-2 KB) | N/A | Small, self-contained units. Splitting breaks XML structure. Embed as single chunk with frontmatter metadata extracted. |
| **Workflow YAML** | **Whole file** | Entire file (0.5-1 KB) | N/A | Tiny files. Splitting YAML mid-block loses context. Add `workflow_name`, `module` as metadata. |
| **Config YAML** | **Whole file** or **top-level key** | Entire file or per-key block | N/A | Small files. For larger configs (mongodb-config.yaml, 66 lines), split by top-level YAML key. |
| **CSV manifests** | **Row-group** (by module/type column) | 20-50 rows per chunk | 0 | Include CSV header in every chunk. Group rows by `module` or `type` column for semantic coherence. |
| **Knowledge base `.md`** | **MarkdownHeader + SizeLimiter** | 500-1000 chars per chunk | 100-200 chars | Split by `##` headers first, then limit size. Preserves section context via header metadata. |
| **Module docs `.md`** | **Hierarchical** (LlamaIndex) or **MarkdownHeader + Recursive** (LangChain) | Parent: 2048 tokens, Leaf: 512 tokens | 50-100 tokens | Large files (1500 lines). Multi-resolution retrieval needed. |
| **Agent sidecars** | **Whole file** | Entire file (0.5-1.5 KB) | N/A | Small, agent-specific. Include `agent_id` in metadata. |

### 4.2 Recommended Chunk Sizes for Code+Prose Mix

For LinkRight's mixed content (markdown prose + YAML code + XML agent definitions):

- **Prose-heavy content** (knowledge base, docs): **500-1000 characters** (~128-256 tokens)
  - Smaller chunks = more precise retrieval
  - Overlap of 100-200 characters prevents context loss at boundaries
- **Code/config** (YAML, XML): **Whole block** or **1000-2000 characters**
  - Code has higher information density per character
  - Splitting code blocks produces non-functional fragments
- **Mixed content**: **800 characters** as default, with structure-aware splitting
  - Split at `##` headers and code block boundaries (`\`\`\``)
  - Never split inside a code fence or YAML block

### 4.3 Unified Chunking Pipeline (Recommended)

```python
from llama_index.core.node_parser import MarkdownNodeParser, SentenceSplitter
from llama_index.core import Document
import yaml
from pathlib import Path

class LinkRightChunker:
    """Content-type-aware chunking for LinkRight."""

    def __init__(self):
        self.md_parser = MarkdownNodeParser()
        self.size_limiter = SentenceSplitter(chunk_size=512, chunk_overlap=50)

    def chunk_document(self, file_path: str) -> list:
        path = Path(file_path)
        content = path.read_text()

        # Route by content type
        if "agents/" in file_path and path.suffix == ".md":
            return self._chunk_agent(content, file_path)
        elif path.suffix in (".yaml", ".yml"):
            return self._chunk_yaml(content, file_path)
        elif path.suffix == ".csv":
            return self._chunk_csv(content, file_path)
        elif path.suffix == ".md":
            return self._chunk_markdown(content, file_path)
        else:
            return self._chunk_default(content, file_path)

    def _chunk_agent(self, content: str, path: str) -> list:
        """Agent files: whole file, extract frontmatter as metadata."""
        frontmatter, body = self._split_frontmatter(content)
        module = self._extract_module(path)
        return [Document(
            text=body,
            metadata={
                "source": path,
                "content_type": "agent",
                "module": module,
                **frontmatter,
            }
        )]

    def _chunk_yaml(self, content: str, path: str) -> list:
        """YAML files: whole file with parsed metadata."""
        try:
            data = yaml.safe_load(content)
            name = data.get("name", Path(path).stem)
        except yaml.YAMLError:
            name = Path(path).stem
        return [Document(
            text=content,
            metadata={
                "source": path,
                "content_type": "workflow" if "workflow" in path else "config",
                "name": name,
                "module": self._extract_module(path),
            }
        )]

    def _chunk_csv(self, content: str, path: str) -> list:
        """CSV files: group rows by module/type, include header in each chunk."""
        lines = content.strip().split("\n")
        header = lines[0]
        chunks = []
        # Group by ~50 rows
        for i in range(1, len(lines), 50):
            batch = lines[i:i+50]
            chunks.append(Document(
                text=header + "\n" + "\n".join(batch),
                metadata={
                    "source": path,
                    "content_type": "csv_manifest",
                    "row_range": f"{i}-{i+len(batch)-1}",
                }
            ))
        return chunks

    def _chunk_markdown(self, content: str, path: str) -> list:
        """Markdown: header-aware splitting with size limits."""
        frontmatter, body = self._split_frontmatter(content)
        doc = Document(text=body, metadata={
            "source": path,
            "content_type": "knowledge_base" if "knowledge" in path else "documentation",
            "module": self._extract_module(path),
            **frontmatter,
        })
        # For small files, return as-is
        if len(body) < 1500:
            return [doc]
        # For large files, split by headers then limit size
        nodes = self.md_parser.get_nodes_from_documents([doc])
        final = []
        for node in nodes:
            if len(node.text) > 2000:
                sub_nodes = self.size_limiter.get_nodes_from_documents(
                    [Document(text=node.text, metadata=node.metadata)]
                )
                final.extend(sub_nodes)
            else:
                final.append(node)
        return final

    def _split_frontmatter(self, content: str) -> tuple:
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                try:
                    return yaml.safe_load(parts[1]) or {}, parts[2].strip()
                except yaml.YAMLError:
                    pass
        return {}, content

    def _extract_module(self, path: str) -> str:
        for mod in ["core", "sync", "flex", "squick", "lifeos", "tea", "lrb"]:
            if f"/{mod}/" in path or f"_{mod}/" in path:
                return mod
        return "unknown"
```

---

## 5. Embedding Models Comparison

### 5.1 API-Based Models

| Model | Dimensions | MTEB Avg | Context | Cost (per 1M tokens) | Notes |
|---|---|---|---|---|---|
| **OpenAI text-embedding-3-small** | 1536 | 62.3 | 8191 | $0.02 | Current LinkRight config. Good quality/cost ratio. |
| **OpenAI text-embedding-3-large** | 3072 | 64.6 | 8191 | $0.13 | +3.7% quality for 6.5x cost. Supports dimension reduction (e.g., 256d, 1024d). |
| OpenAI text-embedding-ada-002 | 1536 | 61.0 | 8191 | $0.10 | **Legacy — do not use.** Worse quality AND more expensive than 3-small. |
| **Cohere embed-v3** (embed-english-v3.0) | 1024 | 64.5 | 512 | $0.10 | Excellent quality. Supports `input_type` parameter (query vs document). Short context window. |
| Cohere embed-multilingual-v3.0 | 1024 | 66.3 (multilingual) | 512 | $0.10 | Best multilingual option. 100+ languages. |
| **Google text-embedding-005** | 768 | 66.3 | 2048 | $0.10 ✅ (price updated) | Strong quality. Limited context window. |
| Voyage AI voyage-3 → **voyage-4-large** | 1024 | **66.8** ✅ | 32000 | $0.12 ✅ | Successor released Jan 2026. MoE architecture. Shared embedding space. |

### 5.2 Open Source Models

| Model | Dimensions | MTEB Avg | Size | GPU VRAM | Notes |
|---|---|---|---|---|---|
| **nomic-embed-text** (v1.5) | 768 | 62.3 | 137M params | ~1 GB | Best open-source quality/size ratio. Matryoshka dimensions (64-768). Apache 2.0. |
| **BGE-large-en-v1.5** | 1024 | 63.6 | 335M params | ~2 GB | Strong English performance. MIT license. |
| **e5-large-v2** | 1024 | 62.2 | 335M params | ~2 GB | Instruction-tuned. Prefix required ("query:" / "passage:"). |
| **GTE-large-en-v1.5** | 1024 | 65.4 | 434M params | ~2.5 GB | Alibaba. Top open-source MTEB. Apache 2.0. |
| mxbai-embed-large-v1 | 1024 | 64.7 | 335M params | ~2 GB | mixedbread.ai. Strong retrieval scores. |
| **Jina-embeddings-v3** → **v5** | 1024 | **71.7** ✅ (v5 NDCG@10) | 677M (small) / 239M (nano) | ~3 GB | 119+ languages. v5 released Feb 2026. #1 on MTEB retrieval. |
| **multilingual-e5-large** | 1024 | 61.5 | 560M params | ~3 GB | Best open-source multilingual. 100 languages including Hindi. |

### 5.3 Dimension vs Quality Tradeoff

OpenAI `text-embedding-3-large` supports native dimension reduction via `dimensions` parameter:

| Dimensions | MTEB Avg (approx) | Storage per vector | Use case |
|---|---|---|---|
| 3072 (full) | 64.6 | 12.3 KB | Maximum quality |
| 1536 | 63.8 | 6.1 KB | Good balance |
| 1024 | 63.0 | 4.1 KB | Compact, minimal quality loss |
| 512 | 61.5 | 2.0 KB | Space-constrained |
| 256 | 59.0 | 1.0 KB | Extreme compression |

**Matryoshka Representation Learning (MRL)**: `nomic-embed-text` v1.5 and `text-embedding-3-large` both support this — embed once at full dimension, truncate at query time for speed/quality tradeoff.

### 5.4 MTEB Benchmark Context

MTEB (Massive Text Embedding Benchmark) scores are averages across tasks: retrieval, classification, clustering, reranking, STS, pair classification, summarization.

**For retrieval specifically** (LinkRight's primary use case):

| Model | MTEB Retrieval (NDCG@10) |
|---|---|
| Voyage-4-large | 66.8 ✅ (updated from Voyage-3) |
| Cohere embed-v3 | 68.1 |
| text-embedding-3-large | 67.5 |
| GTE-large-en-v1.5 | 66.8 |
| text-embedding-3-small | 64.2 |
| nomic-embed-text v1.5 | 62.5 |

---

## 6. Multilingual & Hinglish Handling

### 6.1 The Hinglish Challenge

Hinglish (Hindi words written in Latin script) is linguistically tricky for embeddings:
- Not a standardized language — no ISO code, variable transliteration
- Mixes English vocabulary with Hindi grammar/words in Latin script
- Example: "Yeh feature kaafi accha hai, production me deploy karo" (This feature is quite good, deploy to production)

### 6.2 Model Support for Hinglish

| Model | Hindi Support | Romanized Hindi/Hinglish | Recommendation |
|---|---|---|---|
| text-embedding-3-small | Moderate | Partial — treats as English-like text | **Acceptable for LinkRight** — most content is English |
| text-embedding-3-large | Moderate | Partial | Same as above, slightly better |
| Cohere embed-multilingual-v3 | **Excellent** (explicit Hindi) | **Good** — trained on code-switched text | Best API option for Hinglish |
| multilingual-e5-large | **Excellent** (explicit Hindi) | Moderate | Best open-source for Hindi |
| Jina-embeddings-v5 | **Excellent** (119+ languages) | Good ✅ | Best multilingual option — #1 MTEB retrieval |
| nomic-embed-text | English-focused | **Poor** | Not recommended for Hinglish |
| BGE-large | English-focused | **Poor** | Not recommended for Hinglish |

### 6.3 Practical Assessment for LinkRight

**Reality check**: Based on codebase analysis, actual Hinglish content is minimal:
- Codebase content is 99%+ English
- Hinglish appears only in agent communication directives (CLAUDE.md rule)
- User queries may be in Hinglish, but retrieval targets (docs, configs) are English
- **Conclusion**: Hinglish embedding quality matters for **query encoding**, not document encoding

**Strategy**: Use an English-optimized model for document embedding. For query-time Hinglish handling:
1. Translate Hinglish queries to English before embedding (simple, effective)
2. Or use a multilingual model for query encoding only (more complex)

---

## 7. Cost Projections

### 7.1 Corpus Size Estimation

| Content Type | Files | Avg Size | Total |
|---|---|---|---|
| Agent `.md` | 31 | 1.5 KB | 46.5 KB |
| Workflow YAML | 22 | 5 KB | 110 KB |
| Config YAML | 20 | 3 KB | 60 KB |
| Knowledge base | 40 | 25 KB | 1,000 KB |
| Module docs | 15 | 65 KB | 975 KB |
| CSV manifests | 3 | 30 KB | 90 KB |
| Sidecars | 29 | 1 KB | 29 KB |
| **Total** | **~160** | — | **~2.3 MB** |

Remaining ~350 files are templates, scripts, etc. — likely ~0.7 MB of embeddable content.
**Total embeddable text: ~2-3 MB** (~500K-750K tokens at ~4 chars/token).

### 7.2 Embedding Cost (One-Time Indexing)

| Model | Cost per 1M tokens | Cost for 750K tokens | Cost for re-index (10x/year) |
|---|---|---|---|
| **text-embedding-3-small** | $0.02 | **$0.015** | $0.15/year |
| text-embedding-3-large | $0.13 | $0.098 | $0.98/year |
| Cohere embed-v3 | $0.10 | $0.075 | $0.75/year |
| Google text-embedding-005 | $0.00625 | $0.005 | $0.05/year |
| **Open source (local)** | $0.00 | **$0.00** | $0.00 |

### 7.3 Query-Time Embedding Cost

Assuming 100 queries/day, average query length 50 tokens:

| Model | Daily cost | Monthly cost | Annual cost |
|---|---|---|---|
| text-embedding-3-small | $0.0001 | $0.003 | $0.036 |
| text-embedding-3-large | $0.00065 | $0.02 | $0.24 |
| Open source | $0.00 | $0.00 | $0.00 |

**Bottom line**: At LinkRight's scale (~2-3 MB), embedding costs are **negligible** (<$1/year) for any API model. Cost should not be a deciding factor. Optimize for quality.

---

## 8. Local vs API-Based Embeddings

### 8.1 GPU Requirements for Local Inference

| Model | Params | Min VRAM | Recommended GPU | Throughput (docs/sec) |
|---|---|---|---|---|
| nomic-embed-text | 137M | 1 GB | Any modern GPU / CPU-viable | 500+ |
| BGE-large | 335M | 2 GB | T4 / RTX 3060 | 200+ |
| GTE-large | 434M | 2.5 GB | T4 / RTX 3060 | 150+ |
| multilingual-e5-large | 560M | 3 GB | A10 / RTX 3070 | 100+ |
| Jina-embeddings-v3 | 570M | 3 GB | A10 / RTX 3070 | 100+ |

**CPU inference**: Models under 500M params run acceptably on CPU (10-50 docs/sec). For LinkRight's corpus size (~500 files), even CPU-only re-indexing completes in under a minute.

### 8.2 When Does Local Make Sense?

| Factor | API | Local |
|---|---|---|
| **Setup complexity** | Zero (API key) | Moderate (install torch, download model) |
| **Latency** | 50-200ms per call | 5-20ms per call (GPU) |
| **Cost at scale** | Per-token pricing | Fixed infrastructure cost |
| **Quality ceiling** | Higher (latest models) | Slightly lower (open-source lags) |
| **Privacy** | Data sent to provider | Data stays local |
| **Offline capability** | No | Yes |
| **Break-even point** | <10M tokens/month | >10M tokens/month |

### 8.3 Recommendation for LinkRight

**Use API-based embeddings (text-embedding-3-small)** because:
1. Corpus is tiny (~750K tokens). Cost is negligible ($0.015 per full index).
2. Already configured in ChromaDB config.
3. Zero infrastructure to maintain.
4. Superior quality to similarly-priced open-source models.

**Consider local** only if:
- Privacy requirements change (embedding user resumes locally)
- Offline operation needed
- Scaling to 10,000+ documents

---

## 9. Recommendations

### 9.1 Immediate (Keep Current Stack)

1. **Keep `text-embedding-3-small`** — already configured, excellent cost/quality for LinkRight's scale.
2. **Implement content-type-aware chunking** using the `LinkRightChunker` pipeline (Section 4.3):
   - Agent files & workflow YAML → whole file, metadata-enriched
   - Knowledge base & module docs → MarkdownHeader + size limiter
   - CSV → row-group with header preservation
3. **Extract YAML frontmatter as metadata** — enables filtered retrieval by module, agent, content type.
4. **Chunk sizes**: 512 tokens for prose, whole-file for small structured content.

### 9.2 Near-Term Improvements

1. **Add metadata filtering to retrieval** — ChromaDB supports `where` filters:
   ```python
   results = collection.query(
       query_texts=["career signals"],
       where={"module": "sync"},  # filter by module
       n_results=5,
   )
   ```
2. **Hierarchical chunking for large docs** — use `HierarchicalNodeParser` with `AutoMergingRetriever` for module docs (1500+ lines).
3. **Evaluate `text-embedding-3-large` at reduced dimensions** (1024d) — may give quality uplift with same storage as current 1536d config. Also consider **jina-embeddings-v5** (71.7 NDCG@10 retrieval, 1024d, $0.05/1M tokens) as a strong alternative.

### 9.3 Future Considerations

1. **Cohere embed-multilingual-v3** if Hinglish content grows or user queries are frequently Hinglish.
2. **Voyage-3** if retrieval quality becomes critical (highest MTEB retrieval scores).
3. **nomic-embed-text locally** if privacy/offline requirements emerge — CPU-viable, Apache 2.0.
4. **Reranking** (Cohere rerank-v3, BGE-reranker) as a second-stage filter to improve precision — more impactful than switching embedding models.

---

## Latest Findings (March 2026 — External Research)

> **Source:** Gemini Deep Research output, verified March 17, 2026
> **Scope:** MTEB leaderboard, new models, pricing, Hinglish, chunking updates, ChromaDB

### MTEB Benchmark Leaderboard — Retrieval NDCG@10 (March 2026)

The landscape has shifted significantly. New models from Jina, Qwen, and Google now dominate:

| Rank | Model | NDCG@10 (Retrieval) | Dimensions | Context Window |
|------|-------|---------------------|------------|----------------|
| **1** | **jina-embeddings-v5-text-small** | **71.7** | 1024 | 32,768 |
| 2 | Qwen3-Embedding-8B | 70.58 | 4096 | 32,768 |
| 3 | gte-Qwen2-7B-instruct | 70.24 | 3584 | 32,000 |
| 4 | Gemini-embedding-001 | 68.32 | 3072 | Variable |
| 5 | Voyage-4-large | 66.8 | 1024 | 32,000 |
| 6 | Cohere embed-v4 | 65.2 | 1024 | 128,000 |
| 7 | OpenAI text-embedding-3-large | 64.6 | 3072 | 8,191 |
| 8 | BGE-M3 | 63.0 | 1024 | 8,192 |
| 12 | nomic-embed-text-v1.5 | 59.4 | 768 | 8,192 |

**Leaderboard URL:** https://huggingface.co/spaces/mteb/leaderboard

**Key takeaways:**
- Jina v5 leapfrogs all previous leaders with 71.7 NDCG@10
- OpenAI text-embedding-3-large (64.6) is now ranked #7, not top-3
- Cohere embed-v4 released with 128K context window (massive improvement over v3's 512 tokens)
- text-embedding-3-small not in top 12 for retrieval — still acceptable for LinkRight's scale

### New Embedding Models (2025–2026)

| Model | Release Date | Key Features |
|-------|-------------|-------------|
| **Jina-embeddings-v5-text** | Feb 18, 2026 | 677M (small) / 239M (nano), 119+ languages, 32K context, task-specific LoRA |
| **Voyage-4 Series** | Jan 15, 2026 | MoE architecture, **shared embedding space** (mix models in same index), voyage-4-large/4/4-lite |
| **Gemini-embedding-2-preview** | Mar 10, 2026 | First natively **multimodal** embedding (text+image+video+audio+PDF in one space) |
| **text-embedding-4** (OpenAI) | Aug 31, 2025 | Successor to v3 series, improved across 8K tokens |

**Notable:** Voyage-4's shared embedding space allows using voyage-4-lite for queries and voyage-4-large for indexing — asymmetric retrieval with cost savings.

### Current API Pricing (March 2026)

| Provider | Model | Per 1M Tokens |
|----------|-------|--------------|
| OpenAI | text-embedding-3-small | $0.02 (unchanged) |
| OpenAI | text-embedding-3-large | $0.13 (unchanged) |
| Cohere | embed-v4.0 | $0.12 |
| Google | text-embedding-005 | $0.10 |
| Voyage AI | voyage-4-large | $0.12 |
| Voyage AI | voyage-4-lite | $0.02 |
| Jina AI | jina-embeddings-v5 | $0.05 |

**Batch processing:** Most providers now offer 50% discounts for batch/async embedding jobs.

**Impact for LinkRight:** At ~750K tokens total corpus, even the most expensive model (text-embedding-3-large) costs <$0.10 per full re-index. Pricing remains negligible at our scale.

### Hinglish / Code-Switched Text — Latest Research

Specialized Indic models now significantly outperform general-purpose models for Hinglish:

- **MuRIL (Multilingual Representations for Indian Languages):** Achieves **87.3% intent accuracy** and **84.2% entity recognition F1** on Hindi-English code-mixed text — ~12.8% improvement over general multilingual models
- **Vyakyarth-1-Indic-Embedding:** New Indic-specific model fine-tuned on 10 major Indian languages, addresses cross-lingual/cross-script gaps
- **CBOW + LLaMA combination:** January 2026 study found this achieves highest performance on 16,000 Hinglish sentences for emotion recognition, outperforming standard BERT/SBERT
- **Deromanization strategy:** Transliterating Romanized Hindi back to Devanagari before embedding boosts downstream F1 by ≥3% with XLM-R

**Practical recommendation:** If Hinglish retrieval becomes a primary KPI, use MuRIL or Vyakyarth-1 instead of text-embedding-3-small. For now, LinkRight's English-dominant content means the current model remains adequate for document encoding.

### Chunking Strategy Updates (2025–2026)

Both frameworks have shifted toward **"Agentic Chunking"** — segmentation driven by model reasoning rather than fixed character counts.

**LlamaIndex:**
- **LlamaSplit (Dec 2025):** Beta API that uses AI to automatically separate bundled documents into distinct sections by category
- **LlamaSheets (Jan 2026):** Specialized parser for complex spreadsheets preserving hierarchical structure and multi-level headers
- **Long-Horizon Agents:** Framework now supports agents maintaining context over weeks of document iteration

**LangChain:**
- **Semantic Chunking:** Now considered **mature production option** (was experimental). Detects semantic "valleys" (topic shifts) between sentences
- **LLM-Assisted Segmentation:** Using smaller LLMs (e.g., Gemini 2.5 Flash) as pre-processors for proposition extraction and clustering
- **Production finding (2026):** **Recursive Character Splitting at 512 tokens** still often outperforms semantic chunking — semantic chunking creates 3–5x more vector fragments, increasing noise and storage costs

**Verdict for LinkRight:** Stick with the recommended `LinkRightChunker` pipeline (Section 4.3) using structure-aware splitting. Semantic chunking is overkill for our small, well-structured corpus. LlamaSplit could be valuable if we start ingesting user-uploaded documents (resumes, JDs).

### ChromaDB Updates (March 2026)

- **Latest version:** ChromaDB **1.5.3** (March 7, 2026)
- **Chroma Sync (March 2026):** New native capabilities for syncing data directly from **S3, GitHub, and Web sources** — eliminates need for custom sync scripts for supported sources
  - GitHub: targets specific branches/commits with diff-based incremental updates
  - S3: auto-sync on file updates with queue-based ingestion
  - Uses Tree-sitter for syntax-aware code chunking
- **New embedding function:** Native support for **Perplexity embedding function** (Pplx EF) added in v1.5.1
- **OpenCLIP multimodal retrieval** walkthroughs added (text-to-image) as of Feb 2026
- **Cloud performance:** Write 30 MB/s (~2000 QPS), 5M records/collection, ~20ms p50 query latency (warm), $0.02/GB/mo storage

**Impact for LinkRight:** Chroma Sync's GitHub integration could replace our custom post-commit hook approach for vector sync. Worth evaluating as an alternative to the LlamaIndex IngestionPipeline for GitHub-based repos.

---

## Deep Research Prompt for External AI

Use this prompt with a research-capable AI (e.g., ChatGPT with browsing, Perplexity, Gemini) to get the latest data:

---

> **Research Request: Embedding Models & Chunking — Latest Data (2025-2026)**
>
> I'm building a vector database (ChromaDB) for an AI platform that indexes ~500 markdown files, YAML configs, and CSV files (~2-3 MB total). Content is primarily English with some Romanized Hindi (Hinglish) in user queries. I need the latest data on these topics:
>
> 1. **MTEB Benchmark Leaderboard (current top 20)**: What are the latest MTEB scores as of early 2026? Specifically retrieval (NDCG@10) scores for: OpenAI text-embedding-3-small/large, Cohere embed-v3/v4 (if released), Google text-embedding-005/006, Voyage AI voyage-3/4, nomic-embed-text v1.5/v2, Jina-embeddings-v3/v4, BGE-m3, GTE-Qwen2, and any new top-performing models. Please include the MTEB leaderboard URL and date accessed.
>
> 2. **New embedding models released in 2025-2026**: Have OpenAI, Cohere, Google, Anthropic, or any open-source projects released new embedding models since mid-2025? What are their specs (dimensions, context window, MTEB scores, pricing)?
>
> 3. **Current API pricing**: What is the exact per-1M-token pricing for OpenAI text-embedding-3-small, text-embedding-3-large, Cohere embed-v3, Google text-embedding-005, and Voyage AI models as of March 2026? Has pricing changed since 2024?
>
> 4. **Hinglish/code-switched text embedding performance**: Are there any published benchmarks or papers evaluating embedding model performance on Romanized Hindi (Hinglish) or Hindi-English code-switched text? Specifically interested in retrieval tasks. Any models specifically fine-tuned for Indian language code-switching?
>
> 5. **LlamaIndex vs LangChain chunking updates**: Have LlamaIndex or LangChain released new chunking strategies in 2025-2026? Specifically: any improvements to semantic chunking, hierarchical parsing, or YAML-aware splitters? Any new "agentic chunking" or LLM-assisted chunking approaches that are production-ready?
>
> 6. **ChromaDB embedding function updates**: Does ChromaDB have native support for any new embedding models or built-in chunking as of 2026?
>
> Please provide specific sources (URLs, paper titles, documentation links) for all claims. Distinguish between verified benchmarks and marketing claims.

---

*End of research document.*
