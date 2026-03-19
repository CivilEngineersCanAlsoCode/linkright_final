# Step 06d: Score Product-PM Fit

## Workflow: sync.outbound-campaign / Phase D: Persona Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the product-pm dimension (0-10) for the target job description based on user-centric and product-discovery requirements.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-persona-tilt-guide.md`
- Requires: `jd_profile` (from Phase B)
- Context: `jd_profile.requirements.hard`, `jd_profile.requirements.cultural`

### Hard Stop Conditions
- IF `jd_profile.requirements.hard` is empty → Surface error: "No requirements found. Re-run Phase B."

### Process

1. [SCAN] Identify all requirements (hard and soft) with `signal_type = "product"`.
2. [EVIDENCE] Identify mentions of user-centric activities: "User research", "NPS ownership", "product discovery", "user interviews", "usability testing", "defining MVP", "user-story mapping", "product-market fit".
3. [CHECK] Verify presence of product culture signals: "User-obsessed", "customer-first", "empathy", "design-driven".
4. [SCORE] Assign a value from 0-10 based on same logic:
   - **8-10**: User obsession and product intuition are the primary differentiators.
   - **5-7**: Product discovery is a core part of the role.
   - **2-4**: Product input is expected but tech/growth is the main focus.
   - **0-1**: No product-discovery specific requirements found.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-06d-score-product-pm-fit" \
  --description="Scoring the Product-PM dimension. Focuses on user obsession, NPS, and product discovery to assign a 0-10 score, ensuring the resume reflects a user-first mindset." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `persona_scores.product_pm` (Integer 0-10)
- Update: `jd_profile.persona_scores.product_pm`

### Validation Checklist
- [ ] Product-PM score is an integer between 0 and 10.
- [ ] Rationale for score is documented.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-06d. Product-PM score: [N]. Session variables updated." \
  --set-metadata last_completed_step=step-06d \
  --set-metadata session_variables='{"persona_scores": {"product_pm": [N]}}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Product-PM score [N] assigned based on [X] user-centric requirements and [Y] discovery signals." \
  --json
```

**Next:** `step-06e-select-primary-persona.md`
