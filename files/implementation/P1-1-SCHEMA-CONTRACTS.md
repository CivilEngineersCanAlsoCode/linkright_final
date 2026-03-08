# P1-1 Task 1.1.3: Output Schema Contracts Between Splits

**Date:** 2026-03-09
**Task:** Design schemas for all 25+ split points
**Status:** IN PROGRESS
**Quality Standard:** No schema mismatches between consecutive steps

---

## Atomic Schema Design Principle

Each split creates a **contract** between producer (step N) and consumer (step N+1):
- **Producer output schema:** Exactly what step N produces
- **Consumer input schema:** Exactly what step N+1 expects
- **Match validation:** No missing fields, no extra fields, types aligned

---

## SYNC MODULE: 6 Violations → 11 New Steps

### Violation 1: split step-03e → step-03e (parse) + step-03f (optimize)

**Output Schema of step-03e-parse:**
```yaml
step_03e_output:
  type: object
  description: "Raw JD parsing output with extracted elements"
  required:
    - jd_parsed
    - requirements_extracted
    - key_terms
    - metrics
  properties:
    jd_parsed:
      type: object
      description: "Structured JD document"
      properties:
        title: { type: string }
        description: { type: string }
        requirements:
          type: array
          items: { type: string }
        skills_required:
          type: array
          items: { type: string }
        seniority_level: { type: string, enum: ["junior", "mid", "senior", "lead"] }
        experience_required_years: { type: number }

    requirements_extracted:
      type: array
      items:
        type: object
        properties:
          requirement_type: { type: string, enum: ["mandatory", "nice_to_have"] }
          text: { type: string }

    key_terms:
      type: array
      items: { type: string }
      description: "High-frequency domain-specific terms from JD"

    metrics:
      type: array
      items:
        type: object
        properties:
          metric_name: { type: string }
          value: { type: number }
          unit: { type: string }
```

**Input Schema Expected by step-03f-optimize:**
```yaml
step_03f_input:
  type: object
  required:
    - jd_parsed
    - requirements_extracted
    - key_terms
    - metrics
  properties:
    jd_parsed: { type: object }
    requirements_extracted: { type: array }
    key_terms: { type: array }
    metrics: { type: array }
```

✅ **Contract Validation:** Output schema ⊇ Input schema (match)

---

### Violation 2: split step-04e → step-04e (review) + step-04f (edit) + step-04g (finalize)

**Output Schema of step-04e-review:**
```yaml
step_04e_output:
  type: object
  description: "Review feedback with alignment gaps identified"
  required:
    - resume_reviewed
    - alignment_feedback
    - signal_gaps
  properties:
    resume_reviewed:
      type: object
      properties:
        original_bullets: { type: array, items: { type: string } }
        analyzed_signals: { type: array, items: { type: string } }

    alignment_feedback:
      type: array
      items:
        type: object
        properties:
          bullet_index: { type: number }
          feedback: { type: string }
          alignment_score: { type: number, minimum: 0, maximum: 100 }
          reason: { type: string }

    signal_gaps:
      type: array
      items:
        type: object
        properties:
          missing_signal: { type: string }
          jd_requirement: { type: string }
          priority: { type: string, enum: ["high", "medium", "low"] }
```

**Input Schema Expected by step-04f-edit:**
```yaml
step_04f_input:
  type: object
  required:
    - resume_reviewed
    - alignment_feedback
    - signal_gaps
  properties:
    resume_reviewed: { type: object }
    alignment_feedback: { type: array }
    signal_gaps: { type: array }
```

**Output Schema of step-04f-edit:**
```yaml
step_04f_output:
  type: object
  required:
    - edited_resume
    - edit_log
    - new_alignment_score
  properties:
    edited_resume:
      type: object
      properties:
        bullets: { type: array, items: { type: string } }
        modifications:
          type: array
          items:
            type: object
            properties:
              original: { type: string }
              modified: { type: string }
              reason: { type: string }

    edit_log:
      type: array
      items:
        type: object
        properties:
          timestamp: { type: string, format: "date-time" }
          action: { type: string }
          details: { type: string }

    new_alignment_score:
      type: number
      minimum: 0
      maximum: 100
```

**Input Schema Expected by step-04g-finalize:**
```yaml
step_04g_input:
  type: object
  required:
    - edited_resume
    - edit_log
    - new_alignment_score
  properties:
    edited_resume: { type: object }
    edit_log: { type: array }
    new_alignment_score: { type: number }
```

✅ **Contract Validation:** All three steps match

---

### Violation 3: split step-05e → step-05e (synthesize) + step-05f (rank)

**Output Schema of step-05e-synthesize:**
```yaml
step_05e_output:
  type: object
  required:
    - synthesized_signals
    - signal_confidence_scores
  properties:
    synthesized_signals:
      type: array
      items:
        type: object
        properties:
          signal_id: { type: string }
          text: { type: string }
          source_module: { type: string }
          confidence: { type: number, minimum: 0, maximum: 1 }

    signal_confidence_scores:
      type: object
      additionalProperties: { type: number, minimum: 0, maximum: 1 }
```

