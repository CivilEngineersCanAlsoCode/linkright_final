# Phase D: Persona Scoring - Validation & Review

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS validate with user feedback before proceeding.
🛑 NEVER skip human-in-the-loop validation.

## DEPENDENCIES
- Requires: `step-42-persona-weight` output (persona_weighted_scores.yaml)

## EXECUTION PROTOCOLS
1. [READ] Load persona_weighted_scores.yaml and user profile.
2. [PRESENT] Generate persona fit report highlighting:
   - Strongest persona matches (top 3)
   - Weaker matches needing support (bottom 3)
   - Overall persona readiness score
3. [VALIDATE] Present to user for feedback:
   - Do these persona assessments feel accurate?
   - Are any critical skills missing?
   - Should any persona dimensions be adjusted?
4. [REFINE] Update scores based on user feedback if needed.
5. [DOCUMENT] Store validation feedback and final scores.

## OUTPUT
- persona_final_scores.yaml: Validated and finalized persona scores
- persona_validation_notes.md: User feedback and adjustments
- Next step: step-44-signal-query

## NOTES
- This is key validation step in D phase
- User feedback improves signal retrieval accuracy
- Final scores feed directly into Phase E
