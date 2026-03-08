# Phase E: Signal Retrieval - Ranking & Prioritization

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS rank signals by relevance to JD requirements.
🛑 NEVER rank by recency alone—prioritize JD fit.

## DEPENDENCIES
- Requires: `step-45-signal-extract` output (signal_map.yaml)
- Requires: `step-06-final-output` output (JD priority requirements)

## EXECUTION PROTOCOLS
1. [READ] Load signal_map.yaml and JD priority requirements.
2. [SCORE] Re-score signals against JD requirements:
   - Critical-to-JD signals: +3 points
   - Important signals: +2 points
   - Supporting signals: +1 point
   - Outdated signals: -1 point
3. [RANK] Sort all signals by composite score (query weight + JD fit).
4. [PRIORITIZE] Identify top-20 signals for later narrative use.
5. [VALIDATE] Ensure top signals have strong evidence and relevance.

## OUTPUT
- signal_ranked.yaml: Signals ranked by JD relevance
- signal_top_20.md: Summary of highest-impact signals
- Next step: step-47-signal-validate

## NOTES
- Top-ranked signals drive narrative content creation
- Ranking determines which signals get featured in positioning
- Low-ranked signals kept as backup evidence
