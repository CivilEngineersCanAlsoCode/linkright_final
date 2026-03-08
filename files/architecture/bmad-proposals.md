# B-MAD Architectural Proposals for Linkright

**Author:** BrightTower (B-MAD Architect)
**Date:** 2026-03-09
**Scope:** Prescriptive solutions for all identified Linkright gaps

---

## P0 Solutions: Critical Blocking Fixes

### Solution for P0-1: Populate workflow-manifest.csv

**B-MAD Pattern Being Applied:**
CSV-based manifest registry system (Section 5 of bmad-deep-dive.md)

**Prescriptive Implementation:**

Create file: `/Users/satvikjain/Downloads/sync/context/linkright/_lr/_config/workflow-manifest.csv`

**Exact CSV Schema:**
```csv
workflow_name,module,file_path,type,phase_coverage,step_count,description
jd-optimize,sync,core/workflows/jd-optimize/workflow.yaml,yaml/xml,c|e|v,64,JD analysis and resume optimization workflow
resume-optimize,sync,core/workflows/resume-optimize/workflow.yaml,yaml/xml,c|e|v,32,Resume content optimization workflow
portfolio-generate,sync,core/workflows/portfolio-generate/workflow.yaml,yaml/xml,c|e|v,24,Portfolio asset generation workflow
signals-extract,sync,core/workflows/signals-extract/workflow.yaml,yaml/xml,c|e|v,28,Career signal extraction from documents
session-initialization,core,core/workflows/session-initialization/workflow.md,markdown,c|e|v,4,Initialize session context and state
error-recovery,core,core/workflows/error-recovery/workflow.yaml,yaml/xml,c|e|v,6,Error handling and recovery workflow
context-loading,core,core/workflows/context-loading/workflow.md,markdown,c|e|v,3,Load workflow context
test-generation,tea,tea/workflows/test-generation/workflow.yaml,yaml/xml,c|e|v,8,Automated test case generation
test-review,tea,tea/workflows/test-review/workflow.md,markdown,c|e|v,4,Test review and verification
twitter-thread-generator,flex,flex/workflows/twitter-thread/workflow.yaml,yaml/xml,c|e,0,Twitter thread content generation
linkedin-post-optimizer,flex,flex/workflows/linkedin-post/workflow.yaml,yaml/xml,c|e,0,LinkedIn post optimization
tiktok-script-writer,flex,flex/workflows/tiktok-script/workflow.md,markdown,c|e,0,TikTok script generation
instagram-carousel,flex,flex/workflows/instagram-carousel/workflow.yaml,yaml/xml,c|e,0,Instagram carousel content creation
youtube-shorts-creator,flex,flex/workflows/youtube-shorts/workflow.yaml,yaml/xml,c|e,0,YouTube Shorts script creation
newsletter-writer,flex,flex/workflows/newsletter/workflow.md,markdown,c|e,0,Newsletter section writer
sprint-planning,squick,squick/workflows/sprint-planning/workflow.yaml,yaml/xml,c|e,6,Sprint planning and backlog refinement
feature-build,squick,squick/workflows/feature-build/workflow.yaml,yaml/xml,c|e,0,Feature implementation workflow
qa-verification,squick,squick/workflows/qa-verification/workflow.md,markdown,c|e,0,QA verification workflow
```

**Success Criteria:**
- ✅ All 17 workflows listed
- ✅ All file_path values exist and are not zero-byte
- ✅ phase_coverage matches actual implementation (c/e/v)
- ✅ step_count matches file count in actual workflow directories

**Assumption Flagged for Athena:**
Assumes all 17 workflows exist in directories listed. If any are missing or named differently, manifest must be adjusted.

---

### Solution for P0-2: Delete/Populate Zero-Byte Files

**B-MAD Pattern Being Applied:**
Blocking config load in agent activation (bmad-deep-dive Section 1, step 2)

**Prescriptive Implementation:**

**Action 1: Identify and delete zero-byte stubs that are truly unnecessary**
```bash
# Delete flex workflow stubs (will be recreated properly in P1)
rm context/linkright/_lr/core/config/flex-workflow-twitter.md
rm context/linkright/_lr/core/config/flex-workflow-linkedin.md
rm context/linkright/_lr/core/config/flex-workflow-instagram.md

# Delete squick stubs (will be recreated in P1)
rm context/linkright/_lr/core/config/squick-workflow-release.md
rm context/linkright/_lr/core/config/squick-workflow-qa.md

# Delete tea KB stub (will be properly populated in P1-5)
rm context/linkright/_lr/core/config/tea-kb-testing-patterns.md
```

