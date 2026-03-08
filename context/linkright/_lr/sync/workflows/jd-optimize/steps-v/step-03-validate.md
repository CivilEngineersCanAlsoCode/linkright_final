# Step 03 Validate

## DEPENDENCIES
- Requires: Generated artifact from the corresponding create or edit step
- Requires: Acceptance criteria or Reference schema

## EXECUTION PROTOCOLS
1. [READ] Load the generated artifact.
2. [VALIDATE] Check against the 4 core quality gates (Accuracy, Tone, Structure, Constraints).
3. [REPORT] If pass, output `[VALIDATION: PASS]`. If fail, output `[VALIDATION: FAIL]` with specific feedback for the edit agent.

## OUTPUT
- Validation status and feedback payload.
