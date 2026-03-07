# Step 01: Ingest Outreach Targets

**Goal:** Capture and structure raw data from recruiter, hiring manager, or founder profiles.

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


## 1. Request Target Inputs

Ask the user to paste the target profile PDF, text, or provide a URL (if MCP search available).

## 2. Preliminary Parsing

- Use your internal `sync-parser` persona to structure:
  - **Full Name**
  - **Current Company & Role**
  - **Identified Pain Points** (from posts or company news)
  - **Professional Background** (shared history/shared signals)

## 3. Preliminary Verification

Update `recruiter_profile.json` with the extracted metadata.

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 02: Strategy & Hook extraction.
- **[A] Abort**: Exit the workflow.