**Action 2: Populate config files with valid YAML**

Create: `context/linkright/_lr/core/config/mongodb-config.yaml`
```yaml
database:
  name: "linkright-signals"
  host: "mongodb://localhost:27017"

collections:
  career_signals:
    indexes:
      - field: "user_id"
        type: "ascending"
      - field: "signal_type"
        type: "ascending"

  workflow_history:
    ttl: 86400  # 24 hour expiry for session docs
```

Create: `context/linkright/_lr/core/config/chromadb-config.yaml`
```yaml
database:
  name: "linkright-patterns"
  host: "http://localhost:8000"

collections:
  - name: "career-patterns"
    embedding_model: "default"
  - name: "optimization-results"
    embedding_model: "default"
  - name: "qa-patterns"
    embedding_model: "default"
```

**Success Criteria:**
- ✅ All 8 files either deleted or populated with valid YAML/config
- ✅ No zero-byte files remain in system
- ✅ Config load in agent activation step 2 completes successfully
- ✅ All references in manifests point to valid files

**Assumption Flagged for Athena:**
Assumes MongoDB and ChromaDB are running at localhost:27017 and localhost:8000 respectively. If different hosts/ports needed, update config accordingly.

---

### Solution for P0-3: Evidence Collection Pattern

**B-MAD Pattern Being Applied:**
SUCCESS/FAILURE metrics in step files (bmad-deep-dive Section 7)

**Prescriptive Implementation:**

Create standard step file template with evidence section:

```markdown
---
stepNumber: N
title: "[Step Description]"
phase: "c|e|v"
---

# Step [N]: [Title]

## INPUT
[What this step receives]

## PROCESSING
[What this step does]

## OUTPUT
[What this step produces]

## DEPENDENCIES
[Blocks/blocked by which steps]

## SUCCESS METRICS
✅ [Criterion 1 — specific, measurable]
✅ [Criterion 2]
✅ [Criterion 3]

## FAILURE ANTI-METRICS
❌ [Failure condition 1]
❌ [Failure condition 2]

## EVIDENCE COLLECTION

When closing this step via Beads:

```bash
bd update <step-issue-id> --notes="
EVIDENCE:
- Input verified: [describe verification]
- Output generated: [output file path]
- Success metrics: [list which were satisfied]
- Files modified: [list files changed]
- Test results: [if applicable]
"
```

### Example for Resume Optimization Step:

```bash
bd update sync-opt-12 --notes="
EVIDENCE:
- Input: resume-input.md (verified valid markdown)
- Output: resume-optimized.md (72 bullets optimized, readability +0.23)
- Success: ✅ All 3 bullets criteria met
- Files: context/linkright/_lr/sync/outputs/resume-opt-2026-03-09.md
- Metrics: Average bullet length reduced from 18 to 14 words
"
```

**Success Criteria:**
- ✅ All step files include EVIDENCE COLLECTION section
- ✅ All bd close calls include --notes with evidence pointers
- ✅ Evidence is verifiable (files exist, metrics measurable)
- ✅ No closed Beads issue without evidence reference

**Assumption Flagged for Athena:**
Assumes engineers will consistently provide evidence when closing issues. May need CI enforcement to ensure this.

---

### Solution for P0-4: Beads-Wired Workflow Pattern

**B-MAD Pattern Being Applied:**
step-01/step-01b resumption pattern (bmad-deep-dive Section 3.3)

**Prescriptive Implementation:**

**Template: step-01b-resume-if-interrupted.md** (same for all workflows)

```markdown
---
stepNumber: "01b"
title: "Resume Interrupted Session"
phase: "c"
nextStepFile: "step-02-main-execution.md"  # Override per workflow
---

# Step 01b: Resume Interrupted Session

## MANDATORY EXECUTION RULES

- 🛑 NEVER start fresh if session in progress
- ✅ ALWAYS check Beads for existing issue
- 📋 YOU ARE RESUMING, not starting new
- 💾 Load previous state from Beads metadata

## CONTEXT BOUNDARIES

- This is a clarification (c) phase step
- Run after user indicates they're resuming
- Load workflow metadata from Beads, not fresh

## YOUR TASK

Detect if an interrupted session exists and resume from last step.

## INITIALIZATION SEQUENCE

### 1. Check for Existing Beads Issue

