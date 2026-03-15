# Linkright Audit Plan — Phase A & Phase B Gap Analysis

---

## Executive Summary

**Date:** 2026-03-09 | **Status:** ALL PHASES AUDIT COMPLETE (A + B + D–M) | **Next:** Solution discussion + implementation

### The Audit Plan

The overall audit mission is a systematic quality improvement of the Linkright agentic career platform (`context/linkright/_lr/`). The plan covers the full jd-optimize workflow — the flagship 64-step resume generation engine — across all 7 modules (sync, core, flex, squick, lrb, tea, cis). The audit is structured phase by phase, beginning with Phase A (Session Initialization) and Phase B (JD Ingestion), with Phases C through M to follow covering persona scoring, signal retrieval, gap analysis, content writing, layout, styling, and final export.

### What We Completed

**Step 1 — Deep Code Inspection (Complete):** Three parallel audit agents read every step file across 91 Phase A files and the complete Phase B dependency chain in `jd-optimize/steps-c/`. They inspected file sizes, dependency declarations, execution protocols, config state, manifest accuracy, and cross-reference integrity.

**Step 2 — Issues Identified and Documented (Complete):** 46 issues identified across ALL phases (A, B, D–M) + 1 systemic finding — 6 rated P0 (blocks execution), 39 rated P1 (degrades quality), 1 rated P2 (maintenance debt). Root causes and proposed solutions written for each. CRITICAL SYSTEMIC FINDING: 50% of workflow (32/64 steps) is non-functional scaffolding stubs.

**Step 3 — Audit Document Written (Complete):** All findings are documented in `files/audit/audit_plan.md` (this file), covering Phase A problems A-1 through A-5 and Phase B problems B-1 through B-5.

### Current Stage

We are at the end of the Phase A + Phase B audit. No fixes have been implemented yet — this is still the analysis stage. The next stage is to begin implementing the proposed solutions, starting with the 4 P0 blockers which prevent the jd-optimize workflow from executing at all.

### Issues Tracked — Count and Location

| Severity | Count | Phase | Key Issue |
|----------|-------|-------|-----------|
| P0 | 6 | B-1, B-2, B-3, A-2, D-2, SYS-1 | step-02 missing, dead workflow.md ref, no JD ingestion, config placeholders, step-41 broken dep, **50% workflow is non-functional scaffolding** |
| P1 | 39 | A(4), B(1), D(4), E(5), F(6), G(2), H(3), I(3), J(2), K(3), L(4), M(4) | Duplicate steps, broken deps, no criteria, no schemas, undefined data sources, specification contradictions |
| P2 | 1 | B-5 | step-64 atomicity violation |
| **Total** | **46** | | |

**Where issues are tracked:**
- `files/audit/audit_plan.md` — this file, full problem descriptions with root causes and solutions
- No Beads issues created yet for these findings (next step)
- No fixes applied to `context/linkright/_lr/` yet (read-only during audit)

---

**Date:** 2026-03-09
**Audit Scope:** jd-optimize workflow, all sync/core/flex/squick/lrb/cis/tea modules
**Method:** Deep file-by-file code inspection across 91 Phase A files + complete Phase B chain

---

## Phase A — Session Initialization

### Problem A-1: step-01 is an Instruction Stub, Not an Executable Step

The file `step-01-load-session-context.md` exists in all major workflows (10 identical copies, each 526 bytes) and claims to initialize the session by loading `lr-config.yaml`. In reality, it contains only three bullet-point instructions — read the config, resolve variables, validate presence — with no parsing logic, no field extraction, no validation protocol, and no failure path. It is a high-level description of what should happen, not an implementation of it. When an AI agent executes this step, it receives no structured output: no extracted `{system_name}`, no resolved `{user_name}`, no confirmed presence of required keys. Every downstream step that references these session variables is therefore operating on unverified, potentially placeholder-filled data.

**Root Cause:** The file was authored during the initial scaffolding pass as a template placeholder. The pattern "write the step name and three lines" was applied uniformly across all workflows without distinguishing between steps that require actual logic and steps that are purely navigational. No review process caught that this particular step — the initialization gate for the entire system — had never been implemented beyond its label.

**Proposed Solution:** Rewrite `step-01-load-session-context.md` to include a mandatory field checklist that explicitly enumerates every key that must be present and non-placeholder in `lr-config.yaml` before the step is considered complete. The step should instruct the agent to read each field by name, check it against a known list of disallowed placeholder tokens (`[USER_NAME]`, `[USER_PROFESSIONAL_SUMMARY]`, `[TARGET_JOB_TITLE]`, `${AIRTABLE_WEBHOOK_URL}`, `${POSTIZ_API_URL}`), and halt with a specific error message naming the offending field if any placeholder is detected. It should then extract the resolved values into a session context block that subsequent steps can reference by name. Success criteria: the step produces a confirmed session context with all five user fields populated and no placeholder tokens remaining.

---

### Problem A-2: lr-config.yaml Has Five Unfilled Placeholders

The system configuration file at `_lr/lr-config.yaml` is the single source of truth for user identity and integration credentials across the entire Linkright system. At present it contains five unresolved values: `user.name` is set to `[USER_NAME]`, `user.bio` is set to `[USER_PROFESSIONAL_SUMMARY]`, `user.target_role` is set to `[TARGET_JOB_TITLE]`, `distribution.airtable.url` is set to `${AIRTABLE_WEBHOOK_URL}`, and `distribution.postiz.url` is set to `${POSTIZ_API_URL}`. Additionally, `user.target_companies` and `user.skills` are empty arrays. None of the workflows have a mechanism to detect this condition and halt. The system will silently proceed with placeholder values, producing resume artifacts, outreach emails, and content posts addressed to `[USER_NAME]` or targeting `[TARGET_JOB_TITLE]` roles — errors that only surface in the final output, not at the point of misconfiguration.

**Root Cause:** The config file was committed during initial system setup as a template with the expectation that it would be filled in manually before first use. No initialization workflow was ever built, no guard in any step file checks for placeholder tokens, and no README or onboarding document identifies this as a required first step. The system was designed assuming the config would be pre-populated, but nothing enforces that assumption at runtime.

**Proposed Solution:** Create a one-time initialization workflow (`lr-init`) whose sole purpose is to walk the user through filling each required config field interactively. This workflow should read the current config, identify every field containing a bracket or dollar-sign placeholder, prompt the user for the correct value, write the updated config back, and confirm completion. In parallel, update `step-01-load-session-context.md` (per Problem A-1) to perform a placeholder scan as its first action and refuse to proceed if any token is unresolved. This creates two layers of protection: proactive initialization and reactive detection.

---

### Problem A-3: Two Conflicting step-01b Resumption Protocols Coexist

Every workflow in Linkright is supposed to support session resumption through `step-01b-resume-if-interrupted.md`. In practice, two fundamentally different versions of this file exist simultaneously within the same workflows. The minimal version (506 bytes, found in 11 `steps-c/` directories across sync, squick, flex, and lrb modules) asks the agent to check an `artifacts/` folder, identify the last completed step from metadata, and ask the user to choose between Continue and Restart. The canonical version (2.6 KB, found in 30 `steps/` directories across all modules) instead queries Beads via `bd list --status=in_progress`, loads a MongoDB workflow_history checkpoint, logs the resumption event with structured output, and automatically resumes from the detected state without requiring user intervention. These two protocols are not equivalent fallbacks — they represent completely different architectural approaches to state recovery, one manual and one system-driven.

