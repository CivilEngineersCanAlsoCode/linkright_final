# Linkright Ultra-Atomic Workflow Breakdown

## Context

Complete ordered execution map of every agent, workflow, and atomic step in the Linkright system — from cold start to final artifact output. This serves as the definitive reference for Release 3 implementation planning.

---

## SYSTEM INITIALIZATION (Cold Start)

```
0.1  READ  lr-config.yaml — load user_name, communication_language, output_folder, module registry
0.2  READ  agent-manifest.csv — load 32 agent registrations (id, name, module, path, sidecar_path)
0.3  READ  workflow-manifest.csv — load 29 workflow registrations (id, name, module, path)
0.4  READ  files-manifest.csv — load 630 file integrity hashes
0.5  ACTIVATE  lr-orchestrator (Aether) — central brain, route user intent to module
0.6  ACTIVATE  lr-tracker (Navi) — governance, MongoDB init (users, career_signals, jd_profiles)
0.7  PRESENT  module menu to user → route to workflow
```

---

## 1. CORE MODULE (11 workflows, 32 agents)

### 1.1 SETUP-EXECUTION (First-Run Bootstrap)

```
1.1.1  SCAN   _lr/* for all workflow directories
1.1.2  OUTPUT execution-graph.md (visual dependency graph)
1.1.3  CHECK  `bd` (beads) CLI availability
1.1.4  RUN    `bd onboard` if beads not initialized
1.1.5  CREATE Epic: "Linkright Session [Date]" in beads
1.1.6  PRESENT module introductions (Squick, Sync, Flex, CIS, Core)
1.1.7  ASK    "What would you like to build or achieve today?"
1.1.8  WAIT   for user input
1.1.9  ROUTE  to appropriate module workflow
1.1.10 UPDATE beads epic with specific tasks
```

### 1.2 CONTEXT-GEN (Generate CONTEXT.md)

```
1.2.1  READ   workflow.yaml — config_source, installed_path
1.2.2  ASK    user which module path to index
1.2.3  SCAN   target module for all .md files
1.2.4  IDENTIFY all agents (*.agent.md) in module
1.2.5  IDENTIFY all workflows (workflow.yaml/workflow.md) in module
1.2.6  EXTRACT names and descriptions from YAML/Markdown frontmatter
1.2.7  VALIDATE discovered list with user
1.2.8  GENERATE CONTEXT.md using context.template.md
1.2.9  WRITE  CONTEXT.md to module root
```

### 1.3 BRAINSTORMING

```
1.3.1  READ   workflow.yaml + workflow.md
1.3.2  DEFINE session goal with user
1.3.3  SELECT ideation techniques (from brain-methods.csv)
1.3.4  IDENTIFY participants (agents to involve)
1.3.5  VERIFY setup documentation complete
1.3.6  EXECUTE selected brainstorming technique(s)
1.3.7  RECORD all ideas without judgment
1.3.8  MAINTAIN parking lot for out-of-scope items
1.3.9  ITERATE with refinement prompts
1.3.10 CATEGORIZE similar ideas into clusters
1.3.11 PRIORITIZE by feasibility, impact, alignment
1.3.12 MAP to concrete project tasks
1.3.13 CREATE beads issues for selected items
1.3.14 OUTPUT ideation_report.md
```

### 1.4 LR-DISCUSS (Multi-Agent Discussion)

```
1.4.1  READ   agent-manifest.csv
1.4.2  ASK    user which agents to involve
1.4.3  LOAD   persona files for selected agents
1.4.4  VERIFY all selected agents loaded successfully
1.4.5  AUTO-ADD lr-orchestrator as moderator
1.4.6  PRESENT opening statement of discussion goal
1.4.7  MODERATE discussion (cross-talk prevention)
1.4.8  CAPTURE professional signals during dialogue
1.4.9  LOOP   discussion rounds until goal met
1.4.10 PROVIDE summary of key points
1.4.11 UPDATE/CREATE beads tasks from outcomes
1.4.12 CLEANUP transient session variables
1.4.13 CLOSE  session formally
```

### 1.5 PARTY-MODE (Same as LR-Discuss, simplified)

```
1.5.1  READ   agent-manifest.csv
1.5.2  ASK    user agent selection
1.5.3  AUTO-ADD lr-orchestrator moderator
1.5.4  VERIFY persona files loaded
1.5.5  PRESENT opening statement
1.5.6  MODERATE multi-agent discussion
1.5.7  TRACK  signals throughout
1.5.8  SUMMARIZE discussion points
1.5.9  UPDATE beads state
1.5.10 CLEANUP context
1.5.11 RETURN to main orchestrator
```

### 1.6 CREATE-STORY (Ultimate Context Engine)

