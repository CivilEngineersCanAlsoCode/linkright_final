# Phase D: Persona Scoring - Weighting & Normalization

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS apply consistent weighting across all personas.
🛑 NEVER skip normalization step.

## DEPENDENCIES
- Requires: `step-41-persona-score-init` output (persona_assessment.yaml)

## EXECUTION PROTOCOLS
1. [READ] Load persona_assessment.yaml from previous step.
2. [WEIGHT] Apply differential weighting based on JD criticality:
   - Critical skills (2.0x weight)
   - Important skills (1.5x weight)
   - Nice-to-have skills (1.0x weight)
   - Deprecated skills (-0.5x weight)
3. [NORMALIZE] Convert weighted scores to 0-1 scale.
4. [AGGREGATE] Compute overall persona fit score.
5. [VALIDATE] Review normalized scores for outliers.

## OUTPUT
- persona_weighted_scores.yaml: Normalized and weighted persona scores
- Next step: step-43-persona-validate

## NOTES
- Weighting directly impacts signal retrieval prioritization
- Document rationale for weight assignments
- Outliers should trigger review
