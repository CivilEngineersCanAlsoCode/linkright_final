# Evidence Collection Template

## Overview
Every Beads issue closure MUST include documented evidence proving completion. This ensures:
- ✅ Traceability: What was done, where, and why
- ✅ Auditability: Can revisit decisions months later
- ✅ Quality: Prevents premature/incomplete closures
- ✅ Learning: Build institutional knowledge

---

## Evidence Structure

When closing a Beads issue, use this format:

```markdown
EVIDENCE:
- Input: [What data/files were used as input]
- Operation: [Step-by-step what was actually done]
- Output: [Where output is stored, files created/modified]
- Metrics: [Which success criteria were satisfied; list them explicitly]
- Files modified: [Exact file paths changed]
- Test results: [If applicable, test output or validation results]
- Notes: [Any caveats, assumptions, or follow-up items]
```

---

## Field Definitions

### Input
**What:** Original state of data/files used
**Why:** Establishes baseline; useful for reproducing
**Example:**
```
- Input: 22 workflows in _lr/ directories
- Input: Existing workflow-manifest.csv (header-only, 0 data rows)
- Input: Phase coverage scanned via directory tree
```

### Operation
**What:** Exact steps performed
**Why:** Documents the "how" for future auditing
**Example:**
```
- Operation: Scanned all 22 workflows with find command
- Operation: Enhanced CSV schema with 6 new columns: type, phase_coverage, step_count, status, created_date, description
- Operation: Populated all 22 rows with accurate metadata
- Operation: Validated no duplicate entries (awk)
```

### Output
**What:** Where results are stored
**Why:** Must be findable and reproducible
**Example:**
```
- Output: /context/linkright/_lr/_config/workflow-manifest.csv
- Output: 23 lines (header + 22 workflows)
- Output: 9 columns: id, name, module, path, type, phase_coverage, step_count, description, status
```

### Metrics
**What:** Which success criteria from final-solutions.md were satisfied
**Why:** Proves the issue is actually complete
**Example:**
```
Metrics satisfied:
✅ All 17 workflows listed
✅ No duplicate entries
✅ All file_path values exist and are readable
✅ phase_coverage matches actual implementation (c|e|v)
✅ step_count matches directory scan
✅ Validation script runs without errors
```

### Files Modified
**What:** Exact paths of files changed
**Why:** Enables git diff review
**Example:**
```
- Files modified: /context/linkright/_lr/_config/workflow-manifest.csv
- Files deleted: /context/linkright/_lr/core/config/flex-workflow-twitter.md
- Files deleted: /context/linkright/_lr/core/config/flex-workflow-linkedin.md
- Files created: /context/linkright/_lr/core/config/mongodb-config.yaml (populated)
```

### Test Results
**What:** Any validation/testing that was run
**Why:** Proves robustness
**Example:**
```
- Test: CSV syntax validation (no parse errors)
- Test: All file paths exist: `ls -l` on each path successful
- Test: No empty columns in any row
- Test: phase_coverage matches workflow directory structure (100% verified)
```

### Notes
**What:** Caveats, assumptions, future work
**Why:** Documents context and constraints
**Example:**
```
- Notes: Used all existing workflows; did not create new ones
- Notes: Status field uses binary values (active/stub); can be enhanced later
- Notes: jd-optimize marked as "active" (64 steps); others "stub" (0 steps)
```

---

## Examples by Issue Type

### Example 1: Feature (P0-1 - Workflow Manifest Population)

```
bd close sync-qm-p0-1 --reason="✅ P0-1 COMPLETE: Workflow-manifest.csv populated with 22 workflows

EVIDENCE:
- Input: 22 workflow directories in _lr/ (core, sync, flex, squick, tea, cis modules)
- Input: Existing manifest with header-only (0 data rows)
- Operation: Scanned _lr/ with find/ls to identify all workflows
- Operation: Extracted phase coverage by checking for steps-c/, steps-e/, steps-v/ directories
- Operation: Counted step files in each workflow
- Operation: Enhanced CSV schema with 6 columns (type, phase_coverage, step_count, status, created_date, description)
- Operation: Populated all 22 rows with accurate metadata
- Output: /context/linkright/_lr/_config/workflow-manifest.csv (23 lines total)
- Metrics satisfied:
  ✅ All 22 workflows listed
  ✅ No duplicate entries (awk verification)
  ✅ All file_path values exist and readable
  ✅ phase_coverage accurate (c/e/v cross-checked with directories)
  ✅ step_count matches actual file count per workflow
  ✅ Validation script runs without errors
- Files modified: workflow-manifest.csv
- Test results: CSV syntax valid, no parse errors, all paths verified with `ls`
- Notes: Total workflow count is 22, not 17 as originally estimated; includes all modules"
```

### Example 2: Bug Fix (P0-2 - Zero-byte Files)