```
1.6.1  READ   workflow.yaml + instructions.xml (46-step XML)
1.6.2  DETERMINE target story — auto-discover from sprint-status.yaml OR manual
1.6.3  LOAD   sprint-status.yaml, find next `ready-for-dev` story
1.6.4  READ   all core artifacts exhaustively (PRD, architecture, epics)
1.6.5  EXTRACT story-relevant requirements from architecture
1.6.6  ANALYZE previous story learnings from git history
1.6.7  EXTRACT git intelligence (work patterns, commit style)
1.6.8  RUN    web research for latest technical specifics
1.6.9  COMPILE comprehensive story file with:
         - Context from all artifacts
         - Technical requirements
         - Acceptance criteria
         - Developer guidance
         - Related code paths
1.6.10 VALIDATE story against checklist.md
1.6.11 UPDATE sprint-status.yaml → mark story as `ready-for-dev`
1.6.12 OUTPUT story file to disk
```

### 1.7 DEV-STORY (Implementation Engine — NEVER STOPS)

```
1.7.1  READ   workflow.yaml + instructions.xml (10-step XML)
1.7.2  FIND   next ready story from sprint-status.yaml
1.7.3  LOAD   full project context (all artifacts, all configs)
1.7.4  CHECK  for previous code review context (review continuation)
1.7.5  MARK   story as `in-progress` in sprint-status.yaml
1.7.6  FOR EACH task in story:
         1.7.6.1  READ   task acceptance criteria
         1.7.6.2  IMPLEMENT code (red-green-refactor cycle)
         1.7.6.3  WRITE  unit tests
         1.7.6.4  WRITE  integration tests
         1.7.6.5  WRITE  E2E tests if applicable
         1.7.6.6  RUN    full test suite
         1.7.6.7  VALIDATE all ACs satisfied
         1.7.6.8  MARK   task complete
1.7.7  VERIFY all story tasks complete
1.7.8  RUN    Definition of Done checklist
1.7.9  MARK   story as `review` in sprint-status.yaml
1.7.10 COMMUNICATE completion to user with next steps
```

### 1.8 DOCUMENT-PROJECT (Multi-Mode Documentation)

```
1.8.1  CHECK  for resume state file (interrupted session?)
1.8.2  CHECK  for existing documentation
1.8.3  DETERMINE workflow mode:
         - initial_scan → full-scan-instructions.md
         - full_rescan → full-scan-instructions.md
         - deep_dive → deep-dive-instructions.md
1.8.4  ROUTE  to selected sub-workflow
1.8.5  SCAN   project directory structure
1.8.6  ANALYZE source files, APIs, data models
1.8.7  GENERATE documentation suite:
         - index.md
         - project-overview.md
         - source-tree-analysis.md
         - architecture.md
         - component-inventory.md
         - development-guide.md
         - api-contracts.md
         - data-models.md
         - deployment-guide.md
1.8.8  VALIDATE documentation completeness
1.8.9  OUTPUT to _lr-output/docs/
```

### 1.9 DOCUMENT-SYSTEM (Ecosystem-Level Docs)

```
1.9.1  SCAN   ../../**/CONTEXT.md files (FULL_LOAD strategy)
1.9.2  SYNTHESIZE system-level understanding
1.9.3  GENERATE using templates:
         - system-onboarding.template.md
         - api-reference.template.md
         - architecture-overview.template.md
         - changelog.template.md
         - deployment-guide.template.md
1.9.4  OUTPUT system documentation
```

### 1.10 SPRINT-PLANNING

```
1.10.1  READ   workflow.yaml + instructions.md (XML, 5 steps)
1.10.2  DISCOVER and load all epic files
1.10.3  PARSE  epic files → extract all stories and work items
1.10.4  BUILD  sprint status structure (development_status YAML)
1.10.5  FOR EACH story:
          1.10.5.1  CHECK  if story file exists on disk
          1.10.5.2  PRESERVE advanced status if already set
          1.10.5.3  APPLY  intelligent status detection:
                     backlog → ready-for-dev → in-progress → review → done
1.10.6  GENERATE sprint-status.yaml with metadata + status definitions
1.10.7  VALIDATE completeness (all epics covered, no orphans)
1.10.8  DISPLAY summary table (stories by status, epics, counts)
```

### 1.11 SPRINT-STATUS (Multi-Mode Reporter)

```
1.11.1  DETERMINE execution mode: interactive | validate | data
1.11.2  LOCATE  sprint-status.yaml
1.11.3  READ    and parse sprint-status.yaml
1.11.4  DETECT  invalid entries and risks:
          - Story in review → suggest code-review
          - Multiple in-progress → focus on active
          - All backlog → create stories
          - Stale state (>7 days) → warn
          - Orphaned stories → warn
1.11.5  SELECT  next action recommendation by priority
1.11.6  DISPLAY tabular summary
1.11.7  OFFER   actions: [R]un next, [G]rouped view, [V]iew raw, [E]xit
1.11.8  WAIT    for user selection
1.11.9  EXECUTE selected action
```

---

## 2. SYNC MODULE (3 workflows)

