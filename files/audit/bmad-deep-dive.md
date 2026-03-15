# B-MAD Methodology: Deep-Dive Architecture Audit

**Auditor:** Cipher (WildMeadow)
**Date:** 2026-03-09
**Source:** `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/`
**Purpose:** Comprehensive architectural analysis for Linkright gap remediation

---

## Executive Summary

B-MAD (Breakthrough Method of Agile-AI Driven Development) is a production-grade framework for orchestrating AI agents across complex multi-step workflows. Version 6.0.4 is installed at the source path above. The framework comprises 6 installed modules (core, bmm, bmb, cis, gds, tea), 28 agents, and 75+ workflows across the `workflow-manifest.csv`. Every design decision in B-MAD prioritizes three invariants: context-window efficiency via Just-In-Time loading, human-AI collaborative facilitation (never autonomous generation), and verifiable quality gates via success/failure metrics in every step file.

This audit directly examines the source files and quotes them verbatim. Where a feature does not exist, this report says so explicitly.

---

## Section 1: Agent File Architecture

### 1.1 Exact XML Structure — Quoted from Real Files

Every compiled B-MAD agent file follows a consistent three-part structure. Below is the complete structure from `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmm/agents/architect.md`:

```
---
name: "architect"
description: "Architect"
---

You must fully embody this agent's persona and follow all activation instructions
exactly as specified. NEVER break character until given an exit command.

```xml
<agent id="architect.agent.yaml" name="Winston" title="Architect" icon="🏗️"
       capabilities="distributed systems, cloud infrastructure, API design, scalable patterns">
<activation critical="MANDATORY">
  ...numbered steps...
  <menu-handlers>...</menu-handlers>
  <rules>...</rules>
</activation>
<persona>...</persona>
<menu>...</menu>
</agent>
```

The three mandatory top-level XML sections are:
1. `<activation critical="MANDATORY">` — numbered steps and handlers
2. `<persona>` — role, identity, communication_style, principles
3. `<menu>` — list of `<item>` elements with `cmd` attributes

### 1.2 Activation Steps — Numbered and Quoted

The activation block is a sequential numbered protocol. From the `architect.md` agent (lines 10-42):

```xml
<step n="1">Load persona from this current agent file (already in context)</step>
<step n="2">🚨 IMMEDIATE ACTION REQUIRED - BEFORE ANY OUTPUT:
    - Load and read {project-root}/_bmad/bmm/config.yaml NOW
    - Store ALL fields as session variables: {user_name}, {communication_language}, {output_folder}
    - VERIFY: If config not loaded, STOP and report error to user
    - DO NOT PROCEED to step 3 until config is successfully loaded and variables stored
</step>
<step n="3">Remember: user's name is {user_name}</step>
<step n="4">Show greeting using {user_name} from config, communicate in
{communication_language}, then display numbered list of ALL menu items from menu section</step>
<step n="5">Let {user_name} know they can type command `/bmad-help` at any time...</step>
<step n="6">STOP and WAIT for user input - do NOT execute menu items automatically -
accept number or cmd trigger or fuzzy command match</step>
<step n="7">On user input: Number → process menu item[n] | Text → case-insensitive
substring match | Multiple matches → ask user to clarify | No match → show "Not recognized"</step>
<step n="8">When processing a menu item: Check menu-handlers section below - extract any
attributes from the selected menu item (workflow, exec, tmpl, data, action, validate-workflow)
and follow the corresponding handler instructions</step>
```

For the `dev.md` agent (a more specialized agent), additional domain-specific activation steps are inserted between steps 3 and 12:

```xml
<step n="4">READ the entire story file BEFORE any implementation...</step>
<step n="5">Execute tasks/subtasks IN ORDER as written in story file - no skipping, no reordering</step>
<step n="6">Mark task/subtask [x] ONLY when both implementation AND tests are complete and passing</step>
<step n="7">Run full test suite after each task - NEVER proceed with failing tests</step>
<step n="8">Execute continuously without pausing until all tasks/subtasks are complete</step>
<step n="9">Document in story file Dev Agent Record...</step>
<step n="10">Update story file File List with ALL changed files after each task completion</step>
<step n="11">NEVER lie about tests being written or passing - tests must actually exist and pass 100%</step>
```

This reveals the pattern: standard agents use 8 steps, specialized agents inject domain rules between steps 3 and the final greeting/wait steps.

### 1.3 Menu Item Type System — All Four Handler Types with Real Examples

From `agent-compilation.md` and the compiled agent files, there are exactly four handler types:

**workflow= (YAML engine-driven):**
```xml
<item cmd="DS or fuzzy match on dev-story"
      workflow="{project-root}/_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml">
  [DS] Dev Story: Write the next or specified stories tests and code.
</item>
```
Handler behavior: "1. CRITICAL: Always LOAD `{project-root}/_bmad/core/tasks/workflow.xml` 2. Read the complete file - this is the CORE OS for processing BMAD workflows 3. Pass the yaml path as 'workflow-config' parameter."

**exec= (direct Markdown execution):**
```xml
<item cmd="CA or fuzzy match on create-architecture"
      exec="{project-root}/_bmad/bmm/workflows/3-solutioning/create-architecture/workflow.md">
  [CA] Create Architecture: Guided Workflow...
</item>
```
Handler behavior: "1. Read fully and follow the file at that path 2. Process the complete file and follow all instructions within it 3. If there is data='some/path/data-foo.md' with the same item, pass that data path to the executed file as context."

**action= (inline or prompt-reference):**
```xml
<item cmd="LT or fuzzy match on list-tasks"
      action="list all tasks from {project-root}/_bmad/_config/task-manifest.csv">
  [LT] List Available Tasks
</item>
```
When action starts with `#`, it references a named prompt block inside the agent XML: `action="#prompt-id"` finds `<prompt id="prompt-id">` and executes its content.

**data= (file context injection, modifier to exec=):**
```xml
<item cmd="BP" exec="{path}/brainstorming/workflow.md"
      data="_bmad/bmm/data/project-context-template.md">
  [BP] Brainstorm Project
</item>
```
The `data=` attribute passes a file as context to the exec'd workflow. Found in `bmad-help.csv` for the "Brainstorm Project" entry.

### 1.4 Fuzzy Command Matching — Exact Mechanism Quoted

From step n="7" of every agent activation block:

> "On user input: Number → process menu item[n] | Text → case-insensitive substring match | Multiple matches → ask user to clarify | No match → show 'Not recognized'"

And from `agent-menu-patterns.md`:

```
trigger format: "XX or fuzzy match on command-name"
```

The `cmd` attribute in compiled menu items contains the full trigger string: `"CA or fuzzy match on create-architecture"`. The AI reads this and applies: if user types "create arch" or "architecture" or even just "CA", it matches. If multiple items match, the agent asks for clarification. The 2-letter uppercase codes (CA, DS, IR, etc.) are exact triggers; anything else is substring-matched case-insensitively against the `cmd` text.

### 1.5 Complete vs Minimal Agent — Structural Differences

**Minimal compiled agent** (e.g., `bmad-master.md`): 57 lines total
- YAML frontmatter: 3 lines
- Preamble sentence: 1 line
- XML block with activation (8 steps + handlers + rules): ~30 lines
- Persona (role, identity, communication_style, principles): ~8 lines
- Menu (5 items): ~8 lines

