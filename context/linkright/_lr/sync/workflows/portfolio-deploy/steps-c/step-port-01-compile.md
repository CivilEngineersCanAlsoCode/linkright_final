# Step 01: Compile Frontend Slides

**Goal:** Transform raw signals into the presentation payload for the "Why Me?" slide deck.

---


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## 1. Signal Querying

- Use your internal **Styler** (`sync-styler`) persona to query MongoDB for the top 5 highest-impact career signals.
- Filter for signals that align with the user's primary "Strategic Gravity" (Role Identity).

## 2. Payload Construction

- Format data into `slides_content.json`.
- Categories:
  - **The Problem**: What was broken?
  - **The Process**: How did you fix it?
  - **The Metric**: What was the quantitative result?
  - **The Legacy**: What remains now that you are gone?

## 3. Validation

Show the compiled payload to the user for approval.

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 02: Beyond the Papers UI.
- **[A] Abort**: Exit the workflow.
