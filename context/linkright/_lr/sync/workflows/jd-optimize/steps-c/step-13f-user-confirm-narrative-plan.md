---
description: 'Phase I: Step 13f — Final user confirmation of the narrative plan before content generation'
stepsCompleted: [11, 12, 13]
nextStepFile: './step-14-write-professional-summary.md'
---

# Step 13f: User Confirm Narrative Plan

## 🎯 OBJECTIVE
Present the full `sync-narrative-plan.md` to the user for final review and confirmation, ensuring the human-in-the-loop approves the strategic "tilt" and signal selection.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- User provides an explicit "Confirm" or "Y" on the narrative plan.
- The plan artifact is updated with `status: user-confirmed`.
- Output schema `narrative_confirmation.yaml` records the user's final decision.

### ❌ SYSTEM FAILURE:
- The agent proceeds to Phase J (Content Writing) without user sign-off.
- User feedback is ignored or not incorporated into the plan.
- The plan artifact remains in a "draft" state.

## 📥 INPUT
- `sync-narrative-plan.md`: The fully populated plan.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the finalized `sync-narrative-plan.md`.
2. **[PRESENT]** Display the summary and role-specific strategies to the user.
3. **[PROMPT]** Ask: "Review the narrative plan. Approve (Y/N) or suggest changes?"
4. **[ADJUST]** If changes are requested, return to the relevant sub-step (13a-13e).
5. **[FINALIZE]** Once approved, update the artifact frontmatter.

## 📤 OUTPUT SCHEMA (`narrative_confirmation.yaml`)
```yaml
confirmation_status:
  approved: boolean
  user_notes: string
  final_tilt: string
  readiness_for_writing: boolean
```

## 🔗 DEPENDENCIES
- Requires: All sub-steps 13a-13e complete.
- Blocks: `step-14-write-professional-summary.md` (Phase J).