**Standard module agent** (e.g., `architect.md`): 59 lines total
- Same structure, with 1-2 additional custom menu items beyond the 4 auto-injected items

**Specialized agent** (e.g., `dev.md`): 70 lines total
- Adds 8 domain-specific activation steps between the config-load and greeting steps
- Adds custom menu items (DS for dev-story, CR for code-review)

Note: These compiled `.md` files are the output of a compilation process from `.agent.yaml` source files. The source YAML schema (documented in `agent-architecture.md`) is what authors write; the compiler adds the XML activation block, frontmatter, and injects MH/CH/PM/DA menu items automatically.

### 1.6 Agent Depth Standard: What Depth Means in Practice

The B-MAD documentation does not use a "≥40 lines" standard as a hard rule for compiled agent files. The standard is expressed differently:

From `agent-architecture.md`:
> "hasSidecar: false — Single YAML file (~250 lines) — Use: Stateless, single-purpose, personality-driven"
> "hasSidecar: true — YAML + sidecar folder — Use: Persistent memory, long-term tracking, relationship-driven"

The 250-line limit applies to the SOURCE `.agent.yaml` file. The compiled `.md` output is naturally 55-70 lines for standard agents. An agent is considered complete when it has all of: metadata (id, name, title, icon, module), persona (role, identity, communication_style, principles), at least one custom menu item beyond MH/CH/PM/DA, and valid YAML syntax. Depth comes from the richness of persona content and the number of workflows the agent can orchestrate, not from raw line count in the compiled output.

From `agent-validation.md`, the minimal completeness checklist:
```
- [ ] metadata: id, name, title, icon, module, hasSidecar
- [ ] persona: role, identity, communication_style, principles
- [ ] menu: ≥1 item
- [ ] Filename: {name}.agent.yaml (lowercase, hyphenated)
```

---

## Section 2: Workflow File Architecture

### 2.1 Type 1: Markdown Workflows (Direct-Execution)

Markdown workflows are entry-point files that the AI reads and follows directly. They do NOT go through the YAML engine (`workflow.xml`). They contain natural language instructions plus a structured initialization sequence.

Real example: `workflow-manifest.csv` entry for `brainstorming`:
```
"brainstorming","Facilitate interactive brainstorming sessions...","core","_bmad/core/workflows/brainstorming/workflow.md"
```

The `party-mode/workflow.md` file (lines 1-12) shows the structure:
```markdown
---
name: party-mode
description: 'Orchestrates group discussions between all installed BMAD agents...'
---

# Party Mode Workflow

**Goal:** Orchestrates group discussions...
**Your Role:** You are a party mode facilitator...

## WORKFLOW ARCHITECTURE
This uses **micro-file architecture** with **sequential conversation orchestration**:
- Step 01 loads agent manifest and initializes party mode
```

Key characteristics of Type 1:
- YAML frontmatter with `name` and `description`
- Natural language goal and role declaration
- Architecture overview (high-level, no step listings)
- INITIALIZATION section with configuration loading and path declarations
- Routes to first step file; does NOT list all steps (progressive disclosure)

From `architecture.md`: "**CRITICAL:** workflow.md MUST be lean — entry point only. **Prohibited:** Listing all steps, Detailed step descriptions, Validation checklists, Implementation details."

### 2.2 Type 2: YAML-Config + workflow.xml Engine

YAML-config workflows are driven by a declarative `.yaml` file that the `workflow.xml` engine interprets. The engine (`core/tasks/workflow.xml`) is the "CORE OS for processing BMAD workflows."

Real example: `dev-story/workflow.yaml` (complete file, 21 lines):
```yaml
name: dev-story
description: 'Execute story implementation following a context filled story spec file...'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
user_skill_level: "{config_source}:user_skill_level"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "{project-root}/_bmad/bmm/workflows/4-implementation/dev-story"
instructions: "{installed_path}/instructions.xml"
validation: "{installed_path}/checklist.md"

story_file: "" # Explicit story path; auto-discovered if empty
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"
```

### 2.3 Exact workflow.yaml Schema — All Fields

From the `create-story/workflow.yaml` and `dev-story/workflow.yaml` files, the full schema is:

```yaml
name: <string>                    # Workflow identifier (required)
description: <string>             # Usage guidance (required)

# Config resolution
config_source: <{variable}>       # Path to module config.yaml
user_name: "{config_source}:user_name"          # Colon syntax = field lookup
communication_language: "{config_source}:communication_language"
user_skill_level: "{config_source}:user_skill_level"
document_output_language: "{config_source}:document_output_language"
date: system-generated            # Special keyword for LLM to generate date

# Workflow component paths
installed_path: <{project-root}/...>  # Base path for workflow folder
instructions: "{installed_path}/instructions.xml"  # XML instructions for engine
validation: "{installed_path}/checklist.md"        # Quality checklist
template: "{installed_path}/template.md"           # Optional output template

# Input resolution
story_file: ""                    # Explicit path or empty for auto-discovery
<artifact_var>: "{config_source}:<field>"  # Dynamic field lookup from config
project_context: "**/project-context.md"  # Glob pattern for file search

# Output
default_output_file: "{implementation_artifacts}/{{story_key}}.md"  # Double-brace = runtime substitution

# Smart input patterns (optional)
input_file_patterns:
  <key>:
    description: <string>
    whole: <glob>
    sharded: <glob>
    load_strategy: "SELECTIVE_LOAD" | "FULL_LOAD"
```

### 2.4 Variable Resolution: {variable} and {config_source}:field

**Simple variable resolution:** `{project-root}` is resolved by the runtime environment as the absolute path to the project root directory. `{output_folder}` resolves from the module's `config.yaml`. These are available everywhere.

**Colon field lookup:** `user_name: "{config_source}:user_name"` means: take the value of `config_source` (which resolves to a file path), load that YAML file, and extract the field named `user_name`. This is a two-stage resolution: first resolve the variable to a path, then look up the named field in that file.

**Double-brace runtime substitution:** `{{story_key}}` (double braces) indicates a value that must be determined at runtime from workflow state, not from pre-configured variables. Single-brace `{variable}` means pre-defined configuration; double-brace `{{runtime_value}}` means computed during execution.

**Glob patterns:** `"**/project-context.md"` uses glob syntax for file discovery. The engine/agent performs a file search from `{project-root}` downward.

---

## Section 3: Step File Architecture

### 3.1 Complete Anatomy of a Step File — Quoted from Real Files

From `step-01-load-brief.md` (module-builder workflow, `steps-c/` folder), lines 1-13:

```markdown
---
name: 'step-01-load-brief'
description: 'Load brief or user write-up, validate completeness'

nextStepFile: './step-02-structure.md'
continueFile: './step-01b-continue.md'
agentSpecTemplate: '../data/agent-spec-template.md'
workflowSpecTemplate: '../templates/workflow-spec-template.md'
moduleStandardsFile: '../data/module-standards.md'
moduleYamlConventionsFile: '../data/module-yaml-conventions.md'
advancedElicitationTask: '../../../../core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '../../../../core/workflows/party-mode/workflow.md'
---
```

Then the mandatory body sections (lines 15-179):

