# Beads Dependency Wiring Guide

**Purpose**: Document patterns and procedures for wiring task dependencies in Beads to ensure traceability and prevent circular blockers (maintain DAG - Directed Acyclic Graph integrity).

**Version**: 1.0  
**Status**: Active for Phase C  
**Created**: 2026-03-08

---

## Dependency Model

### Core Concepts

**Blocking Relationship**: Task A `--blocks-->` Task B  
- Meaning: B cannot start until A is complete
- In Beads: `bd dep add A --blocks B`  
- Status: B appears in `bd blocked` until A closes

**Blocked Relationship**: Task B `--blocked-by-->` Task A  
- Same as above, inverse perspective
- In Beads: `bd dep add B A` (B depends on A)

**DAG Property**: No circular dependencies  
- Invalid: A blocks B, B blocks A
- Check: `bd blocked` returns empty when all non-blocked issues are closed
- Verification: Run `bd dep tree <epic-id>` and confirm no cycles

---

## Epic Decomposition Pattern

### Level 1: Epic (Release scope)
Examples: Release 2 "Forward", "Reverse", "Quality", "Bugs"
- Spans entire release or major initiative
- Contains 2-5 features
- Timeline: 2-6 weeks

### Level 2: Features (Capability area)
Examples: 
- Feature: "Career Signal Optimization"
- Feature: "Resume Quality Validation"
- Feature: "Agent Depth Normalization"
- Span: 1-3 weeks
- Subtasks: 3-8 tasks per feature

### Level 3: Tasks (Atomic work items)
Examples:
- Task: "Implement signal extraction algorithm"
- Task: "Create validation template"
- Task: "Normalize all 29 agents"
- Span: 2-5 days each

### Dependency Rules

**Within Feature**:
- Tasks are mostly independent (parallel execution preferred)
- Some tasks may have prerequisites (e.g., "Define schema" before "Validate data")

**Between Features**:
- Feature B may depend on Feature A's deliverables
- Example: "Content Writing" (Feature J) depends on "Narrative Mapping" (Feature I)
- Document explicitly with `bd dep` commands

**Between Epics**:
- R2 Epic A typically doesn't block R2 Epic B (parallel tracks)
- Exception: If B uses output from A, create cross-epic dependency

---

## Release 2 Example: Decomposition Template

### Epic: sync-s2l2 "Forward" (Career Signal Processing)

**Features**:

1. **Feature 2.1: Signal Extraction** (Week 1-2)
   - Task 2.1.1: Extract signals from user profile
   - Task 2.1.2: Build signal scoring matrix
   - Task 2.1.3: Validate signal completeness
   - Dependencies: None (can start immediately)

2. **Feature 2.2: Signal Ranking** (Week 2-3)
   - Task 2.2.1: Rank signals by JD relevance
   - Task 2.2.2: Filter low-relevance signals
   - Task 2.2.3: Create top-20 signal summary
   - Dependencies: Blocks Feature 2.3 (Feature 2.1 must complete first)

3. **Feature 2.3: Narrative Generation** (Week 3-4)
   - Task 2.3.1: Map signals to narrative structure
   - Task 2.3.2: Draft positioning bullets
   - Task 2.3.3: Refine for impact
   - Dependencies: Depends on Feature 2.2

**Dependency Graph**:
```
Feature 2.1 (Signal Extraction)
    |
    +--> Feature 2.2 (Signal Ranking)
              |
              +--> Feature 2.3 (Narrative Generation)
```

**Beads Commands**:
```bash
# Wire Feature 2.2 to depend on 2.1
bd dep add sync-s2l2-f2.2 sync-s2l2-f2.1  # 2.2 depends on 2.1

# Wire Feature 2.3 to depend on 2.2
bd dep add sync-s2l2-f2.3 sync-s2l2-f2.2  # 2.3 depends on 2.2

# Verify DAG
bd dep tree sync-s2l2  # Show full dependency tree
bd blocked  # Should show tasks waiting on their dependencies
```

---

## Circular Dependency Prevention

### Anti-Pattern: Cycle Detection

❌ **Invalid** (Circular):
```
Task A blocks Task B
Task B blocks Task C
Task C blocks Task A  ← Creates cycle!
```

Detection:
```bash
# If any task appears in both its own dependency chain AND dependents, it's circular
bd show <task-id>  # Check dependencies section for cycles
```

### Prevention Strategy

