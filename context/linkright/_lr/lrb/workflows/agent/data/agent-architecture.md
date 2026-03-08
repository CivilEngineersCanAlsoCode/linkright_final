# Agent Architecture

LRB agents use a single unified type with `hasSidecar` boolean to manage state.
`critical_actions` are decoupled from sidecar — they work for both types.

---

## Decision Matrix: hasSidecar

| hasSidecar | Structure | Use When | Memory | Scope |
|------------|-----------|----------|--------|-------|
| `false` | Single YAML file (~250 lines) | Stateless, single-purpose, personality-driven | None | Project-wide |
| `true` | YAML + sidecar folder | Persistent memory, user history, relationship-driven | Yes | Restricted to sidecar |

---

## YAML Schema (All Agents)

```yaml
agent:
  metadata:
    id: _lr/{module}/{agent-name}/{agent-name}.md    # Full path required
    name: 'Persona Name'                              # Human-readable
    title: 'Agent Title / Specialization'             # Role title
    icon: '📦'                                         # Single emoji
    module: 'sync | flex | squick | lrb'             # Which Linkright module
    hasSidecar: false or true                        # State persistence flag

  persona:
    role: |                        # First-person, 1-2 sentences
      What the agent does — capabilities and expertise domain.
    identity: |                    # 2-5 sentences
      Who the agent is — background, context, credibility.
    communication_style: |         # 1-2 sentences
      How the agent talks — voice, tone, mannerisms.
    principles:                    # 3-8 bullet points
      - Principle one
      - Principle two

  critical_actions: []             # Optional — activation behaviors

  prompts:
    - id: prompt-id
      content: |
        <instructions>What this does</instructions>
        <process>1. Step 2. Step</process>

  menu:
    - trigger: XX or fuzzy match on command
      action: '#prompt-id' or inline instruction
      description: '[XX] Description'
```

---

## Metadata Fields

| Field | Format | Example | Rules |
|-------|--------|---------|-------|
| `id` | `_lr/{module}/{agent-name}/{agent-name}.md` | `_lr/sync/sync-parser/sync-parser.md` | Exact path required |
| `name` | Persona name | `Sync-Parser` | First-letter caps |
| `title` | Role | `Signal Extraction Agent` | 2-4 words |
| `icon` | Single emoji | `📦` | One only |
| `module` | Module code | `sync | flex | squick | lrb` | Enum — no typos |
| `hasSidecar` | Boolean | `false` or `true` | Lowercase |

---

## hasSidecar: false

**Single YAML file, stateless, under ~250 lines.**

### Structure
```
sync-parser.agent.yaml                          (~200-250 lines)
```

### Use Cases
- Single-purpose utility with helpful persona
- Each session is independent — no cross-session memory needed
- All logic fits in ~250 lines
- Personality-driven value
- Examples: Sync-Scout, Sync-Sizer, Sync-Styler, Signal Extractor

### Content Guidelines
```yaml
agent:
  metadata:
    hasSidecar: false

  persona:
    role: |
      Capabilities and expertise (1-2 sentences).

    identity: |
      Background and credibility (2-5 sentences).

    communication_style: |
      Voice and tone (1-2 sentences).

    principles:
      - Core principle one
      - Core principle two
      - Core principle three

  critical_actions:
    - 'Activate: [behavior description]'          # Optional
    - 'Rule: [constraint description]'           # Usually 1-2 only

  prompts:
    - id: main-prompt
      content: |
        <instructions>...</instructions>
        <process>...</process>

  menu:
    - trigger: XX or fuzzy match
      action: '#main-prompt'
      description: '[XX] Action'
```

### Size Constraint
- Metadata: ~20 lines
- Persona: ~15 lines
- Critical actions: ~3 lines (optional)
- Prompts: ~50-100 lines
- Menu: ~20 lines
- **Total: ~150-200 lines (max 250)**

If exceeding 250: convert to `hasSidecar: true`

---

## hasSidecar: true

**YAML + sidecar folder for persistent memory and complex workflows.**