### 2.1 JD-OPTIMIZE (53-Step Resume Optimization Engine)

**Agents**: sync-parser (Orion), sync-linker (Atlas), sync-sizer (Kael), sync-refiner (Veda), sync-styler (Cora), sync-scout (Lyra), sync-inquisitor (Sia)

#### Phase 0: Session Management

```
2.1.01  READ   lr-config.yaml — resolve session variables
2.1.01b CHECK  for interrupted session → ask Continue/Restart
```

#### Phase 1: JD Ingestion & Keyword Analysis (steps 03-06)

```
2.1.03  READ   raw JD text input
2.1.03a EXTRACT company name and job title
2.1.03b CATEGORIZE requirements: P0 (must-have), P1 (preferred), P2 (nice-to-have)
2.1.03c EXTRACT ATS keywords with priority weights (P0=1.0, P1=0.7, P2=0.4)
2.1.03d RANK   keywords by hiring signal strength
2.1.04  READ   ats-keyword-weights.yaml, role-taxonomy.yaml, seniority-markers.yaml
2.1.04a IDENTIFY competitive differentiators vs typical applicants
2.1.04b CALCULATE competitive moat score
2.1.04c PRESENT differentiators for user confirmation
2.1.05  READ   full optimized JD draft
2.1.05a RUN    adversarial review (TEA-style)
2.1.05b CLASSIFY findings: HIGH / MEDIUM / LOW severity
2.1.05c REPORT adversarial findings
2.1.06  READ   reviewed draft + all previous artifacts
2.1.06a GENERATE final optimized-jd.md using template
2.1.06b RUN    checklist validation (ingestion + analysis + output)
2.1.06c OUTPUT optimized-jd.md to disk
```

#### Phase 2: Persona Scoring (steps 08-10)

```
2.1.08  READ   jd-profile.yaml (14 fields)
2.1.08a SCORE  persona alignment across 5 dimensions
2.1.08b OUTPUT persona_scores to pipeline state
2.1.09  READ   persona scores
2.1.09a WEIGHT scores by JD emphasis (leadership vs technical vs cultural)
2.1.09b CALCULATE weighted persona alignment percentage
2.1.10  READ   weighted scores
2.1.10a VALIDATE persona scores against career_signals
2.1.10b FLAG   misaligned scores for manual review
2.1.10c OUTPUT validated persona profile
```

#### Phase 3: Signal Retrieval & Ranking (steps 11-13)

```
2.1.11  READ   validated persona profile
2.1.11a CONSTRUCT semantic query from top P0 requirements
2.1.11b QUERY  MongoDB career_signals collection
2.1.11c QUERY  ChromaDB career_signals_vcf (vector similarity)
2.1.12  READ   query results
2.1.12a RETRIEVE top-N matching career signals
2.1.12b MERGE  MongoDB exact matches + ChromaDB semantic matches
2.1.12c DEDUPLICATE signal set
2.1.13  READ   merged signal set
2.1.13a RANK   by cosine similarity to JD requirements
2.1.13b FILTER signals below relevance threshold
2.1.13c OUTPUT ranked signal set for baseline
```

#### Phase 4: Baseline Compilation (steps 14-16)

```
2.1.14  READ   ranked signals + career_signals.yaml
2.1.14a EXTRACT quantifiable metrics (revenue, %, time savings)
2.1.14b VALIDATE XYZ format: "Accomplished [X] as measured by [Y] by doing [Z]"
2.1.14c FLAG   metrics without quantification
2.1.15  READ   metric-patterns.yaml
2.1.15a VALIDATE ownership language ("Led", "Architected", not "Helped", "Assisted")
2.1.15b REPLACE weak verbs with P0 ownership verbs
2.1.15c VERIFY each bullet has clear individual contribution
2.1.16  READ   validated metrics + ownership bullets
2.1.16a COMPILE baseline resume content (Summary + Experience + Skills + Projects)
2.1.16b STRUCTURE by resume sections
2.1.16c OUTPUT baseline compilation artifact
```

#### Phase 5: Gap Analysis (steps 17-19)

```
2.1.17  READ   baseline compilation + JD P0/P1 requirements
2.1.17a DIFF   baseline signals vs JD requirements
2.1.17b IDENTIFY uncovered P0 requirements (critical gaps)
2.1.17c IDENTIFY uncovered P1 requirements (important gaps)
2.1.17d FLAG   requirements with zero matching signals
2.1.18  READ   gap list
2.1.18a CLASSIFY gaps by taxonomy: skill_gap | experience_gap | metric_gap | keyword_gap
2.1.18b DETERMINE fillability: fillable_from_signals | needs_user_input | unfillable
2.1.18c OUTPUT gap taxonomy artifact
2.1.19  READ   classified gaps
2.1.19a PRIORITIZE by: JD weight x fillability x impact
2.1.19b RANK   gaps for inquisitor dialogue
2.1.19c OUTPUT prioritized gap queue
```