**Root Cause:** The canonical Beads-integrated step-01b was developed as part of the Beads wiring initiative and deployed into the `steps/` directory layer. However, the `steps-c/` layer files — which were created earlier during the B-MAD alignment phase — were never updated to match. The project moved forward assuming both layers would be synchronized, but no enforcement mechanism existed to catch the divergence. The result is that a single workflow like `sync/jd-optimize` now has two step-01b files with different behavior, and it is unclear which one an agent will execute when interruption occurs during the create phase.

**Proposed Solution:** Standardize on the canonical 2.6 KB Beads-integrated version as the single step-01b implementation across all directories. Replace all 11 minimal versions in `steps-c/` with the canonical content, updating only the workflow-specific context references (the name of the workflow and the relevant Beads issue scope). Additionally, update every `steps-c/` canonical file to include a cross-reference to the corresponding `steps/step-01b` if a handoff is required, eliminating the ambiguity about which file governs during which phase.

---

### Problem A-4: No Cross-References Between step-01 and step-01b

The execution chain between `step-01-load-session-context.md` and `step-01b-resume-if-interrupted.md` is assumed but never enforced in either direction. `step-01` files do not contain a NEXT STEP section directing the agent to proceed to `step-01b`. `step-01b` files do not contain a PRECONDITION section asserting that `step-01` has already run and that session context has been successfully loaded. This means an agent can enter `step-01b` directly — for example, when resuming a workflow — without ever having initialized the session context. The resumption step then operates on an uninitiated session, potentially picking up an interrupted state from a different session or producing incorrect results because `{user_name}` and other session variables were never resolved.

**Root Cause:** Step files across Linkright were authored as standalone documents without a linking convention. The architecture assumes sequential execution but does not codify that assumption within the files themselves. No review process checked for bidirectional references, and the issue was further masked by the fact that most workflows work correctly in the happy path (where step-01 always runs first) — only edge cases involving mid-workflow interruptions reveal the missing dependency.

**Proposed Solution:** Establish a linking standard requiring every step file to declare both its predecessor and its successor. Add a `## NEXT STEP` section to all `step-01` files stating: "On completion, proceed to `step-01b-resume-if-interrupted.md`." Add a `## PRECONDITION` section to all `step-01b` files stating: "Requires `step-01-load-session-context.md` to have completed successfully. If session context is absent, abort and restart from step-01." Apply this standard retroactively to all 10 `step-01` files and all 41 `step-01b` files across the codebase.

---

### Problem A-5: Nine Workflows Have No step-01 Initialization File

Nine workflows across the core module — `create-story`, `dev-story`, `document-project`, `document-system`, `setup-execution`, `sprint-planning`, `sprint-status`, `common`, and `flex/portfolio-deploy` — contain `step-01b-resume-if-interrupted.md` in their `steps/` directory but have no corresponding `step-01-load-session-context.md` anywhere in their file tree. When these workflows are invoked, they proceed directly into their domain-specific logic without ever loading `lr-config.yaml`, resolving user variables, or establishing session context. Any step within these workflows that references `{user_name}`, `{system_name}`, or other session variables will either fail silently or use uninitialized placeholder values.

**Root Cause:** These workflows were built on the assumption that they would always be invoked as sub-workflows from a parent orchestration flow that had already initialized the session. This assumption was treated as implicit architectural knowledge rather than being enforced through any mechanism. As the system grew and workflows became independently invocable, the assumption was never revisited and the missing initialization step was never added.

**Proposed Solution:** Add `step-01-load-session-context.md` to the `steps/` directory of all nine affected workflows. The content can be identical to the canonical version used in sync workflows, since session initialization is module-agnostic. Additionally, update each workflow's `workflow.md` or `instructions.md` to explicitly state that `step-01` must always be the first file executed, regardless of whether the workflow is invoked directly or as part of a parent orchestration.

---

## Phase B — JD Ingestion

### Problem B-1: step-02-mapping.md Does Not Exist (P0 Execution Blocker)

The file `steps-c/step-03-keyword-extraction.md` in the `jd-optimize` workflow declares a hard dependency on `step-02-mapping` output in its DEPENDENCIES section: "Requires: `step-02-mapping` output." This file instructs the agent to load mapped requirements produced by the previous step. However, `step-02-mapping.md` does not exist anywhere in the `steps-c/` directory. The step numbering jumps directly from `step-01b` to `step-03`, with no `step-02` file present. This means `step-03` cannot execute: it expects an input artifact that was never produced. Because `step-04`, `step-05`, and `step-06` each depend on the previous step's output in a sequential chain, all four steps — representing the entirety of the JD keyword extraction, competitive analysis, adversarial review, and final output phases — are permanently blocked. The core function of the jd-optimize workflow, which is to analyze and optimize a job description, cannot proceed past step-03.

**Root Cause:** During the initial creation of the `steps-c/` file set, step-02 was planned as the JD-to-signal mapping step but was never authored. The dependency declaration in step-03 was written in anticipation of step-02's existence, creating a forward reference that was never fulfilled. Because the steps were scaffolded in bulk and the missing file was not obviously visible without inspecting the dependency chain, the gap persisted through all subsequent releases without being caught.

**Proposed Solution:** Create `step-02-map-jd-to-signals.md` in `_lr/sync/workflows/jd-optimize/steps-c/`. This step should accept the parsed JD output from step-01 (once step-01 is updated to ingest the JD — see Problem B-3), perform semantic matching of JD requirements against the user's career signals stored in ChromaDB, classify each requirement as matched (signal exists), partial (adjacent signal exists), or unmatched (no signal found), and output a structured `requirement-signal-map.yaml` file. This file becomes the input that step-03 consumes when extracting ATS keywords. The step should be approximately 40 lines to meet the atomicity standard, covering DEPENDENCIES, EXECUTION PROTOCOLS, OUTPUT ARTIFACT specification, SUCCESS CRITERIA, and FAILURE PROTOCOL sections.

---

### Problem B-2: workflow.md Contains a Dead Reference to a Nonexistent Entry Point

The `jd-optimize/workflow.md` file at line 46 instructs: "Read fully and follow: `{project-root}/_lr/sync/workflows/jd-optimize/steps/step-01-ingest.md` to begin the workflow." This file does not exist. The `steps/` directory for jd-optimize contains exactly one file: `step-01b-resume-if-interrupted.md`. There is no `step-01-ingest.md` in `steps/`, in `steps-c/`, or anywhere else in the workflow directory. Any automated workflow runner, any agent following the official workflow entry point, or any user reading `workflow.md` for orientation will be directed to a file that cannot be found, causing an immediate and unrecoverable failure before the workflow executes a single step.

**Root Cause:** `workflow.md` was authored aspirationally, referencing files that were intended to be created as part of a future implementation sprint. The entry point `steps/step-01-ingest.md` represents a design decision that was documented but never implemented. When the actual step files were created, they were placed in `steps-c/` with different names, but the workflow.md reference was never updated to reflect what was actually built.

**Proposed Solution:** Update `workflow.md` line 46 to reference the correct entry point for new sessions: `{project-root}/_lr/sync/workflows/jd-optimize/steps-c/step-01-load-session-context.md`. Add a second entry for resumed sessions: `{project-root}/_lr/sync/workflows/jd-optimize/steps-c/step-01b-resume-if-interrupted.md`. The initialization sequence section should clearly distinguish between first-run and resumed-session entry paths, and both paths should reference files that actually exist on disk.

