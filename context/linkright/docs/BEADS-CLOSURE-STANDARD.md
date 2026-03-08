# Beads Task Closure Standard

**Purpose**: Establish consistent evidence-based closure practices for all Beads issues, ensuring traceability and facilitating knowledge capture across releases.

**Version**: 1.0  
**Status**: Active  
**Last Updated**: 2026-03-08

---

## Closure Standard Template

Every Beads issue closure MUST include:

### 1. **Title** (Required)
Clear, action-oriented title that describes the completed work.

**Format**: `[Type]: Outcome achieved`  
**Examples**:
- ✅ `Audit: Zero-byte files verified as intentional .gitkeep`
- ✅ `Implementation: 24 new step files for phases D-M created`
- ❌ `Fixed stuff` (too vague)
- ❌ `Work done` (missing outcome)

---

### 2. **Description** (Required)
Narrative summary of what was accomplished and why it matters.

**Must Include**:
- What was the original problem/requirement?
- What specific actions were taken?
- Why is this important for Release 4?
- Any trade-offs or deferred work?

**Minimum Length**: 2-3 sentences  
**Maximum Length**: 1 paragraph (avoid walls of text; link to detailed docs instead)

**Example**:
```
Audited all 29 agents for XML depth compliance. Found 5 agents below 40-line threshold.
Enhanced each with expanded activation steps, menu-handlers, and rules sections.
All agents now meet BMAD structural requirements and are ready for workflow integration.
Deferred: TEA knowledge base population to Release 5 per ADR-004 (lower priority than
Phase D-M implementation).
```

---

### 3. **Acceptance Criteria** (3-5 items, Required)
Explicit, measurable criteria that were verified to confirm the task is truly complete.

**Format**: Checklist with measurement proof
```
- [ ] Criterion 1: Description + proof (file path, commit hash, test output)
- [ ] Criterion 2: Description + proof
- [ ] Criterion 3: Description + proof
```