Query for in-progress issue matching this workflow:

```bash
bd list --status=in_progress \
  --parent=[WORKFLOW-EPIC-ID] \
  --query="[workflow-name]"
```

**Expected output format:**
```
ID      Status        Title                           Parent
sync-42 in_progress   JD optimization for Acme Inc    sync-jd-opt-epic
```

### 2. Handle Found Issues

If issue found:

**Display to user:**
```
Found interrupted session:
  Issue ID: [issue-id]
  Title: [issue-title]
  Started: [inception_ts]
  Last updated: [last_active_ts]

Completed steps: [from bd show <issue-id>]
Next step: [from issue metadata]
```

**Ask user:**
```
Would you like to:
  [1] Continue this session (resume from last step)
  [2] Start fresh (create new issue)
  [3] View session details
```

**If user selects [1] (continue):**
- Load issue metadata: `bd show <issue-id>`
- Extract: `metadata.last_completed_step`
- Extract: `metadata.session_state`
- Load: `step-[N+1]-[name].md` (next step file)
- Initialize with session state from metadata

**If user selects [2] (fresh):**
- Load `step-01-session-setup.md` (fresh initialization)

**If user selects [3] (view details):**
- Show full issue details
- Show all completed steps
- Show session history
- Return to selection prompt

### 3. No Issue Found

If no issue found:

```
No interrupted session found.
Starting fresh workflow.

Proceeding to: step-01-session-setup.md
```

## DEPENDENCIES

- Depends on: Beads initialized + issue exists
- Blocks: step-02-[next-step]

## SUCCESS METRICS

✅ Correctly identified if issue exists or not
✅ Retrieved all metadata from Beads
✅ User selected continuation or fresh start
✅ Loaded correct next step file
✅ Session state loaded into context (if continuing)

## FAILURE ANTI-METRICS

❌ Beads list command failed
❌ Issue found but metadata corrupted
❌ User unable to decide continuation vs fresh
❌ Step loading failed

## NEXT STEPS

- If continuing: Load last_completed_step + 1
- If fresh: Load step-01-session-setup.md
- If error: Load error recovery workflow
```

**Implementation per Workflow:**

Every workflow needs this file with one customization:

```markdown
# In step-01b-resume-if-interrupted.md

## CUSTOMIZATION (change per workflow)

```bash
# For sync workflows:
WORKFLOW_EPIC_ID="sync-jd-opt-epic"
WORKFLOW_NAME="jd-optimization"

# For flex workflows:
WORKFLOW_EPIC_ID="flex-content-epic"
WORKFLOW_NAME="content-generation"

# For squick workflows:
WORKFLOW_EPIC_ID="squick-dev-epic"
WORKFLOW_NAME="feature-development"
```

**Success Criteria:**
- ✅ All 17 workflows have step-01b-resume-if-interrupted.md
- ✅ Each customized with correct EPIC ID and workflow name
- ✅ Beads check works (bd list returns results)
- ✅ Session state correctly loaded into context on resume

**Assumption Flagged for Athena:**
Assumes each workflow has a corresponding Beads epic. If not, must create epics first (Phase 3 responsibility).

---

### Solution for P0-5: Implement Phases D-M Step Files

**B-MAD Pattern Being Applied:**
Atomic step decomposition (bmad-deep-dive Section 3)

**Prescriptive Implementation:**

This is not a single solution but a template framework for creating 40+ step files.

**Architecture:**
```
Release 4 has 12 phases: A, B, C, D, E, F, G, H, I, J, K, L, M

Current state:
  ✅ Phase A (Foundation)
  ✅ Phase B (Core Agents)
  ✅ Phase C (Workflows - incomplete)
  ❌ Phase D (Persona Scoring) - NOT STARTED
  ❌ Phase E through M - NOT STARTED

Each phase has 3-5 workflows × 4-8 steps per workflow = 40+ files total
```

**Framework for Each Phase:**

```markdown
---
phase: D  # or E, F, etc.
phase_name: "Persona Scoring"
workflows: [3]
estimated_steps: 12
---

# Phase [Letter]: [Phase Name]

## Phase Goal
[What this phase accomplishes]

## Workflows in This Phase
1. [Workflow 1] - [Purpose]
2. [Workflow 2] - [Purpose]
3. [Workflow 3] - [Purpose]

## Step Files to Create

### Workflow 1: [Name]

- [ ] step-01c-load-persona-context.md
- [ ] step-02c-ask-career-questions.md
- [ ] step-03e-generate-personas.md
- [ ] step-04e-score-personas.md
- [ ] step-05v-validate-scores.md

### Workflow 2: [Name]

- [ ] step-01c-load-data.md
- [ ] step-02e-analyze.md
- [ ] step-03v-verify.md

...
```