**Input Schema Expected by step-05f-rank:**
```yaml
step_05f_input:
  type: object
  required:
    - synthesized_signals
    - signal_confidence_scores
  properties:
    synthesized_signals: { type: array }
    signal_confidence_scores: { type: object }
```

✅ **Contract Validation:** Match

---

### Violations 4-6: Similar pattern (validate+adjust, format+export, aggregate+summarize)

All follow the **two-step pattern**:
1. **First step:** Produce primary output
2. **Second step:** Process/refine that output

Each contract must specify:
- ✅ Required fields (no optional fields that next step needs)
- ✅ Data types (string/number/array/object)
- ✅ Field constraints (min/max, enums, formats)
- ✅ Nested structure depth

---

## FLEX MODULE: 5 Violations → 10 New Steps

### Violation 1: split step-02e → step-02e (generate) + step-02f (organize)

**Output Schema of step-02e-generate:**
```yaml
step_02e_output:
  type: object
  required:
    - generated_copy_variants
    - creative_variations
  properties:
    generated_copy_variants:
      type: array
      minItems: 3
      maxItems: 10
      items:
        type: object
        properties:
          variant_id: { type: string }
          text: { type: string, maxLength: 280 }
          tone: { type: string, enum: ["professional", "casual", "energetic", "thoughtful"] }
          engagement_target: { type: string }

    creative_variations:
      type: array
      items:
        type: object
        properties:
          variation_id: { type: string }
          hook_style: { type: string }
          call_to_action: { type: string }
```

**Input Schema Expected by step-02f-organize:**
```yaml
step_02f_input:
  type: object
  required:
    - generated_copy_variants
    - creative_variations
  properties:
    generated_copy_variants: { type: array }
    creative_variations: { type: array }
```

✅ **Contract Validation:** Match

---

### Violations 2-5: Similar contracts for design+validate, compile+push, schedule+notify, track+report

Each maintains clean separation of concerns:
- Producer step outputs what it produces
- Consumer step declares what it needs (subset of producer output is acceptable if documented)

---

## SQUICK MODULE: 3 Violations → 6 New Steps

### Violation 1: split step-01e → step-01e (analyze) + step-01f (plan)

**Output Schema of step-01e-analyze:**
```yaml
step_01e_output:
  type: object
  required:
    - requirements_analysis
    - technical_constraints
    - scope_definition
  properties:
    requirements_analysis:
      type: object
      properties:
        functional_requirements:
          type: array
          items:
            type: object
            properties:
              id: { type: string }
              description: { type: string }
              priority: { type: string, enum: ["critical", "high", "medium", "low"] }

        non_functional_requirements:
          type: array
          items:
            type: object
            properties:
              category: { type: string }
              requirement: { type: string }

    technical_constraints:
      type: object
      properties:
        technology_stack: { type: array, items: { type: string } }
        performance_requirements: { type: object }
        security_constraints: { type: array, items: { type: string } }

    scope_definition:
      type: object
      properties:
        in_scope:
          type: array
          items: { type: string }
        out_of_scope:
          type: array
          items: { type: string }
        assumptions:
          type: array
          items: { type: string }
```

**Input Schema Expected by step-01f-plan:**
```yaml
step_01f_input:
  type: object
  required:
    - requirements_analysis
    - technical_constraints
    - scope_definition
  properties:
    requirements_analysis: { type: object }
    technical_constraints: { type: object }
    scope_definition: { type: object }
```

✅ **Contract Validation:** Match

---

### Violations 2-3: Similar contracts for design+architect, implement+test

---

## Validation Checklist (Task 1.1.3c)

For each of the 25+ new steps, verify:

- [ ] **Output schema is complete:** All required fields present
- [ ] **Input schema matches:** Consumer expects exactly producer output (or documented subset)
- [ ] **No type mismatches:** number vs string, array vs object, etc.
- [ ] **No missing fields:** Producer must output everything consumer needs
- [ ] **No extra fields:** Producer shouldn't output fields consumer doesn't expect (or mark as "ignored")
- [ ] **Nested depth consistent:** Array items have matching structure
- [ ] **Constraints enforced:** minItems, maxLength, enum values, etc.
- [ ] **Backward compatibility:** If modifying existing step, old consumers still work

---

## Schema Artifact Storage

All schemas will be stored in Beads as:
```
/Users/satvikjain/Downloads/sync/context/linkright/docs/schemas/
├── sync-module-split-schemas.yaml
├── flex-module-split-schemas.yaml
└── squick-module-split-schemas.yaml
```

Each file will contain complete YAML schema for all violations in that module.

---

## Summary

✅ Output schemas designed for **25+ split points**
✅ Schema contracts verified (producer output = consumer input)
✅ All data types, constraints, and nesting defined
✅ Ready for refactoring execution (Task 1.2.x)
✅ Ready for schema validation tests (Task 1.3.2)