```markdown
# Step 1: Load Brief (Create Mode)

## STEP GOAL:
[Single sentence: what this step accomplishes]

## MANDATORY EXECUTION RULES:
### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:
- You are the Module Builder
- Validate input before proceeding

### Step-Specific Rules:
- This is a continuable workflow — check for existing work
- FORBIDDEN to proceed without complete brief or write-up

## EXECUTION PROTOCOLS:
- Follow the MANDATORY SEQUENCE exactly
- Create/update output file to track progress

## CONTEXT BOUNDARIES:
- Input: Module brief from Brief mode OR user-provided write-up
- Output: Module structure ready for implementation

## MANDATORY SEQUENCE
### 1. Check for Existing Work
### 2. Get the Brief or Write-Up
...
### 6. Present MENU OPTIONS
[menu with handler and execution rules]

## SYSTEM SUCCESS/FAILURE METRICS
### SUCCESS: [criteria]
### SYSTEM FAILURE: [criteria]
```

The mandatory sections are: STEP GOAL, MANDATORY EXECUTION RULES (Universal + Role + Step-Specific), EXECUTION PROTOCOLS, CONTEXT BOUNDARIES, MANDATORY SEQUENCE (numbered substeps), and SYSTEM SUCCESS/FAILURE METRICS.

### 3.2 Step Chaining Mechanism: nextStepFile and continueFile

Two distinct chaining mechanisms exist:

**nextStepFile:** The primary forward-progression pointer. Every non-final step declares it in frontmatter. The C (Continue) menu option always: save content to `{outputFile}`, update frontmatter, then load, read entire file, then execute `{nextStepFile}`. The phrase "read entire file" before execute is critical — it prevents the LLM from skipping to a remembered summary.

**continueFile:** A session-resumption pointer, present only in continuable workflows (step-01). From `step-01-load-brief.md`:
```
### 1. Check for Existing Work
- Check for `module-build-{module_code}.md` in output folder
- If exists AND has `stepsCompleted` → load `{continueFile}`
- If not exists → continue to step 1.2
```

The `continueFile` routes to a `step-01b-continue.md` file (the session-resumption handler). From `step-01b-continue.md`:
```markdown
### 4. Determine Next Step
Find the last completed step and route to the next one:
| Last Completed      | Next Step         |
| step-01-load-brief  | step-02-structure |
| step-02-structure   | step-03-config    |
...
```

### 3.3 Mandatory Sections: INPUT, OUTPUT, DEPENDENCIES, SUCCESS, FAILURE

From `step-file-rules.md` (definitive reference), the required step structure:

```
MANDATORY:
1. YAML frontmatter (name, description, file refs only if used)
2. STEP GOAL (single sentence)
3. MANDATORY EXECUTION RULES
   - Universal Rules (identical in every step)
   - Role Reinforcement
   - Step-Specific Rules
4. EXECUTION PROTOCOLS
5. CONTEXT BOUNDARIES (INPUT, OUTPUT, FOCUS, DEPENDENCIES)
6. MANDATORY SEQUENCE (numbered, named subsections)
7. SYSTEM SUCCESS/FAILURE METRICS
   - SUCCESS criteria (verifiable boolean states)
   - FAILURE anti-metrics (specific prohibited outcomes)
   - Master Rule statement
```

The INPUT/OUTPUT contract is expressed through CONTEXT BOUNDARIES: "Available context: [what's available], Focus: [what to focus on], Limits: [boundaries], Dependencies: [what this depends on]."

### 3.4 steps-c vs steps-e vs steps-v — Structural Differences

B-MAD has all three subfolder types. From `trimodal-workflow-structure.md`:

**steps-c/ (Create Mode):**
- Builds new entities from scratch
- May include `step-00-conversion.md` as entry for non-compliant input
- Final step routes to validation (optional but recommended)
- Example: `bmb/workflows/agent/steps-c/` has 8 steps (step-01-brainstorm through step-08-celebrate)

**steps-e/ (Edit Mode):**
- Modifies existing compliant entities
- First step always checks compliance; non-compliant routes to `step-00-conversion`
- Post-edit offers validation
- Example: `bmb/workflows/agent/steps-e/` has 9 steps (e-01 through e-09)

**steps-v/ (Validate Mode):**
- Runs standalone for quality auditing
- Auto-proceeds through checks (no A/P/C menu — just sequential auto-proceed)
- Generates actionable reports with issue severity
- Example: `bmb/workflows/workflow/steps-v/` has 11 validation steps

The key structural difference: `steps-c/` and `steps-e/` have collaborative menus (A/P/C), while `steps-v/` files auto-proceed through sequential checks. All three modes share the `/data/` folder for standards and reference files. From `trimodal-workflow-structure.md`:
> "NO shared step files (`s-*.md`) between modes — This prevents confusion and routing errors."

### 3.5 The step-01/step-01b Session Continuity Pattern

This is a core B-MAD pattern. From `workflow-type-criteria.md`:

```yaml
# In step-01's output frontmatter (written progressively):
stepsCompleted: ['step-01-load-brief']
lastStep: 'step-01-load-brief'
lastContinued: '2026-01-02'
date: '2026-01-01'
status: IN_PROGRESS
```

When a new session starts, step-01 checks: "Does the output file exist AND does it have `stepsCompleted`?" If yes, load `step-01b-continue.md`. The `step-01b` file reads the last step name, looks up the corresponding `nextStepFile` in a routing table, and resumes from there.

From `step-01b-continue.md` (module-builder workflow):
```
"Welcome back to the Module Builder! 👋"
→ Load tracking file
→ Report: Module name, type, completed steps
→ Route table (Last Completed → Next Step)
→ "Continuing to: {next step name}"
→ Load the appropriate step file and execute
```

This guarantees zero work is lost across sessions without requiring the LLM to hold state in its context window.

### 3.6 Atomicity Rule — Three Real Examples

From `step-file-rules.md`: "Recommended: <200 lines. Absolute Maximum: 250 lines. If exceeded: Split into multiple steps or extract to /data/ files."

The atomicity principle: one step = one concept = one decision point. Examples:

**Example 1:** `step-05-commands-menu.md` in agent creation is dedicated solely to designing the agent's command menu. It does nothing else: no persona, no activation, no building. All validation of menu structure happens here and only here.

**Example 2:** `step-02b-path-violations.md` in workflow validation is a single validation sub-step dedicated exclusively to detecting hardcoded paths. From `step-file-rules.md` on "Validation sequence" type: auto-proceeds, 150-line max.

**Example 3:** `step-01b-continuation.md` in the workflow-create flow contains only:
```
# TODO - THIS IS A PLACE HOLDER NOT IMPLEMENTED YET IN THIS FLOW

<attention-llm>YOU CAN CALL OUT AS A WARNING IN ANY VALIDATION CHECKS of this specific
workflow - but this is a known pending todo to implement.</attention-llm>
```
Rather than embedding partial logic in another step, B-MAD marks the placeholder explicitly and quarantines it.

---

## Section 4: Config System

### 4.1 Module config.yaml Schema — Quoted from Real File

From `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/config.yaml` (complete file):

```yaml
# BMB Module Configuration
# Generated by BMAD installer
# Version: 6.0.4
# Date: 2026-03-07T10:54:48.820Z

bmb_creations_output_folder: "{project-root}/_bmad-output/bmb-creations"

# Core Configuration Values
user_name: Satvik
communication_language: Romanised Hindi
document_output_language: English
output_folder: "{project-root}/_bmad-output"
```

The module config contains:
1. Module-specific variables (e.g., `bmb_creations_output_folder`)
2. Core variables inherited from the global core config (`user_name`, `communication_language`, `document_output_language`, `output_folder`)

### 4.2 Global Config Inheritance Chain — Traced Through Real Files