---

### Problem B-3: No Step Asks the User to Provide the Job Description

The jd-optimize workflow is designed to optimize a resume against a specific job description, yet no step in the workflow ever asks the user to provide that job description. Comparing against other sync workflows reveals a consistent pattern that jd-optimize alone violates: `outbound-campaign/step-out-01-ingest.md` explicitly asks the user to "paste target profile PDF, text, or URL"; `application-track/step-01-ingest-target.md` instructs to "accept the target JD — paste, URL, or file path"; `quick-optimize/step-01-ingest-diff.md` asks for "the specific section to update." In jd-optimize, step-01 loads system configuration only, step-02 is missing entirely, and step-03 proceeds directly to keyword extraction — with no mechanism for actually obtaining the JD text from the user. The workflow assumes the JD is already available but never establishes how or when it was provided.

**Root Cause:** During the workflow design phase, JD ingestion was conceptually assigned to Phase B but never given explicit ownership in a specific step file. The responsibility was implicitly expected to be handled "somewhere before step-03" without being formalized into an atomic step. As other Phase B content was built around this assumed-but-absent step, the gap became progressively harder to notice because the surrounding structure looked complete.

**Proposed Solution:** Create `step-01-ingest-jd.md` in `steps-c/` as an explicit JD collection step that runs immediately after session initialization. This step should present the user with a clear prompt requesting the job description in one of three formats: pasted text, URL for web scraping, or local file path. It should then extract and validate the following fields: company name, job title, seniority level, team context (if available), and the raw requirements text. Requirements should be categorized using the JD ontology schema in `data/` into Core (P0), Preferred (P1), and Bonus (P2) tiers. The step should output a structured `jd-parsed.yaml` file containing all extracted fields, which becomes the input for the new step-02 mapping step.

---

### Problem B-4: Steps 03 Through 06 Are Underspecified 13-Line Stubs

The four steps that constitute the core of Phase B — `step-03-keyword-extraction.md`, `step-04-competitive-moat.md`, `step-05-adversarial-review.md`, and `step-06-final-output.md` — are each exactly 13 lines long. Each contains a title, a MANDATORY EXECUTION RULES section with two bullet points, a DEPENDENCIES section with one line, and an EXECUTION PROTOCOLS section with three numbered items. None of them define output artifacts, none specify what a completed execution looks like in concrete terms, none include SUCCESS CRITERIA or FAILURE PROTOCOL sections, and none provide enough detail for an agent to execute them consistently and correctly. An agent executing step-03, for example, is told to "Extract high-visibility ATS keywords using ontology" but is given no reference to which ontology file to use, what format the extracted keywords should take, how many to extract, how to rank them, or where to write the output.

**Root Cause:** These steps were created during the bulk scaffolding pass that established the 64-step jd-optimize structure. The scaffolding approach prioritized getting all step files created with placeholder content over filling in implementation details. No second pass was ever completed to expand Phase B steps from scaffolds to executable specifications. Because the steps exist as files and appear in the directory listing, they were counted as "implemented" in release tracking without anyone verifying their actual content quality.

**Proposed Solution:** Expand each of the four steps to a minimum of 40 lines following the Linkright step file standard. Each expansion should include: a DEPENDENCIES section specifying exact input files and their schemas, an EXECUTION PROTOCOLS section with 6–10 numbered, unambiguous instructions referencing specific data files and output formats, an OUTPUT ARTIFACT section specifying the exact filename and schema of what the step produces, a SUCCESS CRITERIA section with a concrete checklist of what "done" looks like, and a FAILURE PROTOCOL section specifying what to do if the step cannot complete. For step-03, this means referencing the ATS keyword ontology in `data/`, specifying a ranked keyword list output format with frequency scores, and defining a minimum keyword count threshold. For step-06, this means specifying the exact template in `templates/` that the final JD profile should populate.

---

### Problem B-5: step-64-delivery-prep Violates the Atomicity Principle

The file `step-64-delivery-prep.md` is the final step in the jd-optimize 64-step sequence and is responsible for producing the final deliverable. It currently performs five distinct cognitive operations within a single step: generating a delivery package in multiple formats, creating a handoff guide for the user, reviewing completeness of all prior outputs, creating a folder structure in `sync-artifacts/`, and generating a confirmation summary. Each of these operations represents a separate cognitive unit — producing output, documenting it, validating it, organizing it, and confirming it — and each could independently fail or require revision without affecting the others. Bundling them into a single step means that if any one operation fails or needs revision, the entire step must be re-executed from scratch, and the step cannot be resumed mid-way through its operation sequence.

**Root Cause:** step-64 was written pragmatically as a "close out everything" final step, treating workflow completion as a single event rather than a sequence of discrete operations. The atomicity principle — one cognitive operation per step — was applied throughout the earlier steps but abandoned for the final step under the implicit assumption that "it's the last step, so it doesn't matter as much." This is a common pattern in agentic workflow design where final cleanup steps accumulate responsibilities that should be distributed.

**Proposed Solution:** Split step-64 into three atomic steps. `step-64-delivery-package.md` should handle only the creation of the output file structure and format conversion, writing the final artifacts to `sync-artifacts/[Company]/[Date]/`. `step-65-delivery-review.md` should handle only the completeness validation — checking that all required output files exist, are non-empty, and conform to their expected schemas. `step-66-delivery-confirm.md` should handle only the final confirmation output to the user, summarizing what was produced and where it was saved. This decomposition also fills the sequence gap after step-64 and brings the total workflow step count to 66.

---

## Phase D — Persona Scoring (Steps 08–10 + 41–43)

### Problem D-1: Phase D Exists as Duplicate Step Sets (P1 — Structural Confusion)

Phase D (Persona Scoring) is implemented twice within the same `steps-c/` directory as two completely independent step sets that cover the same functional purpose. The first set — `step-08-persona-score.md` (316 bytes), `step-09-persona-weighting.md` (324 bytes), and `step-10-persona-validation.md` (326 bytes) — are pure scaffolding stubs containing only a generic three-line template: "[READ] Load context from pipeline. [ANALYZE] Execute core logic for 'Step XX'. [VALIDATE] Ensure BMAD and Context Z alignment." These files contain zero domain logic, no persona-specific instructions, no output schemas, and no references to any other step in the workflow. The second set — `step-41-persona-score-init.md` (1,083 bytes), `step-42-persona-weight.md` (1,005 bytes), and `step-43-persona-validate.md` (1,167 bytes) — contain actual persona scoring logic with specific dimensions, weighting schemes, and validation protocols, though they remain underspecified (see D-3, D-4).

The coexistence of both sets creates ambiguity about which steps an agent should execute. In a sequential workflow, steps 08–10 appear first in numerical order and would be executed before steps 41–43, resulting in either redundant processing or — more likely — the agent performing the stub version first and treating persona scoring as "done" before ever reaching the substantive implementation at steps 41–43.

**Root Cause:** Steps 08–10 were created during the initial bulk scaffolding pass that generated all 64 step files with template content. When the substantive Phase D implementation was later written as steps 41–43 (likely during a phase-specific development sprint), the original scaffolding stubs were never removed or redirected. No reconciliation pass was performed to identify and resolve the duplication.

