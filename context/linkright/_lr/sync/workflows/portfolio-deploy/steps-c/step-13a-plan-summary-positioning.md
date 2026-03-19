# Step 13a: Plan Summary Positioning

## Workflow: sync.portfolio-deploy / Phase I: Narrative Mapping

## Agent: Sync-Linker

---

### Objective
Draft the one-line positioning statement and summary strategy for the resume header.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/templates/sync-narrative-plan.template.md`
- Requires: `persona_fit_primary` (from Phase D)
- Requires: `company_brief` (from Phase C)

### Hard Stop Conditions
- IF `persona_fit_primary` is null → Surface error: "No persona fit found."

### Process

1. [READ] Load `persona_fit_primary` and `company_brief`.
2. [FORMULATE] Draft the `one-line-positioning` statement:
   - Structure: "[Persona Tilt] with [Core Signal] experience in [Industry/Stage]."
   - Example: "Technical PM with 5+ years API architecture experience at scale-up SaaS."
3. [FORMULATE] Draft the `summary_approach`:
   - Highlight top-2 P0 requirements and the corresponding signals.
   - Use language from `company_brief.industry_terms[]`.
4. [OUTPUT] Initialize the `narrative-plan.md` artifact using the template.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-13a-plan-summary-positioning" \
  --description="Planning the resume's summary section. This step defines the core 'hook' and strategic positioning of the user, tailored to the specific company's stage and culture." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/planning-artifacts/sync-narrative-plan-[uuid].md` (Started)

### Validation Checklist
- [ ] Positioning statement is exactly one line.
- [ ] Summary strategy includes at least one keyword from the industry terms list.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-13a. Positioning statement drafted. Session variables updated." \
  --set-metadata last_completed_step=step-13a \
  --set-metadata session_variables='{"positioning_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Summary positioning statement drafted and narrative plan artifact initialized." \
  --json
```

**Next:** `step-13b-plan-role1-bullet-strategy.md`
