# Step 02: Map JD Requirements to Career Signals

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER proceed without the `jd-parsed.yaml` artifact from Step 01.
✅ ALWAYS categorize matches into Matched, Partial, or Unmatched.
✅ ALWAYS query the ChromaDB vector store for semantic alignment.

## DEPENDENCIES
- Requires: `jd-parsed.yaml` (from `step-01-ingest-jd`)
- Requires: ChromaDB vector store access (for career signals)

## EXECUTION PROTOCOLS
1. [READ] Load the `jd-parsed.yaml` file and extract the list of P0, P1, and P2 requirements.
2. [QUERY] For each extracted requirement, perform a semantic search against the ChromaDB `career_signals` collection.
   - Use the requirement text as the query string.
   - Retrieve the top 3 most relevant career signals (milestones, achievements, projects).
3. [CLASSIFY] Assign a match status to each requirement based on the retrieved signals:
   - **Matched**: Found at least one career signal with >85% semantic similarity.
   - **Partial**: Found signals with 50-85% similarity (skills present, but context differs).
   - **Unmatched**: No signals found with >50% similarity.
4. [MAP] Build a mapping between each JD requirement and the supporting career signal IDs.
5. [GAP ANALYSIS] Identify requirements that are "Unmatched" as primary target gaps for the cover letter or interview strategy.
6. [OUTPUT] Generate the `requirement-signal-map.yaml` artifact.

## OUTPUT ARTIFACT
- **File**: `requirement-signal-map.yaml`
- **Schema**:
  ```yaml
  mappings:
    - requirement: string
      priority: P0|P1|P2
      status: Matched|Partial|Unmatched
      supporting_signals:
        - signal_id: string
          similarity: float
          relevance_summary: string
  gaps:
    - requirement: string
      priority: P0|P1|P2
      mitigation_strategy: string
  ```

## SUCCESS CRITERIA
- ✅ `requirement-signal-map.yaml` exists and is valid YAML.
- ✅ All P0 requirements have been classified and mapped.
- ✅ At least one supporting signal is identified for each 'Matched' requirement.

## FAILURE PROTOCOL
- If ChromaDB is unreachable: Halt and request system administrator to check vector store health.
- If zero 'Matched' P0 requirements: Warn user of significant misalignment with this role.

## NEXT STEP
- Proceed to `step-03-keyword-extraction.md` to refine the signal-to-keyword alignment.
