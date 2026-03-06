# Critical Actions

Critical actions define agent activation behavior, constraints, and domain restrictions.
They are optional for stateless agents and MANDATORY for agents with persistent memory.

---

## Purpose

Critical actions specify:
1. **What must happen before agent executes** (initialization)
2. **What the agent is NOT allowed to do** (restrictions)
3. **What rules govern behavior** (non-negotiable constraints)

---

## Format

```yaml
critical_actions:
  - 'Type: [specific constraint or behavior]'
  - 'Type: [another constraint]'
```

**Types:**
- `Load:` Agent must load specific files before executing
- `Rule:` Non-negotiable behavior rule
- `Restrict:` What agent cannot do
- `Activate:` Special initialization behavior

---

## When Required

### hasSidecar: false (Stateless Agent)
- **Optional** — usually not needed
- If present: No sidecar path references allowed
- Use only for special activation behaviors (data fetches, configuration)

**Example:**
```yaml
critical_actions:
  - 'Load: Signal type taxonomy for classification'
  - 'Rule: Never fabricate metrics'
```

### hasSidecar: true (Memory Agent)
- **MANDATORY** — must include all 3 required statements
- Binds agent to sidecar folder
- Loads memories and instructions on initialization
- Restricts file access to sidecar folder

**Required format:**
```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_lr/_memory/{sidecar}/memories.md'
  - 'Load COMPLETE file {project-root}/_lr/_memory/{sidecar}/instructions.md'
  - 'ONLY read/write files in {project-root}/_lr/_memory/{sidecar}/'
```

---

## Sidecar Agent Critical Actions (MANDATORY)

For any agent with `hasSidecar: true`, all 3 of these MUST be present:

### Statement 1: Load Memories
```yaml
- 'Load COMPLETE file {project-root}/_lr/_memory/{sidecar-name}-sidecar/memories.md'
```

**Purpose:** Load user profile, session history, preferences, progress tracking

**Path rules:**
- Must use `{project-root}` as literal placeholder
- Must be `_lr/_memory/` (not `_memory/` or `._memory/`)
- Sidecar folder name: `{agent-name}-sidecar`
- File: `memories.md`

**Example:**
```yaml
- 'Load COMPLETE file {project-root}/_lr/_memory/sync-inquisitor-sidecar/memories.md'
```

### Statement 2: Load Instructions
```yaml
- 'Load COMPLETE file {project-root}/_lr/_memory/{sidecar-name}-sidecar/instructions.md'
```

**Purpose:** Load operational protocols, boundaries, non-negotiable rules

**Path rules:**
- Same as memories: `{project-root}/_lr/_memory/{sidecar-name}-sidecar/`
- File: `instructions.md`

**Example:**
```yaml
- 'Load COMPLETE file {project-root}/_lr/_memory/sync-inquisitor-sidecar/instructions.md'
```

### Statement 3: File Access Restriction
```yaml
- 'ONLY read/write files in {project-root}/_lr/_memory/{sidecar-name}-sidecar/'
```

**Purpose:** Restrict agent to sidecar folder only. Prevents accidental file system access.

**Path rules:**
- Directory path (ends with `/`)
- Matches statements 1 and 2 folder name
- Includes all subfolders (workflows/, knowledge/)

**Example:**
```yaml
- 'ONLY read/write files in {project-root}/_lr/_memory/sync-inquisitor-sidecar/'
```

---

## Common Critical Actions Patterns

### Pattern 1: Data Integrity
```yaml
critical_actions:
  - 'Rule: Never fabricate metrics or data'
  - 'Rule: Mark estimates with [ESTIMATED] tag for user validation'
  - 'Rule: Signal confidence must be: exact | estimated | inferred'
```

### Pattern 2: Scope Restriction
```yaml
critical_actions:
  - 'Load: Know Signal Library schema before extracting'
  - 'Rule: Only extract what user explicitly states'
  - 'Restrict: Do not assume or infer metrics beyond user statement'
```

### Pattern 3: Conversation Boundaries (Inquisitor)
```yaml
critical_actions:
  - 'Rule: Socratic method only — never lead questions'
  - 'Rule: User answers are gospel — no assumptions beyond what stated'
  - 'Restrict: Do not broaden scope beyond identified gap'
  - 'Rule: Flag uncertainty transparently'
```

### Pattern 4: Sidecar Memory (Full)
```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_lr/_memory/sync-tracker-sidecar/memories.md'
  - 'Load COMPLETE file {project-root}/_lr/_memory/sync-tracker-sidecar/instructions.md'
  - 'ONLY read/write files in {project-root}/_lr/_memory/sync-tracker-sidecar/'
  - 'Rule: Application records are immutable once created'
  - 'Rule: Status transitions follow state machine (draft → applied → ...)'
```

### Pattern 5: Knowledge Protection
```yaml
critical_actions:
  - 'Load: Reference knowledge from /knowledge/ folder'
  - 'Restrict: Read-only access to /knowledge/ — never modify'
  - 'Write ONLY to /memories.md for persistent updates'
```

---

## Deriving Critical Actions from Principles

Agent principles should inform critical actions:

| Principle | Critical Action |
|-----------|-----------------|
| "Evidence first, speculation never" | "Mark estimates with [ESTIMATED] tag" |
| "Signal is only valuable if retrievable" | "Validate signal schema before returning" |
| "Never lead questions" | "Socratic method only" |
| "User feedback is gospel" | "No assumptions beyond user statement" |
| "Context informs narrative" | "Understand JD scope before optimizing" |

---

## Validation Checklist

### For hasSidecar: false (Stateless)
- [ ] If `critical_actions` present, no sidecar path references
- [ ] Each action is clear and specific
- [ ] No file system paths (not applicable for stateless)

### For hasSidecar: true (Memory)
- [ ] All 3 required statements present
- [ ] Statement 1: Load memories file
- [ ] Statement 2: Load instructions file
- [ ] Statement 3: File access restriction
- [ ] All paths use `{project-root}` placeholder (not absolute)
- [ ] All paths reference `_lr/_memory/{sidecar}/`
- [ ] Sidecar folder name matches pattern: `{agent-name}-sidecar`
- [ ] Additional rules present if needed (data integrity, behavioral constraints)

### All Types
- [ ] Each action is necessary (no redundant rules)
- [ ] Actions are testable (could you audit compliance?)
- [ ] Actions protect user and system (clear boundaries)
- [ ] No conflicting actions (e.g., "always do X" and "sometimes don't X")

---

## Examples by Agent Type

### Example 1: Sync-Parser (Stateless)
```yaml
critical_actions:
  - 'Load: Signal extraction schema and taxonomy'
  - 'Rule: Validate extracted signal against schema before returning'
  - 'Rule: Flag low metric density (< 0.3) for Inquisitor deepening'
  - 'Rule: Never fabricate metrics'
```

### Example 2: Sync-Inquisitor (Memory Agent)
```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_lr/_memory/sync-inquisitor-sidecar/memories.md'
  - 'Load COMPLETE file {project-root}/_lr/_memory/sync-inquisitor-sidecar/instructions.md'
  - 'ONLY read/write files in {project-root}/_lr/_memory/sync-inquisitor-sidecar/'
  - 'Rule: Socratic method only — never lead questions'
  - 'Rule: User feedback is gospel — no assumptions beyond statement'
  - 'Rule: Estimate confidence is transparent — flagged for validation'
  - 'Restrict: Do not broaden scope beyond identified gap'
```

### Example 3: Sync-Tracker (Memory Agent)
```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_lr/_memory/sync-tracker-sidecar/memories.md'
  - 'Load COMPLETE file {project-root}/_lr/_memory/sync-tracker-sidecar/instructions.md'
  - 'ONLY read/write files in {project-root}/_lr/_memory/sync-tracker-sidecar/'
  - 'Rule: Application records are immutable once logged'
  - 'Rule: Status transitions follow state machine strictly'
  - 'Rule: Every status change requires user confirmation'
```

### Example 4: Flex-Publicist (Memory Agent)
```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_lr/_memory/flex-publicist-sidecar/memories.md'
  - 'Load COMPLETE file {project-root}/_lr/_memory/flex-publicist-sidecar/instructions.md'
  - 'ONLY read/write files in {project-root}/_lr/_memory/flex-publicist-sidecar/'
  - 'Load: Brand voice guidelines from /knowledge/voice.md'
  - 'Restrict: Never post without user approval'
  - 'Rule: Content must align with user personal brand'
```

---

## Critical Actions vs. Principles vs. Menu Actions

| Aspect | Critical Actions | Principles | Menu Actions |
|--------|------------------|------------|--------------|
| **Purpose** | Constraints + initialization | Operating beliefs | User interface |
| **When set** | Agent design time | Agent design time | Agent design time |
| **Who enforces** | LRB compiler | Agent during execution | User (via menu) |
| **Scope** | Activation + boundaries | Decision-making | Available operations |
| **Examples** | "Load memories", "Never X" | "Evidence first", "Context matters" | Extract, Optimize, Track |

---

## Testing Critical Actions

### Load Rules
```bash
# Verify file exists
ls {project-root}/_lr/_memory/{sidecar}/memories.md
# Should succeed

# Verify path in critical_actions matches
grep "project-root" agent.yaml | grep memories
# Should show: {project-root}/_lr/_memory/{sidecar}/memories.md
```

### Behavioral Rules
```bash
# Ask: Could you audit whether agent followed this rule?
# Example: "Never fabricate metrics"
# How would you verify? → Check output for unconfirmed values

# Strong rules are auditable
# Weak rules are vague ("be helpful", "do well")
```

### File Access Restrictions (Sidecar)
```bash
# Verify agent can access sidecar folder
ls {project-root}/_lr/_memory/{sidecar}/

# Verify agent cannot access outside sidecar
# (Should fail if rule enforced)
```

---

## Debugging Critical Actions Issues

| Issue | Symptom | Check |
|-------|---------|-------|
| Missing load | "memories.md not found" | Verify file exists at path in critical_actions |
| Wrong path | "Cannot access memories" | Check path uses `{project-root}` not absolute |
| File restriction | Writes appearing outside sidecar | Verify ONLY statement restricts to sidecar/ |
| Duplicate rules | Confusing behavior | Remove redundant critical_actions |
| Missing MANDATORY (sidecar) | Agent not loading memories | Add all 3 required statements for sidecar agents |

---

*Last updated: 2026-03-06*
*Reference: LRB critical actions guide*
