# Beads Hierarchy: jd-optimize Workflow Audit Issues
## Complete 5-Level Breakdown (Pre-Creation Reference)

---

## RESULTS — CREATION COMPLETE

**Date Executed:** 2026-03-09
**Agent:** Phoenix (RoseGlacier)
**Status:** COMPLETE

### Sub-Epic Created
- **ID:** sync-zas.13
- **Title:** jd-optimize Workflow Audit — Phase A + Phase B Issues
- **Parent:** sync-zas

### Total Issues Created by Level
| Level | Count |
|-------|-------|
| Sub-Epic | 1 |
| Feature | 10 |
| User Story | 20 |
| Task | 37 |
| Subtask | 106 |
| **TOTAL** | **174** |

### Dependencies Wired (6 total)
1. sync-zas.13.2 depends on sync-zas.13.4 (jdo.2 blocked by jdo.4)
2. sync-zas.13.5 depends on sync-zas.13.1 (jdo.5 blocked by jdo.1)
3. sync-zas.13.7 depends on sync-zas.13.5 (jdo.7 blocked by jdo.5)
4. sync-zas.13.8 depends on sync-zas.13.7 (jdo.8 blocked by jdo.7)
5. sync-zas.13.9 depends on sync-zas.13.2 (jdo.9 blocked by jdo.2)
6. sync-zas.13.9 depends on sync-zas.13.4 (jdo.9 blocked by jdo.4)

### Wave Execution Order
- Wave 1 (immediate start): sync-zas.13.1, sync-zas.13.3, sync-zas.13.4, sync-zas.13.10
- Wave 2: sync-zas.13.2 (after 13.4), sync-zas.13.5 (after 13.1), sync-zas.13.6
- Wave 3: sync-zas.13.7 (after 13.5), sync-zas.13.9 (after 13.2 + 13.4)
- Wave 4: sync-zas.13.8 (after 13.7)

---

**Date:** 2026-03-09
**Source:** files/audit/audit_plan.md (Phase A + Phase B audit findings)
**Parent Epic:** sync-zas (LR Quality Mission root)
**New Sub-Epic:** sync-zas-jdo (jd-optimize + Phase A workflow-level issues)
**Status:** PLANNING ONLY — Implementation NOT authorized yet

---

## Overview

| Level | Count |
|-------|-------|
| Sub-Epic | 1 (sync-zas-jdo) |
| Feature | 10 (4 P0 + 5 P1 + 1 P2) |
| User Story | 20 (2 per feature) |
| Task | 52 (2–3 per story) |
| Subtask | 72 (1–2 per task) |
| **TOTAL** | **~155** |

---

## SUB-EPIC

```
SUB-EPIC [sync-zas-jdo]
  Title: jd-optimize Workflow Audit — Phase A + Phase B Issues
  Type: epic
  Priority: P0
  Parent: sync-zas
  Description:
    10 workflow-level issues identified by deep code inspection of the jd-optimize
    flagship 64-step workflow and the Phase A session initialization layer.
    4 P0 blockers prevent the workflow from executing at all.
    5 P1 issues degrade quality and consistency.
    1 P2 atomicity violation limits resumability.
    Source: files/audit/audit_plan.md
```

---

## P0 FEATURES (4 — Hard Blockers)

---

### jdo.1 — A-2: lr-config.yaml Has 5 Unfilled Placeholders

```
FEATURE [jdo.1]
  Title: A-2: Fill 5 placeholder values in lr-config.yaml
  Type: feature
  Priority: P0
  Parent: sync-zas-jdo
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 1 hour
  Description:
    lr-config.yaml — the single source of truth for user identity — has 5 unresolved
    placeholder values: user.name=[USER_NAME], user.bio=[USER_PROFESSIONAL_SUMMARY],
    user.target_role=[TARGET_JOB_TITLE], distribution.airtable.url=${AIRTABLE_WEBHOOK_URL},
    distribution.postiz.url=${POSTIZ_API_URL}. No workflow detects this condition and halts.
    System silently produces resume artifacts with [USER_NAME] in them.
  Acceptance:
    ✅ All 5 placeholder fields filled with real values
    ✅ user.target_companies and user.skills arrays populated
    ✅ No bracket or dollar-sign placeholder tokens remain in lr-config.yaml
    ✅ step-01 (once fixed per jdo.5) will detect and reject remaining placeholders
```

#### Story jdo.1.s1: Audit Config State

