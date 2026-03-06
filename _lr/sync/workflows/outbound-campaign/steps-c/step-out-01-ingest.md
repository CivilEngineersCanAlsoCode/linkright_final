# Step 01: Ingest Outreach Targets

**Goal:** Capture and structure raw data from recruiter, hiring manager, or founder profiles.

---

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
