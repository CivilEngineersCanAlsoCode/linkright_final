# B-MAD Architecture Deep Dive

**Author:** WildMeadow (B-MAD Specialist)
**Date:** 2026-03-09
**Scope:** Complete B-MAD methodology analysis for Linkright alignment

---

## Executive Summary

B-MAD (Brain-centric Modular Agile Development) is a sophisticated framework for building agentic workflows. Its core strength lies in **atomic step design**, **state resumability**, **facilitation-first philosophy**, and **JIT (Just-In-Time) loading** to keep LLM context windows clean. B-MAD's structural patterns are production-ready and directly applicable to Linkright.

**Key Insight:** B-MAD succeeds because it treats every workflow step as a **discrete cognitive contract** (INPUT → DECISION → OUTPUT), with explicit success/failure metrics and resumption hooks.

---

## Section 1: Agent File Architecture

### Structure: XML-Embedded Markdown

B-MAD agents are markdown files (.md) with embedded XML blocks for metadata and behavior definition.

**Complete Anatomy:**

```markdown
---
name: "agent-readable-name"
description: "What this agent does"
---

You must fully embody this agent's persona...

<agent id="agent-id" name="Agent Name" title="Title" icon="emoji" capabilities="...">
  <activation critical="MANDATORY">
    <step n="1">First action</step>
    <step n="2">Second action</step>
    ...
    <step n="N">Final step - STOP and WAIT for user input</step>

    <menu-handlers>
      <handler type="action">...</handler>
    </menu-handlers>

    <rules>
      <r>Rule 1</r>
      <r>Rule 2</r>
    </rules>
  </activation>

  <persona>
    <role>What role does this agent play</role>
    <identity>Deep expertise description</identity>
    <communication_style>How it talks</communication_style>
    <principles>Core principles</principles>
  </persona>

  <menu>
    <item cmd="TRIGGER">Label</item>
  </menu>
</agent>
```

### Activation Sequence (Mandatory Order)

1. **Load persona** from current agent file
2. **Load config.yaml** — BEFORE ANY OUTPUT (blocking step)
3. **Store config fields** as session variables: `{user_name}`, `{communication_language}`, `{output_folder}`
4. **Verify config loaded** — STOP if error, report to user
5. **Greet user** using config variables + setup language
6. **Display menu** as numbered list
7. **STOP and WAIT** — do NOT execute menu items automatically
8. **Process user input** — fuzzy match on number or command text
9. **Check menu-handlers** — extract attributes from selected menu item (workflow=, exec=, data=, action=)

**Critical Rule:** Step 7 is a hard stop. Agents NEVER auto-execute. Facilitation-first always.

### Menu Item Type System

Four types of menu items:

| Type | Format | Behavior |
|------|--------|----------|
| **workflow** | `workflow="/path/to/workflow.md"` | Load and execute workflow file |
| **exec** | `exec="/path/to/script"` | Execute system command or script |
| **action** | `action="#prompt-id"` | Find prompt with matching ID in agent XML and execute |
| **data** | `data="/path/to/file"` | Load and display data file (no execution) |

**Example Menu:**
```xml
<menu>
  <item cmd="BS" workflow="{project-root}/brainstorming/workflow.md">[BS] Brainstorm Ideas</item>
  <item cmd="LT" action="list-tasks">[LT] List Available Tasks</item>
  <item cmd="DX" data="/docs/reference.md">[DX] Documentation</item>
</menu>
```

### Fuzzy Command Matching

When user types text:
1. Case-insensitive substring match on `cmd` attribute
2. If exact `cmd` match (e.g., "BS"), execute immediately
3. If substring match (e.g., "brain"), check if unique
4. If multiple matches, ask user to clarify: "Did you mean: [1] Brainstorm, [2] Brain Dump?"
5. If no match, respond: "Not recognized. Try: [list all menu items]"

### Agent Depth: What ≥40 Lines Looks Like

Minimum viable agent:
- Frontmatter (5 lines)
- Persona block (8 lines)
- Activation sequence (12 steps × 1-2 lines = 15 lines)
- Menu (5 items × 1 line = 5 lines)
- Rules (3 lines)