```
USER STORY [jdo.1.s1]
  Title: As a maintainer, I want to know exactly which lr-config.yaml fields
         are placeholders so I can fill them with real data
  Parent: jdo.1

  TASK [jdo.1.s1.t1]: Read lr-config.yaml and list all placeholder fields
    SUBTASK [jdo.1.s1.t1.st1]: Open _lr/lr-config.yaml, find all [BRACKET] tokens
    SUBTASK [jdo.1.s1.t1.st2]: Find all ${DOLLAR} tokens
    SUBTASK [jdo.1.s1.t1.st3]: List empty arrays (target_companies, skills)
    SUBTASK [jdo.1.s1.t1.st4]: Document exact field paths for each placeholder

  TASK [jdo.1.s1.t2]: Gather real values to fill fields
    SUBTASK [jdo.1.s1.t2.st1]: Determine correct user.name value
    SUBTASK [jdo.1.s1.t2.st2]: Determine professional summary text
    SUBTASK [jdo.1.s1.t2.st3]: Identify target role and companies
```

#### Story jdo.1.s2: Fill Config and Verify

```
USER STORY [jdo.1.s2]
  Title: As any agent that reads lr-config.yaml, I want all fields to have
         real values so I don't produce outputs with placeholder tokens
  Parent: jdo.1

  TASK [jdo.1.s2.t1]: Write real values to all 5 placeholder fields
    SUBTASK [jdo.1.s2.t1.st1]: Set user.name, user.bio, user.target_role
    SUBTASK [jdo.1.s2.t1.st2]: Set distribution URLs (or mark as optional/disabled)
    SUBTASK [jdo.1.s2.t1.st3]: Populate user.target_companies array
    SUBTASK [jdo.1.s2.t1.st4]: Populate user.skills array

  TASK [jdo.1.s2.t2]: Verify no placeholders remain
    SUBTASK [jdo.1.s2.t2.st1]: Grep lr-config.yaml for [, ], ${, }
    SUBTASK [jdo.1.s2.t2.st2]: Confirm 0 results
    SUBTASK [jdo.1.s2.t2.st3]: YAML parse validation — no syntax errors
```

---

### jdo.2 — B-1: step-02-mapping.md Does Not Exist

```
FEATURE [jdo.2]
  Title: B-1: Create step-02-map-jd-to-signals.md (P0 execution blocker)
  Type: feature
  Priority: P0
  Parent: sync-zas-jdo
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 3 hours
  Description:
    step-03-keyword-extraction.md declares dependency on "step-02-mapping output"
    but step-02-mapping.md does not exist. Steps 03–06 are all blocked. The entire
    JD keyword extraction → competitive analysis → adversarial review → final output
    pipeline cannot execute. This is the single largest execution blocker.
  Acceptance:
    ✅ step-02-map-jd-to-signals.md created in steps-c/ (~40 lines)
    ✅ Accepts jd-parsed.yaml from step-01b/step-04-ingest-jd
    ✅ Queries ChromaDB for semantic signal matching
    ✅ Classifies requirements: matched / partial / unmatched
    ✅ Outputs requirement-signal-map.yaml
    ✅ step-03 can now execute (its dependency is satisfied)
  DEPENDS ON: jdo.4 (JD ingestion step must exist first to produce jd-parsed.yaml)
```

#### Story jdo.2.s1: Design step-02 Content

```
USER STORY [jdo.2.s1]
  Title: As a step author, I want a clear spec for step-02 so I can write
         the 40-line file matching Linkright step standards
  Parent: jdo.2

  TASK [jdo.2.s1.t1]: Design step-02 DEPENDENCIES and INPUT schema
    SUBTASK [jdo.2.s1.t1.st1]: Define input: jd-parsed.yaml schema (from jdo.4)
    SUBTASK [jdo.2.s1.t1.st2]: Define ChromaDB query parameters
    SUBTASK [jdo.2.s1.t1.st3]: Define classification logic (matched/partial/unmatched)

  TASK [jdo.2.s1.t2]: Design step-02 OUTPUT schema
    SUBTASK [jdo.2.s1.t2.st1]: Define requirement-signal-map.yaml structure
    SUBTASK [jdo.2.s1.t2.st2]: Define what step-03 will consume from this output
    SUBTASK [jdo.2.s1.t2.st3]: Define SUCCESS CRITERIA checklist
```

#### Story jdo.2.s2: Write and Validate File

```
USER STORY [jdo.2.s2]
  Title: As the jd-optimize workflow, I want step-02 to exist so the
         entire Phase B pipeline can execute without blocking
  Parent: jdo.2

  TASK [jdo.2.s2.t1]: Write step-02-map-jd-to-signals.md (40+ lines)
    SUBTASK [jdo.2.s2.t1.st1]: Write YAML frontmatter (step ID, phase, dependencies)
    SUBTASK [jdo.2.s2.t1.st2]: Write EXECUTION PROTOCOLS (6–10 numbered steps)
    SUBTASK [jdo.2.s2.t1.st3]: Write OUTPUT ARTIFACT section (exact filename + schema)
    SUBTASK [jdo.2.s2.t1.st4]: Write SUCCESS CRITERIA + FAILURE PROTOCOL sections

  TASK [jdo.2.s2.t2]: Verify step-03 dependency is now satisfied
    SUBTASK [jdo.2.s2.t2.st1]: Check step-03 DEPENDENCIES section references step-02
    SUBTASK [jdo.2.s2.t2.st2]: Verify output filename matches step-03 expected input
    SUBTASK [jdo.2.s2.t2.st3]: Line count: confirm ≥40 lines
```