**Approved Solution:** Delete steps 41–43. Rewrite steps 08–10 as the canonical Phase D implementation at the correct sequential position (immediately after Phase B steps 03–06). Step-08 = persona-score-init (with full 10-dimension specification, scoring rubric, SUCCESS CRITERIA, FAILURE PROTOCOL, and output schema). Step-09 = persona-weighting (with explicit JD categorization dependency). Step-10 = persona-validation (with mandatory user confirmation). All cross-references in workflow.md and phase-mapping docs must point to steps 08–10, not 41–43. Steps 41–43 to be deleted after content is migrated.

---

### Problem D-2: Step-41 Depends on Non-Functional Step-40 (P0 — Broken Input Chain)

Step-41 (`step-41-persona-score-init.md`) declares two dependencies: `step-40-final-export` output (user profile data) and `step-06-final-output` output (optimized JD requirements). Step-40 (`step-40-final-export.md`) is a 314-byte scaffolding stub identical in structure to steps 08–10 — it contains only the generic three-line template with no actual export logic, no output artifact specification, and no defined data format. Step-06 (`step-06-final-output.md`) is a 13-line stub (identified in Phase B audit as Problem B-4) that similarly lacks executable detail.

This means Phase D's primary step has two dependencies, both of which produce nothing usable. Step-41 instructs the agent to "Load user profile data and optimized JD requirements" but neither dependency provides a defined artifact to load. An agent executing step-41 would either hallucinate the expected input, fail with a missing-file error, or skip the loading step entirely and proceed with no grounding data.

**Root Cause:** Step-41 was authored with forward-looking dependency declarations — referencing what the dependencies *should* produce once fully implemented — without verifying that those dependencies actually produce the declared outputs. This pattern of aspirational dependency declaration is consistent across the workflow: steps reference other steps' outputs as if they exist, but the referenced steps are stubs that produce nothing.

**Approved Solution:** Step-40 dependency eliminated entirely — steps 41–43 are being deleted (see D-1), and the canonical step-08 sits at the correct sequential position after Phase B. Step-08's dependencies are: (1) step-01 output = session context (user profile from Obsidian Vault), and (2) step-06 output = parsed JD with categorized requirements (`jd_categorized_requirements.yaml`). The step-06 dependency requires B-4 to be fixed first — Phase B stub expansion is a prerequisite for Phase D to function. Dependency chain: step-01 (session) → step-06 (JD analysis) → step-08 (persona scoring).

---

### Problem D-3: Steps 41–43 Lack SUCCESS CRITERIA and FAILURE PROTOCOL (P1 — Quality Gap)

All three substantive Phase D steps (41, 42, 43) follow a partial step file structure that includes MANDATORY EXECUTION RULES, DEPENDENCIES, EXECUTION PROTOCOLS, OUTPUT, and NOTES sections but omits two critical sections required by the Linkright step file standard: SUCCESS CRITERIA (a concrete checklist defining when the step is considered complete) and FAILURE PROTOCOL (instructions for what to do when the step cannot complete normally). Without SUCCESS CRITERIA, an agent has no way to self-assess whether its persona scoring output is adequate — it can produce a minimal or incorrect assessment and still consider the step "done." Without FAILURE PROTOCOL, an agent encountering missing input data, insufficient career history, or ambiguous persona dimensions has no defined recovery path and will either halt the entire workflow or silently produce degraded output.

**Root Cause:** These steps were written during a focused implementation sprint that prioritized getting the core logic documented over achieving full compliance with the step file standard. The SUCCESS CRITERIA and FAILURE PROTOCOL sections were treated as optional polish rather than structural requirements.

**Approved Solution:** Add SUCCESS CRITERIA and FAILURE PROTOCOL to each rewritten step:

**Step-08 (Persona Score Init):** SUCCESS: Minimum 10 scored dimensions, each with confidence score ≥ 0.5, output `persona_assessment.yaml` non-empty and schema-valid. FAILURE: Career data insufficient (< 3 projects/roles) → halt + prompt user for more data. Vault unreadable → halt with specific error naming the missing path.

**Step-09 (Persona Weighting):** SUCCESS: All weights applied, scores normalized to 0-1 range, no outlier > 3σ from mean, output `persona_weighted_scores.yaml` valid. FAILURE: JD categorization missing (B-4 not fixed) → halt with "Phase B prerequisite not met." All scores cluster at same value → flag "insufficient differentiation" and prompt user review.

**Step-10 (Persona Validation):** SUCCESS: User explicitly confirms persona scores, final scores saved to `persona_final_scores.yaml`. User validation is MANDATORY — no skip allowed. FAILURE: User rejects scores → loop back to step-08 with user's corrections. User provides new data → re-run from step-08.

---

### Problem D-4: Step-41 Persona Dimensions Are Vague and Unspecified (P1 — Execution Ambiguity)

Step-41 instructs the agent to "Extract persona dimensions from user career history" and lists four example categories: technical skill clusters, domain expertise levels, experience depth (years, scope), and education credentials. It then says to "Build persona scoring matrix with 10+ scoring dimensions" — but "10+" is not a specification. The step does not define what the 10 dimensions are, how they should be derived, what scoring rubric to use (the NOTES section mentions "0-10 scale" but provides no calibration guidance), how confidence scores should be calculated, or where to read the source career data from (ChromaDB semantic memory? Obsidian Vault files? lr-config.yaml user fields?). An agent executing this step will improvise all of these decisions independently each time, producing inconsistent and non-reproducible persona assessments across sessions.

**Root Cause:** The step was written at the conceptual level — describing *what* should happen — rather than the specification level — describing *exactly how* it should happen. The four listed dimensions are examples, not an exhaustive enumeration, and the "10+" qualifier was used as a placeholder for a specific number that was never determined.

**Approved Solution:** Define exactly 10 persona dimensions (fixed enumerated list, not "10+"):

| # | Dimension | What It Measures |
|---|-----------|-----------------|
| 1 | Technical Skill Match | Core tech stack overlap with JD requirements |
| 2 | Domain Expertise | Industry/domain relevance to target role |
| 3 | Experience Depth | Years of experience + seniority level progression |
| 4 | Leadership & Mentoring | Team size managed, mentoring, RFC/design review leadership |
| 5 | Impact Quantification | Measurable outcomes (revenue, latency, cost savings, etc.) |
| 6 | System Scale | Size and complexity of systems built/maintained |
| 7 | Education & Credentials | Degrees, certifications, formal training |
| 8 | Publications & OSS | Papers published, open source contributions, GitHub activity |
| 9 | Communication & Influence | Presentations, cross-team collaboration, stakeholder management |
| 10 | Cultural/Company Fit | Values alignment, work style compatibility |

Scoring rubric per dimension (example for Dimension 1 — Technical Skill Match): 9-10 = Expert (6+ years) in JD's primary language + all secondary; 7-8 = Expert in primary, proficient in most secondary; 5-6 = Proficient in primary, gaps in secondary; 3-4 = Some experience in primary, major gaps; 1-2 = Minimal overlap with JD tech stack.

Data source: **Obsidian Vault** (projects, achievements, skills files). Future enhancement: ChromaDB semantic search or NotebookLM MCP when available (see ADR-002). Step must reference exact vault path, not generic "career history."

---

### Problem D-5: Step-42 Weighting Depends on Unavailable JD Categorization (P1 — Upstream Dependency Gap)