#### Phase 6: Inquisitor Interview (steps 20-23) — INTERACTIVE

```
2.1.20  READ   prioritized gap queue
2.1.20a ACTIVATE sync-inquisitor (Sia)
2.1.20b CONSTRUCT targeted questions for each gap
2.1.20c PRESENT question set to user
2.1.21  READ   user responses
2.1.21a CONDUCT interactive dialogue per gap
2.1.21b PROBE  for specific metrics, ownership, context
2.1.21c LOOP   until gap is filled or marked unfillable
2.1.22  READ   dialogue transcripts
2.1.22a CAPTURE new signals from user responses
2.1.22b STRUCTURE into career_signal format
2.1.22c STORE  new signals to MongoDB
2.1.23  READ   captured signals
2.1.23a VERIFY new signals fill identified gaps
2.1.23b VALIDATE XYZ format compliance
2.1.23c MERGE  into baseline compilation
2.1.23d OUTPUT updated signal set
```

#### Phase 7: Narrative Construction (steps 24-26)

```
2.1.24  READ   merged signal set + JD requirements
2.1.24a BUILD  narrative arc: trajectory → transformation → impact
2.1.24b IDENTIFY career story theme ("growth", "turnaround", "innovation")
2.1.24c CONSTRUCT opening summary hook (6-second attention capture)
2.1.25  READ   narrative arc
2.1.25a MAP    narrative elements to resume sections
2.1.25b ENSURE each section reinforces the arc
2.1.25c THREAD common theme through all bullets
2.1.26  READ   mapped narrative
2.1.26a VALIDATE narrative coherence (no contradictions)
2.1.26b VALIDATE authentic voice preservation
2.1.26c OUTPUT validated narrative structure
```

#### Phase 8: Content Drafting & Refining (steps 27-30)

```
2.1.27  READ   validated narrative + ranked signals
2.1.27a ACTIVATE sync-refiner (Veda)
2.1.27b DRAFT  resume bullets per section
2.1.27c INJECT ATS keywords at P0 density
2.1.27d USE    branded-vocabulary.yaml for voice consistency
2.1.28  READ   draft bullets
2.1.28a REFINE each bullet for impact-first structure
2.1.28b OPTIMIZE word choice (strong verbs, specific metrics)
2.1.28c ITERATE up to 3 rounds per bullet
2.1.29  READ   refined bullets
2.1.29a ENFORCE XYZ format on every metric bullet
2.1.29b VALIDATE quantification present
2.1.29c FLAG   generic phrases for replacement
2.1.30  READ   XYZ-formatted content
2.1.30a REVIEW full content package holistically
2.1.30b CHECK  for redundancy across sections
2.1.30c VERIFY authentic voice (no invented accomplishments)
2.1.30d OUTPUT reviewed content package
```

#### Phase 9: Layout & Sizing (steps 31-33) — E5 ENHANCED

```
2.1.31  READ   reviewed content + template CSS
2.1.31a ACTIVATE sync-sizer (Kael)
2.1.31b EXTRACT TemplateWidthConfig from selected template:
          - available_width_px (A4 = 793.7px minus margins)
          - font_size_pt (Roboto Regular)
          - digit_width_px (reference unit from hmtx)
2.1.31c CALCULATE line_budget_digit_units = available_width_px / digit_width_px * 0.95
2.1.31d ASSIGN per-bullet digit-unit budgets
2.1.32  READ   layout budget
2.1.32a MEASURE each bullet's weighted character width (per-char Roboto hmtx)
2.1.32b VALIDATE each bullet falls in 90-100% of raw budget
2.1.32c FLAG   bullets outside range for adjustment
2.1.32d ITERATE sizing adjustments (max 3 iterations per bullet)
2.1.33  READ   sized content
2.1.33a COUNT  total lines (estimate against <=58 line budget)
2.1.33b CHECK  one-page constraint
2.1.33c IF overflow: prioritize cuts by signal strength (cut weakest)
2.1.33d OUTPUT page-validated layout
```

#### Phase 10: Style & Theming (steps 34-36) — E4 ENHANCED

```
2.1.34  READ   page-validated layout + company_brief.yaml
2.1.34a ACTIVATE sync-styler (Cora) + sync-scout (Lyra)
2.1.34b SCOUT  extracts target company brand: colors, typography, tone
2.1.34c READ   brand preset JSON (google.json, amazon.json, etc.) OR generate
2.1.34d APPLY  template selection matrix: company_stage x pm_culture → template
2.1.34e VALIDATE WCAG AA contrast (4.5:1 ratio) — auto-darken if fail (10% increments, 3x max)
2.1.34f ENFORCE forbidden overrides: no brand-color backgrounds, no bullet coloring, monochrome body text
2.1.35  READ   themed layout + selected template
2.1.35a READ   template HTML (modern-minimal/clean/visual)
2.1.35b INJECT content into 6 HTML slot markers:
          - {{CANDIDATE_NAME}}
          - {{CONTACT_INFO}}
          - {{SUMMARY}}
          - {{EXPERIENCE}}
          - {{SKILLS}}
          - {{EDUCATION}}
2.1.35c COMPILE CSS with --lr-* token values from brand preset
2.1.35d ASSEMBLE final HTML+CSS document
2.1.35e APPLY  @media print rules (-webkit-print-color-adjust: exact)
2.1.36  READ   compiled document
2.1.36a VALIDATE 6-check gate:
          1. All --lr-* tokens resolve (no undefined variables)
          2. Print output matches screen layout
          3. WCAG AA contrast passes
          4. Template slot markers fully replaced
          5. Font stack resolves (Roboto → system fallback)
          6. A4 page geometry correct (210mm x 297mm)
2.1.36b OUTPUT validated themed resume
```