---

### jdo.3 — B-2: workflow.md Dead Reference at Line 46

```
FEATURE [jdo.3]
  Title: B-2: Fix dead reference in workflow.md (step-01-ingest.md nonexistent)
  Type: feature
  Priority: P0
  Parent: sync-zas-jdo
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 30 minutes
  Description:
    jd-optimize/workflow.md line 46 instructs: "Read and follow steps/step-01-ingest.md"
    This file does not exist anywhere. The steps/ directory has only step-01b.
    Any workflow runner or agent following the official entry point hits an
    unrecoverable failure before a single step executes.
  Acceptance:
    ✅ workflow.md line 46 updated to correct path
    ✅ Points to steps-c/step-01-load-session-context.md (new sessions)
    ✅ Second entry added for resume: steps-c/step-01b-resume-if-interrupted.md
    ✅ Both referenced files actually exist on disk
```

#### Story jdo.3.s1: Fix the Dead Reference

```
USER STORY [jdo.3.s1]
  Title: As a workflow runner, I want workflow.md to point to files that
         actually exist so the workflow can launch without errors
  Parent: jdo.3

  TASK [jdo.3.s1.t1]: Read workflow.md and identify all file references
    SUBTASK [jdo.3.s1.t1.st1]: Read full workflow.md, find line 46
    SUBTASK [jdo.3.s1.t1.st2]: Verify steps-c/step-01-load-session-context.md exists
    SUBTASK [jdo.3.s1.t1.st3]: Verify steps-c/step-01b-resume-if-interrupted.md exists
    SUBTASK [jdo.3.s1.t1.st4]: Check for any other dead references in the file

  TASK [jdo.3.s1.t2]: Update workflow.md with correct entry points
    SUBTASK [jdo.3.s1.t2.st1]: Replace line 46 path with correct steps-c/ path
    SUBTASK [jdo.3.s1.t2.st2]: Add resume-session entry point section
    SUBTASK [jdo.3.s1.t2.st3]: Verify both paths exist after edit
```

#### Story jdo.3.s2: Validate No Other Dead Refs

```
USER STORY [jdo.3.s2]
  Title: As a maintainer, I want workflow.md to have zero dead references
         so any automation or agent can rely on it as source of truth
  Parent: jdo.3

  TASK [jdo.3.s2.t1]: Scan workflow.md for all file references and validate
    SUBTASK [jdo.3.s2.t1.st1]: Extract all file paths mentioned in workflow.md
    SUBTASK [jdo.3.s2.t1.st2]: Verify each path exists on disk
    SUBTASK [jdo.3.s2.t1.st3]: Fix any additional dead references found
```

---

### jdo.4 — B-3: No JD Ingestion Step Exists

```
FEATURE [jdo.4]
  Title: B-3: Create step-01-ingest-jd.md — explicit JD collection step
  Type: feature
  Priority: P0
  Parent: sync-zas-jdo
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 2 hours
  Description:
    jd-optimize workflow never asks the user for the job description. All other
    sync workflows have explicit ingestion steps (outbound-campaign/step-out-01-ingest,
    application-track/step-01-ingest-target, quick-optimize/step-01-ingest-diff).
    jd-optimize's keyword extraction has no source material — JD is never collected.
    Fix: create step-01-ingest-jd.md immediately after session initialization.
  Acceptance:
    ✅ step-01-ingest-jd.md created in steps-c/ (~40 lines)
    ✅ Accepts JD in 3 formats: pasted text / URL / local file path
    ✅ Extracts: company name, job title, seniority, team context, raw requirements
    ✅ Categorizes requirements: Core (P0) / Preferred (P1) / Bonus (P2)
    ✅ Outputs jd-parsed.yaml (consumed by step-02)
    ✅ step-01b NEXT STEP points to this new step
```

#### Story jdo.4.s1: Design JD Ingestion Step

```
USER STORY [jdo.4.s1]
  Title: As a step author, I want a clear design for the JD ingestion step
         matching the pattern used by other sync workflow ingest steps
  Parent: jdo.4

  TASK [jdo.4.s1.t1]: Read 3 existing ingest steps as reference patterns
    SUBTASK [jdo.4.s1.t1.st1]: Read outbound-campaign/step-out-01-ingest.md
    SUBTASK [jdo.4.s1.t1.st2]: Read application-track/step-01-ingest-target.md
    SUBTASK [jdo.4.s1.t1.st3]: Extract common pattern: prompt format, output schema

  TASK [jdo.4.s1.t2]: Design jd-parsed.yaml output schema
    SUBTASK [jdo.4.s1.t2.st1]: Define required fields (company, title, seniority, requirements)
    SUBTASK [jdo.4.s1.t2.st2]: Define P0/P1/P2 requirement categorization structure
    SUBTASK [jdo.4.s1.t2.st3]: Verify step-02 can consume this schema
```