**Total: ~40 lines** = Functional but minimal

**Excellent agent (60-80 lines):**
- Rich persona (10-15 lines with detailed identity + principles)
- Extended activation (15-20 steps with condition checks)
- Multiple menu items (8-10 with inline prompts)
- Advanced rules section (5-8 rules with nuance)
- Context-specific examples (5 lines of usage guidance)

---

## Section 2: Workflow File Architecture

### Two Types of Workflows

#### Type 1: Markdown Workflows (Direct Execution)

Single markdown file that orchestrates the entire workflow.

**Use case:** Simple, linear workflows (e.g., "Create a PRD", "Brainstorm Ideas")

**Structure:**
```markdown
---
name: workflow-name
description: What this does
context_file: '' # Optional project-specific context
---

# Workflow Title

**Goal:** What the user wants to achieve

**Your Role:** Your persona for this workflow

---

## INITIALIZATION

### Configuration Loading
Load config from `{project-root}/_bmad/core/config.yaml`

### Paths
- `installed_path` = `{project-root}/_bmad/core/workflows/[name]`
- `template_path` = `{installed_path}/template.md`
- `output_file` = `{output_folder}/[name]/output-{{date}}.md`

---

## EXECUTION

Read and follow: `steps/step-01-session-setup.md`
```

#### Type 2: YAML-Config + workflow.xml (Complex Workflows)

For complex multi-agent workflows with branching logic and conditional steps.

**Structure:**
```
my-workflow/
├── workflow.yaml           ← Metadata + execution rules
├── workflow.xml            ← Execution engine (branching, conditions)
├── templates/              ← Jinja2 templates for content generation
└── steps/                  ← Step files for sequential execution
    ├── step-01-setup.md
    ├── step-02a-branch-a.md
    ├── step-02b-branch-b.md
    └── step-03-conclude.md
```

**workflow.yaml Schema:**
```yaml
name: workflow-name
description: |
  Multi-line description of workflow

entry_point: step-01-setup
phases:
  - phase: initialization
    steps: [step-01-setup]
  - phase: execution
    steps: [step-02a-branch-a, step-02b-branch-b]
  - phase: conclusion
    steps: [step-03-conclude]

variables:
  project_name: string
  output_folder: string
  user_language: string

templates:
  - name: output-template
    path: templates/output.md
```

### Variable Resolution

B-MAD supports two variable syntaxes:

| Syntax | Source | Example |
|--------|--------|---------|
| `{variable_name}` | config.yaml or workflow context | `{user_name}` → "Satvik" |
| `{config_source}:field` | Nested config lookup | `{colors}:primary` → "#FF5733" |

**Resolution order:**
1. Session variables (loaded from config.yaml)
2. Step-local variables (defined in step file frontmatter)
3. Workflow variables (from workflow.yaml)
4. Defaults (fallback values, if any)

---

## Section 3: Step File Architecture

### Anatomy of a Step File

```markdown
---
stepNumber: 1
title: "Step 1: Load Session Context"
phase: "c"  # or "e" or "v"
nextStepFile: step-02a-branch-a.md
continueStepFile: step-01b-resume.md
frontmatterData:
  stepsCompleted: [1]
  sessionOutput: path/to/output.md
---

# Step [N]: [Human-Readable Title]

## MANDATORY EXECUTION RULES:

- 🛑 Rule 1
- ✅ Rule 2

## INPUT

**What this step receives:**

- Previous step's output (in frontmatter or session state)
- Config variables: `{user_name}`, `{output_folder}`
- Optional context file

## PROCESSING

[Detailed instructions for what to do]

### Substeps (if applicable)

1. First decision/action
2. Second decision/action
3. Third decision/action

## OUTPUT

**What this step produces:**

- Updated frontmatter (stepsCompleted list)
- Updated output file at `{session_output}`
- Decision point (which next step to load)

## DEPENDENCIES

- Depends on: step-01-session-setup.md
- Blocks: step-02-main-work.md
- Requires: config.yaml, template.md

## SUCCESS METRICS

✅ User has confirmed session is initialized
✅ `stepsCompleted` includes [1]
✅ Output document created and populated
✅ Ready to advance to step 2

## FAILURE ANTI-METRICS

❌ Config.yaml not found → STOP and report error
❌ Output folder not writable → STOP and ask user
❌ User cancels session → Load exit step

## NEXT STEPS

- If user confirms continue → `nextStepFile: step-02-main.md`
- If user wants to resume later → `continueStepFile: step-01b-resume.md`
- If user exits → Load dismissal step
```

