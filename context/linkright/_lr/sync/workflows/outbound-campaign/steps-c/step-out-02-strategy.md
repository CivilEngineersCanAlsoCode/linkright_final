# Step 02: Strategy & Hook Extraction

**Goal:** Identify the optimal psychological "Bridge" for the outreach campaign.

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


## 1. Load Context

- Read `recruiter_profile.json` and `jd_profile.json`.
- Query user's **Golden Signals** (P0 matches) from Step 01 and Step 02 of the JD Optimization workflow.

## 2. Identify "The Bridge"

- Use your internal **Lyric** (`sync-publicist`) persona to select the single most powerful project or achievement that connects the user to the target's specific background.

## 3. Define Tone

- Select the tone (Formal, Casual, Technical) that best matches the target company's culture.

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 03: Draft Cover Letter.
- **[P] Previous**: back to Ingest.
- **[A] Abort**: Exit the workflow.
