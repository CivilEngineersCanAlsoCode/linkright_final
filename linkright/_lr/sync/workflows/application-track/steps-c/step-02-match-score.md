# Step 02: Match Score

## MANDATORY EXECUTION RULES (READ FIRST)

✅ ONLY process indexed data from Step 01.

## DEPENDENCIES

- Requires: `step-01-ingest-target` output (`target-jd.yaml`)
- Requires: `signal-capture/artifacts/career_signals.yaml`

## EXECUTION PROTOCOLS

1. [READ] Load career signals and target JD.
2. [ANALYZE] Calculate signal-to-requirement congruence percentage.
3. [VALIDATE] Present match score breakdown to user (P0, P1, P2 categories).

## OUTPUT CONTRACT

- `match-report.yaml` (congruence scores per category)
