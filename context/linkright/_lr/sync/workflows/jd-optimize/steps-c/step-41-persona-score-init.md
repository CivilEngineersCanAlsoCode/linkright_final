# Phase D: Persona Scoring - Initial Assessment

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS follow the sequence strictly.
🛑 NEVER skip validation with context from previous phases.

## DEPENDENCIES
- Requires: `step-40-final-export` output (user profile data)
- Requires: `step-06-final-output` output (optimized JD requirements)

## EXECUTION PROTOCOLS
1. [READ] Load user profile data and optimized JD requirements.
2. [ANALYZE] Extract persona dimensions from user career history:
   - Technical skill clusters
   - Domain expertise levels
   - Experience depth (years, scope)
   - Education credentials
3. [CONSTRUCT] Build persona scoring matrix with 10+ scoring dimensions.
4. [VALIDATE] Cross-check persona dimensions against JD personas.
5. [OUTPUT] Generate persona_assessment.yaml with scores.

## OUTPUT
- persona_assessment.yaml: Initial persona scores and dimensions
- Next step: step-42-persona-weight

## NOTES
- Persona scoring is foundational for signal retrieval phase
- Each dimension scored 0-10 scale
- Include confidence scores for each assessment
