# Phases D-M Implementation Plan (67-Step Sync Engine)

This plan outlines the decomposition and implementation strategy for the 10 missing phases (D-M) in the Linkright Sync module, achieving full B-MAD parity and standardizing the 67-step workflow across all Sync applications.

---

## 1. Phase Mapping (Squick ↔ Sync)

As per Satvik's direction, the Squick 4-phase methodology is mapped onto the 10 Sync phases (D-M).

| Squick Phase | Sync Phases (D-M) | Purpose |
| :--- | :--- | :--- |
| **Analysis** | Phase D: Persona Scoring<br>Phase E: Signal Retrieval<br>Phase F: Baseline Scoring<br>Phase G: Gap Analysis | Analyze input signals and determine the best "tilt" and gap priorities. |
| **Plan** | Phase H: Inquisitor Gap Fill<br>Phase I: Narrative Mapping | Refine context via user interaction and plan the specific artifact structure. |
| **Solutioning** | Phase J: Content Writing<br>Phase K: Layout Validation<br>Phase L: Styling & Compile | Generate, validate, and style the output artifact (Resume, Portfolio, etc.). |
| **Implementation**| Phase M: Final Scoring & Store | Post-execution audit, score uplift calculation, and persistence. |

---

## 2. Detailed Step Decomposition (49 New Steps)

These steps will be implemented as `steps-c/`, `steps-e/`, and `steps-v/` in all Sync workflows.

### Phase D: Persona Scoring (5 steps)
- `step-06a-score-tech-pm-fit.md`
- `step-06b-score-growth-pm-fit.md`
- `step-06c-score-strategy-pm-fit.md`
- `step-06d-score-product-pm-fit.md`
- `step-06e-select-primary-persona.md`

### Phase E: Signal Retrieval (5 steps)
- `step-07-construct-retrieval-query.md`
- `step-08-retrieve-top-k-signals.md`
- `step-08a-filter-by-persona-relevance.md`
- `step-08b-rank-by-metric-density.md`
- `step-08c-group-by-signal-type.md`

### Phase F: Baseline Scoring (6 steps)
- `step-09a-score-keyword-coverage.md`
- `step-09b-score-ownership-match.md`
- `step-09c-score-metric-density.md`
- `step-09d-score-persona-alignment.md`
- `step-09e-score-scope-match.md`
- `step-09f-aggregate-baseline-score.md`

### Phase G: Gap Analysis (3 steps)
- `step-10a-identify-type-a-gaps.md`
- `step-10b-identify-type-b-gaps.md`
- `step-10c-identify-type-c-gaps.md`

### Phase H: Inquisitor Gap Fill (3 steps)
- `step-11-inquisitor-type-a-questions.md`
- `step-11a-inquisitor-type-c-deepening.md`
- `step-11b-confirm-and-register-signals.md`

### Phase I: Narrative Mapping (7 steps)
- `step-12-map-requirements-to-signals.md`
- `step-13a-plan-summary-positioning.md`
- `step-13b-plan-role1-bullet-strategy.md`
- `step-13c-plan-role2-bullet-strategy.md`
- `step-13d-plan-role3-bullet-strategy.md`
- `step-13e-plan-skills-ordering.md`
- `step-13f-user-confirm-narrative-plan.md`

### Phase J: Content Writing (5 steps)
- `step-14-write-professional-summary.md`
- `step-15a-write-role1-bullets.md`
- `step-15b-write-role2-bullets.md`
- `step-15c-write-role3-bullets.md`
- `step-16-write-skills-section.md`

### Phase K: Layout Validation (3 steps)
- `step-17a-sizer-line-overflow-check.md`
- `step-17b-sizer-page-budget-check.md`
- `step-17c-sizer-refiner-iterate.md`

### Phase L: Styling & Compile (3 steps)
- `step-18-select-resume-template.md`
- `step-19-inject-company-branding.md`
- `step-20-compile-html-css.md`

### Phase M: Final Scoring & Store (9 steps)
- `step-21a-score-keyword-coverage-final.md`
- `step-21b-score-ownership-match-final.md`
- `step-21c-score-metric-density-final.md`
- `step-21d-score-persona-alignment-final.md`
- `step-21e-score-scope-match-final.md`
- `step-21f-aggregate-final-score.md`
- `step-21g-calculate-uplift.md`
- `step-22-store-resume-version.md`
- `step-23-generate-optimization-report.md`

---

## 3. Implementation Schedule (Sprint-based)

| Sprint | Goal | Deliverables |
| :--- | :--- | :--- |
| **Sprint 1** | Analysis (D-G) | 19 step files; signal scoring logic; gap identification. |
| **Sprint 2** | Plan & Draft (H-J) | 15 step files; Inquisitor questions; narrative mapping; content generation. |
| **Sprint 3** | Polish & Audit (K-M) | 15 step files; Sizer validation; Styling; Final scoring & report generation. |

---

## 4. Success Criteria

- ✅ All 49 step files exist in `sync-jd-optimize`.
- ✅ All step files follow the **Atomic Step Standard** (one cognitive operation per file).
- ✅ Every step includes the **Checkpoint Save** instruction (`bd update --set-metadata`).
- ✅ Cross-module standardization: `outbound-campaign` and `portfolio-deploy` adopt the same phase structure.
- ✅ Squick mapping is explicitly noted in the phase header within each file.
