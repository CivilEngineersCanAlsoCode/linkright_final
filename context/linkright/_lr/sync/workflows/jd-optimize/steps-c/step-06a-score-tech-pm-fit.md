# Step 06a: Score Tech-PM Fit

## Workflow: sync.jd-optimize / Phase D: Persona Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the tech-pm dimension (0-10) for the target job description based on technical requirements and ownership signals.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-persona-tilt-guide.md`
- Requires: `jd_profile` (from Phase B)
- Context: `jd_profile.requirements.hard`, `jd_profile.ownership_signals`, `jd_profile.skills_technical`

### Hard Stop Conditions
- IF `jd_profile.requirements.hard` is empty → Surface error: "No requirements found to score. Re-run Phase B."

### Process

1. [SCAN] Identify all hard requirements with `signal_type = "technical"`.
2. [SCAN] Identify `ownership_signals` that explicitly imply technical oversight (e.g., "owning the technical roadmap", "API design authority").
3. [CHECK] Verify presence of technical tool requirements in `skills_technical[]`.
4. [KEYWORD] Search JD text for specific technical PM indicators: "API", "architecture", "system design", "engineering partner", "technical debt", "latency", "scalability".
5. [SCORE] Assign a value from 0-10 based on density:
   - **8-10**: Technical requirements constitute the majority of hard requirements; role requires deep engineering background.
   - **5-7**: Technical requirements appear in several key areas but are not the sole focus.
   - **2-4**: Technical skills mentioned as "nice-to-have" or secondary to product/growth.
   - **0-1**: Zero or negligible technical dimension mentioned.

### Beads Task

```bash
bd create "sync.jd-optimize.step-06a-score-tech-pm-fit" \
  --description="Scoring the Tech-PM dimension for the JD profile. This step uses the persona tilt guide and jd_profile signals to assign a 0-10 score, which informs the final persona selection in step-06e." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `persona_scores.tech_pm` (Integer 0-10)
- Update: `jd_profile.persona_scores.tech_pm`

### Validation Checklist
- [ ] Tech-PM score is an integer between 0 and 10.
- [ ] Scoring rationale is documented in session notes.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-06a. Tech-PM score: [N]. Session variables updated." \
  --set-metadata last_completed_step=step-06a \
  --set-metadata session_variables='{"persona_scores": {"tech_pm": [N]}}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Tech-PM score [N] assigned based on [X] technical requirements and [Y] ownership signals." \
  --json
```

**Next:** `step-06b-score-growth-pm-fit.md`