Step-42 assigns differential weights to persona dimensions based on JD criticality categories: Critical skills receive 2.0x weight, Important skills 1.5x, Nice-to-have 1.0x, and Deprecated skills -0.5x. However, the step says to apply weights "based on JD criticality" without specifying where this categorization comes from. The expected source would be step-03 (keyword extraction) or step-06 (final output) from Phase B — but both are 13-line stubs (Problem B-4) that produce no categorized output. There is no step in the workflow that explicitly categorizes JD requirements into Critical/Important/Nice-to-have tiers. Step-42 therefore references a data artifact that no prior step produces, leaving the agent to either improvise the categorization or skip the weighting entirely.

**Root Cause:** Step-42 was authored assuming that the Phase B JD analysis chain would produce categorized requirements as an intermediate artifact. The Phase B steps were never expanded beyond stubs, so the assumed input was never created. The dependency gap spans across phases (B → D) and was not caught because each phase was developed in isolation without end-to-end dependency validation.

**Approved Solution:** JD categorization is Phase B's responsibility — not Phase D's. Step-06 (or its replacement per B-4 fix) must produce `jd_categorized_requirements.yaml` with tiers: P0-Critical, P1-Important, P2-Nice-to-have, P3-Deprecated. Step-09 (persona weighting) consumes this artifact but does not produce it. This becomes part of the B-4 fix scope. Step-09's DEPENDENCIES section must reference `jd_categorized_requirements.yaml` explicitly.

---

## Phase E — Signal Retrieval (Steps 11–13 + 44–47)

### Problem E-1: Phase E Exists as Duplicate Step Sets with Count Mismatch (P1 — Structural Confusion)

Phase E (Signal Retrieval) is duplicated across two step ranges in the same `steps-c/` directory, following the same pattern as Phase D. The early set — `step-11-signal-query.md` (314 bytes), `step-12-signal-retrieval.md` (322 bytes), and `step-13-signal-ranking.md` (318 bytes) — are identical 13-line scaffolding stubs with the generic "[READ] Load context from pipeline. [ANALYZE] Execute core logic. [VALIDATE] Ensure BMAD alignment" template. The later set — `step-44-signal-query.md` (1,282 bytes), `step-45-signal-extract.md` (1,302 bytes), `step-46-signal-rank.md` (1,166 bytes), and `step-47-signal-validate.md` (1,118 bytes) — contain substantive signal retrieval logic with specific protocols.

Notably, the early set has 3 steps while the later set has 4 steps — `step-47-signal-validate` (user confirmation of top-20 signals) has no counterpart in the early range. This means the early scaffolding not only lacks implementation but also lacks a complete functional decomposition of what Phase E requires.

**Root Cause:** Same as D-1 — bulk scaffolding created steps 11–13 as placeholders, the substantive Phase E was later authored as steps 44–47 with an additional validation step, and no reconciliation was performed to remove or redirect the stubs.

**Approved Solution:** Delete steps 44–47. Rewrite steps 11–13 as the canonical Phase E implementation at the correct sequential position (after Phase D steps 08–10). Step-11 = signal-query, Step-12 = signal-extract, Step-13 = signal-rank. Add step-13b-signal-validate.md as user validation checkpoint (the 4th step that was missing from early scaffolding). Sequential flow: 11 → 12 → 13 → 13b → Phase F. Steps 44–47 to be deleted after content is migrated.

---

### Problem E-2: Steps 44 and 46 Depend on Stub step-06 (P1 — Cascading Phase B Dependency)

Step-44 (`signal-query`) declares a dependency on `step-06-final-output` output for "JD signal taxonomy." Step-46 (`signal-rank`) also depends on `step-06-final-output` for "JD priority requirements." Step-06 is a 13-line stub identified in Problem B-4 that produces no usable output. This means two of four Phase E steps reference a non-functional upstream dependency from Phase B, creating a cascading failure that spans three phases: Phase B's stub output → Phase D's broken weighting (D-5) → Phase E's missing taxonomy and priority data.

**Root Cause:** Phase E was designed assuming Phase B would produce categorized and prioritized JD output. Phase B was never expanded beyond stubs, but Phase E's dependency declarations were written against the intended (not actual) Phase B output.

**Approved Solution:** No separate fix needed — this resolves automatically when B-4 + D-5 are fixed. Step-06 will produce `jd_categorized_requirements.yaml` (per D-5 approved solution). Steps 11 (signal-query) and 13 (signal-rank) will consume this artifact. Their DEPENDENCIES sections must reference `jd_categorized_requirements.yaml` from step-06 explicitly.

---

### Problem E-3: Step-45 References Undefined "User Profile Database" (P1 — Data Source Ambiguity)

Step-45 (`signal-extract`) declares a dependency on "User profile database (resume, work history, portfolio)" but does not specify what this database is, where it is located, or how to access it. The Linkright system has multiple potential data sources: ChromaDB (semantic memory store per ADR-002), MongoDB (career signals per ADR-004), Obsidian Vault (raw markdown files), lr-config.yaml (basic user fields), and the session-preferences.yaml (per-session data from Phase A). The step provides no path, no API reference, no database name, and no schema — leaving the executing agent to guess which data source to query and how to interpret its contents.

**Root Cause:** Step-45 was written with a conceptual reference to "the user's data" without binding it to a specific system component. The Linkright architecture has multiple overlapping data stores (a known issue — see ADR-002 and ADR-004), and the step author did not resolve which one was canonical for signal extraction.

**Approved Solution:** Step-12 (signal-extract) data source = **Obsidian Vault direct read** (consistent with D-4 decision). Step must reference exact vault path and expected file structure (projects/, achievements/, skills/ directories). DEPENDENCIES section updated to: "Requires: Obsidian Vault at [configured vault path] with projects, achievements, and skills markdown files." Future enhancement note in step: "When ChromaDB/NotebookLM MCP is available, replace direct file read with semantic search for improved signal matching (see ADR-002)."

---

### Problem E-4: Steps 44–47 Lack SUCCESS CRITERIA and FAILURE PROTOCOL (P1 — Quality Gap)

All four substantive Phase E steps follow the same partial structure as Phase D: they include MANDATORY EXECUTION RULES, DEPENDENCIES, EXECUTION PROTOCOLS, OUTPUT, and NOTES, but omit SUCCESS CRITERIA and FAILURE PROTOCOL sections. Step-45 (signal extraction) is particularly vulnerable — if no signals are found for a persona dimension, the step has no defined behavior: should it flag a gap, return an empty set, prompt the user, or halt the workflow?

**Root Cause:** Same systemic pattern as D-3 — these sections were treated as optional during the focused implementation sprint.

**Approved Solution:** Add SUCCESS CRITERIA and FAILURE PROTOCOL to each rewritten step:

**Step-11 (Signal Query):** SUCCESS: `signal_query.json` generated with ≥ 10 weighted search terms, no duplicates, all terms traceable to persona dimensions. FAILURE: Persona scores missing (step-10 not done) → halt. < 5 searchable terms → flag "insufficient persona data" and prompt user.

**Step-12 (Signal Extract):** SUCCESS: `signal_map.yaml` with ≥ 20 raw signals found, each with at least 1 evidence piece (context, depth, recency). FAILURE: < 10 signals found → warn user "career data may be insufficient." Zero signals → halt + prompt user to add more projects to Vault.