### Step Phase Classification

**Three phases per workflow:**

| Phase | Letter | Purpose | Typical Steps |
|-------|--------|---------|---------------|
| **Clarification** | `c` | Gather input, set context, load configs | step-01c, step-02c |
| **Execution** | `e` | Do the core work | step-03e, step-04e |
| **Verification** | `v` | Review, validate, confirm quality | step-05v, step-06v |

**Naming convention:** `step-[N][phase]-[name].md`
- `step-01c-load-session.md` (clarification)
- `step-02e-generate-content.md` (execution)
- `step-03v-review-output.md` (verification)

### Session Continuity: step-01/step-01b Pattern

Every workflow has two parallel step-01 files:

| File | Purpose | When Used |
|------|---------|-----------|
| `step-01-session-setup.md` | Fresh session initialization | User starts workflow first time |
| `step-01b-resume.md` | Resume existing session | User returns to incomplete workflow |

**Resume Logic:**
```
IF output_file exists AND stepsCompleted in frontmatter:
  → Load step-01b-resume.md
  → Show completed steps + prompt for next action
ELSE:
  → Load step-01-session-setup.md
  → Fresh initialization
```

### Atomicity Rule: One Cognitive Operation Per Step

**ATOMIC (Good) ✅:**
- "Load session context and initialize output document"
- "Ask user for project name and validate input"
- "Generate 20 brainstorm ideas using technique X"

**NON-ATOMIC (Bad) ❌:**
- "Load session, initialize output, ask for name, validate, and generate ideas" ← Too many operations
- "Review ideas and reorganize and create presentation" ← Three separate operations

**Test:** Could you split this step into two independent steps? If yes, it's non-atomic.

---

## Section 4: Config System

### config.yaml Schema

```yaml
# User Configuration
user_name: Satvik
communication_language: Romanised Hindi
document_output_language: English
user_skill_level: advanced

# Paths
project_root: /Users/satvikjain/Downloads/sync
output_folder: "{project-root}/_bmad-output"

# Workflow Defaults
default_workflow: core/workflows/main-menu
default_template: core/templates/default.md

# IDE Configuration
supported_ides:
  - claude
  - cursor
  - vscode
```

### Config Inheritance Chain

1. **Global config** (`_bmad/core/config.yaml`) — applies to all modules
2. **Module config** (`_bmad/[module]/config.yaml`) — overrides global for module
3. **Workflow config** (`workflows/[name]/config.yaml`) — task-specific overrides
4. **Step-local vars** (in step file frontmatter) — step-specific values

**Example Resolution:**

```
{output_folder}
→ Step has `output_folder: workflows/special`? Use that
→ Workflow config defines override? Use that
→ Module config defines it? Use that
→ Global config: "{project-root}/_bmad-output" ← Final value
```

### Variable Resolution Order

```
1. Session variables (loaded from config.yaml first)
2. Step frontmatter variables
3. Workflow context variables
4. Fallback/defaults
```

---

## Section 5: Manifest/Index System

### The 5 CSV Manifests

#### 1. agent-manifest.csv

Lists all agents in the system.

**Schema:**
```
agent_name,module,file_path,description,activation_status
bmad-master,core,core/agents/bmad-master.md,Master orchestrator,active
brainstorm-facilitator,core,core/agents/brainstorm-facilitator.md,Brainstorming guide,active
```

#### 2. workflow-manifest.csv

Lists all workflows.

**Schema:**
```
workflow_name,module,file_path,type,phase_coverage,step_count
brainstorming,core,core/workflows/brainstorming/workflow.md,markdown,c|e|v,4
party-mode,core,core/workflows/party-mode/workflow.md,xml,c|e|v,3
```

#### 3. task-manifest.csv

