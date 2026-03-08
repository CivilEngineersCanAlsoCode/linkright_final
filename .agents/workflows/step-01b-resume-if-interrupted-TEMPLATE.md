# step-01b: Resume if Interrupted

**Agent:** lr-orchestrator
**Phase:** Resumption check (between step-01 and step-01c)
**Purpose:** Detect workflow interruption and resume from last checkpoint

---

## Objective

If this workflow was interrupted before completion, load the last checkpoint and resume from where it stopped. Otherwise, continue to normal flow (step-01c).

---

## DEPENDENCIES

- Requires: `step-01-load-session-context.md` (completed, session loaded)
- Requires: Active Beads issue for this workflow execution (tracking issue)
- Requires: MongoDB (workflow_history collection for checkpoints)
- Requires: Resume checkpoint saved in previous run (if interrupted before)

---

## INSTRUCTIONS

### 1. Check for Active Beads Issue

```bash
# Query Beads for any in_progress issue for this workflow
bd list --status=in_progress --module=[WORKFLOW_MODULE] --limit=1

# Expected output: Either issue ID or "No issues found"
```

If no active issue found → skip to "Normal Start" (step 2)
If active issue found → go to "Resume Flow" (step 3)

---

### 2. Normal Start

If no prior issue or issue is closed:
- Load fresh session context from `step-01-load-session-context.md` (already done in step-01)
- Create new Beads issue for this workflow execution:
  ```bash
  bd create --title="[WORKFLOW_NAME] execution session" \
    --type=task \
    --parent=sync-qm-[PHASE] \
    --status=in_progress
  ```
- Continue to next step: `step-01c-[next-step].md`
- **Do NOT continue below** — return to main workflow

---

### 3. Resume Flow

If active Beads issue found:

#### 3a. Load Last Checkpoint

```bash
# Query MongoDB for last checkpoint of this workflow
db.workflow_history.findOne(
  { workflow_id: "[WORKFLOW_ID]", status: "interrupted" },
  { sort: { created_ts: -1 }, limit: 1 }
)

# Expected: { last_step: "step-XX", checkpoint_data: {...}, created_ts: ... }
```

Extract from checkpoint:
- `last_step`: Which step to resume from (e.g., "step-06a")
- `checkpoint_data`: Any state saved from last execution
- `created_ts`: When the checkpoint was created (for logging)

#### 3b. Verify Checkpoint Integrity

Check that checkpoint file exists and is readable:
```bash
# Verify last_step file exists
ls -la _lr/[MODULE]/workflows/[WORKFLOW_NAME]/steps/[last_step].md

# Expected: File exists, readable, non-empty
```

If file NOT found → **Log error and start over** (go to step 2)

#### 3c. Resume State

Print resumption info:
```
═══════════════════════════════════════════════════════════
🔄 WORKFLOW RESUMPTION
═══════════════════════════════════════════════════════════
Workflow: [WORKFLOW_NAME]
Beads Issue: [ISSUE_ID]
Last Step: [last_step]
Checkpoint Created: [created_ts]
Time Elapsed: [duration since checkpoint]
═══════════════════════════════════════════════════════════
```

#### 3d. Resume Execution

Load the checkpoint step and execute it:
```
→ Load: _lr/[MODULE]/workflows/[WORKFLOW_NAME]/steps/[last_step].md
→ Resume with checkpoint_data: [saved state]
→ Continue execution from this step forward
```

Do NOT re-run steps before `[last_step]` (avoid duplication)

#### 3e. Update Beads Issue

When resumed step completes:
```bash
bd update [ISSUE_ID] --notes="
RESUMED:
- Checkpoint: created_ts
- Last step: [last_step]
- Resumed from: [last_step] after resumption check
- Current step: [next_step after last_step]
- Progress: [X steps completed] / [total steps in workflow]
"
```

---

## OUTPUT

### Checkpoint Saved (for next resumption)

When ANY step completes successfully, save a checkpoint:
```bash
# In each step's success section:
db.workflow_history.insertOne({
  workflow_id: "[WORKFLOW_ID]",
  workflow_name: "[WORKFLOW_NAME]",
  user_id: "[SESSION_USER_ID]",
  status: "in_progress",
  last_step: "[current_step]",
  checkpoint_data: {
    session_context: {...},
    accumulated_results: {...},
    phase: "[PHASE_NAME]",
    progress_percent: [X],
  },
  created_ts: "[ISO_8601_TIMESTAMP]",
  updated_ts: "[ISO_8601_TIMESTAMP]"
})
```

This allows resumption from this checkpoint if interrupted again.

---

## SUCCESS METRICS

- ✅ If no prior issue: resume detection skipped, normal start proceeds
- ✅ If prior issue found: checkpoint loaded successfully
- ✅ If checkpoint valid: resumption begins at correct step
- ✅ If checkpoint invalid: falls back to fresh start (no data loss)
- ✅ Beads issue updated with resumption info
- ✅ No steps re-executed (avoid duplication)

---

## FAILURE ANTI-METRICS (What to avoid)

❌ Don't: Create duplicate Beads issues (check before creating)
❌ Don't: Skip checkpoint if issue found (always attempt resumption)
❌ Don't: Corrupt previous results when resuming
❌ Don't: Leave Beads issue in stale status after resumption

---

## NEXT STEP

### If Resumed
→ Continue execution from `[last_step]` forward (already in progress)

### If Normal Start
→ Load and execute: `step-01c-[workflow-specific-next-step].md`

---

## IMPLEMENTATION NOTES

- **Parametrized:** Replace [WORKFLOW_NAME], [MODULE], [WORKFLOW_ID] with actual values
- **Non-blocking:** Resumption check is fast (<1s); does NOT block workflow
- **Stateless:** This step itself is stateless; state lives in MongoDB checkpoint
- **Reversible:** If checkpoint is invalid, fall back to fresh start (no data loss)
- **Observable:** All resumptions logged to Beads and MongoDB for audit trail

---

## Related Documentation

- **Beads Integration:** See `.agents/workflows/EVIDENCE-TEMPLATE.md`
- **Checkpoint Schema:** See `/context/linkright/docs/checkpoint-schema.yaml`
- **MongoDB Config:** See `/context/linkright/_lr/core/config/mongodb-config.yaml`
- **Workflow Execution:** See `/context/linkright/docs/project knowledge/LR-MASTER-ORCHESTRATION.md`
