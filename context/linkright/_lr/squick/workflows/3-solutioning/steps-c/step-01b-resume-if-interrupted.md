# step-01b: Resume if Interrupted

## PRECONDITION
🛑 NEVER execute this step without first completing `step-01-load-session-context.md`.
✅ ALWAYS ensure that session context (user details, mode) is loaded into memory.

**Agent:** lr-orchestrator
**Phase:** Resumption check (between step-01 and step-01c)
**Purpose:** Detect workflow interruption and resume from last checkpoint

---

## Objective

If this workflow was interrupted before completion, load the last checkpoint and resume from where it stopped. Otherwise, continue to normal flow.

---

## DEPENDENCIES

- Requires: `step-01-load-session-context.md` (completed)
- Requires: Active Beads issue tracking this workflow
- Requires: MongoDB workflow_history collection

---

## INSTRUCTIONS

### 1. Check for Active Beads Issue

```bash
bd list --status=in_progress --limit=1
```

If found → Resume Flow (step 3)
If not found → Normal Start (step 2)

---

### 2. Normal Start

If no prior issue:
- Create new Beads issue for this workflow execution
- Continue to next step
- **Return to workflow** — do NOT continue below

---

### 3. Resume Flow

If active issue found:

#### 3a. Load Last Checkpoint

Query MongoDB:
```bash
db.workflow_history.findOne(
  { status: "interrupted" },
  { sort: { created_ts: -1 }, limit: 1 }
)
```

Extract: `last_step`, `checkpoint_data`, `created_ts`

#### 3b. Verify Checkpoint

Check last_step file exists:
```bash
ls -la steps/[last_step].md
```

If missing → Start over (go to step 2)

#### 3c. Log Resumption

```
═══════════════════════════════════════════════════════════
🔄 WORKFLOW RESUMPTION
Last Step: [last_step]
Checkpoint Created: [created_ts]
═══════════════════════════════════════════════════════════
```

#### 3d. Resume Execution

Load and execute from `[last_step]`

#### 3e. Update Beads

```bash
bd update [ISSUE_ID] --notes="
RESUMED:
- Last step: [last_step]
- Progress: [X] / [total] steps
"
```

---

## OUTPUT

Save checkpoint after each step success:
```bash
db.workflow_history.insertOne({
  status: "in_progress",
  last_step: "[current_step]",
  checkpoint_data: {...},
  created_ts: "[ISO_TIMESTAMP]"
})
```

---

## SUCCESS METRICS

- ✅ Resumption detection works
- ✅ Checkpoint loads correctly
- ✅ Execution continues from last step
- ✅ No step duplication
- ✅ Beads issue updated

---

## NEXT STEP

→ Continue from `[last_step]` or load `step-01c`

---

## See Also

- `.agents/workflows/step-01b-resume-if-interrupted-TEMPLATE.md` (full reference)
- `.agents/workflows/EVIDENCE-TEMPLATE.md` (evidence requirements)