#### Story jdo.4.s2: Write and Place the Step File

```
USER STORY [jdo.4.s2]
  Title: As the jd-optimize workflow, I want an explicit JD collection step
         so keyword extraction always has a source JD to work from
  Parent: jdo.4

  TASK [jdo.4.s2.t1]: Write step-01-ingest-jd.md (40+ lines)
    SUBTASK [jdo.4.s2.t1.st1]: Write user prompt (3 input format options)
    SUBTASK [jdo.4.s2.t1.st2]: Write extraction protocol (company, title, requirements)
    SUBTASK [jdo.4.s2.t1.st3]: Write categorization logic (P0/P1/P2 tiers)
    SUBTASK [jdo.4.s2.t1.st4]: Write OUTPUT ARTIFACT: jd-parsed.yaml
    SUBTASK [jdo.4.s2.t1.st5]: Write SUCCESS CRITERIA + FAILURE PROTOCOL

  TASK [jdo.4.s2.t2]: Wire new step into workflow chain
    SUBTASK [jdo.4.s2.t2.st1]: Update step-01b NEXT STEP → step-01-ingest-jd
    SUBTASK [jdo.4.s2.t2.st2]: Update step-01-ingest-jd NEXT STEP → step-02
    SUBTASK [jdo.4.s2.t2.st3]: Verify chain: step-01 → step-01b → step-01-ingest-jd → step-02 → step-03
```

---

## P1 FEATURES (5 — Major Issues)

---

### jdo.5 — A-1: step-01 Is an Instruction Stub (526 Bytes, No Logic)

```
FEATURE [jdo.5]
  Title: A-1: Rewrite step-01-load-session-context.md with real validation logic
  Type: feature
  Priority: P1
  Parent: sync-zas-jdo
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 3 hours
  Description:
    10 identical copies of step-01-load-session-context.md (526B each) exist across
    all major workflows. Each has only 3 bullet points — read config, resolve, validate —
    with no parsing logic, no field extraction, no failure path. Agents execute it and
    receive no structured output. Every downstream step operates on unverified,
    potentially placeholder-filled data from lr-config.yaml.
  Acceptance:
    ✅ All 10 step-01 files rewritten with mandatory field checklist
    ✅ Step scans lr-config.yaml for placeholder tokens ([, ], ${, })
    ✅ Step halts with specific error if any placeholder detected
    ✅ Step extracts validated session variables into session context block
    ✅ SUCCESS CRITERIA: all 5 user fields confirmed non-placeholder
  DEPENDS ON: jdo.1 (lr-config filled first; otherwise step-01 will always fail)
```

#### Story jdo.5.s1: Write New step-01 Template

```
USER STORY [jdo.5.s1]
  Title: As a step author, I want a canonical rewritten step-01 template
         so all 10 copies can be updated consistently
  Parent: jdo.5

  TASK [jdo.5.s1.t1]: Design the placeholder scanning logic
    SUBTASK [jdo.5.s1.t1.st1]: List all disallowed tokens: [USER_NAME], [USER_PROFESSIONAL_SUMMARY], [TARGET_JOB_TITLE], ${AIRTABLE_WEBHOOK_URL}, ${POSTIZ_API_URL}
    SUBTASK [jdo.5.s1.t1.st2]: Write check instruction: halt + name offending field
    SUBTASK [jdo.5.s1.t1.st3]: Write session context output block format

  TASK [jdo.5.s1.t2]: Write canonical rewritten step-01 (40+ lines)
    SUBTASK [jdo.5.s1.t2.st1]: DEPENDENCIES section (lr-config.yaml path)
    SUBTASK [jdo.5.s1.t2.st2]: EXECUTION PROTOCOLS (6 steps: read, scan, halt-or-extract, output)
    SUBTASK [jdo.5.s1.t2.st3]: OUTPUT ARTIFACT: session-context block
    SUBTASK [jdo.5.s1.t2.st4]: SUCCESS CRITERIA + FAILURE PROTOCOL
    SUBTASK [jdo.5.s1.t2.st5]: NEXT STEP → step-01b link
```

#### Story jdo.5.s2: Deploy to All 10 Workflow Copies

```
USER STORY [jdo.5.s2]
  Title: As any workflow, I want step-01 to actually validate session context
         so downstream steps never operate on unverified placeholder data
  Parent: jdo.5

  TASK [jdo.5.s2.t1]: Find all 10 step-01 files
    SUBTASK [jdo.5.s2.t1.st1]: Glob _lr/ for step-01-load-session-context.md
    SUBTASK [jdo.5.s2.t1.st2]: Confirm 10 copies across workflows
    SUBTASK [jdo.5.s2.t1.st3]: Note any workflow-specific context references to preserve

  TASK [jdo.5.s2.t2]: Update all 10 files with canonical rewrite
    SUBTASK [jdo.5.s2.t2.st1]: Replace content in sync workflow step-01 files
    SUBTASK [jdo.5.s2.t2.st2]: Replace content in core module step-01 files
    SUBTASK [jdo.5.s2.t2.st3]: Replace remaining step-01 files
    SUBTASK [jdo.5.s2.t2.st4]: Verify: all 10 files now ≥40 lines
```

