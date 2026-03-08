# Phase H: Inquisitor - Question Generation

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS generate questions from prioritized gaps.
🛑 NEVER ask vague or unactionable questions.

## DEPENDENCIES
- Requires: `step-50-gap-category` output (gap_strategy.yaml)

## EXECUTION PROTOCOLS
1. [READ] Load gap_strategy.yaml with prioritized gaps.
2. [GENERATE] Create targeted inquisitor questions:
   - One primary question per high-priority gap
   - Questions must have answerable responses
   - Format: specific, context-grounded, actionable
   - Example: "Walk me through your most complex scaling challenge"
3. [VALIDATE] Review questions for:
   - Clarity and directness
   - Likelihood to elicit gap-filling evidence
   - Professional appropriateness
   - Interview context fit (resume, cover letter, discussion)
4. [ORGANIZE] Structure questions by priority and category.
5. [OUTPUT] Generate inquisitor_questions.yaml with full prompt set.

## OUTPUT
- inquisitor_questions.yaml: Targeted gap-filling questions
- Next step: step-52-inquisitor-dialogue

## NOTES
- Questions are posed to user to fill gaps in positioning
- High-quality questions elicit valuable positioning material
- User responses become content source material