### Structure
```
_lr/{module}/{agent-name}/
├── {agent-name}.agent.yaml              (~150 lines)
└── {agent-name}-sidecar/
    ├── memories.md                      (User profile, session history)
    ├── instructions.md                  (Protocols, operating boundaries)
    ├── [custom-files].md               (Optional: tracking, goals, etc.)
    ├── workflows/                       (Optional: complex multi-step)
    └── knowledge/                       (Optional: domain reference)
```

### Use Cases
- Must remember across sessions (user preferences, progress, history)
- Personal knowledge base that grows over time
- Domain-specific expertise with restricted file access
- Long-term relationship with user
- Complex workflows > 100 lines
- Examples: Sync-Inquisitor, Sync-Tracker, Sync-Refiner (with memory)

### Required Sidecar Files

**memories.md:**
```markdown
# User Profile
[Session history, preferences, tracking data]

# Linkright Signal Library Index
[Cached references to user signals for quick retrieval]
```

**instructions.md:**
```markdown
# Protocol Boundaries
[What agent can/cannot do]

# Critical Rules
[Non-negotiable constraints]
```

### Critical Actions for Sidecar (REQUIRED)

```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_lr/_memory/{sidecar-folder}/memories.md'
  - 'Load COMPLETE file {project-root}/_lr/_memory/{sidecar-folder}/instructions.md'
  - 'ONLY read/write files in {project-root}/_lr/_memory/{sidecar-folder}/'
```

**Path Rules:**
- MUST use `{project-root}` as literal placeholder (not absolute path)
- MUST include `_lr/_memory/{sidecar-folder}/` in all references
- MUST load both memories.md AND instructions.md on activation

### Sidecar Installation Path
```
{project-root}/_lr/_memory/{sidecar-folder}/
```

Not: `.sync/`, not `._memory/`, not `_bmad/` — Linkright uses `_lr/_memory/`.

---

## Menu Actions

| Type | Format | Example |
|------|--------|---------|
| Prompt reference | `action: "#prompt-id"` | `action: "#extract-signal"` |
| Inline instruction | `action: "Direct text"` | `action: "Update memories.md"` |

### Trigger Format
```yaml
trigger: XX or fuzzy match on command
```

- `XX` = 2-letter code (first letters of action name)
- `fuzzy match on command` = Natural language match on action description
- User can type `signal` or `extract` or `SG` to trigger same action

### Description Format
```yaml
description: '[XX] Description'
```

- `[XX]` = Code in brackets
- `Description` = Short, action-focused

**Reserved codes (auto-injected — DO NOT use):**
- MH (Meta Help)
- CH (Context Help)
- PM (Persona Menu)
- DA (Detailed About)

### Example Menu

```yaml
menu:
  - trigger: SG or fuzzy match on signal
    action: '#extract-signal'
    description: '[SG] Extract work signal'

  - trigger: JD or fuzzy match on jd
    action: '#parse-jd'
    description: '[JD] Parse job description'

  - trigger: OPT or fuzzy match on optimize
    action: '#optimize-resume'
    description: '[OPT] Optimize resume'
```

---

## Prompts

Reusable templates referenced via `#id`:

```yaml
prompts:
  - id: extract-signal
    content: |
      <instructions>Extract structured work signal from reflection</instructions>
      <process>
        1. Parse raw text for ownership and metrics
        2. Classify signal type from taxonomy
        3. Validate against schema
        4. Return structured JSON
      </process>
      <example>
        Input: "Led payment gateway launch for 2M users"
        Output: { type: "execution", ownership: "sole", metrics: "2M users" }
      </example>
```

### Prompt Structure
- `id`: Semantic identifier (snake_case)
- `instructions`: One sentence — what this does
- `process`: 3-6 numbered steps
- `example`: Optional — input → output

### Best Practices
- Use semantic XML tags (`<instructions>`, `<process>`, `<example>`)
- Keep focused on single purpose
- Number multi-step processes
- Include example if complex logic

---

## Persona (All Agents)

First-person voice only. Must cover all four fields:

```yaml
role: |
  What the agent does — capabilities and expertise.

identity: |
  Who the agent is — background and credibility.

communication_style: |
  How the agent talks — voice and tone.

principles:
  - Core principle one
  - Core principle two
  - Core principle three (minimum 3, max 8)
```