---

### jdo.6 — A-3: Two Conflicting step-01b Versions Coexist

```
FEATURE [jdo.6]
  Title: A-3: Standardize step-01b — replace 11 minimal stubs with canonical version
  Type: feature
  Priority: P1
  Parent: sync-zas-jdo
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 2 hours
  Description:
    Two fundamentally different step-01b versions exist simultaneously:
    - 11 minimal stubs (506B) in steps-c/ — manual check of artifacts/ folder
    - 30 canonical (2.6KB) in steps/ — Beads bd list, MongoDB checkpoint, auto-resume
    The minimal stubs don't use Beads at all. When a workflow is interrupted during
    the create phase (steps-c), the minimal version runs — losing all Beads state.
  Acceptance:
    ✅ All 11 minimal step-01b files in steps-c/ replaced with canonical version
    ✅ Each canonical copy customized with correct workflow name and Beads scope
    ✅ All step-01b files query bd list --status=in_progress
    ✅ Zero 506B minimal stubs remain in any steps-c/ directory
```

#### Story jdo.6.s1: Audit All step-01b Files

```
USER STORY [jdo.6.s1]
  Title: As a maintainer, I want to know exactly which 11 files are the
         minimal stubs so replacement can be targeted precisely
  Parent: jdo.6

  TASK [jdo.6.s1.t1]: Find all step-01b files and measure them
    SUBTASK [jdo.6.s1.t1.st1]: Glob _lr/ for step-01b*.md
    SUBTASK [jdo.6.s1.t1.st2]: Check file size: 506B = minimal stub
    SUBTASK [jdo.6.s1.t1.st3]: Check file size: 2.6KB = canonical
    SUBTASK [jdo.6.s1.t1.st4]: List the 11 minimal stub paths

  TASK [jdo.6.s1.t2]: Read one canonical version as replacement template
    SUBTASK [jdo.6.s1.t2.st1]: Read canonical step-01b from steps/ directory
    SUBTASK [jdo.6.s1.t2.st2]: Identify workflow-specific tokens to parameterize
```

#### Story jdo.6.s2: Replace All 11 Minimal Stubs

```
USER STORY [jdo.6.s2]
  Title: As any workflow's create phase, I want step-01b to use Beads for
         resumption so interrupted sessions are recovered with full context
  Parent: jdo.6

  TASK [jdo.6.s2.t1]: Replace minimal stubs in sync module steps-c/ directories
    SUBTASK [jdo.6.s2.t1.st1]: Replace jd-optimize/steps-c/step-01b (customize workflow tag)
    SUBTASK [jdo.6.s2.t1.st2]: Replace other sync steps-c/ stubs

  TASK [jdo.6.s2.t2]: Replace minimal stubs in other module steps-c/ directories
    SUBTASK [jdo.6.s2.t2.st1]: Replace flex module step-01b stubs
    SUBTASK [jdo.6.s2.t2.st2]: Replace squick, lrb module step-01b stubs
    SUBTASK [jdo.6.s2.t2.st3]: Final check: grep for 506B files in steps-c/ — 0 results
```

---

### jdo.7 — A-4: No Cross-References Between step-01 and step-01b

```
FEATURE [jdo.7]
  Title: A-4: Add NEXT STEP and PRECONDITION links between step-01 and step-01b
  Type: feature
  Priority: P1
  Parent: sync-zas-jdo
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 2 hours
  Description:
    step-01 has no NEXT STEP section directing to step-01b.
    step-01b has no PRECONDITION asserting step-01 ran first.
    Agents can enter step-01b directly without initializing session context.
    Fix: establish bidirectional linking standard and apply to all 10+41 files.
  Acceptance:
    ✅ All 10 step-01 files have NEXT STEP → step-01b
    ✅ All step-01b files have PRECONDITION → step-01 must have completed
    ✅ step-01b aborts and redirects to step-01 if session context absent
  DEPENDS ON: jdo.5 (step-01 rewritten first so NEXT STEP has a real target)
```

#### Story jdo.7.s1: Define Linking Standard

```
USER STORY [jdo.7.s1]
  Title: As a step author, I want a clear linking convention so every step
         declares its predecessor and successor explicitly
  Parent: jdo.7

  TASK [jdo.7.s1.t1]: Write the STEP LINKING STANDARD
    SUBTASK [jdo.7.s1.t1.st1]: Define NEXT STEP section format for step-01
    SUBTASK [jdo.7.s1.t1.st2]: Define PRECONDITION section format for step-01b
    SUBTASK [jdo.7.s1.t1.st3]: Define abort-and-redirect behavior in step-01b
```

