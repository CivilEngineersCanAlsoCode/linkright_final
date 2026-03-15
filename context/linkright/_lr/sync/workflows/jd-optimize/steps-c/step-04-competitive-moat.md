# Step 04: Competitive Moat Identification

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER proceed without the `requirement-signal-map.yaml` from Step 02.
✅ ALWAYS identify at least 3 unique competitive differentiators.
✅ ALWAYS focus on achievements that exceed the JD's core requirements.

## DEPENDENCIES
- Requires: `requirement-signal-map.yaml` (from `step-02-map-jd-to-signals`)
- Requires: `keyword-list.yaml` (from `step-03-keyword-extraction`)

## EXECUTION PROTOCOLS
1. [READ] Load the requirement-signal map and the keyword list.
2. [ANALYZE] Review all 'Matched' P0 and P1 requirements. Identify instances where your supporting signals **exceed** the JD's expectations:
   - Example: JD asks for "Go experience"; you have "Built a Go framework used by 200+ engineers."
   - Example: JD asks for "Distributed Systems knowledge"; you have "Optimized a system from 1M to 10M concurrent users."
3. [DETERMINE] Identify your **Competitive Moats** (Unique Selling Points):
   - **Scale Moat**: Experience at higher scales than the target role requires.
   - **Complexity Moat**: Experience solving harder problems than the target role implies.
   - **Velocity Moat**: Proven track record of shipping faster or optimizing more aggressively.
   - **Domain Moat**: Deep expertise in the specific industry or technology niche.
4. [RANK] Select the top 3-5 moats that provide the strongest evidence for the target role.
5. [FORMULATE] Craft "Moat Statements" for each identified differentiator:
   - Format: "Unlike typical candidates who [Standard Experience], I [Your Moat-Level Achievement]."
6. [GENERATE] Create the `competitive-moat.yaml` artifact.

## OUTPUT ARTIFACT
- **File**: `competitive-moat.yaml`
- **Schema**:
  ```yaml
  competitive_moats:
    - category: string (Scale|Complexity|Velocity|Domain)
      moat_statement: string
      supporting_signal_ids: [string]
      target_requirements: [string]
  metadata:
    moat_count: integer
    strength_score: float
  ```

## SUCCESS CRITERIA
- ✅ `competitive-moat.yaml` exists and is valid YAML.
- ✅ At least 3 distinct competitive moats are identified and documented.
- ✅ Each moat is tied back to at least one P0 or P1 JD requirement.

## FAILURE PROTOCOL
- If zero moats identified: Re-scan all career signals for non-matched but high-value achievements.
- If moat statements lack quantification: Re-read signal details for specific metrics/numbers.

## NEXT STEP
- Proceed to `step-05-adversarial-review.md` to stress-test your alignment.