**For sidecar agents:** include memory reference patterns:

```yaml
communication_style: |
  I reference past naturally: "Last time you mentioned..." or "I've noticed patterns..."
  Direct and clear, with warmth when appropriate.
```

---

## Critical Actions

Optional for stateless agents (`hasSidecar: false`).
MANDATORY for agents with persistent state (`hasSidecar: true`).

### Purpose
Define activation behaviors, constraints, and domain restrictions.

### Format
```yaml
critical_actions:
  - 'Action type: [specific constraint or behavior]'
  - 'Rule: [non-negotiable boundary]'
```

### Examples

**For Stateless Agent:**
```yaml
critical_actions:
  - 'Validate signal schema before returning'
  - 'Flag low metric density signals for user review'
```

**For Sidecar Agent:**
```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_lr/_memory/sync-inquisitor-sidecar/memories.md'
  - 'Load COMPLETE file {project-root}/_lr/_memory/sync-inquisitor-sidecar/instructions.md'
  - 'ONLY read/write files in {project-root}/_lr/_memory/sync-inquisitor-sidecar/'
  - 'Never suggest metrics; only surface what user confirms'
  - 'Flag estimates with [ESTIMATED] tag for validation'
```

### Common Patterns

**Data Integrity:**
```yaml
- 'NEVER fabricate metrics'
- 'Mark confidence: exact | estimated | inferred'
```

**Scope Restriction:**
```yaml
- 'ONLY read from {folder}/knowledge/ - do NOT modify'
- 'Write ONLY to {folder}/memories.md'
```

**Behavior Rules:**
```yaml
- 'Socratic method only - never lead questions'
- 'User feedback is gospel - no assumptions beyond stated'
```

---

## Validation Checklist

### All Agents
- [ ] Valid YAML syntax (test: `yaml linter`)
- [ ] metadata: id, name, title, icon, module, hasSidecar
- [ ] persona: role (1-2 lines), identity (2-5 lines), communication_style (1-2 lines), principles (3-8)
- [ ] Each prompt has: id, instructions, process
- [ ] Menu triggers: `XX or fuzzy match`
- [ ] Menu descriptions: `[XX] Description format`
- [ ] No reserved codes (MH, CH, PM, DA)
- [ ] File named `{agent-name}.agent.yaml`

### hasSidecar: false
- [ ] Under ~250 lines total
- [ ] No sidecar path references in critical_actions
- [ ] All functionality fits in single YAML

### hasSidecar: true
- [ ] Sidecar folder exists with memories.md + instructions.md
- [ ] ALL paths use: `{project-root}/_lr/_memory/{sidecar-folder}/...`
- [ ] `{project-root}` is literal (not absolute path)
- [ ] critical_actions MANDATORY and includes all three required statements
- [ ] Sidecar folder installed to: `_lr/_memory/` not `_memory/` or `._memory/`

---

## What LRB Compiler Adds (DO NOT Include)

Do NOT manually add these — compiler injects them:
- Frontmatter (`---name/description---`)
- XML activation blocks
- Menu workflow handlers
- Auto-injected menu items (MH, CH, PM, DA)
- Rule validation section

---

## Quick Decision Guide

### Use hasSidecar: false if:
- ✅ Single-purpose utility
- ✅ No cross-session memory needed
- ✅ Fits under 250 lines
- ✅ Independent interactions
- ✅ Personality-driven value

### Use hasSidecar: true if:
- ✅ Memory needed across sessions
- ✅ User preferences to track
- ✅ Personal knowledge base
- ✅ Domain-specific with restricted access
- ✅ Progress tracking / history
- ✅ Complex multi-step workflows

### Escalate to Module Builder (LRB Module workflow) if:
- ✅ Multiple distinct personas
- ✅ Many specialized workflows (>20)
- ✅ Multiple users with different permissions
- ✅ Shared resources across agents

---

*Last updated: 2026-03-06*
*Reference: Adapted from `bmad/_bmad/bmb/workflows/agent/data/agent-architecture.md` (BMAD agent builder)*
*LRB adaptation: Updated for Linkright paths (_lr/_memory), module taxonomy (sync/flex/squick/lrb)*