```
bd close sync-qm-p0-2 --reason="✅ P0-2 COMPLETE: Zero-byte files eliminated + configs populated

EVIDENCE:
- Input: 6 zero-byte stub files found via `find . -size 0`
- Input: 2 empty YAML config files (mongodb-config.yaml, chromadb-config.yaml)
- Operation: Deleted 6 zero-byte files (flex-workflow-*, squick-workflow-*, tea-kb-*)
- Operation: Populated mongodb-config.yaml with 66 lines (4 collections, indexes, TTL)
- Operation: Populated chromadb-config.yaml with 57 lines (3 collections, embedding config)
- Operation: Verified no remaining zero-byte files (except .gitkeep)
- Output: mongodb-config.yaml (66 lines, complete, env-var support)
- Output: chromadb-config.yaml (57 lines, complete, fallback modes)
- Metrics satisfied:
  ✅ All 8 zero-byte files deleted or populated
  ✅ No zero-byte files remain (verified with find)
  ✅ YAML syntax valid (no parse errors)
  ✅ All required fields present in both configs
  ✅ Agent activation step 2 (config load) succeeds
- Files modified: mongodb-config.yaml, chromadb-config.yaml
- Files deleted: flex-workflow-twitter.md, flex-workflow-linkedin.md, flex-workflow-instagram.md, squick-workflow-release.md, squick-workflow-qa.md, tea-kb-testing-patterns.md
- Test results: Config validation passed, agent activation test passed
- Notes: Both configs have env var support (MONGODB_HOST, CHROMADB_HOST) with fallbacks"
```

### Example 3: Documentation (P1-2 - ADR Creation)

```
bd close sync-qm-p1-2.1 --reason="✅ ADR-001: Beads for Task Persistence completed

EVIDENCE:
- Input: Requirements from architectural audit (need task persistence, dependency tracking)
- Operation: Researched Beads design philosophy (Github repo, blog post)
- Operation: Identified alternatives (Redis, PostgreSQL, file-based YAML)
- Operation: Evaluated each against Linkright's single-user constraint
- Operation: Documented decision rationale, consequences, decision maker
- Output: /context/linkright/docs/adrs/ADR-001-Beads-for-Task-Persistence.md (250 lines)
- Metrics satisfied:
  ✅ Context section clear
  ✅ Decision explicitly stated
  ✅ Alternatives section complete (3+ alternatives)
  ✅ Rationale honest and specific
  ✅ Consequences documented (pros and cons)
  ✅ Decision Maker identified (Satvik)
- Files created: ADR-001-Beads-for-Task-Persistence.md
- Test results: Reviewed by Prometheus (B-MAD architect), approved
- Notes: This ADR covers Satvik's tool preferences; not meant as universal best practice"
```

---

## Common Mistakes to Avoid

❌ **Too vague:**
```
EVIDENCE:
- Input: Done
- Operation: Fixed it
- Output: It works now
```
❌ Better:
```
EVIDENCE:
- Input: 3 atomicity violations in step files (steps doing 2-3 operations)
- Operation: Refactored each into separate single-operation steps with output schemas
- Output: 6 new step files created, original 3 files reduced to core operation
```

---

❌ **Missing files:**
```
EVIDENCE:
- Input: Some manifest files
- Operation: Updated manifests
- Output: Files updated
```
❌ Better:
```
EVIDENCE:
- Input: agent-manifest.csv, workflow-manifest.csv, files-manifest.csv
- Operation: Validated all for broken references, duplicates, zero-byte refs
- Output: All 3 manifests repaired, validation script created
- Files modified: agent-manifest.csv, workflow-manifest.csv, files-manifest.csv
- Files created: scripts/validate-manifests.sh
```

---

❌ **Unverifiable claims:**
```
EVIDENCE:
- Metrics: All quality gates working
```
❌ Better:
```
EVIDENCE:
- Metrics satisfied:
  ✅ Pre-gate validates inputs exist (tested with invalid input, correctly blocked)
  ✅ Post-gate validates output schema (tested with malformed output, correctly failed)
  ✅ Fail-gate defines recovery (fallback logic verified in 3 scenarios)
- Test results: 12 gate tests passed, 0 failed
```

---

## When to Close vs. Defer

### Close this issue when:
✅ All success criteria from final-solutions.md are met
✅ Evidence is documented and reproducible
✅ No critical blockers remain
✅ Quality bar is met (no "good enough" shortcuts)

### Defer/Re-open when:
🔄 Only partial success (mark with PARTIAL evidence)
🔄 Blocker discovered mid-execution (explain in notes)
🔄 Quality doesn't meet standard (revert and retry)

---

## Beads Integration

### Closing with Evidence (Command Format)

```bash
bd update <id> --notes="EVIDENCE:
- Input: ...
- Operation: ...
- Output: ...
- Metrics: ...
- Files modified: ...
- Test results: ...
"

bd close <id>
```

Or inline:
```bash
bd close <id> --reason="[evidence text here]"
```

### Reviewing Evidence Later

```bash
bd show <id>          # Shows notes field with evidence
bd show <id> --verbose  # Shows full history
```

---

## Mandatory vs. Optional

### ALWAYS REQUIRED (Non-Negotiable)
- Input: What was the state before?
- Operation: What exactly did you do?
- Output: Where are the results?
- Metrics: Which criteria satisfied?
- Files modified: What changed?

### REQUIRED for:
- Bug fixes: Test results (proof it's fixed)
- Documentation: Any caveats or assumptions

### OPTIONAL (but helpful)
- Notes: Future follow-ups, context

---

## Questions?

If unsure about what to include:
1. Imagine reviewing this in 6 months
2. Would you know what was done and why?
3. Could you reproduce the exact changes?

If answer is "no" to any of these → add more detail to evidence.

**Quality > Completion Speed** ✅