1. **Unidirectional time flow**: Earlier tasks don't depend on later tasks
2. **Avoid mutual blocking**: If A blocks B, then B cannot block A
3. **Review before wiring**: Before running `bd dep add`, sketch graph on paper first
4. **Test after wiring**: Run `bd dep tree` and look for suspicious patterns

---

## Wiring Procedure for Release 2 Epics

### Pre-Wiring Checklist

- [ ] All 4 R2 epics (Forward, Reverse, Quality, Bugs) exist as issues in Beads
- [ ] Each epic has 2-5 features decomposed
- [ ] Each feature has 3-8 tasks defined
- [ ] All issues have clear titles and descriptions
- [ ] No circular dependencies identified in sketched graph

### Wiring Steps

**Step 1: Map Feature-Level Dependencies**
```bash
# For each epic, identify feature dependencies
# Example: Forward epic features
bd dep add sync-s2l2-f2.2 sync-s2l2-f2.1  # F2.2 depends on F2.1
bd dep add sync-s2l2-f2.3 sync-s2l2-f2.2  # F2.3 depends on F2.2
bd dep add sync-s2l2-f2.4 sync-s2l2-f2.3  # F2.4 depends on F2.3
# Continue for other epics...
```

**Step 2: Map Cross-Epic Dependencies (if any)**
```bash
# If Reverse epic depends on Forward epic completion:
bd dep add sync-h1xf-f3.1 sync-s2l2-f2.4  # Reverse F3.1 depends on Forward F2.4
```

**Step 3: Verify DAG Integrity**
```bash
# Show dependency trees for all epics
bd dep tree sync-s2l2
bd dep tree sync-h1xf
bd dep tree sync-pjzf
bd dep tree sync-c3e8

# Check for cycles
bd blocked  # Should show tasks currently blocked (not cycle)
```

**Step 4: Document Rationale**
Create a dependency rationale document:
```markdown
## Release 2 Dependency Wiring Rationale

### Forward Epic (sync-s2l2)
- Feature 2.2 (Signal Ranking) depends on 2.1 (Signal Extraction)
  Reason: Cannot rank signals until they are extracted
  Risk: None (straightforward sequential flow)

- Feature 2.3 (Narrative Gen) depends on 2.2 (Signal Ranking)
  Reason: Narrative requires ranked signals
  Risk: If ranking takes longer than estimated, delays narrative

### Cross-Epic Dependencies
- None currently (all epics can execute in parallel)
```

---

## Verification Commands

### After Wiring Complete

```bash
# 1. Verify DAG is acyclic (no cycles)
bd blocked  # Should list tasks with blockers; empty if all resolved

# 2. Show dependency tree for each epic
bd dep tree sync-s2l2
bd dep tree sync-h1xf
bd dep tree sync-pjzf
bd dep tree sync-c3e8

# 3. Count total dependencies
bd list --json | jq '[.[].dependencies[]?] | length'

# 4. Identify critical path (longest dependency chain)
# (Manual analysis of bd dep tree output)
```

### Expected Results for R2 Wiring

✅ **Success Metrics**:
- All 4 epics have features (8-15 features total)
- Feature-level dependencies documented (6-12 dependencies)
- Cross-epic dependencies identified (0-3)
- DAG is acyclic (`bd blocked` shows no cycles)
- Total dependencies = feature interdependencies + cross-epic links

❌ **Failure Modes**:
- Circular dependency detected (run `bd dep tree` from suspicious task)
- Missing feature (epic has < 2 features)
- Undocumented dependency (features appear disconnected but should be linked)

---

## Phase C Integration

**Phase C Task: bd-dep1**
- Decompose R2 epics (4 epics × 2-5 features = 8-15 features)
- Wire feature-level dependencies (6-12 links)
- Verify DAG acyclic
- Document rationale

**Timeline**: 1-2 days  
**Deliverables**: 
- Dependency tree diagrams
- Beads issues wired with `bd dep` commands
- Rationale document
- `bd blocked` verification showing zero unresolved cycles

---

## Related Resources

- **Beads Documentation**: Dependency management, `bd dep` command
- **Closure Standard**: BEADS-CLOSURE-STANDARD.md
- **Release 2 Issues**: Beads sync-s2l2, sync-h1xf, sync-pjzf, sync-c3e8
- **DAG Verification**: `bd dep tree <issue>`, `bd blocked`