Lists executable tasks (typically for automation).

**Schema:**
```
task_name,module,executor,file_path,depends_on
editorial-review-structure,core,ai,core/tasks/editorial-review-structure.xml,help
validate-prd,bmm,ai,bmm/tasks/validate-prd.xml,create-prd
```

#### 4. help-manifest.csv / module-help.csv

Maps help topics to documentation files.

**Schema:**
```
topic,keyword,file_path,description
agent-structure,xml,docs/reference/agent-structure.md,How to write B-MAD agents
workflow-lifecycle,resumption,docs/reference/workflow-lifecycle.md,Session continuation patterns
```

#### 5. tool-manifest.csv

Lists external tools/APIs that workflows might call.

**Schema:**
```
tool_name,type,api_endpoint,config_path,requires_auth
github-api,api,https://api.github.com,config/github.yaml,true
local-sqlite,db,file:///data.db,config/sqlite.yaml,false
```

### How Manifests Power IDE Command Palettes

**Flow:**
1. User opens IDE (Cursor, Claude, VSCode)
2. IDE loads `.cursor/commands/` or equivalent
3. Each command file references B-MAD manifests: `load_from_csv(workflow-manifest.csv)`
4. IDE renders command palette with all workflows, agents, tasks
5. User selects command → IDE invokes corresponding agent/workflow

**Example:** Cursor command file might say:
```yaml
workflow_list: $load_manifest(workflow-manifest.csv)
available_commands: $workflow_list[*].workflow_name
```

---

## Section 6: JIT Loading Principle

### Core Rule: What Must NOT Be Preloaded

**❌ Preload these:**
- Agent files with full XML
- All 50+ step files for a workflow
- Complete manifest CSVs (hundreds of rows)
- All templates and data files

**❌ Why:**
- LLM context windows are limited (100K tokens typical)
- Preloading everything = context bloat
- Agent gets confused by irrelevant data
- Slower response times
- Higher API costs

### What MUST Be Loaded JIT (Just-In-Time)

**✅ Load on-demand:**
1. **Config.yaml** — blocking load in activation step 2
2. **Current step file** — load when entering that step
3. **Referenced templates** — load when step needs them
4. **Data files** — load when step requests them

**✅ Why:**
- Only context needed for current task is loaded
- Agent stays focused
- Context stays clean (typically 10-20KB per step)
- Faster thinking + lower cost

### Facilitation-First Rule

**Core principle:** Agent is a facilitator, NOT an executor.

**Pattern:**
```
Agent: "Here are 3 options for next step. Which would you prefer?"
User: Selects option
Agent: Executes that option only
Agent: STOPS and WAITS for next user input
```

**Never:**
```
Agent: "I'll now generate ideas, organize them, create a presentation, and send you the final output"
```

**Why this matters:**
- Users stay in control
- Agent doesn't make assumptions
- Each step is explicit and reviewable
- Easier to resume interrupted workflows

---

## Section 7: Quality Patterns

### Success/Failure Metrics (Exact Format)

Every step file MUST include these sections:

**SUCCESS METRICS** — ✅ checklist

```markdown
## SUCCESS METRICS

✅ User has confirmed [requirement 1]
✅ Output file contains [specific content]
✅ [Metric 3 has been verified]
✅ System is ready for [next phase]
```

**FAILURE ANTI-METRICS** — ❌ checklist

```markdown
## FAILURE ANTI-METRICS

❌ Config.yaml not found or unreadable
❌ User cancels without saving
❌ Output folder is read-only
❌ API call fails after retries
```

**Purpose:** Before advancing, agent checks both checklists. If any anti-metric is true, STOP and don't proceed.

### YOLO Mode (Autonomous Completion)

**Definition:** Agent auto-executes remaining steps without waiting for user input.

**When activated:** Step file includes `yolo_mode: true` in frontmatter

**Mechanics:**
```markdown
---
yolo_mode: true
auto_advance_threshold: 0.9  # Confidence level for auto-advance
---
```

**Behavior:**
- Agent completes current step
- If `auto_advance_threshold` exceeded, auto-load next step
- Continue until workflow complete or error occurs
- Report completion summary to user

