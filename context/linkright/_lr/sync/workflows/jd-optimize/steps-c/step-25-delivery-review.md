---
description: 'Phase M: Step 25 — Final quality gate review of the packaged artifacts before user delivery'
stepsCompleted: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
nextStepFile: './step-26-delivery-confirm.md'
---

# Step 25: Delivery Review

## 🎯 OBJECTIVE
Perform a final visual and technical audit of the delivery package to ensure everything is perfect before the session ends.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- The HTML resume renders correctly without broken layout or missing text.
- The optimization report accurately summarizes the session's success.
- File permissions are set correctly for user access.
- Output schema `delivery_review_audit.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Technical errors (e.g., broken images, CSS failures) are found in the final package.
- The report contains stale data from a previous session.
- The review is bypassed without a final "Green Light" from the agent.

## 📥 INPUT
- `delivery_package.yaml`: The bundled artifacts.

## ⚙️ EXECUTION PROTOCOLS
1. **[OPEN]** Perform a "Silent Render" of the HTML artifact to check for console errors or broken nodes.
2. **[SCRUB]** Scan all artifacts for any remaining system tokens or internal notes.
3. **[VALDIATE]** Ensure the `package_id` is unique and traceable.
4. **[SCORE]** Assign a "Delivery Readiness Score" [0-1.0].

## 📤 OUTPUT SCHEMA (`delivery_review_audit.yaml`)
```yaml
review_audit:
  technical_pass: boolean
  visual_sanity_pass: boolean
  readiness_score: float
  reviewed_by: string
  status: "REVIEWED"
```

## 🔗 DEPENDENCIES
- Requires: `step-24` output.
- Blocks: `step-26-delivery-confirm.md`.
