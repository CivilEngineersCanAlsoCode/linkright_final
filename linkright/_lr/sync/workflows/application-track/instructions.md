# Application Track Workflow

Track, manage, and optimize the full job application lifecycle from submission to offer.

## Sequence:

1. **Ingest Target**: Load job listing and company context.
2. **Match Score**: Cross-reference career signals with JD requirements.
3. **Generate Tracker Entry**: Create a pipeline row with status, follow-up dates, and notes.
4. **Update Status**: Modify existing entries as applications progress.

## Output:

- `application-tracker.md` — Living pipeline document.
- `follow-up-calendar.yaml` — Automated reminder schedule.
