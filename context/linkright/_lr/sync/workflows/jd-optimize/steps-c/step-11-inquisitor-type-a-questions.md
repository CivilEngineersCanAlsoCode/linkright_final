---
description: 'Phase H: Step 11 — Generation of targeted interview questions for Type A Gaps (Critical Absences)'
stepsCompleted: [10]
nextStepFile: './step-11a-inquisitor-type-c-deepening.md'
---

# Step 11: Inquisitor Type A Questions

## 🎯 OBJECTIVE
Generate the specific high-signal interview questions required to extract raw career signals for Type A Gaps (Critical Absences).

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Every Type A gap identified in Phase G has at least one targeted question.
- Questions are context-grounded (referencing specific JD requirements).
- Output schema `inquisitor_queue.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Questions are generic ("Tell me about your technical skills").
- High-priority gaps are skipped in the question queue.
- Follow-up prompts fail to specify the type of evidence (STAR method) needed.

## 📥 INPUT
- `type_a_gaps[]`: List of critical absences from Phase G.
- `sync-inquisitor-prompts.md`: Prompt templates.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the list of Type A Gaps.
2. **[CONSTRUCT]** For each critical gap, generate a high-signal interview question:
   - **Formula:** `JD Context + Gap Type + Elicitation Hook`.
3. **[FORMAT]** Assemble the `inquisitor_queue[]`.
4. **[PROMPT]** Surface the questions to the user and wait for raw response.
5. **[COLLECT]** Store the user's raw response verbatim.

## 📤 OUTPUT SCHEMA (`inquisitor_queue.yaml`)
```yaml
inquisitor_queue:
  - gap_id: string
    question_text: string
    target_evidence: "Metric|Action|Outcome"
    user_response_raw: string
    status: "PENDING|CAPTURED"
```

## 🔗 DEPENDENCIES
- Requires: `step-10a` output.
- Blocks: `step-11b-confirm-and-register-signals.md`.
