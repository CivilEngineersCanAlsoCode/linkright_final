---
description: 'Phase H: Step 11b — Final confirmation of interview responses and registration of new career signals into the database'
stepsCompleted: [10, 11, 11.5]
nextStepFile: './step-12-map-requirements-to-signals.md'
---

# Step 11b: Confirm and Register Signals

## 🎯 OBJECTIVE
Transform raw user responses from the Inquisitor phase into structured, verified career signals and register them in the system for narrative mapping.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- All raw responses from `step-11` and `step-11a` are reviewed and confirmed by the user.
- New signals are formatted correctly (Context, Action, Result) before registration.
- Final match scores for remediated gaps are calculated and updated.

### ❌ SYSTEM FAILURE:
- Unverified raw text is passed to Phase I without structuring.
- The user is not given a chance to edit or refine the captured responses.
- Signal registration fails to link new evidence to the original JD requirement IDs.

## 📥 INPUT
- `inquisitor_queue.yaml`: Raw responses for Type A gaps.
- `deepening_queue.yaml`: Extracted metrics for Type C gaps.

## ⚙️ EXECUTION PROTOCOLS
1. **[REVIEW]** Present the captured responses and metrics to the user.
2. **[EDIT]** Allow the user to make 1 final refinement to the text or numbers.
3. **[STRUCTURE]** Convert refined responses into structured **Career Signal Blocks**:
   - **Signal ID:** [Generated]
   - **Context:** Verbatim task context.
   - **Action:** User's specific contribution.
   - **Result:** Confirmed metrics and outcomes.
4. **[REGISTER]** Append new signals to the `top_signals[]` pool.
5. **[UPDATE]** Update the match status of remediated gaps from "Gap" to "Matched".

## 📤 OUTPUT SCHEMA (`verified_signals.yaml`)
```yaml
new_signals:
  - requirement_id: string
    signal_id: string
    structured_content: string
    confirmed_metrics: [string]
    new_match_score: float
```

## 🔗 DEPENDENCIES
- Requires: `step-11` and `step-11a` output.
- Blocks: `step-12-map-requirements-to-signals.md` (Phase I).