**Use case:** Background/async workflows where user doesn't need constant handoffs

### Resumable Workflows (State Persistence)

**How progress is saved:**

1. **Frontmatter tracking:**
```markdown
---
stepsCompleted: [1, 2, 3]
currentStep: 4
sessionState:
  generated_ideas: 47
  current_technique: "SCAMPER"
  output_file: path/to/output.md
---
```

2. **Output document persistence:**
- Each step appends to output document
- Never overwrites previous content
- Complete audit trail of session

3. **Resumption detection:**
```
IF output_file.frontmatter.stepsCompleted exists:
  → This is a continuation
  → Load step-01b-resume.md
  → Show progress: "Completed steps 1-3, ready for step 4"
ELSE:
  → Fresh session
```

---

## Section 8: Cross-Reference Chain

### Complete Flow: IDE Command → Execution

```
User types: /brainstorm "Product ideas"
        ↓
IDE loads: .cursor/commands/
        ↓
Finds: brainstorm-ideas.md
        ↓
File contains: workflow: "{project-root}/_bmad/core/workflows/brainstorming/workflow.md"
        ↓
Agent loads: workflow.md
        ↓
workflow.md loads config: {project-root}/_bmad/core/config.yaml
        ↓
Config variables resolved: {user_name}, {output_folder}
        ↓
Agent loads step-01-session-setup.md (or step-01b-resume.md if continuing)
        ↓
Step file has: nextStepFile: step-02a-branch-a.md
        ↓
Agent loads: step-02a-branch-a.md
        ↓
Step references template: {installed_path}/template.md
        ↓
Agent loads template and populates
        ↓
OUTPUT: Complete brainstorming document
```

### {project-root} Resolution

**Definition:** Root directory of the B-MAD installation

**Resolved at:** Agent activation step 2, when config.yaml is loaded

**Example values:**
- `/Users/satvik/projects/bmad` → becomes `{project-root}`
- All paths using `{project-root}/...` now resolve absolutely

### Step File References to Templates and Data

**In step files:**
```markdown
Template path: {installed_path}/template.md
Data file: {project-root}/_bmad/core/data/brain-methods.csv
Config value: {user_name} (from config.yaml)
```

**Resolution:**
1. `{installed_path}` = directory containing current step file
2. `{project-root}` = config.yaml project_root value
3. All other `{variables}` looked up in config or step context

---

## Section 9: What Makes B-MAD Excellent (Top 10 Patterns)

### Pattern 1: Atomic Step Design ⭐⭐⭐

**Most frameworks do:** Workflows with 5-10 massive multi-purpose steps

**B-MAD does:** Each step is ONE cognitive operation

**Impact:**
- Easier to resume interrupted workflows
- Clearer success criteria
- Easier to debug when something fails

### Pattern 2: Session Resumability ⭐⭐⭐

**Most frameworks do:** Lose state when interrupted

**B-MAD does:** Every step saves progress to frontmatter + output file

**Impact:**
- User can pause multi-hour workflows
- Return days later without losing context
- Audit trail of every decision

### Pattern 3: JIT Loading ⭐⭐⭐

**Most frameworks do:** Load entire workflows into context

**B-MAD does:** Load only the current step + immediate dependencies

**Impact:**
- Context stays clean (prevents hallucination)
- Faster inference
- Lower API costs
- Works better on resource-constrained LLMs

### Pattern 4: Facilitation-First Philosophy ⭐⭐

**Most frameworks do:** Agent auto-executes multiple steps

**B-MAD does:** Agent facilitates, waits for user to decide each step

**Impact:**
- Users stay in control
- Less risk of unwanted actions
- Natural conversation flow
- Works well for exploratory/creative tasks

### Pattern 5: Fuzzy Command Matching ⭐⭐

**Most frameworks do:** Require exact command names

**B-MAD does:** Substring match + auto-complete on typos

