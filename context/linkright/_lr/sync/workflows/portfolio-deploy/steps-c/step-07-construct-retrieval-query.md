# Step 07: Construct Retrieval Query

## Workflow: sync.portfolio-deploy / Phase E: Signal Retrieval

## Agent: Sync-Linker

---

### Objective
Construct the semantic query string and metadata filters for ChromaDB retrieval based on the JD profile and primary persona tilt.

### Dependencies
- Requires: `jd_profile` (from Phase B)
- Requires: `persona_fit_primary` (from Phase D)

### Hard Stop Conditions
- IF `persona_fit_primary` is null → Surface error: "No primary persona selected. Re-run Phase D."

### Process

1. [EXTRACT] Select top-3 hard requirements (by weight) from `jd_profile.requirements.hard[]`.
2. [CONSTRUCT] Formulate the semantic `query_text` using the following components:
   - Top-3 hard requirements.
   - `persona_fit_primary` description as context.
   - `company_stage` and `team` context.
   - Top-3 ATS keywords.
   - Format: "[Requirement1]. [Requirement2]. [Requirement3]. Seeking [persona_fit] experience for [company_stage] environment. Expertise in [keywords]."
3. [FILTER] Define the `filter_metadata` to refine results:
   - `persona_relevance.[primary_persona]` >= 2
4. [LOG] Record the final query string and filter in the session metadata.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-07-construct-retrieval-query" \
  --description="Constructing the semantic query for signal retrieval. This query uses ChromaDB semantic search to pull the most relevant user signals based on the JD profile and persona tilt." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `query_text`
- Variable: `filter_metadata`

### Validation Checklist
- [ ] `query_text` includes at least 3 hard requirements.
- [ ] `filter_metadata` correctly targets the primary persona relevance.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-07. Query: '[text]'. Session variables updated." \
  --set-metadata last_completed_step=step-07 \
  --set-metadata session_variables='{"query_text": "[query_text]", "filter_metadata": "[filter_metadata]"}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Retrieval query constructed using top [N] requirements and '[persona]' persona filter." \
  --json
```

**Next:** `step-08-retrieve-top-k-signals.md`
