# Step 15b: Write Role 2 Bullets

## Workflow: sync.outbound-campaign / Phase J: Content Writing

## Agent: Sync-Writer

---

### Objective
Generate 3-4 supporting bullet points for the secondary professional role (Role 2), following the `role2_strategy` from the narrative plan.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-bullet-writing-guide.md`
- Requires: `sync-narrative-plan.md` (from Phase I)
- Requires: `top_signals[]` (from Phase H)

### Hard Stop Conditions
- IF no signals are mapped to Role 2 in the plan → Surface error: "Role 2 strategy missing."

### Process

1. [READ] Load the `role2_strategy` from the narrative plan and the mapped `top_signals[]`.
2. [WRITE] Draft 3-4 bullet points using the **XYZ Formula**:
   - Focus on "Persistence" — show the skill has been used across multiple roles.
   - If `persona_fit_secondary` is applicable, include it in the narrative.
3. [TILT] Maintain the `persona_fit_primary` anchor but allow for secondary persona influence.
4. [MIRROR] Use JD keywords from the P1/P2 requirements.
5. [EVALUATE] Ensure bullets are concise (max 2 lines).
6. [OUTPUT] Append the Role 2 section to the `optimized-resume.md` artifact.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-15b-write-role2-bullets" \
  --description="Generating final bullet points for the user's secondary role. These signals provide 'depth' and prove a consistent track record of high-performance." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/optimized-artifacts/optimized-resume-[uuid].md` (Updated)

### Validation Checklist
- [ ] At least 3 bullet points generated for the secondary role.
- [ ] At least one bullet includes a quantifiable metric.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-15b. Role 2 bullets written. Session variables updated." \
  --set-metadata last_completed_step=step-15b \
  --set-metadata session_variables='{"role2_bullets_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Role 2 bullet points generated and appended to the optimized resume artifact." \
  --json
```

**Next:** `step-15c-write-role3-bullets.md`