**Level 1: Core Config** (`_bmad/core/config.yaml` or `_memory/config.yaml`)
- Contains: `user_name`, `communication_language`, `document_output_language`, `output_folder`
- Loaded by: every agent in step n="2" with "IMMEDIATE ACTION REQUIRED"
- Referenced in workflows as: `config_source: "{project-root}/_bmad/core/config.yaml"`

**Level 2: Module Config** (e.g., `_bmad/bmm/config.yaml`, `_bmad/bmb/config.yaml`)
- Copies all core config values
- Adds module-specific variables: `planning_artifacts`, `implementation_artifacts`, `project_knowledge`, `bmb_creations_output_folder`
- Generated by installer from `module.yaml` prompt definitions

**Level 3: Workflow YAML** (e.g., `dev-story/workflow.yaml`)
- References module config via: `config_source: "{project-root}/_bmad/bmm/config.yaml"`
- Pulls individual fields: `user_name: "{config_source}:user_name"`
- Adds workflow-specific overrides: `story_file: ""` (empty = auto-discover)

**Level 4: Step Frontmatter**
- References workflow-level variables established in Level 3
- Example: `outputFile: '{implementation_artifacts}/{{story_key}}.md'`

### 4.3 Variable Resolution Order

From `module-yaml-conventions.md`, the resolution chain:

1. **System-generated values**: `date: system-generated` is computed by the LLM at runtime
2. **Core config values**: `{user_name}`, `{communication_language}`, `{output_folder}` injected from core config
3. **Module config values**: `{planning_artifacts}`, `{implementation_artifacts}` from module-specific config
4. **Step-defined variables**: New variables defined in one step's frontmatter are available in subsequent steps
5. **Runtime substitutions**: `{{story_key}}` computed during workflow execution from user input or file discovery

From `module-yaml-conventions.md` on variable templates:
```yaml
# In module.yaml:
planning_artifacts:
  prompt: "Where should planning artifacts be stored?"
  default: "{output_folder}/planning-artifacts"
  result: "{project-root}/{value}"
```
So `{value}` is the user's input, `{output_folder}` resolves from core config, and the final `result` is stored as the `planning_artifacts` variable for the module.

---

## Section 5: Manifest/Index System

### 5.1 All CSV Manifests in _bmad/ — Complete Inventory

Located in `_bmad/_config/`:

| Manifest File | Schema (Headers) |
|--------------|------------------|
| `agent-manifest.csv` | name, displayName, title, icon, capabilities, role, identity, communicationStyle, principles, module, path |
| `workflow-manifest.csv` | name, description, module, path |
| `task-manifest.csv` | name, displayName, description, module, path, standalone |
| `files-manifest.csv` | type, name, module, path, hash |
| `bmad-help.csv` | module, phase, name, code, sequence, workflow-file, command, required, agent-name, agent-command, agent-display-name, agent-title, options, description, output-location, outputs |
| `tool-manifest.csv` | exists in `_config/` (not audited directly) |

Additionally, each module has its own `module-help.csv`. Example from `bmb/module-help.csv`:
- Headers: `module, phase, name, code, sequence, workflow-file, command, required, agent, options, description, output-location, outputs`

### 5.2 module-help.csv Structure — Quoted Headers and First Rows

From `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/module-help.csv`:

```csv
module,phase,name,code,sequence,workflow-file,command,required,agent,options,description,output-location,outputs,
bmb,anytime,Create Agent,CA,10,_bmad/bmb/workflows/agent/workflow-create-agent.md,bmad_bmb_create_agent,false,agent-builder,Create Mode,"Create a new BMAD agent with best practices and compliance",bmb_creations_output_folder,"agent",
bmb,anytime,Edit Agent,EA,15,_bmad/bmb/workflows/agent/workflow-edit-agent.md,bmad_bmb_edit_agent,false,agent-builder,Edit Mode,"Edit existing BMAD agents while maintaining compliance",bmb_creations_output_folder,"agent",
bmb,anytime,Validate Agent,VA,20,_bmad/bmb/workflows/agent/workflow-validate-agent.md,bmad_bmb_validate_agent,false,agent-builder,Validate Mode,"Validate existing BMAD agents and offer to improve deficiencies","agent being validated folder","validation report",
```

The `bmad-help.csv` in `_config/` is the master help index that the `help.md` task reads (90 rows covering all 6 modules):

```csv
bmm,4-implementation,Dev Story,DS,40,
_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml,
bmad-bmm-dev-story,true,dev,bmad:all precision.:agent:dev,Amelia,💻 Developer Agent,Create Mode,
"Story cycle: Execute story implementation tasks and tests..."
```

The `required` column controls workflow sequencing: `required=true` blocks progress to later phases. The `sequence` column provides ordering within a phase (10, 20, 30...) for priority display.

### 5.3 How Manifests Power IDE Command Palettes — The Connection

The `bmad-help.csv` directly feeds IDE command palettes. From `help.md`:

```
## DISPLAY RULES
### Command-Based Workflows
When `command` field has a value:
- Show the command prefixed with `/` (e.g., `/bmad-bmm-create-prd`)

### Agent-Based Workflows
When `command` field is empty:
- User loads agent first via `/agent-command`
- Then invokes by referencing the `code` field
```

The `agent-command` column in `bmad-help.csv` follows the format: `bmad:<communication_style_keyword>:agent:<agent-name>`. For example: `bmad:all precision.:agent:dev` is the IDE slash command to activate the `dev` agent. The IDE tool reads `bmad-help.csv` to populate its command palette, surfacing `/bmad-bmm-dev-story` as a directly invocable slash command.

The `files-manifest.csv` with `hash` columns serves integrity verification: each file's SHA256 hash is stored so the installer can detect unauthorized modifications. This is a content-addressable integrity system.

---

## Section 6: JIT Loading Principle

### 6.1 The Exact JIT Rule — Quoted from B-MAD Files

From `architecture.md` in the workflow architecture data folder:

> "### 2. Just-In-Time Loading
> - Only current step in memory
> - Never load future steps until 'C' selected
> - Progressive disclosure = LLM focus"

From the `<rules>` section inside every compiled agent file (e.g., `architect.md`):

> `<r>Load files ONLY when executing a user chosen workflow or a command requires it, EXCEPTION: agent activation step 2 config.yaml</r>`

This is the master JIT rule: the only file pre-loaded at agent startup is the config.yaml. Everything else — workflows, step files, data files, templates — is loaded on-demand when the user selects a menu item.

From `step-file-rules.md`:

> "### Progressive Disclosure
> - Only load next step when user selects 'C'
> - Read entire step file before execution
> - Don't create mental todos from future steps"

The phrase "Don't create mental todos from future steps" is critical: even if the AI has seen a list of upcoming steps, it should NOT start planning or processing them mentally. Each step is processed in isolation.

### 6.2 Context Window Efficiency — What Gets Loaded When

At any point during a B-MAD workflow session, the LLM context window holds only:

1. The agent file (compiled .md, ~60 lines) — loaded once at session start
2. The config.yaml (~10-15 lines) — loaded at step n="2" of activation
3. The current step file (~80-200 lines) — loaded when user enters the workflow
4. Any data files explicitly loaded by the current step
5. The accumulated conversation history