#### Phase 11: Final Scoring & Export (steps 37-40)

```
2.1.37  READ   validated resume + JD requirements
2.1.37a SCORE  across 5 dimensions:
          1. Keyword Coverage (P0/P1/P2 hit rate)
          2. Ownership Match (strong verb density)
          3. Metric Density (quantified bullets / total)
          4. Persona Alignment (weighted score)
          5. Visual Quality (template + brand score)
2.1.37b CALCULATE composite alignment_score (0-100)
2.1.37c OUTPUT scoring report
2.1.38  READ   scoring report
2.1.38a UPDATE lr-tracker (Navi) with:
          - jd_profile entry
          - alignment_score
          - resume version metadata
2.1.38b STORE  to MongoDB jd_profiles collection
2.1.39  READ   final resume artifact
2.1.39a STORE  resume version to _lr-output/sync-artifacts/
2.1.39b STORE  to MongoDB resume_versions collection
2.1.39c UPDATE resume-versions-sidecar/memories.md
2.1.40  READ   stored resume
2.1.40a EXPORT as HTML (for web/email)
2.1.40b EXPORT as PDF (via print pipeline)
2.1.40c PRESENT to user with alignment score summary
2.1.40d CLOSE  workflow, update session state
```

#### Validation Steps (steps-v/)

```
2.1.V01-V10  For each phase gate:
  V.a  READ   generated artifact from phase
  V.b  READ   acceptance criteria / reference schema
  V.c  CHECK  Accuracy gate (data correctness)
  V.d  CHECK  Tone gate (authentic voice, no generic phrases)
  V.e  CHECK  Structure gate (format compliance, XYZ)
  V.f  CHECK  Constraint gate (page limit, keyword density)
  V.g  REPORT PASS/FAIL with specific feedback per criterion
```

### 2.2 OUTBOUND-CAMPAIGN (Cover Letter + Outreach Engine)

**Agents**: sync-publicist (Lyric), flex-publicist (Echo)

```
2.2.01  READ   lr-config.yaml — resolve session variables, load company_brief.yaml
2.2.01b CHECK  interrupted session → Continue/Restart

2.2.02  [INGEST] Recruiter/Hiring Manager Profile
2.2.02a READ   target inputs (recruiter PDF, LinkedIn, company page)
2.2.02b PARSE  into structured recruiter_profile.json
2.2.02c EXTRACT hiring manager name, role, team, company division
2.2.02d VERIFY parsed profile with user → [C]ontinue / [A]bort

2.2.03  [STRATEGY] Identify The Bridge
2.2.03a READ   recruiter_profile.json + jd_profile.yaml + career_signals
2.2.03b IDENTIFY "The Bridge" — strongest achievement↔requirement connection
2.2.03c DEFINE outreach tone (formal/conversational/technical)
2.2.03d SELECT psychological hook type (shared experience, mutual connection, metric-driven)
2.2.03e PRESENT strategy to user → [C]ontinue / [P]revious / [A]bort

2.2.04  [COVER LETTER] 3-Paragraph Engine — E1 ENHANCED
2.2.04a ACTIVATE sync-publicist (Lyric)
2.2.04b DRAFT  Paragraph 1: HOOK — recruiter-focused opening, reference specific company need
2.2.04c DRAFT  Paragraph 2: WHY ME — Bridge achievement match, XYZ metric proof
2.2.04d DRAFT  Paragraph 3: SYNERGY — why 1+1=3, value proposition, soft CTA
2.2.04e INJECT company-specific tone from company_brief.yaml
2.2.04f VALIDATE against 7-check gate:
          1. Word count in range (250-400)
          2. At least 1 XYZ metric cited
          3. Bridge reference present
          4. Company name appears 2+ times
          5. Tone matches outreach_strategy
          6. Zero generic phrases ("I'm excited to apply...")
          7. No caution topics mentioned
2.2.04g PRESENT to user for feedback → [C]ontinue / [P]revious / [A]bort

2.2.05  [IN-MAIL] LinkedIn Hiring Manager Message
2.2.05a READ   cover letter + recruiter profile
2.2.05b DRAFT  personalized In-Mail (shorter than cover letter)
2.2.05c INCLUDE specific metric from cover letter
2.2.05d ADD    soft CTA ("technical alignment chat" or "coffee chat")
2.2.05e PRESENT → [C]ontinue / [P]revious / [A]bort

2.2.06  [CONNECT INVITE] LinkedIn Connection (<=300 chars)
2.2.06a READ   strategy + bridge achievement
2.2.06b DRAFT  3 variants, each <= 300 characters
2.2.06c ENFORCE character clamp (hard reject if > 300)
2.2.06d INJECT shared signal or bridge achievement reference
2.2.06e PRESENT 3 variants → [C]ontinue / [P]revious / [A]bort

2.2.07  [PROFILE UPDATES] Temporary Strategic Changes
2.2.07a ACTIVATE flex-publicist (Echo)
2.2.07b EVALUATE current LinkedIn profile against JD keywords
2.2.07c SUGGEST headline update (high-impact JD keywords)
2.2.07d SUGGEST about section update (highlight Bridge achievement)
2.2.07e REVIEW  full campaign sequence holistically
2.2.07f PRESENT → [S]ave & Exit / [P]revious / [A]bort

2.2.V01 VALIDATE full campaign
2.2.V01a READ   all campaign artifacts
2.2.V01b RUN    checklist (research + drafting + brand phases)
2.2.V01c REPORT PASS/FAIL per criterion
```

