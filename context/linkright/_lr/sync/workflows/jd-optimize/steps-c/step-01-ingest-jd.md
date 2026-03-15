# Step 01: Job Description (JD) Ingestion

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER proceed without a valid Job Description.
✅ ALWAYS categorize requirements into P0/P1/P2 tiers.
✅ ALWAYS extract the company name and target role accurately.

## DEPENDENCIES
- Requires: Session initialized via `step-01-load-session-context`
- Requires: User-provided JD (Text, URL, or File Path)

## EXECUTION PROTOCOLS
1. [PROMPT] Ask the user to provide the Job Description in one of three formats:
   - Paste the full JD text directly.
   - Provide a URL to the job posting.
   - Provide a path to a local JD file (PDF/Docx/Text).
2. [EXTRACT] Parse the provided JD and extract the following core signals:
   - **Company Name**: The hiring organization.
   - **Job Title**: The official role designation.
   - **Seniority**: Junior, Mid, Senior, Lead, Staff, Principal, etc.
   - **Team/Department**: (If available) The specific group within the company.
3. [ANALYZE] Identify and categorize all job requirements:
   - **Core (P0)**: Non-negotiable must-haves (e.g., "10+ years Go experience").
   - **Preferred (P1)**: Strong advantages (e.g., "Experience with Kubernetes").
   - **Bonus (P2)**: Nice-to-haves (e.g., "Open source contributions").
4. [MAP] Align extracted requirements with the standard Linkright ontology categories.
5. [VALIDATE] Ensure at least 3 P0 requirements were identified.
6. [OUTPUT] Generate the `jd-parsed.yaml` artifact in the session artifacts directory.

## OUTPUT ARTIFACT
- **File**: `jd-parsed.yaml`
- **Schema**:
  ```yaml
  job_metadata:
    company: string
    title: string
    seniority: string
    team: string
  requirements:
    p0_core: [string]
    p1_preferred: [string]
    p2_bonus: [string]
  ```

## SUCCESS CRITERIA
- ✅ `jd-parsed.yaml` exists and is valid YAML.
- ✅ Company name and job title are correctly identified.
- ✅ At least 3 P0 core requirements are listed.

## FAILURE PROTOCOL
- If JD is missing or unreadable: Request user to re-provide in plain text.
- If P0 requirements < 3: Ask user for clarification on core role expectations.

## NEXT STEP
- Proceed to `step-02-map-jd-to-signals.md` for semantic matching.