**Step-13 (Signal Rank):** SUCCESS: `signal_ranked.yaml` sorted by composite score, `signal_top_20.md` generated with top 20 signals. FAILURE: All signals score < 3/10 → flag "weak JD fit, consider different role." Ties in top-20 → use recency as tiebreaker.

**Step-13b (Signal Validate):** SUCCESS: User explicitly confirms top-20 signals (mandatory — no skip), `signals_final_validated.yaml` saved. FAILURE: User rejects > 50% signals → loop back to step-11 with user corrections. User adds new signals manually → merge and re-rank from step-13.

---

### Problem E-5: Output Schema Definitions Missing Across All Phase E Steps (P1 — Interoperability Gap)

Steps 44–47 each declare output artifacts (`signal_query.json`, `signal_map.yaml`, `signal_ranked.yaml`, `signals_final_validated.yaml`) but none of these steps define what these files should contain structurally. There are no field definitions, no example schemas, no required vs optional fields, and no format specifications beyond the file extension. Step-46 mentions scoring rules ("+3 points for critical, +2 for important, +1 for supporting, -1 for outdated") but does not define the total scale, the composite score calculation formula, or the output format for ranked results. This means every agent execution will produce a different structure, making cross-step data flow unreliable and preventing any automated validation of intermediate outputs.

**Root Cause:** The steps were written as human-readable process descriptions rather than machine-executable specifications. The OUTPUT section names a filename but treats the internal structure as implicit knowledge that the executing agent should derive from context.

**Approved Solution:** Add OUTPUT SCHEMA subsection to each step with exact structure:

**Step-11 (`signal_query.json`):**
```json
{
  "query_terms": [
    { "term": "distributed systems", "weight": 8, "source_dimension": "technical_skill_match", "persona_gap_score": 3 }
  ],
  "constraints": { "recency_years": 5, "min_evidence_count": 1 },
  "metadata": { "generated_from": "persona_final_scores.yaml", "total_terms": 12 }
}
```

**Step-12 (`signal_map.yaml`):**
```yaml
signals:
  - id: SIG-001
    title: "Kafka pipeline optimization at Spotify"
    evidence:
      context: "Senior ML Engineer, 2024"
      depth: "Led 3-person team, production system"
      impact: "40% latency reduction"
      recency: "1 year ago"
    relevance_score: 8.5
    source: "vault/projects/spotify-signal-curation.md"
```

**Step-13 (`signal_ranked.yaml`):** Same structure as signal_map.yaml, sorted by composite score. Composite formula: `composite = query_weight × 0.6 + jd_fit_score × 0.4`, normalized to 0–100.

**Step-13b (`signals_final_validated.yaml`):** Same as ranked + `user_confirmed: true` flag + `validation_notes: "user feedback text"` per signal.

---

## Phase F — Baseline Scoring (Steps 14–16 + 48–49 + 58)

### Problem F-1: Phase F Has Triple Duplication Across Three Step Ranges (P1 — Structural Confusion)

Phase F (Baseline Scoring) is the most fragmented phase in the workflow, appearing in three separate step ranges. The early set — `step-14-baseline-metrics.md` (322 bytes), `step-15-baseline-ownership.md` (326 bytes), and `step-16-baseline-compilation.md` (330 bytes) — are pure 13-line scaffolding stubs. The mid-range set — `step-48-baseline-score.md` (1,275 bytes) and `step-49-baseline-gaps.md` (1,109 bytes) — contain substantive scoring and gap calculation logic. The late set — `step-58-baseline-compile.md` (~800 bytes) — is explicitly labeled "Phase F (Extended)" and performs score aggregation that logically belongs immediately after steps 48–49.

The count mismatch is severe: 3 stubs (14–16), 2 substantive steps (48–49), and 1 extension (58) — six files across three ranges for a single phase. The early scaffolding names (metrics, ownership, compilation) don't even align with the substantive step names (score, gaps, compile), suggesting the scaffolding was done before the functional decomposition was finalized.

**Root Cause:** Same systemic scaffolding-then-implement pattern as Phases D and E, compounded by a third "extended" step (58) that was added later to fill a gap in the mid-range set without reconciling with either the early stubs or the existing mid-range steps.

---

### Problem F-2: Step-48 Dependency on Step-47 Will Become Stale (P1 — Cross-Phase Dependency)

Step-48 declares a dependency on `step-47-signal-validate` output (`signals_final_validated.yaml`). Per the approved E-1 solution, step-47 is being deleted and its function moved to step-13b. When Phase E renumbering is implemented, step-48's dependency reference will point to a deleted file. Since Phase F will also be renumbered (following the D-1/E-1 pattern of consolidating at early positions), this resolves naturally — but must be tracked as a required update during implementation.

**Root Cause:** Cross-phase dependencies are declared by step number rather than by artifact name. When steps are renumbered, all downstream references break.

---

### Problem F-3: Step-48 Re-Depends on Stub Step-06 (P1 — Cascading Phase B Dependency)

Step-48 requires `step-06-final-output` output for "JD scoring dimensions" and uses the same Critical/Important/Nice-to-have weighting scheme (2.0x/1.5x/1.0x) as Phase D step-09. This is the third phase (after D and E) that depends on step-06's non-functional output. The dependency on `jd_categorized_requirements.yaml` (from the D-5/B-4 approved fix) applies here as well.

**Root Cause:** Same as D-5 and E-2 — step-06 was assumed to produce categorized JD output but never did.

---

### Problem F-4: No SUCCESS CRITERIA or FAILURE PROTOCOL (P1 — Quality Gap)

Steps 48, 49, and 58 all lack SUCCESS CRITERIA and FAILURE PROTOCOL sections, following the same systemic pattern as Phases D and E.

**Root Cause:** Same as D-3 and E-4.

---

### Problem F-5: Output Schema Definitions Missing (P1 — Interoperability Gap)

`baseline_scores.yaml`, `gaps_analysis.yaml`, `baseline_compilation.yaml`, and `baseline_summary.md` are all named as outputs but none have defined structures. Step-48 mentions scoring bands (Expert 80–100, Proficient 60–79, etc.) but doesn't define the output format. Step-49 defines gap categories (Critical 20+, Important 10–19, Minor 1–9) but doesn't specify the YAML structure.

**Root Cause:** Same as E-5.

---

### Problem F-6: "Required Score" for Gap Calculation Is Never Established (P1 — Logic Gap)

Step-49 calculates gaps as `Gap = Required Score - Actual Score` but no prior step defines what the "Required Score" is for each JD dimension. Step-48 scores the user's actual readiness level, but there is no corresponding step that establishes the target benchmark per JD requirement. Without a defined target, the gap calculation is impossible — the agent would need to improvise what score is "required" for each dimension, producing inconsistent and arbitrary gap assessments.

**Root Cause:** The gap calculation formula assumes the existence of a target scoring matrix that was never created. The Phase B JD analysis (steps 03–06) was supposed to establish requirement-level expectations, but since those steps are stubs, the target data was never produced. This is a deeper manifestation of the B-4 cascade — not just missing categorization (D-5) but also missing quantified expectations.

---

## Phase G — Gap Analysis (Steps 17–19 + 50)

### Problem G-1: Phase G Has Duplicate Steps with Count Mismatch (P1 — Structural Confusion)

