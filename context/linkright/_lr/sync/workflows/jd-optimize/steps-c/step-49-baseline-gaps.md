# Phase F: Baseline Scoring - Gap Quantification

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS calculate gaps from baseline scores.
🛑 NEVER ignore critical gaps in scoring.

## DEPENDENCIES
- Requires: `step-48-baseline-score` output (baseline_scores.yaml)

## EXECUTION PROTOCOLS
1. [READ] Load baseline_scores.yaml from previous step.
2. [COMPARE] Calculate gap for each JD dimension:
   - Gap = (Required Score - Actual Score)
   - Critical gaps (20+ point deficit)
   - Important gaps (10-19 points)
   - Minor gaps (1-9 points)
   - No gap (score meets or exceeds requirement)
3. [SUMMARIZE] Generate gap summary by category.
4. [RANK] Sort gaps by impact on position success:
   - Criticality weight
   - Frequency in JD (how often mentioned)
   - Market rarity (how hard to find)
5. [OUTPUT] Generate gaps_analysis.yaml with all gap data.

## OUTPUT
- gaps_analysis.yaml: Quantified gap assessment
- Next step: step-50-gap-category

## NOTES
- Gap analysis drives inquisitor questions in Phase H
- Prioritized gaps direct content strategy
- Large gaps may trigger negotiation talking points
