# Step 09f: Aggregate Baseline Score

## Workflow: sync.outbound-campaign / Phase F: Baseline Scoring

## Agent: Sync-Linker

---

### Objective
Sum all 5 dimension scores into a single baseline alignment score (0-100) and identify the weakest dimensions for prioritized gap analysis.

### Dependencies
- Requires: `baseline_dim1` through `baseline_dim5` (from steps 09a-09e)
- Blocks: Phase G (Gap Analysis)

### Hard Stop Conditions
- IF any of the 5 baseline dimensions are missing → Surface error: "Incomplete baseline scoring pool."

### Process

1. [SUM] Add the 5 scores to compute the `alignment_score_baseline`:
   - `total = d1 + d2 + d3 + d4 + d5`
2. [UPDATE] Update `jd_profile.alignment_score_baseline` with the total.
3. [RANK] Sort the 5 dimensions by score in ascending order (lowest first).
4. [IDENTIFY] Flag all dimensions that fall below the threshold defined in `sync-scoring-dimensions.csv`.
5. [PRIORITIZE] List these flagged dimensions as `gap_priorities[]` for Phase G.
6. [LOG] Surface the final summary: "Baseline alignment: [N]/100. Primary Gap: [Dimension] ([Score])."

### Beads Task

```bash
bd create "sync.outbound-campaign.step-09f-aggregate-baseline-score" \
  --description="Aggregating the final baseline score. This step provides the starting 'Fit Score' for the user's resume before any optimization has occurred. It identifies the specific areas (Keywords, metrics, etc.) that need the most improvement." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `alignment_score_baseline` (Float 0-100)
- Variable: `dimension_breakdown[]`
- Variable: `gap_priorities[]`

### Validation Checklist
- [ ] Total score is accurately summed.
- [ ] At least one gap priority is identified if the total score is < 80.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed Phase F. Baseline Score: [N]/100. Session variables updated." \
  --set-metadata last_completed_step=step-09f \
  --set-metadata session_variables='{"baseline_total": [total], "gap_priorities": [gaps]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Final baseline alignment score of [N]/100 calculated. Identified [M] gap priorities." \
  --json
```

**Phase Complete.** → Load: `step-10a-identify-type-a-gaps.md` (Phase G)
