# Step 23: Generate Optimization Report

## Workflow: sync.outbound-campaign / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Generate a comprehensive PDF/Markdown optimization report for the user, summarizing the fit scores, uplift, and key strategic changes made during the session.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/templates/sync-optimization-report.template.md`
- Requires: `jd_profile` (from Phase B)
- Requires: `alignment_score_baseline`, `alignment_score_final`, `uplift` (from Phase M)

### Hard Stop Conditions
- IF final score is missing → Surface error: "Cannot generate report."

### Process

1. [READ] Load all session scores and metadata.
2. [WRITE] Populate the `sync-optimization-report.md` using the template:
   - **Header**: Company, Role, Date.
   - **Scoreboard**: Baseline vs Final vs Uplift.
   - **Dimension Breakdown**: Performance in all 5 categories.
   - **Strategic Wins**: Top 3 high-impact bullets generated.
   - **Recommendation**: "Ready to Apply" or "Further Deepening Required".
3. [SAVE] Write the report to the session's export directory.
4. [FINALIZE] Mark the entire workflow as complete in the session variables.
5. [LOG] Surface the final success message: "Workflow Complete. ✔"

### Beads Task

```bash
bd create "sync.outbound-campaign.step-23-generate-optimization-report" \
  --description="Generating the final optimization report. This report is the primary user-facing deliverable, providing a clear summary of the 'Fit Score' improvement and highlighting the most impactful changes made to the user's career story." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/optimized-artifacts/optimization-report-[rv_id].md`

### Validation Checklist
- [ ] Report scoreboard accurately reflects session scores.
- [ ] Final recommendation is based on the final alignment score threshold.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Workflow Complete. Report generated. Session variables finalized." \
  --set-metadata last_completed_step=step-23 \
  --set-metadata session_variables='{"workflow_status": "complete"}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Optimization report generated. Workflow 'sync.outbound-campaign' completed successfully." \
  --json
```

**Workflow Complete. ✔**
