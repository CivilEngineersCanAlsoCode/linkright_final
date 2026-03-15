# Step 03: ATS Keyword Extraction & Weighting

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER proceed without the `requirement-signal-map.yaml` from Step 02.
✅ ALWAYS use the official `jd-ontology.yaml` for keyword normalization.
✅ ALWAYS calculate a relevance score for each extracted keyword.

## DEPENDENCIES
- Requires: `requirement-signal-map.yaml` (from `step-02-map-jd-to-signals`)
- Requires: `_lr/sync/workflows/jd-optimize/data/reference/jd-ontology.yaml`

## EXECUTION PROTOCOLS
1. [READ] Load the requirement-signal map and the official ATS keyword ontology.
2. [EXTRACT] For each Matched and Partial requirement, identify the primary and secondary keywords.
   - Primary: Core technology, framework, or skill (e.g., "Go", "Distributed Systems").
   - Secondary: Methodology or environment context (e.g., "Agile", "Microservices").
3. [NORMALIZE] Map the extracted terms to the canonical terms in the `jd-ontology.yaml`.
   - Example: "Golang" → "Go", "K8s" → "Kubernetes".
4. [SCORE] Calculate a **Keyword Weight** (1-10) based on:
   - JD Frequency: How many times it appears in the JD.
   - Requirement Priority: P0 (x1.5), P1 (x1.0), P2 (x0.5).
   - Signal Strength: Similarity score from Step 02.
5. [FILTER] Select the top 15-20 highest-weighted keywords for the final optimization.
6. [GENERATE] Create the `keyword-list.yaml` artifact containing the normalized terms and their calculated weights.

## OUTPUT ARTIFACT
- **File**: `keyword-list.yaml`
- **Schema**:
  ```yaml
  keywords:
    - term: string
      category: string
      weight: float
      source_requirements: [string]
      normalized: boolean
  metadata:
    total_keywords: integer
    ontology_version: string
  ```

## SUCCESS CRITERIA
- ✅ `keyword-list.yaml` exists and is valid YAML.
- ✅ At least 15 keywords are extracted and weighted.
- ✅ All P0 requirements are represented in the keyword list.

## FAILURE PROTOCOL
- If ontology file is missing: Revert to basic NLP extraction and flag for manual review.
- If < 10 keywords meet weight threshold: Lower similarity threshold in Step 02 and re-run.

## NEXT STEP
- Proceed to `step-04-competitive-moat.md` to identify your unique differentiators.