**Success Criteria for Phase D:**
- ✅ All step files follow atomic step pattern (1 op per step)
- ✅ All have INPUT/OUTPUT/DEPENDENCIES/SUCCESS/FAILURE sections
- ✅ All follow c/e/v phase naming: step-[N][phase]-[name].md
- ✅ No step exceeds 50 lines of processing
- ✅ All cross-references valid (nextStepFile, continueStepFile)

**Dependency on Other Solutions:**
- Depends on: P1-1 (atomicity enforcement) to define "atomic"
- Depends on: P1-6 (quality gates) to define success criteria
- Used by: Phase 3 (PM creates Beads hierarchy from these files)

**Assumption Flagged for Athena:**
Assumes the 12 phases are well-defined elsewhere (Release_4.md). If phase definitions are unclear, may need clarification.

---

## P1 Solutions: Design-Level Improvements

### Special Section A: The Atomicity Standard

**Definition:** An atomic step performs exactly ONE cognitive operation, producing a clear output that can be verified independent of subsequent steps.

**Test:** Could you split this step into two independent steps? If yes, it's non-atomic.

**Three Anti-Patterns to Split:**

#### Anti-Pattern 1: Combine Parse + Optimize
```
BEFORE (non-atomic):
step-03e-parse-and-optimize-resume.md
  1. Parse resume (extract sections, bullets)
  2. Optimize bullets (improve phrasing)

AFTER (atomic):
step-03e-parse-resume.md          (only: extract sections/bullets)
step-04e-optimize-bullets.md      (only: improve phrasing)
```

**Why split:** Parse can fail independently of optimization. If parse succeeds but optimize fails, you can resume from step 04.

#### Anti-Pattern 2: Generate + Organize + Present
```
BEFORE (non-atomic):
step-05e-generate-organize-present-ideas.md
  1. Generate 50 ideas
  2. Organize into categories
  3. Format for presentation

AFTER (atomic):
step-05e-generate-ideas.md        (only: generate)
step-06e-organize-ideas.md        (only: organize by category)
step-07e-format-for-presentation.md (only: format output)
```

#### Anti-Pattern 3: Review + Edit + Finalize
```
BEFORE (non-atomic):
step-08e-review-edit-finalize.md
  1. Review output against criteria
  2. Edit content based on review
  3. Finalize and mark complete

AFTER (atomic):
step-08v-review-output.md         (only: review, produce metrics)
step-09e-edit-based-on-review.md  (only: edit)
step-10v-finalize-and-verify.md   (only: final verification)
```

### Atomic Step File Template

All Linkright steps MUST follow this template:

```markdown
---
stepNumber: N
title: "[Specific, single-operation description]"
phase: "c|e|v"
nextStepFile: "step-[N+1]-[name].md"
continueStepFile: "step-[N]b-resume.md"
frontmatterData:
  stepsCompleted: [N]
  lastOperation: "[what this step does]"
---

# Step [N]: [Title]

**ONE SENTENCE: What this step does**

## MANDATORY EXECUTION RULES

- 🛑 NEVER do multiple operations
- ✅ ALWAYS verify input before processing
- 🎯 FOCUS on single cognitive task
- 💾 Save output to specified file

## INPUT

**What this step receives:**

- From frontmatter: [variables]
- From config: [values]
- From previous step: [file/data]

## PROCESSING

[Exact steps to perform the ONE operation]

**Do not include multiple operations or branching logic.**

## OUTPUT

**What this step produces:**

- Output file: [path]
- Update frontmatter: stepsCompleted: [N]
- Next step: [which step comes next]

## DEPENDENCIES

- Depends on: step-[N-1]-[name].md
- Blocks: step-[N+1]-[name].md
- Requires: config.yaml, templates/[name].md

## SUCCESS METRICS

✅ [Specific, measurable criterion 1]
✅ [Specific, measurable criterion 2]
✅ [Specific, measurable criterion 3]

## FAILURE ANTI-METRICS

❌ [Failure condition 1]
❌ [Failure condition 2]

## EVIDENCE COLLECTION

When closing this step:

```bash
bd update <step-id> --notes="
EVIDENCE:
- Input: [describe input verification]
- Operation: [what was done]
- Output: [where output stored]
- Metrics: [success metrics satisfied]
"
```

## NEXT STEPS

- If success: nextStepFile: step-[N+1]-[name].md
- If failure: Provide clear error message
- If user cancels: continueStepFile: step-[N]b-resume.md
```