Phase G (Gap Analysis) has 3 early-range scaffolding stubs — `step-17-gap-identification.md` (326 bytes), `step-18-gap-taxonomy.md` (314 bytes), `step-19-gap-prioritization.md` (326 bytes) — and 1 substantive step — `step-50-gap-category.md` (1,361 bytes). The early set has 3 steps covering identification, taxonomy, and prioritization; the late set has 1 step covering categorization. The functional overlap is significant: gap identification + taxonomy ≈ gap categorization, and gap prioritization is embedded within step-50's "rank gaps by remediation timeline" protocol. The early scaffolding decomposed the work into finer granularity than the substantive implementation, suggesting the design evolved from 3 separate operations to 1 combined step.

**Root Cause:** Same systemic scaffolding-then-implement pattern. Step-50 consolidated what the scaffolding had split into 3 steps.

---

### Problem G-2: Standard Quality Gaps (P1)

Step-50 lacks SUCCESS CRITERIA, FAILURE PROTOCOL, and output schema for `gap_strategy.yaml`. The remediation categories (Fillable, Positioning, Compensation, Negotiation, Dealbreaker) are well-defined conceptually but have no formal classification criteria — what threshold makes a gap "Dealbreaker" vs "Negotiation"? No quantitative rules are provided.

**Root Cause:** Same as D-3, E-4, F-4.

---

## Phase H — Inquisitor (Steps 20–23 + 51 + 59)

### Problem H-1: Phase H Has Severe Count Mismatch (P1 — Structural Confusion)

Phase H (Inquisitor) has the largest count mismatch of any phase. Early range: 4 stubs — `step-20-inquisitor-prompt.md` (324 bytes), `step-21-inquisitor-dialogue.md` (328 bytes), `step-22-inquisitor-capture.md` (326 bytes), `step-23-inquisitor-verification.md` (336 bytes). Late range: 1 substantive step — `step-51-inquisitor-prep.md` (1,239 bytes). Extended: 1 step — `step-59-inquisitor-capture.md` (1,018 bytes, "Phase H Extended").

Early scaffolding envisioned a 4-step inquisitor flow (prompt → dialogue → capture → verification). The substantive implementation collapsed this to 1 step (prep) plus 1 extended step (capture). The dialogue and verification steps have no substantive counterpart — the agent is told to generate questions (step-51) and capture responses (step-59) but there is no step governing how to conduct the actual dialogue or verify the responses.

**Root Cause:** Same scaffolding pattern, but here the late-range implementation is actually *less complete* than what the scaffolding envisioned. The scaffolding correctly identified that inquisitor needs dialogue management and verification, but the implementation only covered prep and capture.

---

### Problem H-2: Step-51 Next Step Reference Is Wrong (P1 — Dead Reference)

Step-51's OUTPUT section says "Next step: step-52-inquisitor-dialogue" — but step-52 is actually `step-52-narrative-struct.md` (Phase I, not Phase H). There is no `step-52-inquisitor-dialogue`. The intended next step is step-59 (inquisitor capture), which is 8 steps away in sequence. This dead reference would send an agent from Phase H directly into Phase I, skipping the actual user dialogue entirely.

**Root Cause:** The next-step reference was written expecting the early-range numbering (where step-21 was inquisitor-dialogue) but using the late-range number space.

---

### Problem H-3: Standard Quality Gaps (P1)

Steps 51 and 59 lack SUCCESS CRITERIA, FAILURE PROTOCOL, and output schemas.

---

## Phase I — Narrative Mapping (Steps 24–26 + 52 + 60)

### Problem I-1: Phase I Has Duplicate Steps with Count Mismatch (P1)

Early: 3 stubs — `step-24-narrative-arc.md` (316 bytes), `step-25-narrative-mapping.md` (324 bytes), `step-26-narrative-validation.md` (330 bytes). Late: 1 substantive step — `step-52-narrative-struct.md` (1,183 bytes). Extended: 1 step — `step-60-narrative-refine.md` (1,244 bytes, "Phase I Extended"). Same pattern: 3 scaffolding stubs → 1 substantive + 1 extended.

---

### Problem I-2: Step-52 Depends on Deleted Step-47 (P1)

Step-52 dependency: `step-47-signal-validate output (signals_final_validated.yaml)`. Per E-1 approved solution, step-47 is being deleted and replaced by step-13b. This cross-reference will break during renumbering. Additionally, step-52 also references "Inquisitor dialogue responses (step-51 phase H)" — but step-51 only generates questions, not responses. Responses come from step-59 (capture). So step-52 has an incorrect dependency — it should reference step-59 output, not step-51.

---

### Problem I-3: Standard Quality Gaps (P1)

Steps 52 and 60 lack SUCCESS CRITERIA, FAILURE PROTOCOL, and output schemas.

---

## Phase J — Content Writing (Steps 27–30 + 53 + 61)

### Problem J-1: Phase J Has Duplicate Steps with Count Mismatch (P1)

Early: 4 stubs — `step-27-content-drafting.md` (322 bytes), `step-28-content-refining.md` (322 bytes), `step-29-content-xyz-format.md` (326 bytes), `step-30-content-review.md` (318 bytes). Late: 1 substantive step — `step-53-content-draft.md` (1,278 bytes). Extended: 1 step — `step-61-content-refine.md` (1,276 bytes, "Phase J Extended"). Step-29 "content-xyz-format" is particularly notable — "xyz" is a literal placeholder name that was never replaced with an actual format name.

---

### Problem J-2: Standard Quality Gaps (P1)

Steps 53 and 61 lack SUCCESS CRITERIA, FAILURE PROTOCOL, and output schemas.

---

## Phase K — Layout Validation (Steps 31–33 + 54)

### Problem K-1: Phase K Has Duplicate Steps (P1)

Early: 3 stubs — `step-31-layout-budget.md` (316 bytes), `step-32-layout-sizing.md` (316 bytes), `step-33-layout-onepage-check.md` (330 bytes). Late: 1 substantive step — `step-54-layout-check.md` (1,134 bytes). No extended step. Step-54 mentions "layout specifications" as input but no step produces them — the page dimensions, margin sizes, and font constraints for A4 resume format are never formally defined in any step file.

---

### Problem K-2: Layout Specifications Undefined (P1 — Logic Gap)

Step-54 says "[READ] Load content and layout specifications" but no prior step produces layout specifications. The A4 resume constraints (210mm × 297mm, margin sizes, maximum word count, font sizes, section heights) are critical for layout validation but exist nowhere in the workflow. The agent would need to improvise all dimensional constraints.

**Root Cause:** Layout specifications were assumed to come from the template CSS (context/linkright/docs/Template CV & Portfolio/) but no step in the workflow reads or references the template dimensions.

---

### Problem K-3: Standard Quality Gaps (P1)

Step-54 lacks SUCCESS CRITERIA, FAILURE PROTOCOL, and output schema.

---

## Phase L — Styling & Theming (Steps 34–36 + 55)

### Problem L-1: Phase L Has Duplicate Steps (P1)

Early: 3 stubs — `step-34-style-theming.md` (316 bytes), `step-35-style-compile.md` (316 bytes), `step-36-style-validation.md` (322 bytes). Late: 1 substantive step — `step-55-styling.md` (1,184 bytes). No extended step.

---

### Problem L-2: "Company Branding Guidelines" Source Undefined (P1 — Data Source Ambiguity)