#### Story jdo.7.s2: Apply Links to All Files

```
USER STORY [jdo.7.s2]
  Title: As an agent resuming mid-workflow, I want step-01b to verify that
         step-01 ran so I never resume into an uninitialized session
  Parent: jdo.7

  TASK [jdo.7.s2.t1]: Add NEXT STEP to all 10 step-01 files
    SUBTASK [jdo.7.s2.t1.st1]: Add to sync workflow step-01 files
    SUBTASK [jdo.7.s2.t1.st2]: Add to core module step-01 files
    SUBTASK [jdo.7.s2.t1.st3]: Verify: all 10 step-01 files have NEXT STEP section

  TASK [jdo.7.s2.t2]: Add PRECONDITION to all step-01b files
    SUBTASK [jdo.7.s2.t2.st1]: Add to steps-c/ step-01b files (11 files, now canonical)
    SUBTASK [jdo.7.s2.t2.st2]: Add to steps/ step-01b files (30 files)
    SUBTASK [jdo.7.s2.t2.st3]: Verify abort-on-missing-context logic present in each
```

---

### jdo.8 — A-5: Nine Workflows Missing step-01 Initialization

```
FEATURE [jdo.8]
  Title: A-5: Add step-01-load-session-context.md to 9 uninitiated workflows
  Type: feature
  Priority: P1
  Parent: sync-zas-jdo
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 2 hours
  Description:
    9 core workflows have step-01b but no step-01: create-story, dev-story,
    document-project, document-system, setup-execution, sprint-planning,
    sprint-status, common, flex/portfolio-deploy. They enter domain logic without
    loading lr-config.yaml or establishing session context. {user_name} and other
    session variables are uninitialized.
  Acceptance:
    ✅ step-01-load-session-context.md added to all 9 workflow steps/ directories
    ✅ Each workflow's workflow.md updated to list step-01 as first step
    ✅ Each step-01b in these workflows has PRECONDITION → step-01
  DEPENDS ON: jdo.7 (linking standard established first)
```

#### Story jdo.8.s1: Confirm the 9 Affected Workflows

```
USER STORY [jdo.8.s1]
  Title: As a maintainer, I want to confirm exactly which 9 workflows
         have step-01b but no step-01 so deployment is precise
  Parent: jdo.8

  TASK [jdo.8.s1.t1]: Verify the 9 workflows in audit_plan.md
    SUBTASK [jdo.8.s1.t1.st1]: Check: create-story, dev-story, document-project
    SUBTASK [jdo.8.s1.t1.st2]: Check: document-system, setup-execution, sprint-planning
    SUBTASK [jdo.8.s1.t1.st3]: Check: sprint-status, common, flex/portfolio-deploy
    SUBTASK [jdo.8.s1.t1.st4]: Confirm each has step-01b but no step-01
```

#### Story jdo.8.s2: Deploy step-01 to All 9 Workflows

```
USER STORY [jdo.8.s2]
  Title: As any of the 9 core workflows, I want session initialization to
         run first so user variables are always available
  Parent: jdo.8

  TASK [jdo.8.s2.t1]: Add step-01 to core module workflows (5)
    SUBTASK [jdo.8.s2.t1.st1]: Add to create-story/steps/
    SUBTASK [jdo.8.s2.t1.st2]: Add to dev-story/steps/
    SUBTASK [jdo.8.s2.t1.st3]: Add to document-project/steps/
    SUBTASK [jdo.8.s2.t1.st4]: Add to document-system/steps/
    SUBTASK [jdo.8.s2.t1.st5]: Add to setup-execution/steps/, sprint-planning/steps/, sprint-status/steps/

  TASK [jdo.8.s2.t2]: Add step-01 to remaining workflows + update workflow.md
    SUBTASK [jdo.8.s2.t2.st1]: Add to common/steps/ and flex/portfolio-deploy/steps/
    SUBTASK [jdo.8.s2.t2.st2]: Update each workflow's workflow.md to list step-01 as first
    SUBTASK [jdo.8.s2.t2.st3]: Final check: all 9 workflows have step-01 as entry
```

---

### jdo.9 — B-4: Steps 03–06 Are 13-Line Stubs

```
FEATURE [jdo.9]
  Title: B-4: Expand steps 03–06 from 13-line stubs to 40+ line specifications
  Type: feature
  Priority: P1
  Parent: sync-zas-jdo
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 4 hours
  Description:
    step-03-keyword-extraction, step-04-competitive-moat, step-05-adversarial-review,
    step-06-final-output — each is exactly 13 lines. No output artifacts defined.
    No SUCCESS CRITERIA. No FAILURE PROTOCOL. Agents cannot execute them consistently.
    step-03 doesn't reference which ontology file to use, what format to produce,
    how many keywords to extract, or where to write output.
  Acceptance:
    ✅ All 4 steps expanded to ≥40 lines each
    ✅ Each has: DEPENDENCIES, EXECUTION PROTOCOLS (6–10 steps), OUTPUT ARTIFACT, SUCCESS CRITERIA, FAILURE PROTOCOL
    ✅ step-03 references the ATS ontology file path explicitly
    ✅ step-06 references the correct template from templates/ directory
  DEPENDS ON: jdo.2 (step-02 must exist) + jdo.4 (JD ingest must exist)
```

