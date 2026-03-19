# Step 17b: Sizer Page Budget Check

## Workflow: sync.outbound-campaign / Phase K: Layout Validation

## Agent: Sync-Sizer

---

### Objective
Audit the `optimized-resume.md` for total page length and section balance.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-layout-constraints.yaml`
- Requires: `optimized-resume.md` (from Phase J)

### Hard Stop Conditions
- IF `optimized-resume.md` is empty → Surface error: "Empty resume draft."

### Process

1. [READ] Load the draft `optimized-resume.md`.
2. [CALCULATE] Estimate total page count:
   - Map total word count or line count to a 1-page budget (approx. 450-500 words).
3. [EVALUATE] Check section balance:
   - Summary: Max 10% of page.
   - Experience: 70-80% of page.
   - Skills/Education: 10-20% of page.
4. [IDENTIFY] Flag any section that exceeds the target balance or pushes the resume to a 2nd page without justification.
5. [LOG] Surface the layout health score.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-17b-sizer-page-budget-check" \
  --description="Auditing the resume's total page budget. High-performance resumes must be concise; this step ensures the user's career story is told within the 1-page target (or justified 2-page) with proper section balance." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `page_count` (Float)
- Variable: `section_balance_score` (0.0-1.0)

### Validation Checklist
- [ ] Resume fits within the 1-page word count threshold (if < 10 years experience).
- [ ] Section balance reflects standard hiring expectations.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-17b. Page Budget: [N] pages. Session variables updated." \
  --set-metadata last_completed_step=step-17b \
  --set-metadata session_variables='{"page_budget_ok": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Page budget audit complete; total estimated pages: [N]. Balance score: [S]." \
  --json
```

**Next:** `step-17c-sizer-refiner-iterate.md`