Step-55 requires "Company branding guidelines" but no step collects or produces this data. Phase A (session initialization) asks for company name and template preference but doesn't establish branding guidelines (colors, fonts, logo). The step mentions CSS variables (primary, accent, highlight colors) — which aligns with the Template CV template's CSS variable system (per TEMPLATE-INTEGRATION-ARCHITECTURE.md) — but makes no explicit reference to it. The connection between Phase A's template selection and Phase L's styling application is entirely implicit.

**Root Cause:** The template integration architecture was documented separately (files/implementation/TEMPLATE-INTEGRATION-ARCHITECTURE.md) but never wired into the step files.

---

### Problem L-3: Step-55 Says "PDF" But System Only Produces HTML+CSS (P1 — Specification Contradiction)

Step-55 says "[VALIDATE] Format compliance (PDF dimensions, etc.)" but per the approved Point-6 decision, the system ONLY produces HTML+CSS. No PDF generation is part of the workflow. This contradicts the approved output format and would confuse an executing agent about what format to validate.

---

### Problem L-4: Standard Quality Gaps (P1)

Step-55 lacks SUCCESS CRITERIA, FAILURE PROTOCOL, and output schema.

---

## Phase M — Final Scoring (Steps 37–39 + 56 + 62–63)

### Problem M-1: Phase M Has Duplicate Steps Plus Extended Assembly and Validation (P1)

Early: 3 stubs — `step-37-final-scoring.md` (316 bytes), `step-38-final-tracker-update.md` (330 bytes), `step-39-final-storage.md` (316 bytes). Late: 1 substantive step — `step-56-final-quality.md` (1,454 bytes). Extended: 2 steps — `step-62-portfolio-assemble.md` (1,264 bytes, "Phase K-L Extended") and `step-63-success-validation.md` (1,257 bytes, "Phase M Extended").

Step-62 is labeled "Phase K-L (Extended)" despite being in the step-62 range — it's a portfolio assembly step that logically belongs after styling (Phase L) but before final quality (Phase M). This creates ambiguity about Phase M's boundaries.

---

### Problem M-2: Step-62 Contradicts Point-6 Output Format (P1 — Specification Contradiction)

Step-62 says "Create multiple formats (PDF, HTML, plain-text)" and outputs `final_portfolio.pdf`, `final_portfolio.html`, `final_portfolio.txt`. Per the approved Point-6 decision, output is HTML+CSS ONLY — no PDF, no plain-text. Additionally, the filename should be `[Company]_[Role]_Resume_[Date].html`, not `final_portfolio.html`. The step's output specification directly contradicts the approved output rules.

---

### Problem M-3: Step-56 "10+ Quality Dimensions" Are Undefined (P1)

Same pattern as D-4 — step-56 says "Assess portfolio against 10+ quality dimensions" and lists 10 examples but uses "10+" as a vague qualifier. The 10 listed dimensions (accuracy, JD alignment, evidence quality, writing quality, visual design, completeness, positioning clarity, format compliance, gap coverage, impact projection) are reasonable but the scoring rubric is undefined — what constitutes a 70% threshold? No calibration is provided.

---

### Problem M-4: Standard Quality Gaps (P1)

Steps 56, 62, and 63 lack SUCCESS CRITERIA, FAILURE PROTOCOL, and output schemas.

---

## Systemic Finding: CROSS-WORKFLOW DUPLICATION PATTERN (P0 — Architectural)

### Problem SYS-1: Every Phase Has Dual Implementation Creating 27 Redundant Steps

Across Phases D through M, a consistent pattern emerges: every phase exists as both early-range scaffolding stubs (steps 08–39) AND late-range substantive implementations (steps 41–56) AND in some cases extended steps (steps 57–63). The total impact:

| Phase | Early Stubs | Late Steps | Extended | Redundant Files |
|-------|-------------|------------|----------|-----------------|
| D | 08-10 (3) | 41-43 (3) | — | 3 |
| E | 11-13 (3) | 44-47 (4) | 57 (1) | 4 |
| F | 14-16 (3) | 48-49 (2) | 58 (1) | 3 |
| G | 17-19 (3) | 50 (1) | — | 1 |
| H | 20-23 (4) | 51 (1) | 59 (1) | 2 |
| I | 24-26 (3) | 52 (1) | 60 (1) | 2 |
| J | 27-30 (4) | 53 (1) | 61 (1) | 2 |
| K | 31-33 (3) | 54 (1) | — | 1 |
| L | 34-36 (3) | 55 (1) | — | 1 |
| M | 37-39 (3) | 56 (1) | 62-63 (2) | 3 |
| **Total** | **32** | **15** | **6** | **22 redundant** |

Of 64 total step files, **32 are pure scaffolding stubs** (identical 13-line template, 314-336 bytes each), **15 are substantive implementations** (1,018-1,454 bytes), **6 are extended steps**, and the remaining are Phase A/B steps. The workflow is approximately 50% non-functional scaffolding.

**Root Cause:** The 64-step structure was scaffolded in bulk as a single pass, then a second implementation pass created substantive steps in the 41-56 range without removing or updating the scaffolding. A third pass added "Extended" steps (57-63) for phases that needed additional operations. No reconciliation pass was ever performed.

**Approved Solution Direction:** For each phase, delete the late-range (41-56) and extended (57-63) steps. Rewrite the early-range steps (08-39) at their correct sequential positions with full specifications. Consolidate extended step logic into the early-range rewrites. This eliminates 22+ redundant files and creates a clean sequential flow: steps 01-06 (Phase A+B) → 08-10 (D) → 11-13b (E) → 14-16 (F) → 17-19 (G) → 20-23 (H) → 24-26 (I) → 27-30 (J) → 31-33 (K) → 34-36 (L) → 37-39 (M) → 40/64-66 (Delivery). This approach was approved in D-1 and E-1 decisions and should be applied uniformly across all phases.

---

## Summary: Priority Matrix

| Problem | Severity | What Breaks Without Fix |
|---------|----------|------------------------|
| B-1: step-02 missing | P0 | Steps 03–06 cannot execute; entire JD analysis blocked |
| B-2: workflow.md dead reference | P0 | Workflow cannot be launched by any automated runner |
| B-3: No JD ingestion step | P0 | JD never collected; keyword extraction has no source material |
| A-2: lr-config.yaml placeholders | P0 | System outputs placeholder tokens in resume artifacts |
| A-1: step-01 not executable | P1 | Session context unverified; all downstream steps use unvalidated data |
| A-3: Two conflicting step-01b | P1 | Inconsistent resumption behavior; Beads not used in steps-c phase |
| A-4: No step cross-references | P1 | Agents can enter resumption without initialization |
| A-5: 9 workflows skip Phase A | P1 | Core workflows operate without session context |
| B-4: Steps 03–06 are stubs | P1 | Agents cannot execute phase B consistently |
| D-2: step-41 depends on stub step-40 | P0 | Phase D input chain broken; persona scoring has no valid input |
| D-1: Duplicate step sets (08–10 vs 41–43) | P1 | Ambiguous execution order; agent may execute stubs instead of real steps |
| D-3: No SUCCESS/FAILURE criteria (41–43) | P1 | Agent cannot determine completion or handle errors |
| D-4: Vague persona dimensions in step-41 | P1 | Inconsistent, non-reproducible persona scoring |
| D-5: Weighting needs unavailable JD categorization | P1 | Step-42 cannot apply weights without categorized requirements |
| B-5: step-64 non-atomic | P2 | Final delivery cannot be partially resumed or independently retried |
