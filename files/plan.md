Plan: Linkright Multi-Agent Analysis & Implementation via Agent MCP Mail

 Context

 Problem being solved:
 Linkright is a domain-specific agentic career platform (sync + flex + squick modules) that was architecturally inspired by B-MAD but has accumulated
 significant quality debt across 4 releases. Release 4 audit identified: 8 zero-byte files, empty workflow-manifest, atomicity violations, missing
 ADRs, agent XML depth inconsistency, broken manifest cross-refs, no traceability on 173 closed beads, and incomplete modules (flex, squick). The goal
 is to use a team of 7 specialized Agent MCP Mail agents — 2 specialists (audit layer), 2 architects (solution layer), 1 PM (planning layer), 2
 engineers (execution layer) — to perform a rigorous gap analysis and systematically bring Linkright to exceed B-MAD's standards.

 Intended outcome:
 A fully orchestrated multi-agent session that produces:
 1. A structured audit of both systems (in files/audit/)
 2. Stress-tested architectural solutions (in files/architecture/)
 3. A complete Beads-tracked implementation plan (in files/planning/)
 4. Parallel implementation of all fixes (in files/implementation/)

 All output files go inside files/ directory organized by subdirectory — no scattered individual files.

 ---
 Critical Files

 ┌──────────────────────────────────────────────────────────────────────────────────────────────────────┬────────────────────────────────────────┐
 │                                                 File                                                 │                Purpose                 │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────┤
 │ /Users/satvikjain/Downloads/sync/context/linkright/_lr/                                              │ Linkright runtime system (READ-ONLY)   │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────┤
 │ /Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/                                          │ B-MAD runtime system (READ-ONLY)       │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────┤
 │ /Users/satvikjain/Downloads/sync/context/linkright/docs/Audit artifacts/LINKRIGHT-BMAD-AUDIT.md      │ Existing audit (READ-ONLY)             │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────┤
 │ /Users/satvikjain/Downloads/sync/context/linkright/releases/Release_4.md                             │ R4 gap list with 18 tasks (READ-ONLY)  │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────┤
 │ /Users/satvikjain/Downloads/sync/context/linkright/docs/project knowledge/LR-MASTER-ORCHESTRATION.md │ Linkright prime directive (READ-ONLY)  │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────┤
 │ /Users/satvikjain/Downloads/sync/setup/setup.md                                                      │ Agent Mail protocol (Section 10)       │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────┤
 │ /Users/satvikjain/Downloads/sync/files/                                                              │ OUTPUT directory (create subdirs here) │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────────────────────────┤
 │ ~/.claude/settings.json                                                                              │ Agent Mail MCP config (Bearer token)   │
 └──────────────────────────────────────────────────────────────────────────────────────────────────────┴────────────────────────────────────────┘

 ---
 The 7 Agents — Identity & Roles

 Layer 1: Specialists (Audit)

 ┌─────┬─────────────────────────┬──────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
 │  #  │       Agent Name        │ Persona  │                                          Role                                           │
 ├─────┼─────────────────────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ 1   │ lr-bmad-specialist      │ "Cipher" │ B-MAD Architecture Specialist — encyclopedic knowledge of every B-MAD pattern           │
 ├─────┼─────────────────────────┼──────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
 │ 2   │ lr-linkright-specialist │ "Nova"   │ Linkright Architecture Specialist — encyclopedic knowledge of entire Linkright universe │
 └─────┴─────────────────────────┴──────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

 Layer 2: Architects (Solution Design)

 ┌─────┬────────────────────────┬──────────────┬────────────────────────────────────────────────────────────────────────────────────────┐
 │  #  │       Agent Name       │   Persona    │                                          Role                                          │
 ├─────┼────────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ 3   │ lr-bmad-architect      │ "Prometheus" │ B-MAD Architect — translates B-MAD best practices into prescriptive solutions          │
 ├─────┼────────────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ 4   │ lr-linkright-architect │ "Athena"     │ Linkright Architect — validates solutions against Linkright's universe and constraints │
 └─────┴────────────────────────┴──────────────┴────────────────────────────────────────────────────────────────────────────────────────┘

 Layer 3: Execution

 ┌─────┬────────────────────┬──────────────┬──────────────────────────────────────────────────────────────────────┐
 │  #  │     Agent Name     │   Persona    │                                 Role                                 │
 ├─────┼────────────────────┼──────────────┼──────────────────────────────────────────────────────────────────────┤
 │ 5   │ lr-project-manager │ "Phoenix"    │ PM — full Beads decomposition (epics→tasks→subtasks) before any code │
 ├─────┼────────────────────┼──────────────┼──────────────────────────────────────────────────────────────────────┤
 │ 6   │ lr-engineer-1      │ "Vulcan"     │ Engineer 1 — parallel implementation (assigned odd-numbered epics)   │
 ├─────┼────────────────────┼──────────────┼──────────────────────────────────────────────────────────────────────┤
 │ 7   │ lr-engineer-2      │ "Hephaestus" │ Engineer 2 — parallel implementation (assigned even-numbered epics)  │
 └─────┴────────────────────┴──────────────┴──────────────────────────────────────────────────────────────────────┘

 ---
 Output File Structure (inside files/)

 files/
 ├── audit/
 │   ├── bmad-deep-dive.md           ← Cipher's complete B-MAD architecture report
 │   ├── linkright-deep-dive.md      ← Nova's complete Linkright architecture report
 │   └── gap-analysis.md             ← Cipher + Nova collaborative gap report (ranked by severity)
 ├── architecture/
 │   ├── bmad-proposals.md           ← Prometheus: B-MAD patterns → Linkright prescriptions
 │   ├── linkright-constraints.md    ← Athena: what Linkright can/cannot adopt and why
 │   ├── stress-test-log.md          ← Every assumption challenged + counterarguments
 │   └── final-solutions.md          ← Combined, agreed architectural decisions
 ├── planning/
 │   ├── implementation-plan.md      ← Phoenix's narrative plan (phases, rationale)
 │   └── beads-breakdown.md          ← Epic → Feature → Story → Task → Subtask tree
 └── implementation/
     ├── engineer-1-log.md            ← Vulcan's work log
     └── engineer-2-log.md            ← Hephaestus's work log

 ---
 Execution Flow

 Phase 1: Specialist Audit (Parallel)
   Cipher reads B-MAD        Nova reads Linkright
   → both write to files/audit/
   → Cipher + Nova sync via Agent Mail
   → produce gap-analysis.md (collaborative)

 Phase 2: Architecture Solutions (Sequential after Phase 1)
   Prometheus reads gap-analysis.md → writes bmad-proposals.md
   Athena reads gap-analysis.md → writes linkright-constraints.md
   Prometheus + Athena stress-test each other via Agent Mail
   → produce final-solutions.md

 Phase 3: Planning (Sequential after Phase 2)
   Phoenix reads final-solutions.md
   Phoenix creates full Beads hierarchy (bd create for each issue)
   Phoenix writes implementation-plan.md + beads-breakdown.md
   Phoenix sends handoff to Vulcan + Hephaestus via Agent Mail
   WAIT: Planning FULLY complete before engineers start

 Phase 4: Implementation (Parallel after Phase 3)
   Vulcan + Hephaestus claim respective Beads issues
   Work in parallel, coordinate via Agent Mail for conflicts
   Each writes work log to files/implementation/

 ---
 The Detailed Prompt (to be run as the orchestrating agent)

 The prompt below is what gets sent to start this entire multi-agent session. It is structured as a single Claude Code invocation that registers all 7
 agents and orchestrates the workflow.

 ═══════════════════════════════════════════════════════════════════════════════
 LINKRIGHT MULTI-AGENT QUALITY MISSION — AGENT MCP MAIL ORCHESTRATION PROMPT
 Version: 1.0 | Project: sync | Date: 2026-03-09
 ═══════════════════════════════════════════════════════════════════════════════

 ## MISSION BRIEFING

 You are the Orchestrator for a 7-agent quality improvement mission for the
 Linkright agentic career platform. Your job is to:

 1. Register all 7 agents in Agent MCP Mail
 2. Orchestrate the 4-phase workflow by sending structured messages between agents
 3. Ensure all outputs land in the correct files/ subdirectory
 4. Monitor progress via Agent Mail inbox
 5. Never let Phase N+1 start before Phase N is complete

 ---

 ## SYSTEM CONTEXT

 ### What is Linkright?
 Linkright is a domain-specific agentic platform for career operations.
 It has 3 user-facing modules:
 - **sync**: Outbound career positioning (resume optimization, JD analysis, portfolio)
 - **flex**: Inbound brand building (viral social content automation)
 - **squick**: Enterprise rapid shipping (B-MAD+Beads for software development)

 It also has 4 internal modules:
 - **core**: Orchestration hub (lr-orchestrator "Aether", lr-tracker "Navi")
 - **lrb**: Linkright Builder (meta-module for building Linkright itself)
 - **tea**: Testing & QA assurance
 - **cis**: Creative Intelligence System

 ### What is B-MAD?
 B-MAD (Brain-centric Modular Agile Development) is the open-source methodology
 framework that Linkright's architecture is inspired by. It is the gold standard
 for agentic workflow design. Linkright BORROWS B-MAD's architectural patterns
 but is NOT a B-MAD module — zero B-MAD identity in outputs.

 ### The Relationship
 Linkright adopts B-MAD's structural patterns (atomic steps, data/templates
 separation, three-phase workflows, agent personas, JIT loading) but enhances
 them with:
 - Beads (Dolt-backed task tracking with dependency graphs)
 - ChromaDB (semantic vector memory)
 - MongoDB (structured career signal storage)
 - Agent Mail (multi-agent coordination)
 - 33 IDE integrations via unified manifest (vs B-MAD's 19)

 ### Current Quality State (Release 4 Audit)
 CRITICAL GAPS:
 - crit-1: 8 zero-byte files (mongodb-config.yaml, chromadb-config.yaml,
           flex workflow files)
 - crit-2: workflow-manifest.csv is empty (header only, 0 workflow rows)
 - crit-3: 173 closed Beads issues with no acceptance evidence
 - crit-4: Beads not wired as source-of-truth in agent workflows
 - crit-5: Context Z phases D–M (40+ step files) unimplemented

 MAJOR GAPS:
 - major-1: Atomicity violations (step-04 "align-signals" has 5 sub-operations)
 - major-2: Missing ADRs (Architecture Decision Records)
 - major-3: Agent XML depth 15–60 lines; target ≥40 lines each
 - major-4: Broken manifest cross-references
 - major-5: TEA knowledge base is empty
 - major-6: No quality gates (pre/post execution validation)
 - major-7: Template variable inconsistency ({{VAR}} vs ${VAR} vs $VAR)
 - major-8: Flex workflows mostly stub/empty
 - major-9: Squick module not fully implemented

 ---

 ## CRITICAL PATH RULES

 ### context/ is READ-ONLY
 The directory /Users/satvikjain/Downloads/sync/context/ is READ-ONLY.
 Agents MUST NOT modify any file under context/.
 Agents read from context/ to understand the systems.
 Agents write ONLY to /Users/satvikjain/Downloads/sync/files/.

 ### files/ Output Structure
 ALL output files MUST be placed inside files/ with this structure:
 files/
 ├── audit/           ← Phase 1 outputs
 ├── architecture/    ← Phase 2 outputs
 ├── planning/        ← Phase 3 outputs
 └── implementation/  ← Phase 4 outputs
 NO individual files at the root of files/. ALWAYS use subdirectories.

 ### Beads for ALL Task Tracking
 Use bd (Beads Go v0.59.0+) for all issue tracking.
 NEVER use TodoWrite, markdown checklists, or text files for task tracking.
 All epics/features/tasks MUST be created in Beads before engineers start work.

 ---

 ## STEP 1: AGENT REGISTRATION

 Register all 7 agents in Agent MCP Mail. The server is running at:
 http://127.0.0.1:8765/api/
 Bearer token: [available in ~/.claude/settings.json]

 Register each agent using create_agent_identity or register_agent:

 ### Agent 1: Cipher (B-MAD Specialist)
 - agent_name: lr-bmad-specialist
 - display_name: Cipher
 - description: B-MAD Architecture Specialist. Encyclopedic knowledge of the
   complete B-MAD methodology — every file pattern, naming convention, agent
   structure, workflow type, step file format, config YAML schema, IDE
   integration pattern, workflow execution engine (workflow.xml), CSV manifests,
   cross-reference chains, JIT loading principle, facilitation-first philosophy,
   YOLO mode, success/failure metrics in step files, and the deep module
   architecture (bmm, bmb, cis, gds, tea). Cipher knows WHY B-MAD is structured
   the way it is, not just what the structure is.
 - role: specialist
 - capabilities: [architecture-analysis, pattern-recognition, gap-identification]

 ### Agent 2: Nova (Linkright Specialist)
 - agent_name: lr-linkright-specialist
 - display_name: Nova
 - description: Linkright Architecture Specialist. Deep expert on the entire
   Linkright universe — all 7 modules (core, sync, flex, squick, lrb, tea, cis),
   all 29+ agents with their personas and XML structures, all workflow step files
   (including the 64-step jd-optimize flagship), the 3-phase workflow design
   (steps-c/e/v), memory sidecar architecture, Beads integration patterns,
   ChromaDB + MongoDB config, Agent Mail protocol, the 5 CSV manifests, IDE
   integration via unified manifest, and all 4 Release audit histories. Nova
   knows the current quality state, every gap, and every architectural decision
   made across Releases 1-4.
 - role: specialist
 - capabilities: [architecture-analysis, domain-knowledge, linkright-expertise]

 ### Agent 3: Prometheus (B-MAD Architect)
 - agent_name: lr-bmad-architect
 - display_name: Prometheus
 - description: B-MAD Architect. Takes B-MAD's best architectural practices and
   translates them into prescriptive, actionable solutions for Linkright. Knows
   exactly how B-MAD handles: step atomicity (one cognitive operation per step),
   success/failure metrics (explicit checklists in every step), the workflow
   execution engine (workflow.xml as shared "OS"), JIT loading (nothing preloaded
   until user selects), facilitation-first (agents facilitate, humans drive),
   YOLO mode (autonomous completion), resumable workflows (progress in YAML
   frontmatter), data/templates separation, fuzzy command matching, and the
   CSV-based manifest/index system. Prometheus can specify exact file templates,
   YAML schemas, and XML structures that Linkright should adopt.
 - role: architect
 - capabilities: [solution-design, bmad-patterns, technical-specification]

 ### Agent 4: Athena (Linkright Architect)
 - agent_name: lr-linkright-architect
 - display_name: Athena
 - description: Linkright Architect. Guardian of Linkright's identity and
   constraints. Knows that Linkright is NOT a B-MAD module (zero B-MAD identity),
   that it is domain-specific (career operations), and that some B-MAD patterns
   are deliberately excluded (e.g., role-specific memory sidecars replaced by
   MongoDB+ChromaDB, IDE command duplication replaced by unified manifest).
   Athena validates every proposed solution against: (1) Does it serve career
   operations use cases? (2) Does it maintain Linkright identity? (3) Does it
   add complexity without proportional value? (4) Is it consistent with the
   Beads+ChromaDB+MongoDB infrastructure? Athena stress-tests every assumption.
 - role: architect
 - capabilities: [solution-validation, linkright-constraints, stress-testing]

 ### Agent 5: Phoenix (Project Manager)
 - agent_name: lr-project-manager
 - display_name: Phoenix
 - description: Project Manager and Beads Orchestrator. Takes the final
   architectural solutions from Prometheus and Athena and decomposes them into
   a complete, executable Beads hierarchy: Epics → Features → User Stories →
   Tasks → Atomic Subtasks (and bugs where applicable). Uses bd commands
   exclusively for issue tracking. Creates ALL beads issues before handing off
   to engineers. Writes a narrative implementation-plan.md explaining phases,
   rationale, and sequence. Assigns odd-numbered epics to Vulcan, even-numbered
   to Hephaestus. Does NOT write code.
 - role: pm
 - capabilities: [planning, beads-orchestration, dependency-mapping]

 ### Agent 6: Vulcan (Engineer 1)
 - agent_name: lr-engineer-1
 - display_name: Vulcan
 - description: Senior Engineer specializing in Linkright system files — agent
   XML normalization, step file creation, YAML config population, manifest
   repair, workflow completion. Works in parallel with Hephaestus on
   odd-numbered epics assigned by Phoenix. Claims Beads issues before starting,
   closes with evidence after completing. Coordinates with Hephaestus via
   Agent Mail for any file conflicts. Writes progress to
   files/implementation/engineer-1-log.md.
 - role: engineer
 - capabilities: [implementation, file-editing, yaml-authoring, markdown-authoring]

 ### Agent 7: Hephaestus (Engineer 2)
 - agent_name: lr-engineer-2
 - display_name: Hephaestus
 - description: Senior Engineer specializing in Linkright workflow design —
   step file authoring, ADR creation, quality gate implementation, TEA knowledge
   base population, Beads wiring in agent workflows. Works in parallel with
   Vulcan on even-numbered epics assigned by Phoenix. Claims Beads issues before
   starting, closes with evidence after completing. Coordinates with Vulcan via
   Agent Mail for any file conflicts. Writes progress to
   files/implementation/engineer-2-log.md.
 - role: engineer
 - capabilities: [workflow-design, step-authoring, adr-writing, qa-patterns]

 ---

 ## STEP 2: PHASE 1 — SPECIALIST AUDIT (Run Cipher + Nova in parallel)

 ### Message to Cipher (lr-bmad-specialist)
 Subject: PHASE-1: B-MAD Architecture Deep Dive
 From: Orchestrator
 To: lr-bmad-specialist

 Your Mission

 Read the complete B-MAD methodology at:
   /Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/

 Produce a comprehensive architecture report at:
   /Users/satvikjain/Downloads/sync/files/audit/bmad-deep-dive.md

 What to Cover (all sections mandatory)

 Section 1: Agent File Architecture

 - Exact XML structure of a B-MAD agent file (frontmatter +  +
  +  + )
 - How activation steps are numbered and what MUST happen in each
 - Menu item type system (workflow=, exec=, action=, data=)
 - Fuzzy command matching pattern
 - What makes an agent file complete (minimum viable vs excellent)
 - Agent depth: what does ≥40 lines look like in practice?

 Section 2: Workflow File Architecture (both types)

 - Type 1: Markdown workflows (direct-execution)
 - Type 2: YAML-config + workflow.xml engine (complex)
 - Exact workflow.yaml schema with all fields
 - How {variable} and {config_source}:field resolution works

 Section 3: Step File Architecture

 - Complete anatomy of a step file (YAML frontmatter + body sections)
 - The step chaining mechanism (nextStepFile, continueStepFile)
 - Mandatory sections: INPUT, OUTPUT, DEPENDENCIES, SUCCESS metrics, FAILURE anti-metrics
 - How steps-c vs steps-e vs steps-v are structurally different
 - The step-01/step-01b session continuity pattern
 - Atomicity rule: one cognitive operation per step (examples of right vs wrong)

 Section 4: Config System

 - Module config.yaml schema
 - Global config inheritance chain
 - Variable resolution order

 Section 5: Manifest/Index System

 - All 5 CSV manifests and their schemas (headers + meaning of each column)
 - module-help.csv structure and purpose
 - How manifests power IDE command palettes

 Section 6: JIT Loading Principle

 - Exact rule: what must NOT be preloaded, what MUST be loaded JIT
 - How this keeps context windows clean
 - The facilitation-first rule and why it matters

 Section 7: Quality Patterns

 - Success/failure metrics in step files (exact format)
 - YOLO mode (how it works, what it bypasses)
 - Resumable workflows (how progress is saved and detected)
 - Advanced Elicitation + Party Mode integration in steps

 Section 8: Cross-Reference Chain

 - The full chain from IDE command → agent file → config → workflow → steps
 - How {project-root} resolves
 - How step files reference templates and data files

 Section 9: What Makes B-MAD EXCELLENT

 - Top 10 patterns that most frameworks lack
 - Why these patterns matter for quality, reliability, and user experience
 - Direct quotes from B-MAD files illustrating best practice

 Section 10: B-MAD's Relevance to Linkright's Gaps

 - Map each of Linkright's known gaps (from crit-1 to major-9) to the specific
 B-MAD pattern that addresses it
 - Be specific: "For atomicity violations, B-MAD uses X pattern at Y file"

 ---
 Collaboration Step

 Once your report is written, send me (Orchestrator) a message:
   Subject: PHASE-1-DONE: Cipher B-MAD audit complete
   Body: Summary of top 5 most actionable insights for Linkright

 ### Message to Nova (lr-linkright-specialist)
 Subject: PHASE-1: Linkright Architecture Deep Dive
 From: Orchestrator
 To: lr-linkright-specialist

 Your Mission

 Read the complete Linkright system at:
   /Users/satvikjain/Downloads/sync/context/linkright/_lr/

 Also read:
   /Users/satvikjain/Downloads/sync/context/linkright/docs/Audit artifacts/LINKRIGHT-BMAD-AUDIT.md
   /Users/satvikjain/Downloads/sync/context/linkright/releases/Release_4.md
   /Users/satvikjain/Downloads/sync/context/linkright/docs/project knowledge/LR-MASTER-ORCHESTRATION.md

 Produce a comprehensive report at:
   /Users/satvikjain/Downloads/sync/files/audit/linkright-deep-dive.md

 What to Cover (all sections mandatory)

 Section 1: Module Architecture Map

 - Complete map of all 7 modules (core, sync, flex, squick, lrb, tea, cis)
 - For each module: agents, workflows, knowledge files, config, teams
 - Which modules are complete, partial, or stub
 - The core hub role (lr-orchestrator + lr-tracker) vs domain modules

 Section 2: Agent Architecture Current State

 - List all 29 agents with: persona name, XML completeness (lines, sections),
 sidecar status, customize.yaml status
 - Which agents meet ≥40 line depth? Which fall short?
 - XML structure consistency across agents (what varies that shouldn't)
 - Memory sidecar architecture: instructions.md + memories.md pattern

 Section 3: Workflow Architecture Current State

 - All 17 workflows indexed (module, path, step count, phase coverage)
 - Which are fully decomposed? Which are stubs?
 - Step phase coverage: which have steps-c, steps-e, steps-v?
 - The jd-optimize 64-step workflow as the gold standard — what makes it good
 - Gap: which workflows lack step-01-load-session-context.md or
 step-01b-resume-if-interrupted.md?

 Section 4: Step File Quality Audit

 - Sample 15 step files across modules
 - For each: does it have INPUT/OUTPUT/DEPENDENCIES/SUCCESS/FAILURE sections?
 - Atomicity check: any steps doing multiple cognitive operations?
 - Template variable consistency: {{VAR}} vs ${VAR} vs $VAR (find all 3 variants)
 - Naming convention consistency: steps/ vs steps-c/e/v/ mixed?

 Section 5: Manifest and Config State

 - All 5 CSV manifests: current row count vs expected
 - workflow-manifest.csv: confirm 0 workflow rows (critical gap)
 - agent-manifest.csv: are all 29 agents listed?
 - Zero-byte files: find ALL zero-byte files (not just the 8 known ones)
 - lr-config.yaml: are [USER_NAME] etc. still placeholders?

 Section 6: Beads Integration State

 - Where do agent workflows currently reference bd commands?
 - Which workflows have step-01b-resume-if-interrupted.md (Beads check)?
 - Which workflows should have bd ready / bd update / bd close calls but don't?
 - What would a fully Beads-wired workflow look like?

 Section 7: Linkright's Genuine Advantages Over B-MAD

 - Be specific and honest: where is Linkright BETTER than B-MAD?
 - Beads integration, ChromaDB semantic memory, Agent Mail coordination,
 unified IDE manifest, domain specificity
 - These must be preserved and amplified, not lost in "alignment"

 Section 8: Current Gap Severity Matrix

 Build a table with ALL gaps ranked by:
 - Severity (P0=blocks workflows, P1=degrades quality, P2=maintenance debt)
 - Blast radius (how many agents/workflows/modules are affected)
 - Fix complexity (hours)
 - Fix priority (must fix R4, nice to have R5, backlog)

 Include the 18 tasks from Release_4.md plus any NEW gaps you discover.

 Section 9: The Squick Opportunity

 - Squick is "B-MAD+Beads for enterprise software development"
 - Current state: 7 agents defined, workflows sketched, not fully implemented
 - What would a fully implemented Squick look like?
 - What does B-MAD's bmm module have that Squick lacks?

 Section 10: What Linkright Needs to EXCEED B-MAD

 - Not just match — EXCEED. What would "10x B-MAD" look like for career ops?
 - Think: Beads-aware step files that auto-create issues, ChromaDB queries
 built into steps, Agent Mail handoffs in workflow.yaml, session resumption
 via Beads (not just file-based), automated quality gates via CI script

 ---
 Collaboration Step

 Once your report is written, wait for Cipher's report confirmation.
 Then read files/audit/bmad-deep-dive.md and produce the gap analysis:
   /Users/satvikjain/Downloads/sync/files/audit/gap-analysis.md

 Gap Analysis Structure

 Section 1: Critical Gaps (P0) — must fix before Release 4 ships

 Section 2: Major Gaps (P1) — must fix in Release 4 timeline

 Section 3: Enhancement Opportunities (P2) — exceed B-MAD, not just match

 Section 4: B-MAD Patterns Linkright Should Adopt (with rationale for each)

 Section 5: B-MAD Patterns Linkright Should NOT Adopt (with rationale for each)

 Section 6: Linkright-Original Patterns to Amplify (what to double down on)

 ---
 After Gap Analysis

 Send Orchestrator:
   Subject: PHASE-1-DONE: Nova + gap analysis complete
   Body: Critical path summary — top 3 blocking issues

 ---

 ## STEP 3: PHASE 2 — ARCHITECTURE SOLUTIONS (After Phase 1 complete)

 ### Trigger: Both Cipher AND Nova have sent PHASE-1-DONE messages.

 ### Message to Prometheus (lr-bmad-architect)
 Subject: PHASE-2: Prescriptive B-MAD Solutions for Linkright
 From: Orchestrator
 To: lr-bmad-architect

 Your Mission

 Read:
   /Users/satvikjain/Downloads/sync/files/audit/gap-analysis.md
   /Users/satvikjain/Downloads/sync/files/audit/bmad-deep-dive.md
   /Users/satvikjain/Downloads/sync/context/bmad-method/_bmad/ (as needed)

 Produce:
   /Users/satvikjain/Downloads/sync/files/architecture/bmad-proposals.md

 What to Produce

 For EACH gap in the gap-analysis.md, write a prescriptive B-MAD-inspired solution:

 Format per solution:

 ## Solution for: [gap-id] [gap-name]

 ### B-MAD Pattern Being Applied
 [which exact B-MAD pattern, from which file, with quote]

 ### Prescriptive Implementation for Linkright
 [step-by-step: exactly what to create, modify, or delete]
 [include exact YAML schemas, XML templates, file naming patterns]
 [include a minimal working example as code block]

 ### Success Criteria
 [how to verify this solution is correctly implemented]

 ### Assumption Flagged for Athena to Stress-Test
 [what assumption in this solution might not fit Linkright's constraints]

 Priority order: P0 first, then P1, then enhancement opportunities.

 Special Sections Required:

 A: The Atomicity Standard

 Write a definitive reference for what "atomic step" means in Linkright context.
 Include: 3 examples of non-atomic steps (anti-patterns) and how to split them.
 Include: The exact step file template that all Linkright steps should follow.

 B: The Agent XML Standard

 Write the minimum-viable agent XML template for Linkright (≥40 lines).
 Cover: all required XML sections, what goes in each, exact format.
 Include: the activation sequence (what steps are mandatory in every agent).

 C: The Manifest Repair Standard

 How should workflow-manifest.csv be populated?
 Write the exact CSV schema + 3 example rows for Linkright workflows.

 D: The Beads-Wired Workflow Pattern

 How should B-MAD's "resumable workflow" pattern be enhanced with Beads?
 Design: the Beads-aware step-01b-resume-if-interrupted.md template that
 checks bd list --status=in_progress for this workflow's Beads issue.

 E: Quality Gates Pattern

 B-MAD has success/failure metrics per step. Design Linkright's enhanced version:
 - Pre-execution gate (validation before step runs)
 - Post-execution gate (validation after step completes)
 - Beads close gate (what evidence must exist before bd close)

 ---
 After writing proposals, send Nova a message:
   Subject: PHASE-2-PROPOSALS-READY: Please stress-test
   Body: Paste your top 5 assumptions that need Athena's validation

 ### Message to Athena (lr-linkright-architect)
 Subject: PHASE-2: Validate + Stress-Test B-MAD Proposals
 From: Orchestrator
 To: lr-linkright-architect

 Your Mission

 Read:
   /Users/satvikjain/Downloads/sync/files/audit/gap-analysis.md
   /Users/satvikjain/Downloads/sync/files/audit/linkright-deep-dive.md
   /Users/satvikjain/Downloads/sync/context/linkright/docs/project knowledge/LR-MASTER-ORCHESTRATION.md

 Wait for Prometheus's proposals, then read:
   /Users/satvikjain/Downloads/sync/files/architecture/bmad-proposals.md

 Produce two files:
   /Users/satvikjain/Downloads/sync/files/architecture/linkright-constraints.md
   /Users/satvikjain/Downloads/sync/files/architecture/stress-test-log.md

 File 1: linkright-constraints.md

 Section 1: What Linkright CANNOT adopt from B-MAD (with rationale)

 Section 2: What Linkright MUST adapt (not copy verbatim) from B-MAD

 Section 3: What Linkright should INVENT (B-MAD has nothing equivalent)

 Section 4: Non-negotiable Linkright Constraints

 - Zero B-MAD identity in outputs
 - Career operations domain specificity (career signals, JD optimization)
 - Beads as source-of-truth (not just manual checkpoints)
 - MongoDB+ChromaDB for memory (not file-based sidecars for all memory)
 - Agent Mail for coordination (Prometheus can't just copy B-MAD's single-agent model)
 - Romanized Hindi communication for Satvik
 - Single-user system (not team-based like B-MAD)

 File 2: stress-test-log.md

 For EACH proposal from Prometheus, run this stress test:

 ## Stress Test: [proposal-id]

 ### Assumption Being Tested
 [what does this proposal assume about Linkright?]

 ### Challenge
 [the strongest counterargument — why this might NOT work for Linkright]

 ### Edge Case
 [what breaks if this solution is applied naively?]

 ### Verdict
 [ADOPT AS-IS / ADOPT WITH MODIFICATIONS / REJECT / DEFER]

 ### Modified Version (if applicable)
 [the Linkright-native version of this proposal]

 ---
 After stress testing, meet Prometheus via Agent Mail to agree on final solutions.
 Together produce:
   /Users/satvikjain/Downloads/sync/files/architecture/final-solutions.md

 final-solutions.md Structure

 Agreed Solutions (P0) — sorted by implementation order

 Agreed Solutions (P1) — sorted by implementation order

 Enhancement Roadmap (P2)

 Rejected Proposals (with reasons)

 Open Questions for Satvik (any human decision points)

 ---
 Send Orchestrator when complete:
   Subject: PHASE-2-DONE: Architecture solutions finalized
   Body: Count of P0/P1/P2 solutions, any open questions for Satvik

 ---

 ## STEP 4: PHASE 3 — PLANNING (After Phase 2 complete)

 ### Trigger: Athena sends PHASE-2-DONE message.

 ### Message to Phoenix (lr-project-manager)
 Subject: PHASE-3: Full Beads Implementation Plan
 From: Orchestrator
 To: lr-project-manager

 Your Mission

 Read:
   /Users/satvikjain/Downloads/sync/files/architecture/final-solutions.md
   /Users/satvikjain/Downloads/sync/files/audit/gap-analysis.md

 Produce:
   /Users/satvikjain/Downloads/sync/files/planning/implementation-plan.md
   /Users/satvikjain/Downloads/sync/files/planning/beads-breakdown.md

 And create the COMPLETE Beads hierarchy using bd commands.

 Phase 3A: Write implementation-plan.md

 Structure:
 Overview: What we're fixing and why

 Phase 1: Critical Fixes (P0) — sequence + rationale

 Phase 2: Major Improvements (P1) — sequence + rationale

 Phase 3: Enhancement Work (P2) — sequence + rationale

 Engineer Assignment Strategy

 - Vulcan (Engineer 1): odd-numbered epics
 - Hephaestus (Engineer 2): even-numbered epics
 - Conflict protocol: both claim same file → send Agent Mail to Orchestrator
 Success Definition: what does "done" look like for this mission?

 Phase 3B: Create Beads Hierarchy

 Step 1: Create root epic

 bd create --title="LR Quality Mission: B-MAD Alignment & Excellence"
   --description="Comprehensive quality improvement mission to bring Linkright to exceed B-MAD standards. Covers critical fixes (P0), major
 improvements (P1), and enhancement opportunities (P2) identified by 4-agent audit+architecture team."
   --type=epic --priority=0

 Step 2: Create feature per P0 critical gap

 For each critical gap (crit-1 through crit-5), create a feature:
 bd create --title="[gap-id]: [gap-name]"
   --description="[why this is critical, what breaks without it, acceptance criteria]"
   --type=feature --parent= --priority=0

 Step 3: Create feature per P1 major gap

 Similar for major-1 through major-9.

 Step 4: Create user stories per feature

 Each feature gets 2-5 user stories. User story format:
 "As [role], I want [capability] so that [outcome]"

 Step 5: Create atomic tasks per user story

 Tasks must be: single agent, single file or single operation, completable
 in <2 hours.

 Step 6: Create bugs for zero-byte files

 For each zero-byte file found, create a bug issue:
 bd create --title="BUG: [filename] is zero-byte — [module]"
   --type=bug --priority=0 --parent=

 Step 7: Wire dependencies

 Use bd dep add to create the DAG:
 bd dep add
 Example: step-file-creation depends on atomicity-standard being written first.
 Run bd dep tree  to verify DAG is acyclic.

 Step 8: Assign epics

 Odd-numbered epics → Vulcan (bd update  --assignee=lr-engineer-1)
 Even-numbered epics → Hephaestus (bd update  --assignee=lr-engineer-2)

 Phase 3C: Write beads-breakdown.md

 A formatted tree showing the complete Beads hierarchy:
 - Epic IDs and titles
 - Feature IDs and titles under each epic
 - Story IDs and titles under each feature
 - Task IDs and titles under each story
 - Bug IDs where applicable
 - Dependency relationships
 - Assignee for each epic

 Handoff Protocol

 Once ALL Beads issues are created and verified (bd dep tree shows valid DAG):

 Send to Vulcan:
   Subject: PHASE-3-HANDOFF: Your implementation brief
   Body: List of your assigned epic IDs + brief + key dependencies to be aware of

 Send to Hephaestus:
   Subject: PHASE-3-HANDOFF: Your implementation brief
   Body: List of your assigned epic IDs + brief + key dependencies

 Send to Orchestrator:
   Subject: PHASE-3-DONE: Planning complete, engineers briefed
   Body: Total issue count, epic breakdown, estimated scope

 CRITICAL CONSTRAINT

 Do NOT hand off to engineers until:
 - ALL Beads issues created ✓
 - All dependencies wired (DAG verified acyclic) ✓
 - implementation-plan.md written ✓
 - beads-breakdown.md written ✓
 - Both engineers briefed via Agent Mail ✓

 ---

 ## STEP 5: PHASE 4 — IMPLEMENTATION (After Phase 3 complete)

 ### Trigger: Phoenix sends PHASE-3-DONE message.

 ### Message to Vulcan (lr-engineer-1)
 Subject: PHASE-4: Implementation — Your Assigned Epics
 From: Orchestrator
 To: lr-engineer-1

 Your Mission

 Implement all solutions assigned to you in the Beads plan.
 Work in parallel with Hephaestus. Coordinate via Agent Mail for any file conflicts.

 Protocol

 Before starting each task:

 1. bd update  --status=in_progress
 2. Reserve the files you'll modify:
 file_reservation_paths(project_key=/Users/satvikjain/Downloads/sync,
   agent_name=lr-engineer-1, paths=["path/to/file/**"],
   exclusive=true, reason="")

 After completing each task:

 1. Verify success criteria from files/architecture/final-solutions.md
 2. bd close  --reason="[evidence of completion]"
 3. Write one line to files/implementation/engineer-1-log.md:
 [timestamp]  DONE: [what was done] → [file path]
 4. Release file reservations if no longer needed

 When you complete an epic:

 1. Run bd close
 2. Send Orchestrator: Subject: EPIC-DONE: [epic-id] [title]

 If you need Hephaestus to wait (file conflict):

 send_message(to=["lr-engineer-2"],
   subject="FILE-CONFLICT: [file-path]",
   body_md="I'm working on [file]. Please wait until I release reservation.",
   ack_required=true)

 Quality Standards

 Every file you create/modify must:
 - Follow the standards in files/architecture/final-solutions.md
 - Pass the success criteria defined for its gap
 - Not break any other file that references it
 - Have consistent template variable syntax ({{VAR}} format — pick one)
 - If it's a step file: include INPUT, OUTPUT, DEPENDENCIES, SUCCESS, FAILURE sections
 - If it's an agent file: be ≥40 lines with complete XML sections
 - If it's a config YAML: have all required fields populated (no zero-byte)

 Send Orchestrator when all your epics are done:

   Subject: PHASE-4-VULCAN-DONE: All assigned epics complete
   Body: Total tasks completed, files modified, any issues encountered

 ### Message to Hephaestus (lr-engineer-2)
 Subject: PHASE-4: Implementation — Your Assigned Epics
 From: Orchestrator
 To: lr-engineer-2

 Your Mission

 Same as Vulcan's brief but for even-numbered epics.
 [Same protocol as Vulcan — refer to implementation protocol above]

 Your Specialization Focus

 You are particularly responsible for:
 - ADR (Architecture Decision Record) creation
 - TEA knowledge base population (12+ files)
 - Quality gates implementation (pre/post execution validation steps)
 - Workflow-manifest.csv repair and population
 - Beads wiring in agent workflow files (step-01b templates)
 - Flex workflow completion (content-automation workflow stubs)

 These require workflow design expertise that is your specialty.

 Send Orchestrator when all your epics are done:

   Subject: PHASE-4-HEPHAESTUS-DONE: All assigned epics complete
   Body: Total tasks completed, files modified, any issues encountered

 ---

 ## STEP 6: MISSION COMPLETION

 ### Trigger: Both Vulcan and Hephaestus send PHASE-4-*-DONE messages.

 ### Final Verification Checklist (run this before declaring mission complete):

 ```bash
 # 1. Zero-byte files check
 find /Users/satvikjain/Downloads/sync/context/linkright/_lr \
   -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.csv" \) -size 0 \
   | grep -v ".gitkeep"
 # Expected: 0 results (other than intentional .gitkeep)

 # 2. Manifest check
 wc -l /Users/satvikjain/Downloads/sync/context/linkright/_lr/_config/workflow-manifest.csv
 # Expected: >5 lines (header + at least 4 workflow rows)

 # 3. Beads state
 bd stats
 # Expected: 0 open critical/major issues

 # 4. Agent XML depth check (all agents ≥40 lines)
 for f in $(find /Users/satvikjain/Downloads/sync/context/linkright/_lr -name "*.md" -path "*/agents/*"); do
   lines=$(wc -l < "$f");
   if [ $lines -lt 40 ]; then echo "SHORT: $f ($lines lines)"; fi
 done
 # Expected: 0 results

 # 5. files/ directory structure check
 ls /Users/satvikjain/Downloads/sync/files/
 # Expected: audit/ architecture/ planning/ implementation/ only

 Declare mission complete:

 Send to all agents:
   Subject: MISSION-COMPLETE: Linkright Quality Mission Done
   Body: Summary of all completed work, verification results, open items for Satvik

 Then run git commit:
   git add files/ context/linkright/
   git commit -m "feat(quality): Linkright multi-agent quality mission complete

 - 7-agent audit+architecture+implementation team
 - All P0 critical gaps resolved
 - All P1 major improvements implemented
 - Full Beads traceability established
 - files/audit/ files/architecture/ files/planning/ files/implementation/ generated

   Co-Authored-By: Claude Haiku 4.5 noreply@anthropic.com"
   git push

 ---

 ## Things to Verify Before Running This Prompt

 1. Agent Mail server is live: `curl http://localhost:8765/health/liveness`
 2. Beads is working: `bd stats`
 3. files/ directory exists: `ls /Users/satvikjain/Downloads/sync/files/`
 4. context/ is NOT being modified accidentally (add a sanity check at start)
 5. Bearer token is available in `~/.claude/settings.json`

 ---

 ## How to Run This Prompt

 Paste the full prompt (from "LINKRIGHT MULTI-AGENT QUALITY MISSION" to end of
 STEP 6) as a single Claude Code session message. Claude Code will:
 1. Load all Agent MCP Mail tools
 2. Register all 7 agents
 3. Send Phase 1 messages to Cipher + Nova
 4. Monitor inbox until both send PHASE-1-DONE
 5. Trigger Phase 2, then Phase 3, then Phase 4 in sequence
 6. Run final verification and commit

 The orchestration is sequential between phases but parallel within phases.
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