#### Story jdo.9.s1: Research Referenced Data Files

```
USER STORY [jdo.9.s1]
  Title: As a step author, I want to know which data files and templates
         steps 03–06 should reference so expansions are accurate
  Parent: jdo.9

  TASK [jdo.9.s1.t1]: Find ATS keyword ontology file location
    SUBTASK [jdo.9.s1.t1.st1]: Glob _lr/ for ontology files in data/ directories
    SUBTASK [jdo.9.s1.t1.st2]: Identify which ontology step-03 should reference

  TASK [jdo.9.s1.t2]: Find output template for step-06
    SUBTASK [jdo.9.s1.t2.st1]: Glob jd-optimize/ for templates/ directory
    SUBTASK [jdo.9.s1.t2.st2]: Identify correct template for JD profile output
```

#### Story jdo.9.s2: Expand All Four Steps

```
USER STORY [jdo.9.s2]
  Title: As an agent, I want steps 03–06 to have complete specifications
         so I can execute the JD analysis pipeline without guessing
  Parent: jdo.9

  TASK [jdo.9.s2.t1]: Expand step-03-keyword-extraction.md (40+ lines)
    SUBTASK [jdo.9.s2.t1.st1]: Add DEPENDENCIES: requirement-signal-map.yaml + ontology path
    SUBTASK [jdo.9.s2.t1.st2]: Add EXECUTION PROTOCOLS (8 steps: load, match, rank, filter, output)
    SUBTASK [jdo.9.s2.t1.st3]: Add OUTPUT ARTIFACT: keyword-list.yaml with frequency scores
    SUBTASK [jdo.9.s2.t1.st4]: Add SUCCESS CRITERIA: minimum keyword count threshold

  TASK [jdo.9.s2.t2]: Expand step-04, step-05, step-06 (40+ lines each)
    SUBTASK [jdo.9.s2.t2.st1]: Expand step-04-competitive-moat (competitive differentiation analysis)
    SUBTASK [jdo.9.s2.t2.st2]: Expand step-05-adversarial-review (stress-test resume bullets)
    SUBTASK [jdo.9.s2.t2.st3]: Expand step-06-final-output (template reference, output format)
    SUBTASK [jdo.9.s2.t2.st4]: Verify all 4 files: ≥40 lines, all sections present
```

---

## P2 FEATURE (1 — Enhancement)

---

### jdo.10 — B-5: step-64 Violates Atomicity (5 Operations)

```
FEATURE [jdo.10]
  Title: B-5: Split step-64-delivery-prep into 3 atomic steps (64, 65, 66)
  Type: feature
  Priority: P2
  Parent: sync-zas-jdo
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 1.5 hours
  Description:
    step-64-delivery-prep performs 5 distinct cognitive operations in one step:
    generate delivery package, create handoff guide, review completeness, create
    folder structure in sync-artifacts/, generate confirmation summary. If any one
    fails, the entire step must re-run. Cannot resume mid-step.
    Fix: split into step-64 (package), step-65 (review), step-66 (confirm).
  Acceptance:
    ✅ step-64 handles ONLY: create output file structure + format conversion → sync-artifacts/
    ✅ step-65 handles ONLY: completeness validation (all required files exist, non-empty)
    ✅ step-66 handles ONLY: user confirmation output (what was produced + where)
    ✅ Step count goes from 64 to 66
    ✅ Each new step is ≤1 cognitive operation
```

#### Story jdo.10.s1: Design the Split

```
USER STORY [jdo.10.s1]
  Title: As a step author, I want a clear split design for step-64 so I
         know exactly what belongs in each of the 3 new steps
  Parent: jdo.10

  TASK [jdo.10.s1.t1]: Read current step-64 and map its 5 operations
    SUBTASK [jdo.10.s1.t1.st1]: Read step-64-delivery-prep.md fully
    SUBTASK [jdo.10.s1.t1.st2]: List all 5 operations and their outputs
    SUBTASK [jdo.10.s1.t1.st3]: Assign each operation to step-64, 65, or 66
```

#### Story jdo.10.s2: Execute the Split

```
USER STORY [jdo.10.s2]
  Title: As the final delivery phase, I want 3 atomic steps so any one
         of them can fail and be retried without rerunning the whole delivery
  Parent: jdo.10

  TASK [jdo.10.s2.t1]: Rewrite step-64 (package only) and create step-65, step-66
    SUBTASK [jdo.10.s2.t1.st1]: Rewrite step-64: only creates output files in sync-artifacts/
    SUBTASK [jdo.10.s2.t1.st2]: Create step-65-delivery-review.md: completeness validation
    SUBTASK [jdo.10.s2.t1.st3]: Create step-66-delivery-confirm.md: user confirmation summary
    SUBTASK [jdo.10.s2.t1.st4]: Wire chain: step-64 NEXT → step-65 NEXT → step-66 DONE
    SUBTASK [jdo.10.s2.t1.st5]: Update workflow step count documentation (64 → 66)
```

