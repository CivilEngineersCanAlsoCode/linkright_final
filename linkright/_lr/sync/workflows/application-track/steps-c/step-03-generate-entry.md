# Step 03: Generate Tracker Entry

## DEPENDENCIES

- Requires: `step-02-match-score` output (`match-report.yaml`)

## EXECUTION PROTOCOLS

1. [READ] Load match report.
2. [GENERATE] Create a new row in the application-tracker using the template.
3. [VALIDATE] Confirm follow-up date and status with user.

## OUTPUT CONTRACT

- Appends to `application-tracker.md`
