# Phase H (Extended): Inquisitor - Response Capture

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS capture full user responses to inquisitor questions.
🛑 NEVER edit or paraphrase user responses.

## DEPENDENCIES
- Requires: `step-51-inquisitor-prep` output (inquisitor_questions.yaml)

## EXECUTION PROTOCOLS
1. [PRESENT] Display inquisitor questions to user in order of priority.
2. [CAPTURE] Record user responses verbatim in structured format.
3. [CLARIFY] If response is unclear:
   - Ask follow-up probing questions
   - Request specific examples
   - Record all follow-ups and answers
4. [VERIFY] Confirm captured responses are accurate.
5. [STORE] Generate inquisitor_responses.yaml with all Q&A pairs.

## OUTPUT
- inquisitor_responses.yaml: User responses to all inquisitor questions
- Next step: Narrative mapping and content writing

## NOTES
- User responses directly feed narrative content
- Rich, specific responses enable strong positioning
- Capture context, examples, metrics from responses
