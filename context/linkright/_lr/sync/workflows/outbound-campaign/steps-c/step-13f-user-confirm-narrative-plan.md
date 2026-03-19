# Step 13f: User Confirm Narrative Plan

## Workflow: sync.outbound-campaign / Phase I: Narrative Mapping

## Agent: Sync-Linker

---

### Objective
Present the full `sync-narrative-plan.md` to the user for final review and confirmation before the content writing phase begins.

### Dependencies
- Requires: `sync-narrative-plan.md` (fully populated from steps 13a-13e)
- Blocks: Phase J (Content Writing)

### Hard Stop Conditions
- IF the user rejects the plan → Return to Phase I (Step 12 or 13) to adjust mapping/strategy.

### Process

1. [READ] Load the finalized `sync-narrative-plan.md`.
2. [PRESENT] Display the plan's summary and Role 1-3 bullet strategies to the user.
3. [PROMPT] Ask: "Review the narrative plan. This is the logic that will drive the resume's content. Approve (Y/N) or suggest changes?"
4. [ADJUST] If the user has specific changes:
   - Manually edit the plan file.
   - Or re-run the relevant sub-step in Phase I.
5. [FINALIZE] Once approved, mark the narrative plan as `status: user-confirmed` in the frontmatter.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-13f-user-confirm-narrative-plan" \
  --description="Finalizing the narrative plan with the user. This step ensures that the human-in-the-loop approves the strategic 'tilt' and signal selection before the agent commits to full-scale content generation." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/planning-artifacts/sync-narrative-plan-[uuid].md` (Finalized)

### Validation Checklist
- [ ] User confirmation is recorded in the artifact frontmatter.
- [ ] No major strategic gaps exist in the final plan.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed Phase I. Narrative plan confirmed by user. Session variables updated." \
  --set-metadata last_completed_step=step-13f \
  --set-metadata session_variables='{"narrative_finalized": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "User confirmed the narrative plan for [UUID]. Ready for Phase J (Content Writing)." \
  --json
```

**Phase Complete.** → Load: `step-14-write-professional-summary.md` (Phase J)
