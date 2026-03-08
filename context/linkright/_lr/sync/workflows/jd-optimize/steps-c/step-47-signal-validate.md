# Phase E: Signal Retrieval - Final Validation

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS validate top-20 signals with user.
🛑 NEVER assume signal accuracy without human review.

## DEPENDENCIES
- Requires: `step-46-signal-rank` output (signal_ranked.yaml)

## EXECUTION PROTOCOLS
1. [READ] Load signal_ranked.yaml and top-20 summary.
2. [PRESENT] Generate signal validation report:
   - Top 20 extracted signals with evidence
   - JD relevance scores
   - Supporting context for each signal
3. [VALIDATE] Ask user to confirm signals:
   - Are these signals accurately described?
   - Is any critical signal missing?
   - Are there signals that shouldn't be included?
4. [REFINE] Update signal map based on user corrections.
5. [FINALIZE] Lock signal set for Phase F baseline scoring.

## OUTPUT
- signals_final_validated.yaml: Final validated signal set
- signal_validation_notes.md: User feedback recorded
- Next step: Phase F baseline scoring begins

## NOTES
- Validated signals are inputs to baseline scoring
- User feedback refines signal accuracy
- Large gaps trigger Phase H inquisitor questions
