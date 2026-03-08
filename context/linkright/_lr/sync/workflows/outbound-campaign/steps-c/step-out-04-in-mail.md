# Step 04: Draft In-Mail

**Goal:** Create a high-gravity personalized LinkedIn In-Mail.

---

## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER generate content without user validation.
✅ ALWAYS strictly follow the defined sequence below.
🚫 FORBIDDEN to load next step until discovery and extraction are complete.

## CONTEXT BOUNDARIES
- Available configurations from parent: {system_version}, {mode}

## EXECUTION PROTOCOLS
1. [READ] Target inputs securely.
2. [ANALYZE] Apply persona rules to structure the data.
3. [VALIDATE] Await user confirmation before proceeding.

## INPUT CONTRACT
- Unstructured text or file payload.

## OUTPUT CONTRACT
- Standardized Profile/Data object conforming to workspace schemas.


## 1. Personalized Drafting

- Use your internal **Lyric** (`sync-publicist`) persona to draft a message specifically for the hiring manager/recruiter.
- **Metric Inclusion**: Must include one high-impact quantitative metric from the user's career.

## 2. Call to Action

- Include a soft call to action for a "technical alignment chat" or "coffee chat".

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 05: Draft Connect Invite.
- **[P] Previous**: back to Cover Letter.
- **[A] Abort**: Exit the workflow.