### 2.3 PORTFOLIO-DEPLOY (Portfolio Website Assembly & Push)

**Agents**: sync-styler (Cora), lr-tracker (Navi)

```
2.3.01  READ   lr-config.yaml — session variables, GitHub Pages config
2.3.01b CHECK  interrupted session → Continue/Restart

2.3.02  [COMPILE] Slide Deck Payload — E2 (DEFERRED to Release 4)
2.3.02a ACTIVATE sync-styler (Cora)
2.3.02b QUERY  top 5 highest-impact signals (filtered by Strategic Gravity)
2.3.02c FOR EACH signal:
          2.3.02c.1  STRUCTURE as: Problem → Process → Metric → Legacy
          2.3.02c.2  VALIDATE quantitative metric present
2.3.02d COMPILE into slides_content.json
2.3.02e PRESENT payload to user for approval → [C]ontinue / [A]bort

2.3.03  [BEYOND THE PAPERS] Portfolio Content — E3 ENHANCED
2.3.03a READ   hobby/project/timeline data sources
2.3.03b LOAD   projects-source.yaml (>=3 projects required)
2.3.03c FOR EACH project:
          2.3.03c.1  STRUCTURE: title, description, thumbnail, tags, external_link
          2.3.03c.2  ASSIGN HSLA project color
2.3.03d LOAD   timeline entries (>=3 required, >=2 types diversity)
2.3.03e LOAD   hobbies data (>=1 required)
2.3.03f COMPILE portfolio_content.json
2.3.03g VALIDATE against 8-check gate:
          1. Projects >= 3
          2. Hobbies >= 1
          3. Timeline entries >= 3
          4. Diversity >= 2 types (professional + personal)
          5. All URLs valid
          6. All images have alt text
          7. Life Narrative placeholder exists
          8. portfolio_content.json schema valid
2.3.03h PRESENT for user review → [C]ontinue / [P]revious / [A]bort

2.3.04  [DEPLOY] GitHub Pages Push
2.3.04a ACTIVATE lr-tracker (Navi)
2.3.04b READ   slides_content.json + portfolio_content.json
2.3.04c READ   HTML/CSS templates from _lr/sync/templates/
2.3.04d INJECT JSON payloads into HTML templates
2.3.04e INJECT --lr-* CSS tokens from brand preset
2.3.04f INJECT BTP CSS namespace (.lr-btp-scope)
2.3.04g PREPARE dist/ static site folder
2.3.04h CHECKOUT gh-pages branch
2.3.04i MOVE   local artifacts to root
2.3.04j COMMIT "Sync-Deploy: Updated Portfolio [ISO-Timestamp]"
2.3.04k PUSH   git push origin gh-pages
2.3.04l WAIT   30 seconds for GitHub Pages propagation
2.3.04m VERIFY live URL accessible
2.3.04n REPORT live URL to user
2.3.04o CLOSE  workflow, update session logs → [S]ave & Exit / [P]revious / [A]bort

2.3.V01 VALIDATE deployment
2.3.V01a READ   all portfolio artifacts + live URL
2.3.V01b RUN    checklist (preparation + validation + deployment)
2.3.V01c REPORT PASS/FAIL per criterion
```

---

## 3. SQUICK MODULE (5 phases + enterprise-ship)

### 3.1 PHASE 1: ANALYSIS