---

## Dependency Graph

```
IMMEDIATE START (no blockers):
  jdo.1 (lr-config placeholders) → start first
  jdo.3 (workflow.md dead ref) → start immediately (30 min fix)
  jdo.10 (step-64 split) → standalone P2, start anytime

DEPENDENCY CHAIN:
  jdo.4 (JD ingest) must complete before jdo.2 (step-02) starts
    [step-02 consumes jd-parsed.yaml produced by jdo.4]

  jdo.1 (lr-config) must complete before jdo.5 (step-01) starts
    [step-01 validation will always fail if config still has placeholders]

  jdo.5 (step-01 rewrite) must complete before jdo.7 (cross-refs) starts
    [NEXT STEP links only valid after step-01 is a real file]

  jdo.7 (cross-refs) must complete before jdo.8 (9 workflows) starts
    [linking standard must be defined before deploying to 9 workflows]

  jdo.2 + jdo.4 must complete before jdo.9 (steps 03-06 stubs) starts
    [stubs need step-02 + JD ingest to produce the inputs steps 03-06 consume]

WAVE ORDER:
  Wave 1: jdo.1, jdo.3, jdo.4, jdo.10 (parallel)
  Wave 2: jdo.2, jdo.5, jdo.6 (jdo.2 after jdo.4; jdo.5 after jdo.1)
  Wave 3: jdo.7, jdo.9 (after jdo.5 and jdo.2+jdo.4 respectively)
  Wave 4: jdo.8 (after jdo.7)
```

---

## Engineer Assignments

| Feature | Issue | Engineer | Hours | Priority |
|---------|-------|----------|-------|----------|
| jdo.1 | A-2: lr-config placeholders | Hephaestus | 1h | P0 |
| jdo.2 | B-1: step-02 missing | Vulcan | 3h | P0 |
| jdo.3 | B-2: workflow.md dead ref | Hephaestus | 0.5h | P0 |
| jdo.4 | B-3: JD ingestion step | Vulcan | 2h | P0 |
| jdo.5 | A-1: step-01 stub | Vulcan | 3h | P1 |
| jdo.6 | A-3: conflicting step-01b | Hephaestus | 2h | P1 |
| jdo.7 | A-4: no cross-references | Vulcan | 2h | P1 |
| jdo.8 | A-5: 9 workflows missing step-01 | Vulcan | 2h | P1 |
| jdo.9 | B-4: steps 03-06 stubs | Hephaestus | 4h | P1 |
| jdo.10 | B-5: step-64 atomicity | Vulcan | 1.5h | P2 |

**Vulcan total:** 3+2+3+2+2+1.5 = **13.5 hours**
**Hephaestus total:** 1+0.5+2+4 = **7.5 hours**
**Grand total:** ~21 hours

---

## Issue Count Summary

| Feature | Stories | Tasks | Subtasks | Subtotal |
|---------|---------|-------|----------|----------|
| jdo.1 | 2 | 4 | 11 | 17 |
| jdo.2 | 2 | 4 | 10 | 16 |
| jdo.3 | 2 | 3 | 7 | 12 |
| jdo.4 | 2 | 4 | 10 | 16 |
| jdo.5 | 2 | 4 | 11 | 17 |
| jdo.6 | 2 | 4 | 9 | 15 |
| jdo.7 | 2 | 4 | 8 | 14 |
| jdo.8 | 2 | 3 | 9 | 14 |
| jdo.9 | 2 | 4 | 9 | 15 |
| jdo.10 | 2 | 3 | 6 | 11 |
| **1 sub-epic + 10 features** | **20** | **37** | **90** | **~158** |

---

## Notes for Phoenix

```
1. Create sync-zas-jdo as sub-epic first (parent = sync-zas root epic)
2. Create all 10 features with parent = sync-zas-jdo
3. Wire dependencies with bd dep add AFTER all issues created
4. jdo.2 blocked by jdo.4 (jdo.2 depends on jdo.4)
5. jdo.5 blocked by jdo.1
6. jdo.7 blocked by jdo.5
7. jdo.8 blocked by jdo.7
8. jdo.9 blocked by jdo.2 AND jdo.4
9. Run bd dep tree sync-zas to verify full DAG (both sync-zas and sync-zas-jdo)
10. Report final issue count to WindyHawk via Agent Mail
```

---

*Document created: 2026-03-09*
*Source: files/audit/audit_plan.md (Phase A + Phase B findings)*
*Next step: Phoenix creates ~158 Beads issues matching this blueprint*