**Example for bd-agent1 (Agent Normalization)**:
```
- [x] All 29 agents verified ≥ 40 lines
  PROOF: `for f in _lr/*/agents/*.md; do wc -l "$f"; done | grep -c ": [4-9][0-9]"` → 29 ✓
  
- [x] All agents have <agent>, <persona>, <activation>, <menu-handlers>, <rules>
  PROOF: Agent inspection shows all 5 required XML blocks present
  
- [x] 5 agents enhanced (sync-narrator 33→46, squick-* 39→49)
  PROOF: Git commit f146357 shows changes to 5 agent files
  
- [x] No agent XML structure broken by changes
  PROOF: Manual spot-check on lr-orchestrator, sync-linker, squick-ux confirms valid XML
```

---

### 4. **Resolution Evidence** (Required)
Concrete proof that the work was actually completed. Choose the most relevant for your task:

#### A. **Commit Hash** (for code changes)
Link to the specific git commit(s) that implement the closure.

**Format**: `Git commit: <hash>: <commit message>`  
**Example**: `Git commit: f146357: fix: Normalize all 29 agents to ≥40 lines`

#### B. **File Paths** (for created/modified files)
List specific files that prove completion.

**Format**: `Files: <path>, <path>, <path>`  
**Example**: `Files: _lr/docs/adrs/ADR-*.md (6 files), _lr/core/workflows/common/validation-template.md`

#### C. **Test Output** (for verified behavior)
Show actual test/validation output proving success.

**Format**: Command + output snippet
```bash
$ bd ready --json | jq '.[] | select(.status=="open") | .id' | wc -l
45
(Interpretation: 45 open/ready issues, down from 187 at Phase A start)
```

#### D. **Metrics/Counts** (for quantitative closure)
Numeric proof of completion.

**Format**: `Result: <metric> = <value>`  
**Example**:
- Result: Total agents normalized = 29 (100%)
- Result: Step files created = 24 (>25 lines each)
- Result: ADRs created = 5 (>70 lines each)

#### E. **Report Documents** (for analysis/audit closures)
Link to generated reports or documentation.

**Format**: `Report: <path>, <size>, <timestamp>`  
**Example**: `Report: Release_4.md (57KB, 1148 lines), context-z-phase-mapping.md (3.6KB)`

**Requirement**: Always provide at least ONE form of evidence. For complex tasks, combine multiple (e.g., commit hash + file paths + test output).

---

## Closure Quality Checklist

Before submitting a closure, verify:

- [ ] **Title is specific** - Outcome is clear from title alone
- [ ] **Description explains context** - Why was this work needed?
- [ ] **Acceptance criteria are testable** - Could someone else verify these?
- [ ] **Evidence is concrete** - Not vague ("it works"), but specific proof
- [ ] **Evidence is verifiable** - Someone could check the commit/file/test claim
- [ ] **No duplicates** - Task not already closed with same evidence
- [ ] **Linked to dependencies** - If this unblocks other work, link it
- [ ] **Traceability recorded** - Future developer can understand what was done

---

## Common Closure Patterns

### Pattern A: Implementation Task (Code/Files Created)
**Evidence combination**: Commit hash + File paths + File line counts
```
Acceptance:
- [x] Feature implemented per spec
  PROOF: Git commit 49cafef, 24 new files created (steps-c/step-41-64*.md)
  
- [x] All files > 25 lines, DEPENDENCIES sections present
  PROOF: wc -l checks show 27-36 lines each; grep DEPENDENCIES returns 24 matches

Resolution Evidence:
- Commit: 49cafef: feat: Implement 24 new step files for Context Z phases D-M
- Files: steps-c/step-{41..64}-*.md (24 files, 1.9KB total)
```

### Pattern B: Audit/Verification Task
**Evidence combination**: Audit report + Metrics + File evidence
```
Acceptance:
- [x] All 29 agents audited and verified
  PROOF: Audit script found 29 agents, line count verified for each
  
- [x] 5 agents enhanced, 24 agents already compliant
  PROOF: Commit f146357 modifies 5 files; remaining 24 show ≥40 lines

Resolution Evidence:
- Metrics: Agents normalized = 29/29 (100%)
- Report: Agent audit results (all >40 lines, complete XML structure)
- Commit: f146357: fix: Normalize all 29 agents to ≥40 lines
```

### Pattern C: Infrastructure/Configuration Task
**Evidence combination**: Manifests created + Validation output + File list
```
Acceptance:
- [x] 5 config manifests created and validated
  PROOF: ls -lh _lr/_config/*-manifest.csv shows 5 files (15KB total)
  
- [x] All manifests parse as valid CSV
  PROOF: head -1 each manifest shows headers; manual spot-check for syntax
  
- [x] Cross-reference validation passed (no broken paths)
  PROOF: Manifest entries cross-checked against filesystem; zero orphaned entries

Resolution Evidence:
- Files: agent-manifest.csv (31 lines), workflow-manifest.csv (29), 
  files-manifest.csv (11), task-manifest.csv (15), tool-manifest.csv (12)
- Commit: 3db3f87: feat: Create and audit 5 config manifests
```

### Pattern D: Documentation/Design Task
**Evidence combination**: Document paths + Word counts + Git history
```
Acceptance:
- [x] ADR template created per BMAD standard
  PROOF: ADR_TEMPLATE.md (81 lines), has sections (Context, Decision, Rationale, etc.)
  
- [x] 5 pilot ADRs created, each >70 lines, covering key decisions
  PROOF: ADR-001 (72 lines, E2 deferral), ADR-002 (74 lines, +2 agents), 
  ADR-003 (78 lines, Squick), ADR-004 (89 lines, TEA KB), ADR-005 (84 lines, Config)

Resolution Evidence:
- Files: _lr/docs/adrs/ADR_TEMPLATE.md (81 lines), ADR-001-005.md (72-89 lines each)
- Commit: 2a01ec8: feat: Create ADR template and 5 pilot ADRs
```

---

## Evidence Strength Ranking

**Strongest Evidence**:
1. Automated test output showing success (pass/fail is unambiguous)
2. Git commit with specific file diffs (verifiable history)
3. Quantified metrics with clear thresholds (5/5 tests, 29/29 agents)
4. File artifacts with line counts or size (verifiable via filesystem)

**Weaker Evidence**:
5. Verbal description without proof ("all agents look good")
6. Vague metrics ("lots of agents normalized")
7. Missing commit hash or file paths
8. No way for future developer to verify

**Unacceptable**:
❌ "Fixed it" with no proof
❌ "All working" with no metrics
❌ Evidence that doesn't match the claim
❌ Broken links or deleted files

---

## Closure Workflow

**Step 1**: Complete the work (implement, audit, test)  
**Step 2**: Gather evidence (commit hash, file paths, metrics, test output)  
**Step 3**: Write acceptance criteria using the evidence format above  
**Step 4**: Use `bd close <id>` with detailed `--reason` parameter  
**Step 5**: Verify the closure in `bd show <id>` - it shows in close_reason field  

**Example**:
```bash
bd close sync-mro.2.4 --reason "Execution complete: Normalized all 29 agents to ≥40 lines. 
Enhanced 5 agents: sync-narrator (33→46), squick-architect (39→49), etc. 
All agents verified with complete XML blocks: <agent>, <persona>, <activation>, <menu-handlers>, <rules>. 
Git commit: f146357. All agents BMAD-aligned."
```

---

## Review Checklist for Phase C (Beads Wiring)

When retrofitting closed issues or reviewing closures:

- [ ] **Closure reason field is populated** (not empty)
- [ ] **Evidence is specific** (not vague)
- [ ] **Evidence is verifiable** (commit hash, file path, metrics)
- [ ] **Acceptance criteria clear** (not ambiguous)
- [ ] **Context preserved** (future dev can understand why this was done)
- [ ] **Deferred work documented** (if deferring to next phase)
- [ ] **Dependencies linked** (if unblocking other work)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-08 | Initial standard created for Release 4 Beads wiring |

---

## References

- **BMAD Quality Gates**: Validation patterns that inform closure standards
- **Beads Documentation**: Task tracking and dependency management
- **Release 4 Checklist**: Closure verification gates
- **ADRs**: Architectural Decision Records explain strategic choices

