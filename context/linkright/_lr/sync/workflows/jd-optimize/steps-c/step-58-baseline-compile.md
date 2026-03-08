# Phase F (Extended): Baseline Compilation - Score Aggregation

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS compile scores with consistent methodology.
🛑 NEVER mix different scoring scales.

## DEPENDENCIES
- Requires: `step-49-baseline-gaps` output (gaps_analysis.yaml)

## EXECUTION PROTOCOLS
1. [READ] Load baseline scores and gap analysis.
2. [AGGREGATE] Compute overall scores:
   - Overall JD fit percentage (0-100%)
   - Readiness by requirement category (Critical/Important/Nice-to-have)
   - Strength ranking (top 3 areas, bottom 3 areas)
3. [COMPILE] Create comprehensive baseline_compilation.yaml with:
   - Individual dimension scores
   - Category aggregates
   - Overall fit assessment
   - Confidence levels per score
4. [REPORT] Generate human-readable baseline_summary.md
5. [OUTPUT] Compiled baseline data for gap analysis phase.

## OUTPUT
- baseline_compilation.yaml: Aggregated baseline scores
- baseline_summary.md: Readable score summary

## NOTES
- Baseline compilation guides gap prioritization
- Clear aggregates help communicate readiness to user
- Confidence scores account for evidence quality
