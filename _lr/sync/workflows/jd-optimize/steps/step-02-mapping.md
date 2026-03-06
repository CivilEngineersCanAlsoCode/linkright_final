# Step 02: Signal Mapping

**Goal:** Bridge the JD requirements with the user's authentic career milestones.

---

## 1. Load Career Signals

- Access user's career signals from Mongo (`career_signals` collection) or local memory.
- Search for signals that align with the Tech Stack and Success Metrics identified in Step 01.

## 2. Semantic Matching

- Use your internal `sync-linker` persona to score the alignment between JD requirements and user signals.
- Identify the "Golden Signals" (P0 matches).

## 3. Presence Verification

- Confirm if any required P0 signals are missing (identify "Gaps").

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 03: Profile Generation.
- **[P] Previous**: Back to Ingest JD.
- **[A] Abort**: Exit the workflow.
