# Step 01: Ingest Job Description

**Goal:** Capture the raw JD text and identify the core role identity.

---

## 1. Request JD Input

Ask the user to paste the target Job Description or provide a link (if MCP search available).

## 2. Preliminary Parsing

- Use your internal `sync-parser` persona to identify:
  - **Company Name**
  - **Job Title**
  - **Primary Tech Stack/Requirements**
  - **Core Success Metrics** (if available)

## 3. Feedback Loop

Present the parsed metadata to the user for validation.

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 02: Signal Mapping.
- **[A] Abort**: Exit the workflow.
