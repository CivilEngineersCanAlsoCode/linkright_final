# Step 15c: Write Role 3 Bullets

## Workflow: sync.portfolio-deploy / Phase J: Content Writing

## Agent: Sync-Writer

---

### Objective
Generate 2-3 foundation bullet points for the user's earlier professional experience (Role 3), following the `role3_strategy` from the narrative plan.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-bullet-writing-guide.md`
- Requires: `sync-narrative-plan.md` (from Phase I)
- Requires: `top_signals[]` (from Phase H)

### Hard Stop Conditions
- IF no signals are mapped to Role 3 in the plan → Surface error: "Role 3 strategy missing."

### Process

1. [READ] Load the `role3_strategy` from the narrative plan and the mapped `top_signals[]`.
2. [WRITE] Draft 2-3 bullet points using the **XYZ Formula**:
   - Focus on "Foundation" — show the earliest evidence of the skills required by the current JD.
3. [TILT] Use the `persona_fit_primary` as a high-level guide but prioritize foundational relevance.
4. [MIRROR] Use remaining JD keywords if applicable.
5. [EVALUATE] Ensure bullets are concise (max 2 lines).
6. [OUTPUT] Append the Role 3 section to the `optimized-resume.md` artifact.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-15c-write-role3-bullets" \
  --description="Generating final bullet points for the user's tertiary role. These signals show the early 'foundation' of the user's career, completing the narrative arc." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/optimized-artifacts/optimized-resume-[uuid].md` (Updated)

### Validation Checklist
- [ ] At least 2 bullet points generated for the tertiary role.
- [ ] Bullet tone is consistent with the rest of the resume.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-15c. Role 3 bullets written. Session variables updated." \
  --set-metadata last_completed_step=step-15c \
  --set-metadata session_variables='{"role3_bullets_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Role 3 bullet points generated and appended to the optimized resume artifact." \
  --json
```

**Next:** `step-16-write-skills-section.md`
