---
description: 'Phase M: Step 26 — Final user confirmation, artifact handoff, and session closure'
stepsCompleted: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
nextStepFile: 'COMPLETE'
---

# Step 26: Delivery Confirm

## 🎯 OBJECTIVE
Hand off the finalized artifacts to the user, obtain final confirmation, and close the session successfully.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- User provides a final "Confirm" or "Thank you" on the delivery.
- The session is marked as `completed` in the Beads issue tracker.
- A final summary message is displayed listing all exported files.
- Output schema `session_closure_audit.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Session is left "open" or "in-progress" after delivery.
- User is not provided with the final file paths.
- The session fails to record the "Uplift" in the global career metrics.

## 📥 INPUT
- `delivery_review_audit.yaml`: The final quality pass.

## ⚙️ EXECUTION PROTOCOLS
1. **[DISPLAY]** Show the final list of artifacts and their locations to the user.
2. **[HANDOFF]** Present the "Session Summary": "We achieved a [Uplift]% improvement in fit for the [Role] at [Company]."
3. **[CONFIRM]** Ask: "Are you satisfied with the optimization results? (Y/N)"
4. **[CLOSE]** Mark the parent Beads feature as `closed` with the final report evidence.
5. **[END]** Signal workflow completion.

## 📤 OUTPUT SCHEMA (`session_closure_audit.yaml`)
```yaml
closure_audit:
  user_satisfied: boolean
  completion_timestamp: string
  total_steps_executed: int
  final_uplift: float
  beads_closed: boolean
  status: "SESSION_CLOSED"
```

## 🔗 DEPENDENCIES
- Requires: All previous steps complete.
- Blocks: NONE (Workflow End).
