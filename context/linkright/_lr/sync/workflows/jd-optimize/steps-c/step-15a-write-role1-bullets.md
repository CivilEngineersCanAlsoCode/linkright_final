# Step 15a: Write Role 1 Bullets

## Workflow: sync.jd-optimize / Phase J: Content Writing

## Agent: Sync-Writer

---

### Objective
Generate 4-5 high-impact bullet points for the most recent professional role (Role 1), following the `role1_strategy` from the narrative plan.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-bullet-writing-guide.md`
- Requires: `sync-narrative-plan.md` (from Phase I)
- Requires: `top_signals[]` (from Phase H)

### Hard Stop Conditions
- IF no signals are mapped to Role 1 in the plan → Surface error: "Role 1 strategy missing."

### Process

1. [READ] Load the `role1_strategy` from the narrative plan and the mapped `top_signals[]`.
2. [WRITE] Draft 4-5 bullet points using the **XYZ Formula**:
   - **X**: Achieved [Metric]
   - **Y**: As measured by [Data Source/KP]
   - **Z**: By doing [Action/Technical Skill]
3. [TILT] Ensure each bullet reflects the `persona_fit_primary` tilt (e.g., if Tech-PM, emphasize API/architecture).
4. [MIRROR] Use exact keywords from the JD's P0 requirements and `company_brief.industry_terms[]`.
5. [EVALUATE] Check each bullet's line length (max 2 lines) and impact density.
6. [OUTPUT] Append the Role 1 section to the `optimized-resume.md` artifact.

### Beads Task

```bash
bd create "sync.jd-optimize.step-15a-write-role1-bullets" \
  --description="Generating final bullet points for the user's primary role. This step transforms structured career signals into persuasive resume copy using the XYZ formula and persona-specific 'tilt'." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/optimized-artifacts/optimized-resume-[uuid].md` (Updated)

### Validation Checklist
- [ ] At least 4 bullet points generated for the primary role.
- [ ] Every bullet includes a quantifiable metric.
- [ ] Tone aligns with the primary persona.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-15a. Role 1 bullets written. Session variables updated." \
  --set-metadata last_completed_step=step-15a \
  --set-metadata session_variables='{"role1_bullets_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Role 1 bullet points generated and appended to the optimized resume artifact." \
  --json
```

**Next:** `step-15b-write-role2-bullets.md`
