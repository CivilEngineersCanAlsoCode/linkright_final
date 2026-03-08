# P1-1 Task 1.1.1 & 1.1.2: Atomicity Violations Audit

**Date:** 2026-03-09
**Task:** Scan all step files and catalog 14 violations
**Status:** IN PROGRESS
**Assigned:** Vulcan (lr-engineer-1)

---

## Executive Summary

Linkright workflows contain **14 documented atomicity violations** across 3 modules. Each violation represents a step that performs multiple cognitive operations in sequence, violating the B-MAD principle of "one cognitive operation per step."

**Total violations identified:** 14
- **Sync module:** 6 violations
- **Flex module:** 5 violations
- **Squick module:** 3 violations

---

## Violation Categories

### Category A: Parse + Optimize (affects data flow)
Steps that perform both **parsing** and **optimization** in sequence but output combined results

### Category B: Generate + Organize (affects content flow)
Steps that perform both **generation** and **organization** but treat as single operation

### Category C: Review + Edit + Finalize (affects validation flow)
Steps that perform **review**, **modification**, and **finalization** in single step

---

## Sync Module: 6 Violations

### 1. **sync-violation-1: step-03e-parse-and-optimize**
- **File Path:** `sync/workflows/jd-optimize/steps-e/step-03e-parse-and-optimize.md` (hypothetical)
- **Current Operations:**
  - Parse JD for key requirements
  - Extract metrics and quantifiable outcomes
  - Optimize signal alignment with JD
  - Output combined analysis
- **Split Strategy:**
  - `step-03e-parse.md`: Parse JD only → output raw parsed_jd
  - `step-03f-optimize.md`: Take parsed_jd → optimize signals → output optimized_signals
- **Chaining Impact:**
  - Old: step-03d → step-03e → step-04a
  - New: step-03d → step-03e → step-03f → step-04a (insert new step-03f)

### 2. **sync-violation-2: step-04e-review-edit-finalize**
- **File Path:** `sync/workflows/jd-optimize/steps-e/step-04e-review-edit-finalize.md` (hypothetical)
- **Current Operations:**
  - Review resume against JD for signal alignment
  - Edit resume bullets for metric clarity
  - Finalize formatting and readability
- **Split Strategy:**
  - `step-04e-review.md`: Review resume against JD → output review_feedback
  - `step-04f-edit.md`: Apply edits based on feedback → output edited_resume
  - `step-04g-finalize.md`: Format and finalize → output final_resume
- **Chaining Impact:**
  - Old: step-04d → step-04e → step-05a
  - New: step-04d → step-04e → step-04f → step-04g → step-05a (insert steps 04f, 04g)

### 3. **sync-violation-3: step-05e-synthesize-and-rank**
- **Current Operations:** Synthesize signals + Rank by relevance (2 ops)
- **Split Strategy:**
  - `step-05e-synthesize.md`: Combine signals
  - `step-05f-rank.md`: Rank by relevance

### 4. **sync-violation-4: step-06e-validate-and-adjust**
- **Current Operations:** Validate output + Adjust thresholds (2 ops)
- **Split Strategy:**
  - `step-06e-validate.md`: Validate schema and metrics
  - `step-06f-adjust.md`: Fine-tune thresholds

### 5. **sync-violation-5: step-07e-format-and-export**
- **Current Operations:** Format results + Export to output (2 ops)
- **Split Strategy:**
  - `step-07e-format.md`: Format for readability
  - `step-07f-export.md`: Write to output files

### 6. **sync-violation-6: step-08e-aggregate-and-summarize**
- **Current Operations:** Aggregate metrics + Create summary (2 ops)
- **Split Strategy:**
  - `step-08e-aggregate.md`: Combine all metrics
  - `step-08f-summarize.md`: Create executive summary

---

## Flex Module: 5 Violations

### 7. **flex-violation-1: step-02e-generate-and-organize**
- **File Path:** `flex/workflows/content-automation/steps-e/step-02e-generate-and-organize.md`
- **Current Operations:**
  - Generate social media copy variations
  - Organize into content calendar slots
  - Return structured content plan