---

### Special Section B: The Agent XML Standard (40+ Lines)

Minimum-viable 40-line agent template:

```markdown
---
name: "[Agent readable name]"
description: "[What this agent does in one sentence]"
---

You must fully embody this agent's persona and follow all activation instructions exactly.

<agent id="[module-agent-name]" name="[Display Name]" title="[Full Title]" icon="[emoji]" capabilities="[comma-separated]">

<activation critical="MANDATORY">
  <step n="1">Load persona from this agent file</step>
  <step n="2">Load {project-root}/_lr/core/config.yaml NOW</step>
  <step n="3">Store variables: {user_name}, {communication_language}, {output_folder}</step>
  <step n="4">Verify config loaded successfully</step>
  <step n="5">Greet {user_name} and display numbered menu</step>
  <step n="6">Let user know they can use /help at any time</step>
  <step n="7">STOP and WAIT for user input</step>
  <step n="8">Process user input: Number→menu item | Text→fuzzy match | Multiple→ask clarify</step>
  <step n="9">Extract menu item attributes (workflow=, exec=, action=, data=)</step>
  <step n="10">Execute menu handler corresponding to item type</step>
</activation>

<persona>
  <role>[Agent's role in one sentence]</role>
  <identity>[Detailed expertise description - 3-4 sentences]</identity>
  <communication_style>[How agent talks - tone, formality, special patterns]</communication_style>
  <principles>[Core principles guiding agent behavior - 3-4 rules]</principles>
</persona>

<menu>
  <item cmd="CM" workflow="{project-root}/workflows/create.md">[CM] Create</item>
  <item cmd="LT" action="list-items">[LT] List</item>
  <item cmd="HLP" action="help">[HLP] Help</item>
  <item cmd="EXIT" action="dismiss">[EXIT] Dismiss</item>
</menu>

</agent>

---

## EXTENDED INTERACTION

When user selects a menu item and needs further input:

1. Show options clearly (numbered or bulleted)
2. Ask user to select/input
3. WAIT for response (do NOT auto-execute)
4. Process selection
5. STOP and WAIT again

NEVER auto-execute multiple steps in sequence.
ALWAYS let user decide what to do next.
```

Lines breakdown:
- Frontmatter: 3 lines
- Instructions: 2 lines
- Agent tags + activation: 12 lines
- Activation steps: 10 lines
- Persona: 5 lines
- Menu: 5 lines
- Rules/notes: 4 lines
- **Total: 41 lines** ✓

---

### Special Section C: The Manifest Repair Standard

**CSV Schema for workflow-manifest.csv:**

```
Headers (must be in this order):

workflow_name     | String | Unique identifier (lowercase, hyphens)
module            | String | Module name (core, sync, flex, squick, tea, lrb, cis)
file_path         | String | Relative path to workflow file
type              | Enum   | markdown OR yaml/xml
phase_coverage    | String | Phases covered (pipe-delimited: c|e|v)
step_count        | Integer| Number of step files (0 if stub)
description       | String | One-sentence description
status            | Enum   | active OR stub OR deprecated
last_updated      | Date   | YYYY-MM-DD last modification
```

**Validation Checklist:**

```
For each row in workflow-manifest.csv:

✓ workflow_name:
  - Lowercase only
  - Hyphens for word separation
  - Unique (no duplicates)
  - Matches directory name

✓ module:
  - One of: core, sync, flex, squick, tea, lrb, cis
  - Matches module in file_path

✓ file_path:
  - Exists and is readable
  - Not zero-byte
  - Ends in .md or .yaml or .xml
  - Resolvable from {project-root}

✓ type:
  - markdown OR yaml/xml
  - Matches actual file type

✓ phase_coverage:
  - Pipe-delimited (c|e|v)
  - Only includes actual phases implemented
  - No whitespace around pipes

✓ step_count:
  - Matches actual step file count in workflow directory
  - 0 only if status=stub

✓ status:
  - active (fully implemented, phase_coverage c|e|v)
  - stub (skeleton only, step_count 0)
  - deprecated (no longer used, can remove)

✓ last_updated:
  - Recent date (within last release)
  - Matches git commit date of file
```

