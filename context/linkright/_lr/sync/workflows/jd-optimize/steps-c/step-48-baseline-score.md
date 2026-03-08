# Phase F: Baseline Scoring - Signal Quantification

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS score against JD requirements systematically.
🛑 NEVER mix relative and absolute scoring methods.

## DEPENDENCIES
- Requires: `step-47-signal-validate` output (signals_final_validated.yaml)
- Requires: `step-06-final-output` output (JD scoring dimensions)

## EXECUTION PROTOCOLS
1. [READ] Load validated signals and JD scoring dimensions (10+ dims).
2. [SCORE] For each JD dimension, quantify user readiness:
   - Expert (80-100): Deep mastery, proven track record
   - Proficient (60-79): Solid skill, regular use
   - Intermediate (40-59): Exposure, developing skill
   - Beginner (20-39): Basic knowledge, limited experience
   - Missing (0-19): No evidence found
3. [AGGREGATE] Compute baseline score per JD requirement:
   - Critical requirements: weight × 2.0
   - Important requirements: weight × 1.5
   - Nice-to-have: weight × 1.0
4. [OUTPUT] Generate baseline_scores.yaml with all scores.

## OUTPUT
- baseline_scores.yaml: Quantified baseline assessment
- Next step: step-49-baseline-gaps

## NOTES
- Baseline scores are inputs to gap analysis
- Scoring must be evidence-based from signal validation
- Conservative scoring recommended for credibility
