---
description: 'Phase H: Step 11a — Generation of deepening questions for Type C Gaps (Metric Gaps) to quantify existing signals'
stepsCompleted: [10, 11]
nextStepFile: './step-11b-confirm-and-register-signals.md'
---

# Step 11a: Inquisitor Type C Deepening

## 🎯 OBJECTIVE
Generate specific "deepening" questions to extract missing metrics, scale, and quantifiable results for Type C Gaps (Metric Gaps).

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Every Type C gap identified in Phase G has a corresponding metric-focused question.
- Questions specify the units required (e.g., "%, USD, User count, Time saved").
- Output schema `deepening_queue.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Deepening questions are too broad, failing to elicit specific numbers.
- The agent accepts "qualitative" answers for Type C gaps without one follow-up for "quantification".
- Captured metrics are stored without validation of their units or scale.

## 📥 INPUT
- `type_c_gaps[]`: List of metric gaps from Phase G.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the list of Type C Gaps.
2. **[CONSTRUCT]** For each metric gap, generate a deepening question:
   - **Formula:** `Contextual Achievement + Missing Metric Type + Quantification Hook`.
   - **Example:** "You mentioned [Signal X]. Can you estimate the percentage reduction in latency achieved?"
3. **[FORMAT]** Append these questions to the `inquisitor_queue[]`.
4. **[PROMPT]** Surface deepening questions to the user.
5. **[COLLECT]** Extract specific numbers/metrics from user responses and store verbatim.

## 📤 OUTPUT SCHEMA (`deepening_queue.yaml`)
```yaml
deepening_queue:
  - signal_id: string
    question_text: string
    required_metric_type: string
    user_metric_response: string
    status: "PENDING|CAPTURED"
```

## 🔗 DEPENDENCIES
- Requires: `step-10c` output.
- Blocks: `step-11b-confirm-and-register-signals.md`.