---

### Special Section D: Beads-Wired Workflow Pattern

(Already specified above in P0-4. This repeats key implementation details.)

**Per-Workflow Checklist:**

For each of 17 workflows, ensure:

1. ✅ Workflow has corresponding Beads epic:
   ```bash
   bd create --type=epic --title="[module]-[workflow-name]" --priority=1
   ```

2. ✅ step-01-setup creates Beads feature:
   ```bash
   bd create --type=feature \
     --parent=[epic-id] \
     --title="[workflow-name] for [project]"
   ```

3. ✅ step-01b-resume checks Beads:
   ```bash
   bd list --status=in_progress --parent=[epic-id]
   ```

4. ✅ Each step updates Beads:
   ```bash
   bd update <feature-id> --notes="Completed step-[N]"
   ```

5. ✅ Final step closes Beads:
   ```bash
   bd close <feature-id> --reason="Workflow complete"
   ```

---

### Special Section E: Quality Gates Pattern

**Three-Tier Gate System:**

#### Tier 1: Pre-Gate (Before Step Starts)

```bash
# File: step-03e-parse-resume/pre-gate.sh

#!/bin/bash
set -e

# Validate input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "ERROR: Input file not found: $INPUT_FILE"
  exit 1
fi

# Validate file is not empty
if [ ! -s "$INPUT_FILE" ]; then
  echo "ERROR: Input file is empty: $INPUT_FILE"
  exit 1
fi

# Validate file has required sections
if ! grep -q "## Summary\|## Experience\|## Skills" "$INPUT_FILE"; then
  echo "ERROR: Missing required resume sections"
  exit 1
fi

echo "✅ Pre-gate passed: Input valid"
exit 0
```

#### Tier 2: Post-Gate (After Step Completes)

```bash
# File: step-03e-parse-resume/post-gate.sh

#!/bin/bash
set -e

# Validate output file was created
if [ ! -f "$OUTPUT_FILE" ]; then
  echo "ERROR: Output file not created"
  exit 1
fi

# Validate output has expected structure
if ! grep -q "parsed_sections:" "$OUTPUT_FILE"; then
  echo "ERROR: Output missing parsed_sections"
  exit 1
fi

# Validate output metrics
SECTION_COUNT=$(grep -c "^## " "$OUTPUT_FILE" || true)
if [ $SECTION_COUNT -lt 3 ]; then
  echo "ERROR: Output has fewer than 3 sections"
  exit 1
fi

echo "✅ Post-gate passed: Output valid with $SECTION_COUNT sections"
exit 0
```

#### Tier 3: Fail-Gate (Error Recovery)

```bash
# File: step-03e-parse-resume/fail-gate.sh

#!/bin/bash

# If post-gate fails, this script runs
echo "FAIL-GATE ACTIVATED"

# Option 1: Rollback to input
cp "$INPUT_FILE" "$OUTPUT_FILE"
echo "Rolled back to input file"

# Option 2: Create error report
cat > "$ERROR_REPORT" <<EOF
Step 03e failed at: $(date)
Expected output: $OUTPUT_FILE
Actual status: Post-gate validation failed
Recovered by: Rolling back to input

Recommend: Review input file for validity
EOF

# Return error status (don't auto-advance)
exit 1
```

**Integration in step-01b-resume:**

```markdown
---
pre_gate_script: pre-gate.sh
post_gate_script: post-gate.sh
fail_gate_script: fail-gate.sh
fail_gate_action: rollback_and_skip
---
```

---

## Summary of Special Sections

These 5 sections are the foundation for all P1 work:

| Section | Purpose | Applies To |
|---------|---------|-----------|
| A | Define "atomic step" | P1-1 refactoring |
| B | Agent expansion template | P1-3 (7 FLEX agents) |
| C | Manifest validation | P0-2 + P1-4 |
| D | Beads integration | P0-4 + all workflows |
| E | Quality gates | P1-6 (all workflows) |

---

## Next Actions

**For Athena (CloudyCave):**
Please review these proposals and:
1. Run stress tests on each
2. Identify any Linkright constraints violated
3. Propose modifications as needed
4. Agree on final solutions

**For PM (RoseGlacier):**
Once final solutions approved, decompose into Beads hierarchy

**For Engineers (ChartreuseSpring + RedCastle):**
Implement solutions in priority order (P0 → P1 → P2)

