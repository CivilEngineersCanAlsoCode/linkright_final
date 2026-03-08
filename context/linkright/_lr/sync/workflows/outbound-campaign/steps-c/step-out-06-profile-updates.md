# Step 06: Suggest Profile Updates

**Goal:** Recommend temporary, strategic profile changes that align with this specific campaign.

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


## 1. Social Brand Evaluation

- Use your internal **Echo** (`flex-publicist`) persona to evaluate the user's current LinkedIn presence against the JD.
- Suggest changes to:
  - **Headline**: High-impact keywords from the JD.
  - **About Section**: Highlighting the specific "Bridge" achievement.

## 2. Final Review

Present the full campaign sequence to the user for final confirmation.

---

## NEXT ACTION

- **[S] Save & Exit**: Finalize the campaign and close the workflow.
- **[P] Previous**: back to Connect Invite.
- **[A] Abort**: Exit the workflow.