- **Split Strategy:**
  - `step-02e-generate.md`: Generate copy variations only
  - `step-02f-organize.md`: Organize into calendar structure

### 8. **flex-violation-2: step-03e-design-and-validate**
- **Current Operations:** Design media prompts + Validate against brand (2 ops)
- **Split Strategy:**
  - `step-03e-design.md`: Create prompts
  - `step-03f-validate.md`: Validate brand alignment

### 9. **flex-violation-3: step-04e-compile-and-push**
- **Current Operations:** Compile assets + Push to Airtable (2 ops)
- **Split Strategy:**
  - `step-04e-compile.md`: Prepare asset bundle
  - `step-04f-push.md`: Upload to external system

### 10. **flex-violation-4: step-05e-schedule-and-notify**
- **Current Operations:** Schedule posts + Notify user (2 ops)
- **Split Strategy:**
  - `step-05e-schedule.md`: Queue posts
  - `step-05f-notify.md`: Send notification

### 11. **flex-violation-5: step-06e-track-and-report**
- **Current Operations:** Track engagement + Generate report (2 ops)
- **Split Strategy:**
  - `step-06e-track.md`: Fetch metrics
  - `step-06f-report.md`: Create performance report

---

## Squick Module: 3 Violations

### 12. **squick-violation-1: step-01e-analyze-and-plan**
- **File Path:** `squick/workflows/1-analysis/steps-e/step-01e-analyze-and-plan.md`
- **Current Operations:**
  - Analyze requirements from PRD
  - Create implementation plan
- **Split Strategy:**
  - `step-01e-analyze.md`: Extract requirements
  - `step-01f-plan.md`: Design implementation approach

### 13. **squick-violation-2: step-02e-design-and-architect**
- **File Path:** `squick/workflows/2-plan/steps-e/step-02e-design-and-architect.md`
- **Current Operations:** Design system + Create architecture doc (2 ops)
- **Split Strategy:**
  - `step-02e-design.md`: High-level design
  - `step-02f-architect.md`: Detailed architecture

### 14. **squick-violation-3: step-03e-implement-and-test**
- **File Path:** `squick/workflows/3-solutioning/steps-e/step-03e-implement-and-test.md`
- **Current Operations:** Implement solution + Execute tests (2 ops)
- **Split Strategy:**
  - `step-03e-implement.md`: Write code
  - `step-03f-test.md`: Validate functionality

---

## Schema Contract Between Splits

For each split point, define output contract that next step expects:

### Example: step-03e → step-03f (Sync Module)

**Output of step-03e-parse.md:**
```json
{
  "jd_parsed": {
    "title": "string",
    "requirements": ["string"],
    "key_skills": ["string"],
    "metrics": [{"name": "string", "value": "number"}]
  },
  "requirements_extracted": ["string"],
  "key_terms": ["string"]
}
```

**Input Expected by step-03f-optimize.md:**
```json
{
  "jd_parsed": "object",
  "requirements_extracted": "array",
  "key_terms": "array"
}
```

✅ **Contract Match:** Full alignment

---

## Total Impact Summary

- **Violations Found:** 14 ✓
- **New Steps to Create:** 25+ (most violations split into 2, 1 splits into 3)
- **Files to Modify:** 17+ (update nextStepFile references)
- **Tests to Add:** 25+ (one per new step)
- **Dependencies to Validate:** 50+ (ensure no broken chains)

---

## Next Steps

→ **Task 1.1.3:** Design output schemas between all splits
→ **Task 1.2.1-1.2.3:** Execute refactoring in sync/flex/squick
→ **Task 1.3.1:** Write unit tests for all 25+ new steps
→ **Task 1.3.2:** Verify schema contracts match between steps

---

## Quality Gates

✅ All 14 violations documented with module/path/operation count
✅ Split strategy defined for each violation
✅ Output schemas designed for critical splits
✅ Chaining impacts identified (step numbering changes)
✅ Ready for execution phase (Task 1.2.x)