```
3.1.01  READ   lr-config.yaml
3.1.01b CHECK  interrupted session
3.1.02  ASK    user for project core concept / raw brief
3.1.03  EXTRACT technical requirements from brief
3.1.04  CONFIRM understanding with user
3.1.05  GENERATE product-brief.md using template
3.1.E01 [EDIT MODE] Load existing phase artifacts
3.1.E02 [EDIT MODE] Identify mutation scope → apply approved modifications
```

### 3.2 PHASE 2: PLAN

```
3.2.01  READ   lr-config.yaml
3.2.01b CHECK  interrupted session
3.2.02  READ   product-brief.md from Phase 1
3.2.03  DECOMPOSE goals into User Stories
3.2.04  DRAFT  PRD using prd.template.md
3.2.05  PRESENT PRD to user for approval
3.2.E01 [EDIT MODE] Assess mutation
3.2.E02 [EDIT MODE] Apply mutation
```

### 3.3 PHASE 3: SOLUTIONING

```
3.3.01  READ   lr-config.yaml
3.3.01b CHECK  interrupted session
3.3.02  READ   prd.md from Phase 2
3.3.03  ANALYZE PRD requirements
3.3.04  PROPOSE tech stack, data models, component interaction
3.3.05  DESIGN architecture (minimal engineering, maximal impact)
3.3.06  VALIDATE for tech debt / over-engineering
3.3.07  OUTPUT adr.md (Architecture Decision Record)
3.3.E01 [EDIT MODE] Assess mutation
3.3.E02 [EDIT MODE] Apply mutation
```

### 3.4 PHASE 4: IMPLEMENTATION

```
3.4.01  READ   lr-config.yaml
3.4.01b CHECK  interrupted session
3.4.02  READ   adr.md from Phase 3
3.4.03  IMPLEMENT code based on ADR
3.4.04  RUN    code-review/instructions.xml quality gate
3.4.05  PRESENT review findings to user
3.4.06  ITERATE on feedback
3.4.07  FINALIZE and commit
3.4.E01 [EDIT MODE] Assess mutation
3.4.E02 [EDIT MODE] Apply mutation
```

### 3.5 ENTERPRISE-SHIP (End-to-End)

```
3.5.B01 ACTIVATE squick-analyst (Alex)
3.5.B01a READ   product_brief.md
3.5.B01b ANALYZE technical constraints (Auth, Scale, Compliance)
3.5.B01c IDENTIFY missing domain-specific signals
3.5.B01d OUTPUT discovery_report.json

3.5.B02 ACTIVATE squick-pm (Piper)
3.5.B02a READ   discovery_report.json
3.5.B02b DEFINE "Minimum Viable Enterprise" scope
3.5.B02c MAP    requirements to agent responsibilities
3.5.B02d OUTPUT enterprise_backlog.md

3.5.01  Load session context
3.5.02  Route through Phases 1→4 sequentially
```

---

## 4. FLEX MODULE (1 workflow)

### 4.1 CONTENT-AUTOMATION (LinkedIn & Outreach Content)

**Agents**: flex-publicist (Echo), lr-tracker (Navi)

```
4.1.01  READ   lr-config.yaml
4.1.01b CHECK  interrupted session
4.1.02  CALIBRATE flex-publicist to user's professional positioning

4.1.03  [INGEST] Capture Reflection
4.1.03a ACTIVATE lr-tracker (Navi)
4.1.03b READ   _lr/_memory/reflections/latest.md
4.1.03c DECOMPOSE text into atomic task/achievement blocks
4.1.03d REGISTER new signals to MongoDB career_signals
4.1.03e OUTPUT new_signals[] in MongoDB

4.1.04  [QUERY] Viral Insights
4.1.04a ACTIVATE flex-publicist (Echo)
4.1.04b QUERY  ChromaDB viral_insights collection (semantic search)
4.1.04c MATCH  patterns from previous high-engagement posts
4.1.04d EXTRACT opening sentence patterns that worked
4.1.04e OUTPUT narrative_hooks[]

4.1.05  [GENERATE] Social Copy
4.1.05a COMBINE new_signals + narrative_hooks
4.1.05b READ   voice-profile.md for vocabulary reference
4.1.05c READ   branded-vocabulary.yaml for brand voice
4.1.05d DRAFT  LinkedIn social copy (3 variations)
4.1.05e DRAFT  1 LinkedIn article/thought piece
4.1.05f OUTPUT linkedin_draft_[date].txt

4.1.06  [GENERATE] Media Prompts
4.1.06a GENERATE hyper-detailed prompts for AI media tools
4.1.06b TARGET platforms: Google NanoBanana, NotebookLM, Gamma, Veo3
4.1.06c OUTPUT media_prompts_[date].md

4.1.07  [PUSH] Stage to Airtable
4.1.07a ACTIVATE lr-tracker (Navi)
4.1.07b CONSTRUCT JSON payload: post_text, media_prompts, platform, status
4.1.07c POST   to n8n webhook endpoint
4.1.07d VERIFY staging in Airtable
4.1.07e STORE  Airtable Record ID
4.1.07f OUTPUT successfully staged post

4.1.V01 VALIDATE workflow
4.1.V01a READ   all artifacts
4.1.V01b RUN    checklist.md validation
4.1.V01c REPORT PASS/FAIL
```