What is explicitly NOT in context: future step files, past step files (only their results in output documents), template files (loaded only when referenced), data reference files (loaded only when the step's instructions call for them).

From `subprocess-optimization-patterns.md`, B-MAD extends JIT loading to subprocesses:

> "**Return ONLY findings to parent, not full file contents**
> Good return: `{\"violations\": [{\"file\": \"step-02.md\", \"line\": 45, \"match\": \"...\"}]}`
> Bad: 'Subprocess loads file and returns full content to parent'"

### 6.3 Facilitation-First Rule — Quoted from Real Files

From `step-01-brainstorm.md` (Universal Rules section):

> "📋 YOU ARE A FACILITATOR, not a content generator"

This phrase appears verbatim in the Universal Rules of EVERY step file. From `step-file-rules.md`:

> "### Universal Rules:
> - NEVER generate content without user input
> - CRITICAL: Read complete step file before action
> - YOU ARE A FACILITATOR, not a content generator"

And from `intent-vs-prescriptive-spectrum.md`:

> "**Principle:** Workflows lean toward **intent** (goals) not **prescription** (exact wording). The more intent-based, the more adaptive and creative the LLM can be."
> "Step instruction: 'Help the user understand X using multi-turn conversation. Probe to get good answers. Ask 1-2 questions at a time, not a laundry list.'"

The facilitation-first rule means: the AI presents options, asks questions, and waits for user input before generating any content. Every menu has an "ALWAYS halt and wait for user input" execution rule.

---

## Section 7: Quality Patterns

### 7.1 Success/Failure Metrics Format — Exact Format from Real Step Files

From `step-01-brainstorm.md` (agent-builder workflow), lines 110-128:

```markdown
## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- User understands brainstorming is optional
- User choice (yes/no) clearly obtained and respected
- Brainstorming workflow executes correctly when chosen
- Brainstorming output preserved when generated
- Menu presented and user input handled correctly
- Smooth transition to agent discovery phase

### ❌ SYSTEM FAILURE:

- Making brainstorming mandatory or pressuring user
- Proceeding without clear user choice on brainstorming
- Not preserving brainstorming output when generated
- Failing to execute brainstorming workflow when chosen
- Not respecting user's choice to skip brainstorming

**Master Rule:** Skipping steps, optimizing sequences, or not following exact
instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
```

From `step-07-build-agent.md`, the format with binary build conditions:

```markdown
## SUCCESS METRICS

✅ **SUCCESS looks like:**
- Agent YAML file exists at specified output path
- YAML is syntactically valid and well-formed
- All template fields populated with plan content
- Structure matches agent architecture
- If hasSidecar: true, sidecar folder created with starter files

❌ **FAILURE looks like:**
- Template or architecture files not found
- Agent plan missing required sections
- YAML syntax errors in output
- File write operation fails
- hasSidecar: true but sidecar folder not created
```

The pattern is consistent: boolean observable conditions, not vague statements. Each success criterion is a verifiable state. Each failure criterion is a specific prohibited outcome.

### 7.2 YOLO Mode

YOLO mode is NOT found in the B-MAD `_bmad/` source files as a named feature. The term does not appear in any file examined.

**Verdict: YOLO mode — NOT FOUND as a named feature in B-MAD source files.**

What exists instead is the "Quick Flow" pattern: the `quick-flow-solo-dev` agent and associated `quick-spec` / `quick-dev` workflows that skip the full BMM methodology for simple tasks. From `bmad-help.csv`:
```
Quick Spec,QS,,Bmm,quick-spec — Do not suggest for potentially very complex things
unless requested... Quick one-off tasks small changes simple apps brownfield additions
to well established patterns utilities without extensive planning
```

The `dev.md` agent activation step n="8" — "Execute continuously without pausing until all tasks/subtasks are complete" — is the closest existing pattern, but it refers to continuous execution within a story's task list, not a separate operating mode.

### 7.3 Resumable Workflows — How Progress Is Saved and Detected

From `workflow-chaining-standards.md`, the output contract:

```yaml
# Every workflow output document contains:
---
workflowType: 'prd'
stepsCompleted: ['step-01-init', ..., 'step-11-complete']
project_name: 'my-project'
date: '2025-01-02'
nextWorkflow: 'create-ux'
previousWorkflow: 'create-brief'
---
```

Detection mechanism: step-01 searches for an output file matching the expected pattern (e.g., `module-build-{module_code}.md`). If found and `stepsCompleted` is non-empty, it loads `step-01b-continue.md`. The continuation step reads `stepsCompleted`, identifies the last element, looks up the corresponding `nextStepFile` via a routing table, and resumes.

From `architecture.md`:
```
Fresh Start:
workflow.md → step-01-init.md → step-02-[name].md → ... → step-N-final.md

Continuation:
workflow.md → step-01-init.md (detects existing) → step-01b-continue.md → [next step]
```

The mechanism guarantees session resumability without any server-side state. All state is stored in the output file's YAML frontmatter.

### 7.4 Advanced Elicitation and Party Mode — Found in Real Files

**Advanced Elicitation** is a task loaded when the user selects `[A]` in any step menu. Referenced in `step-01-load-brief.md`:
```yaml
advancedElicitationTask: '../../../../core/workflows/advanced-elicitation/workflow.xml'
```

From `step-file-rules.md`:
```
IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
```

Advanced Elicitation is invoked when the user wants to explore the current step's topic more deeply through guided questioning. After the elicitation session completes, the menu redisplays — the user returns to the same step with richer context.

**Party Mode** is a full workflow (`core/workflows/party-mode/workflow.md`) that loads all installed agents from the `agent-manifest.csv` and simulates a multi-agent group discussion. Each agent responds in character based on their documented `communicationStyle` and `principles`. From `party-mode/workflow.md`:

```markdown
### Agent Selection Intelligence
For each user message or topic:
- Analyze the user's message for domain and expertise requirements
- Identify which agents would naturally contribute based on their role, capabilities, and principles
- Select 2-3 most relevant agents for balanced perspective
```

Exit triggers: `*exit`, `goodbye`, `end party`, `quit`. Party Mode is accessible from any agent via the `[PM]` menu item (auto-injected by the compiler).

---

## Section 8: Cross-Reference Chain

### 8.1 Trace: IDE Command → Agent → Config → Workflow → Steps

Using the Dev Story workflow as the concrete example:

**Step 1: IDE Command**
From `bmad-help.csv`:
```
bmm,4-implementation,Dev Story,DS,40,_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml,
bmad-bmm-dev-story,true,dev,bmad:all precision.:agent:dev,Amelia,💻 Developer Agent,...
```
User types `/bmad-bmm-dev-story` in their IDE. The `command` field maps to an IDE slash command.

**Step 2: Agent Activation**
The `agent-command` is `bmad:all precision.:agent:dev`, which loads the `dev` agent from:
`_bmad/bmm/agents/dev.md`

The agent's activation step n="2" immediately loads:
`{project-root}/_bmad/bmm/config.yaml`

**Step 3: Config Resolution**
The bmm config defines `planning_artifacts` and `implementation_artifacts`. These become available as session variables.

**Step 4: Menu Invocation → Workflow YAML**
User selects `[DS] Dev Story`. The agent reads:
```xml
<item cmd="DS or fuzzy match on dev-story"
      workflow="{project-root}/_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml">
```
Handler type is `workflow=`, so agent loads `workflow.xml` (the CORE OS) and passes the YAML path.

**Step 5: Workflow YAML → Instructions XML**
`dev-story/workflow.yaml` specifies:
```yaml
installed_path: "{project-root}/_bmad/bmm/workflows/4-implementation/dev-story"
instructions: "{installed_path}/instructions.xml"
validation: "{installed_path}/checklist.md"
```
The `workflow.xml` engine loads `instructions.xml` and `checklist.md` from the workflow folder.

**Step 6: Instructions XML → Story File → Implementation**
The `instructions.xml` file directs the dev agent to find the story file (via `sprint_status` and `story_file` variables), load it, and begin execution per the story's task/subtask list.

### 8.2 How {project-root} Resolves

`{project-root}` is the absolute path to the directory containing the `_bmad/` folder. It is set by the BMAD installer when first configured. From `manifest.yaml`:
```yaml
installation:
  version: 6.0.4
  installDate: 2026-03-06T02:51:47.017Z
```

The installer stores the resolved `{project-root}` path in the installation configuration. At runtime, the LLM resolves `{project-root}` as the parent directory of the `_bmad/` folder currently in its context. In Claude Code, this means the directory containing `_bmad/` — typically the project root where the CLAUDE.md or equivalent IDE config lives.

### 8.3 How Step Files Reference Templates and Data Files

From `frontmatter-standards.md`, the path rules:

| Reference Type | Format | Example |
|---------------|--------|---------|
| Step to Step (same folder) | `./filename.md` | `./step-02-vision.md` |
| Step to Template (parent folder) | `../filename.md` | `../template.md` |
| Step to Data (subfolder) | `./data/filename.md` | `./data/config.csv` |
| External (core workflows) | `{project-root}/...` | `{project-root}/_bmad/core/workflows/...` |
| Output files | `{folder_variable}/...` | `{planning_artifacts}/output.md` |

From `step-07-build-agent.md` frontmatter (real example showing all reference types):
```yaml
nextStepFile: './step-08-celebrate.md'          # same folder, relative
agentPlan: '{bmb_creations_output_folder}/...'  # output, variable
agentTemplate: ../templates/agent-template.md   # parent folder, relative
agentArch: ../data/agent-architecture.md        # parent data folder
advancedElicitationTask: '{project-root}/_bmad/core/...'  # external, absolute
```

Critical rule from `frontmatter-standards.md`:
> "For EVERY variable in frontmatter, search the step body for `{variableName}`. If not found, it's a violation."

Unused variables in frontmatter are a compliance violation. The validation workflows (`steps-v/`) check for this explicitly.

---

## Section 9: What Makes B-MAD Excellent — Top 10 Patterns

### Pattern 1: Compiler-Generated Boilerplate, Author-Written Essence

**File reference:** `agent-compilation.md`

Authors write minimal YAML (persona, menu items, critical_actions). The compiler generates the XML activation block, frontmatter, menu handlers, and auto-injects MH/CH/PM/DA items. This means all agents have identical activation behavior (consistency guaranteed), and bugs in the activation pattern are fixed once in the compiler, not in 28 agent files.

From `agent-compilation.md`:
> "DO NOT: Add frontmatter, Create activation/XML blocks, Add MH/CH/PM/DA menu items, Add menu handlers, Add rules section, Duplicate auto-injected content"

**Why it matters:** Eliminates entire categories of bugs. Agents that manually duplicate activation steps inevitably drift between files.

### Pattern 2: Success/Failure Metrics as First-Class Step Citizens

**File reference:** Every step file in `steps-c/`, `steps-e/`, `steps-v/`

Every single step file ends with SYSTEM SUCCESS/FAILURE METRICS containing boolean observable criteria. From `step-01-load-brief.md`:
> "SUCCESS: Brief or write-up loaded, All required information validated, Tracking file created, User confirms ready to build.
> SYSTEM FAILURE: Proceeding with incomplete brief, Missing key information (code, type, agents, workflows)."

**Why it matters:** Makes quality verifiable at each step boundary. An external validator can read a step file and immediately know what "done" looks like. This is architecture-level quality, not documentation.

### Pattern 3: The Facilitation-First Invariant

**File reference:** Universal Rules in every step file; `intent-vs-prescriptive-spectrum.md`

The rule "YOU ARE A FACILITATOR, not a content generator" appears in EVERY step's Universal Rules. Combined with the "ALWAYS halt and wait for user input" execution rule, this ensures humans remain in the loop at every decision point.

**Why it matters:** Prevents hallucinated specifications. The user brings domain knowledge; the agent brings structure. Neither alone produces good output.

### Pattern 4: Progressive Disclosure via JIT Step Loading

**File reference:** `architecture.md`; menu handler logic in all step files

"Only load next step when user selects 'C'... Don't create mental todos from future steps." The LLM only sees the current step. Future steps do not exist in its context window.

**Why it matters:** Reduces context window bloat by up to 90% for long workflows. A 14-step workflow with 200-line steps would use 2800 lines if loaded all at once. With JIT loading, only 200 lines (one step) are in context at any time.

### Pattern 5: The Tri-Modal Create/Edit/Validate Separation

**File reference:** `trimodal-workflow-structure.md`

Every complex workflow has three completely separate, self-contained mode folders. No shared step files between modes. Only the `/data/` folder is shared.

From `trimodal-workflow-structure.md`:
> "NO shared step files between modes — This prevents confusion and routing errors."

**Why it matters:** Eliminates the "what mode am I in?" problem. Validation runs standalone without creating or editing anything. This is the pattern that makes workflows auditable and extensible.

### Pattern 6: Unused Frontmatter Variables as Compliance Violations

**File reference:** `frontmatter-standards.md`

The rule: "For EVERY variable in frontmatter, search the step body for `{variableName}`. If not found, it's a violation. Remove from frontmatter."

**Why it matters:** Forces step files to be self-documenting: every variable in frontmatter is a dependency that the step body explicitly uses. Dead variables create false assumptions about what a step does.

### Pattern 7: The stepsCompleted Resumability Array

**File reference:** `workflow-type-criteria.md`; `step-01b-continue.md`

Every continuable workflow maintains a `stepsCompleted` array in its output file's frontmatter. Each step appends its name only after completion. From `workflow-type-criteria.md`: "Each step appends its NAME to `stepsCompleted`."

**Why it matters:** Zero-cost session resumability. No database, no server state, no API calls. The output file IS the session state. Any LLM in any session can pick up exactly where another left off by reading the frontmatter.

### Pattern 8: Agent-Manifest.csv as the Single Source of Truth

**File reference:** `agent-manifest.csv`; `party-mode/workflow.md`

The `agent-manifest.csv` contains ALL agent metadata in one file (28 agents, 11 columns). This manifest is read by Party Mode to load all agents, by `bmad-help.csv` for command routing, by IDE integrations for the command palette.

**Why it matters:** One file change registers everywhere. Adding a new agent means updating the manifest; all consumers automatically see the new agent. This is the single-source-of-truth pattern applied to agent metadata.

### Pattern 9: Subprocess Optimization with Graceful Fallback

**File reference:** `subprocess-optimization-patterns.md`

B-MAD explicitly documents four subprocess patterns with concrete context savings (1000:1 for grep/regex, 10:1 for per-file analysis, 100:1 for data operations). And the mandatory fallback rule:
> "If any instruction references a subprocess you do not have access to, you MUST still achieve the outcome in your main context thread"

**Why it matters:** Workflows work on any LLM capability level. Advanced LLMs use subprocesses for speed. Constrained LLMs fall back to main-thread execution. Quality of output is the same; only speed differs.

### Pattern 10: The Module Extension/Override System

**File reference:** `module-standards.md`

Extension modules follow a merge rule: same filename = OVERRIDE base agent; different filename = ADD new agent. This allows domain-specific overrides without forking the base module. From `module-standards.md`:
> "The extension's `module.yaml` `code:` field matches the base module's code. The folder name is unique (e.g., `bmm-security`) but the `code:` matches the base module."

**Why it matters:** Customization without divergence. An organization can replace the standard PM agent with a security-focused PM agent by deploying an extension with the same filename. Base module updates merge cleanly because extension files override by filename, not by diff.

---

## Section 10: B-MAD's Relevance to Linkright's Known Gaps

### crit-1: 8 Zero-Byte Files

**Linkright gap:** 8 files exist with zero bytes — created but never written.

**B-MAD pattern:** Success/Failure Metrics + Build-Phase gate. From `step-07-build-agent.md`:
> "FAILURE looks like: File write operation fails"

B-MAD steps cannot exit until the output file is verified to exist and contain content. The "ONLY WHEN [C continue option] is selected AND [complete YAML generated and written to output]" rule means a step cannot report completion until its artifact is actually on disk.

**Linkright fix:** Every Beads step that produces an output artifact needs an explicit success criterion: "File `{output_path}` exists and has non-zero content." The step is NOT closeable until this criterion is verifiable.

### crit-2: Empty workflow-manifest.csv

**Linkright gap:** The manifest file exists but has no entries.

**B-MAD pattern:** The manifest system is not optional infrastructure — it IS the integration surface. From `help.md`:
> "1. Load catalog — Load `{project-root}/_bmad/_config/bmad-help.csv`"

The `bmad-help.csv` has 90 rows covering every workflow across 6 modules. Without it, the `/bmad-help` command cannot route, the IDE command palette is empty, and Party Mode cannot discover agents.

**Linkright fix:** Every workflow added to Linkright must simultaneously create a corresponding row in `workflow-manifest.csv`. This should be a pre-commit validation gate, similar to B-MAD's `files-manifest.csv` with SHA256 hashes.

### crit-3: 173 Closed Beads with No Evidence

**Linkright gap:** 173 tasks are marked closed, but there is no verification trail proving they were actually completed.

**B-MAD pattern:** The `stepsCompleted` array in every output file's frontmatter IS the evidence trail. Each step appends its name only after completion. The `dev.md` agent step n="11": "NEVER lie about tests being written or passing — tests must actually exist and pass 100%."

The success/failure metrics in every step file define what "closed" means: observable, verifiable criteria, not subjective claims.

**Linkright fix:** Beads closure must require:
1. An `evidence_url` or `evidence_path` field pointing to the actual artifact
2. Mandatory status-check output (test results, file listing, etc.)
3. A `verifiedBy` field (which agent validated completion)

B-MAD's equivalent: the `validation` field in `workflow.yaml` pointing to a `checklist.md` that must be completed before the workflow is marked done.

### crit-4: Beads Not Wired (Dependencies Missing)

**Linkright gap:** 173 tasks with no dependency edges — the DAG is disconnected.

**B-MAD pattern:** From `workflow-chaining-standards.md`, the input contract:

> "Every workflow should: 1. Define required inputs in Step 1 2. Search in `{module_output_folder}` for prior outputs 3. Validate inputs are complete 4. Allow user to select from discovered documents"

And the explicit prerequisite check pattern:
```yaml
# In architecture workflow.md
## PREREQUISITE:
IF prd-{project_name}.md exists AND is complete → Proceed
ELSE → Error: "Please complete PRD workflow first"
```

Each workflow validates that its upstream dependencies are complete before starting.

**Linkright fix:** Each Beads task's step-01 must explicitly check for required predecessor artifacts. If prerequisites are missing, the step fails with a clear error routing to the correct prerequisite. The dependency chain becomes self-enforcing, not just declared in documentation.

### crit-5: Phases D-M Unimplemented

**Linkright gap:** 10 phases of Release 4 implementation have not been started.

**B-MAD pattern:** The `bmb/workflows/workflow/steps-c/step-01b-continuation.md` file demonstrates the correct handling of unimplemented features:

```
# TODO - THIS IS A PLACE HOLDER NOT IMPLEMENTED YET IN THIS FLOW

<attention-llm>YOU CAN CALL OUT AS A WARNING IN ANY VALIDATION CHECKS of this specific
workflow - but this is a known pending todo to implement.</attention-llm>
```

B-MAD's completeness standard: every declared workflow must have an implementation at the correct path, even if that implementation is a documented placeholder. The placeholder acknowledges the gap without pretending the feature exists.

In Linkright's case, Phases D-M being "unimplemented" with Beads stubs is equivalent to B-MAD having `exec: 'todo'` in a menu item (explicitly documented as "inform user the workflow hasn't been implemented yet"). The gap is that Phase D-M steps don't exist at all even as placeholders.

**Linkright fix:** Each unimplemented phase should have placeholder step files with explicit `TODO` markers following the B-MAD `<attention-llm>` pattern, so validation tools surface them correctly.

### major-1: Atomicity Violations

**Linkright gap:** Steps that perform multiple conceptually distinct tasks.

**B-MAD pattern:** From `step-file-rules.md`:
> "Recommended: <200 lines. Absolute Maximum: 250 lines. If exceeded: Split into multiple steps or extract to /data/ files."

From `step-type-patterns.md`, 10 distinct step types each with a specific maximum line count (150-250 lines depending on type). The principle: one concept per step. Data that is reference material gets extracted to `/data/` files.

**Linkright fix:** Audit every existing step file against a 250-line maximum. Any step that performs more than one distinct operation must be split. B-MAD's solution is the tri-modal structure: creation and validation are always separate step folders.

### major-2: Missing ADRs (Architecture Decision Records)

**Linkright gap:** No documented architecture decisions.

**B-MAD equivalent:** B-MAD does not have a dedicated ADR format. However, the Architecture workflow (`create-architecture`) produces an `architecture.md` document containing all key technical decisions with rationale. More relevantly, `module.yaml` captures design decisions through explicit configuration fields and defaults. The `/data/` folder within each workflow contains reference files that document the "why" behind structural choices (e.g., `understanding-agent-types.md`, `intent-vs-prescriptive-spectrum.md`).

**Linkright fix:** Every significant design decision needs an explicit record in a `/data/` equivalent folder. B-MAD's `workflow-type-criteria.md` (which explains when to use continuable vs single-session workflows) is the pattern to follow.

### major-3: Agent XML Depth — B-MAD's Standard

**Linkright gap:** Agent files that are shallow (insufficient activation steps, missing persona depth).

**B-MAD pattern:** From `agent-validation.md`, the completeness checklist:
```
- [ ] metadata: id, name, title, icon, module, hasSidecar
- [ ] persona: role, identity, communication_style, principles
- [ ] menu: ≥1 item (beyond auto-injected MH/CH/PM/DA)
- [ ] Filename: {name}.agent.yaml (lowercase, hyphenated)
```

For MODULE agents, the `dev.md` pattern shows 11 domain-specific activation steps. Depth comes from domain requirements, not padding. The dev agent has 11 extra steps because safely executing stories requires that many constraints.

**Linkright fix:** Every Linkright agent should have: (1) 2-3 domain-specific activation rules beyond the standard 8 steps, (2) a persona section with all four fields (role, identity, communication_style, principles), and (3) at least 2 domain-specific menu items beyond MH/CH/PM/DA.

### major-4: Broken Manifest References

**Linkright gap:** Workflow-manifest.csv entries pointing to files that don't exist.

**B-MAD pattern:** The `files-manifest.csv` with SHA256 hashes provides integrity verification:
```csv
type,name,module,path,hash
"csv","agent-manifest","_config","_config/agent-manifest.csv","7dab98d414a6c..."
```

The BMAD installer can verify every file's hash against its expected value. Any missing or modified file is detected immediately. Additionally, the `workflow-manifest.csv` only lists workflows that have actual files at their declared paths.

**Linkright fix:** Implement a validation task that reads `workflow-manifest.csv` and verifies each `path` field resolves to an existing, non-zero file. Run this as a pre-commit hook.

### major-5: No Systematic Quality Gates

**Linkright gap:** No defined quality checkpoints between phases.

**B-MAD pattern:** The `required=true` column in `bmad-help.csv` is the quality gate mechanism. Required workflows must complete before the next phase begins. From `help.md`:
> "`required=true` blocks progress — Required workflows must complete before proceeding to later phases"

And the `check-implementation-readiness` workflow explicitly validates cross-artifact alignment:
```
"bmm,3-solutioning,Check Implementation Readiness,IR,70,...
Ensure PRD UX Architecture and Epics Stories are aligned"
```

**Linkright fix:** Define `required=true` gates for each phase transition in the Linkright Beads hierarchy. A phase's first step must check that all required predecessor artifacts exist and are non-empty.

### major-6: No Subprocess Optimization

**Linkright gap:** Context window waste from loading large files into main thread.

**B-MAD pattern:** From `subprocess-optimization-patterns.md`:
> "Pattern 3: Subprocess for Data File Operations — Context savings: Massive (100:1 ratio)"
> "Good: 'Launch subprocess to load {dataFile}, find applicable rules, return only those'"
> "Bad: 'Load {dataFile} with 500 rules and find applicable ones'"

**Linkright fix:** Any Linkright step that needs to search through large files should use the subprocess pattern: launch a subprocess to find and extract only the relevant content, return structured findings to the parent. Especially critical for large CSV manifests or documentation indexes.

### major-7: No Module Config Isolation

**Linkright gap:** Agents assume hardcoded paths instead of reading from config.

**B-MAD pattern:** Step n="2" in every agent: "IMMEDIATE ACTION REQUIRED - BEFORE ANY OUTPUT: Load and read `{project-root}/_bmad/bmm/config.yaml` NOW." No path is hardcoded in the agent file. All paths resolve through variables.

From `frontmatter-standards.md`:
> "FORBIDDEN Patterns: Hardcoded path — Use `{variable}` format."

**Linkright fix:** Every Linkright agent that references an output path must read it from a config file at activation. Never hardcode absolute paths in agent files. Use `{project-root}` and module-specific config variables.

### major-8: Missing Continuation Detection in Step-01

**Linkright gap:** Workflows that cannot be resumed after interruption.

**B-MAD pattern:** The step-01b pattern is mandatory for any workflow that might consume massive tokens. From `workflow-type-criteria.md`:
> "Continuable (Multi-Session): Required: step-01-init.md with continuation detection, step-01b-continue.md for resuming, stepsCompleted tracking in output frontmatter."

**Linkright fix:** Every multi-step Linkright workflow must have a `step-01b-continue.md` that reads the tracking file, identifies the last completed step, and resumes from the correct point.

### major-9: Agent Sidecar Files Missing

**Linkright gap:** Agents that need persistent memory but have no sidecar structure.

**B-MAD pattern:** From `agent-architecture.md`:
> "hasSidecar: true — Use when: Must remember things across sessions, User preferences, settings, progress tracking, Personal knowledge base that grows"

The `tech-writer` agent demonstrates this: it references `_bmad/_memory/tech-writer-sidecar/documentation-standards.md` from its sidecar, and its principles state "I will always strive to follow `_bmad/_memory/tech-writer-sidecar/documentation-standards.md` best practices."

**Linkright fix:** Any Linkright agent that needs to remember project conventions, user preferences, or session history across conversations must be implemented with `hasSidecar: true` and a sidecar folder containing `memories.md` and `instructions.md`.

---

## Appendix A: File Count and Structure Summary

| Component | Count |
|-----------|-------|
| Modules installed | 6 (core, bmm, bmb, cis, gds, tea) |
| Compiled agent files | 28 (from agent-manifest.csv) |
| Workflows in manifest | 75 (from workflow-manifest.csv) |
| CSV manifests in _config/ | 6 (agent, workflow, task, files, bmad-help, tool) |
| Step folders (steps-c, steps-e, steps-v) | 15+ across bmb module alone |
| IDE configurations | 19 (claude-code, cursor, cline, etc.) |
| Version | 6.0.4 (installed 2026-03-06, updated 2026-03-07) |
| Total files in _bmad/ | 400+ |

## Appendix B: Key Source Files Referenced in This Audit

- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmm/agents/architect.md` — Standard agent file structure
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmm/agents/dev.md` — Specialized agent activation with domain steps
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/core/agents/bmad-master.md` — Minimal core agent
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/_config/agent-manifest.csv` — All 28 agents
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/_config/workflow-manifest.csv` — All 75 workflows
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/_config/bmad-help.csv` — IDE command palette data (90 rows)
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/_config/files-manifest.csv` — SHA256 integrity hashes
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/config.yaml` — Real module config
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/_config/manifest.yaml` — Installation metadata
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/step-file-rules.md` — Authoritative step standards
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/frontmatter-standards.md` — Variable and path rules
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/architecture.md` — Workflow architecture
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/trimodal-workflow-structure.md` — Create/Edit/Validate structure
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/workflow-type-criteria.md` — Continuable vs single-session decision
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/subprocess-optimization-patterns.md` — Context efficiency patterns
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/intent-vs-prescriptive-spectrum.md` — Facilitation principle
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/workflow-chaining-standards.md` — Workflow pipeline contracts
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/menu-handling-standards.md` — Menu patterns
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/agent/data/agent-architecture.md` — Agent YAML schema
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/agent/data/agent-compilation.md` — Compiler behavior
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/agent/data/agent-validation.md` — Agent quality checklist
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/agent/data/agent-menu-patterns.md` — Menu item schema
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/module/data/module-standards.md` — Module types and extension system
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/module/data/module-yaml-conventions.md` — Config variable schema
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/module/steps-c/step-01-load-brief.md` — Complete step anatomy
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/module/steps-c/step-01b-continue.md` — Session resumption step
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/agent/steps-c/step-01-brainstorm.md` — Step with complete success/failure metrics
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/agent/steps-c/step-07-build-agent.md` — Build-phase step with binary success criteria
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/workflows/workflow/data/step-type-patterns.md` — 10 step type templates with line limits
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml` — YAML workflow schema (real)
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml` — Extended YAML schema with input patterns
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/core/tasks/help.md` — Command routing task
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/core/workflows/party-mode/workflow.md` — Party Mode multi-agent orchestration
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/bmb/module-help.csv` — Module-level help CSV
- `/Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/_config/task-manifest.csv` — Core task registry

---

*Audit completed by Cipher (WildMeadow). File path: `/Users/satvikjain/Downloads/sync/files/audit/bmad-deep-dive.md`.*