**Impact:**
- Better UX (typos don't break workflows)
- Easier to remember commands
- Less friction in user interaction

### Pattern 6: Multi-Phase Workflows (c/e/v) ⭐⭐

**Most frameworks do:** Linear workflows without structure

**B-MAD does:** All workflows follow Clarify → Execute → Verify pattern

**Impact:**
- Consistent mental model
- Easier to understand where you are in workflow
- Natural breakpoints for resumption

### Pattern 7: Template + Config Separation ⭐⭐

**Most frameworks do:** Mix data, template, config in one file

**B-MAD does:** Separate concerns (templates/, config/, data/)

**Impact:**
- Easy to update config without touching templates
- Templates are reusable across workflows
- Less duplication

### Pattern 8: CSV-Based Manifest Registry ⭐⭐

**Most frameworks do:** Hard-coded command lists in code

**B-MAD does:** CSV manifests that power IDE command palettes

**Impact:**
- Easy to add new agents/workflows without code changes
- IDEs can auto-generate command palettes from CSVs
- Manifest is a single source of truth

### Pattern 9: Advanced Elicitation Integration ⭐

**Most frameworks do:** Generic Q&A

**B-MAD does:** Deep integration with "Advanced Elicitation" workflow for complex user needs

**Impact:**
- Better understanding of ambiguous requirements
- More thorough discovery phase
- Less rework downstream

### Pattern 10: Error Recovery with Anti-Metrics ⭐

**Most frameworks do:** Continue even if something goes wrong

**B-MAD does:** Explicit FAILURE anti-metrics — agent checks before advancing

**Impact:**
- Catches errors early
- Prevents cascading failures
- Clear error messages guide recovery

---

## Section 10: B-MAD's Relevance to Linkright's Known Gaps

### Gap Mapping: Linkright Issues → B-MAD Solutions

| Linkright Gap | B-MAD Solution | Location | Applicability |
|---------------|---|---|---|
| **crit-1: Zero-byte files** | Config loading in activation (blocking step) | Agent XML step 2 | ✅ Create quality gate: all configs must load |
| **crit-2: Empty workflow-manifest.csv** | Manifest-driven registry system | CSV manifests section | ✅ Populate workflow-manifest.csv with all 17 workflows |
| **crit-3: 173 closed Beads with no evidence** | SUCCESS/FAILURE metrics per step | Step file architecture | ✅ Add evidence collection to each step file |
| **crit-4: Beads not wired in workflows** | step-01b-resume pattern uses state file | Section 3.3 | ✅ Add bd list --status check in step-01b |
| **crit-5: Phases D-M unimplemented** | step-[N][c/e/v]-[name] naming convention | Section 3.1 | ✅ Use c/e/v phases for all new steps |
| **major-1: Atomicity violations** | Atomicity rule: 1 cognitive op per step | Section 3.4 | ✅ Refactor multi-op steps into separate files |
| **major-2: Missing ADRs** | None (ADRs are outside B-MAD scope) | — | ⚠️ Linkright must add own ADR pattern |
| **major-3: Agent XML depth <40 lines** | Excellent agent example (60-80 lines) | Section 1.4 | ✅ Expand all agents to ≥40 lines |
| **major-4: Manifest cross-refs broken** | CSV manifests + validation pattern | Section 5 | ✅ Validate manifest cross-references |
| **major-5: TEA knowledge base empty** | Data files loaded JIT from step | Section 6 | ✅ Create TEA data files + step loading them |
| **major-6: No quality gates** | SUCCESS/FAILURE metrics + YOLO mode | Section 7 | ✅ Add pre/post execution gates |
| **major-7: Template variable inconsistency** | Variable resolution rule (priority order) | Section 4.3 | ✅ Standardize on `{variable}` only |
| **major-8: Flex workflows stub** | Two-type workflow architecture | Section 2 | ✅ Implement flex workflows using workflow.yaml |
| **major-9: Squick unimplemented** | Complete workflow lifecycle pattern | Sections 2-3 | ✅ Use YAML + XML for complex Squick workflows |

---

## Conclusion

B-MAD's architectural patterns are **directly transferable** to Linkright. The three most impactful patterns are:

1. **Atomic Steps** — Split multi-operation steps into separate files
2. **Resumability** — Add step-01b resume detection with Beads checks
3. **JIT Loading** — Load only current step + immediate deps

These three alone would eliminate most of Linkright's quality debt.