---

## 5. CIS MODULE (1 workflow)

### 5.1 NARRATIVE-CRAFT (Professional Identity Narrative)

```
5.1.01  READ   career_signals.yaml from sync/workflows/signal-capture/artifacts/
5.1.01a LOAD   all career signals
5.1.01b IDENTIFY trajectory and transformation story
5.1.01c DETERMINE career arc theme
5.1.01d PRESENT arc to user for confirmation
5.1.01e CRITICAL: NEVER invent accomplishments — use ONLY provided signals

5.1.02  READ   confirmed career arc
5.1.02a DRAFT  3 hook variations (under 50 words each)
5.1.02b PRESENT to user for selection
5.1.02c ITERATE on selected hook if needed
5.1.02d OUTPUT refined professional summary hook

5.1.V01 VALIDATE narrative
5.1.V01a READ   all narrative artifacts
5.1.V01b RUN    validation checklist
5.1.V01c REPORT PASS/FAIL
```

---

## AGENT INVENTORY (32 agents across 7 modules)

| #   | Agent               | Persona       | Module | Role                    | Sidecar |
| --- | ------------------- | ------------- | ------ | ----------------------- | ------- |
| 1   | lr-orchestrator     | Aether        | core   | Central Brain           | Yes     |
| 2   | lr-tracker          | Navi          | core   | Governance & Memory     | Yes     |
| 3   | sync-parser         | Orion         | sync   | Lead Signal Engineer    | Yes     |
| 4   | sync-sizer          | Kael          | sync   | Strict Gatekeeper       | Yes     |
| 5   | sync-refiner        | Veda          | sync   | The Sculptor            | Yes     |
| 6   | sync-linker         | Atlas         | sync   | Matching Architect      | Yes     |
| 7   | sync-styler         | Cora          | sync   | Visual Craftsman        | Yes     |
| 8   | sync-scout          | Lyra          | sync   | Field Intelligence      | Yes     |
| 9   | sync-publicist      | Lyric         | sync   | Outreach Engineer       | Yes     |
| 10  | sync-inquisitor     | Sia           | sync   | Probing Interviewer     | Yes     |
| 11  | sync-narrator       | Mnemosyne     | sync   | Memory Synthesizer      | No      |
| 12  | sync-tracker        | Ledger        | sync   | Success Officer         | No      |
| 13  | lr-agent-builder    | Bond          | lrb    | Agent Architect         | Yes     |
| 14  | lr-module-builder   | Morgan        | lrb    | Module Architect        | Yes     |
| 15  | lr-workflow-builder | Wendy         | lrb    | Process Engineer        | Yes     |
| 16  | lr-qa               | Quinn         | lrb    | QA Specialist           | Yes     |
| 17  | lr-analyst          | M             | lrb    | Requirements Analyst    | Yes     |
| 18  | lr-test-engineer    | Q             | lrb    | Test Engineer           | Yes     |
| 19  | flex-publicist      | Echo          | flex   | Social Brand Strategist | Yes     |
| 20  | squick-pm           | Piper         | squick | Enterprise PM           | Yes     |
| 21  | squick-analyst      | Alex          | squick | Data Analyst            | Yes     |
| 22  | squick-architect    | Arthur        | squick | Solution Architect      | Yes     |
| 23  | squick-sm           | Sasha         | squick | Scrum Master            | Yes     |
| 24  | squick-qa           | Vera          | squick | QA Specialist           | Yes     |
| 25  | squick-ux           | Ula           | squick | Enterprise UX           | Yes     |
| 26  | squick-tech-writer  | Tycho         | squick | Documentation Engineer  | Yes     |
| 27  | cis-architect       | Cis-Architect | cis    | Senior Technical (stub) | No      |
| 28  | cis-engineer        | Cis-Engineer  | cis    | Senior Technical (stub) | No      |
| 29  | tea-scout           | Tea-Scout     | tea    | Senior Technical (stub) | No      |
| 30  | tea-validator       | Tea-Validator | tea    | Senior Technical (stub) | No      |

---

## DATA FLOW SUMMARY

```
User Input (Raw JD + Career History)
    |
    v
[Signal Capture] → career_signals.yaml → MongoDB
    |
    v
[JD-Optimize] → jd_profile.yaml → optimized resume HTML/PDF
    |                                      |
    v                                      v
[Outbound-Campaign]                 [Portfolio-Deploy]
    |                                      |
    v                                      v
Cover Letter + In-Mail +            slides_content.json +
Connect Invite + Profile Updates    portfolio_content.json
                                           |
                                           v
                                    GitHub Pages (live URL)
    |
    v
[Content-Automation] → LinkedIn posts → Airtable → n8n → Postiz
```
