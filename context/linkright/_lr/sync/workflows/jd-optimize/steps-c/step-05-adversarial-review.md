# Step 05: Adversarial Review & Weakness Mitigation

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER proceed without the `requirement-signal-map.yaml` from Step 02.
✅ ALWAYS identify the top 3 most critical alignment weaknesses.
✅ ALWAYS propose a specific mitigation or "bridge" statement for each gap.

## DEPENDENCIES
- Requires: `requirement-signal-map.yaml` (from `step-02-map-jd-to-signals`)
- Requires: `competitive-moat.yaml` (from `step-04-competitive-moat`)

## EXECUTION PROTOCOLS
1. [READ] Load the requirement-signal map and competitive moat report.
2. [IDENTIFY] Review all 'Partial' and 'Unmatched' requirements. Focus on the P0 and P1 gaps.
3. [SIMULATE] Perform an "Adversarial Review" from the recruiter's perspective:
   - "Why would we NOT hire this candidate?"
   - "What is missing from their profile based on this JD?"
4. [RANK] Select the top 3 most critical alignment weaknesses (e.g., "Missing explicit leadership experience in the JD's specific niche").
5. [FORMULATE] Propose a specific mitigation or "bridge" strategy for each identified weakness:
   - **Mitigation A**: Technical Proxy (e.g., "I haven't used Tool X, but I am an expert in Tool Y, which shares the same underlying architecture.")
   - **Mitigation B**: Speed to Proficiency (e.g., "I am currently learning this technology and have already built a proof-of-concept project.")
   - **Mitigation C**: Indirect Evidence (e.g., "While I haven't held a 'Lead' title, I have managed cross-functional projects with 10+ stakeholders.")
6. [REVIEW] Ensure the mitigations are authentic and do not over-promise.
7. [GENERATE] Create the `adversarial-review.yaml` artifact.

## OUTPUT ARTIFACT
- **File**: `adversarial-review.yaml`
- **Schema**:
  ```yaml
  weaknesses:
    - requirement: string
      priority: P0|P1|P2
      adversarial_objection: string
      mitigation_strategy: string
      bridge_statement: string
  metadata:
    risk_level: High|Medium|Low
    mitigation_coverage: float
  ```

## SUCCESS CRITERIA
- ✅ `adversarial-review.yaml` exists and is valid YAML.
- ✅ At least 3 critical weaknesses have been addressed.
- ✅ Each weakness is paired with a specific, actionable bridge statement.

## FAILURE PROTOCOL
- If zero weaknesses found: Re-run Step 02 with higher similarity thresholds.
- If bridge statements are generic (e.g., "I can learn it"): Demand more technical proxy or indirect evidence.

## NEXT STEP
- Proceed to `step-06-final-output.md` to compile the final JD-aligned profile.
