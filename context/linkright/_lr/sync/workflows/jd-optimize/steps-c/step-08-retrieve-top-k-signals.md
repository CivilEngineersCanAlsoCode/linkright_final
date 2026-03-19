# Step 08: Retrieve Top-K Signals

## Workflow: sync.jd-optimize / Phase E: Signal Retrieval

## Agent: Sync-Linker

---

### Objective
Execute the semantic search against the ChromaDB "sync_signals" collection to retrieve the top candidate signals for optimization.

### Dependencies
- Requires: `query_text`, `filter_metadata` (from step-07)
- Requires: ChromaDB "sync_signals" collection must be initialized.

### Hard Stop Conditions
- IF search returns 0 results → Surface error: "Signal library is empty or query is too restrictive. Re-evaluate query filters."

### Process

1. [CONNECT] Establish a session with the ChromaDB "sync_signals" collection.
2. [QUERY] Execute semantic search using `query_text` and `filter_metadata`.
   - `top_k`: 15
3. [FALLBACK] If result count < 5:
   - Relax `filter_metadata` (remove `persona_relevance` constraint).
   - Re-execute query.
4. [WARN] If still < 5:
   - Notify the user: "Signal library may be thin for this role. Consider running `sync-capture` for more data."
5. [COLLECT] Store the `raw_retrieved_signals[]` array, including `signal_id`, `relevance_score`, and `metadata`.

### Beads Task

```bash
bd create "sync.jd-optimize.step-08-retrieve-top-k-signals" \
  --description="Executing ChromaDB semantic search. Retrieves up to 15 top candidate signals from the user's signal library to provide material for the resume's bullets." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `raw_retrieved_signals[]`

### Validation Checklist
- [ ] At least 5 candidate signals were successfully retrieved.
- [ ] Each signal has a non-zero relevance score.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-08. [N] signals retrieved. Session variables updated." \
  --set-metadata last_completed_step=step-08 \
  --set-metadata session_variables='{"signal_count": [N], "top_signal_id": "[id]"}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Successfully retrieved [N] candidate signals from ChromaDB with top score [S]." \
  --json
```

**Next:** `step-08a-filter-by-persona-relevance.md`
