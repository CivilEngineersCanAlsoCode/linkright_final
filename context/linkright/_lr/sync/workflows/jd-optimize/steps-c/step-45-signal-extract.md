# Phase E: Signal Retrieval - Data Extraction

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS extract signals from authoritative sources.
🛑 NEVER fabricate or assume signal presence.

## DEPENDENCIES
- Requires: `step-44-signal-query` output (signal_query.json)
- Requires: User profile database (resume, work history, portfolio)

## EXECUTION PROTOCOLS
1. [READ] Load signal_query.json search parameters.
2. [EXTRACT] Scan career history sources for matching signals:
   - Resume/CV sections (skills, experience, achievements)
   - Work history (projects, responsibilities, outcomes)
   - Portfolio/GitHub (code samples, contributions)
   - Education/certifications (training, credentials)
3. [SCORE] Assign relevance scores to found signals based on query weights.
4. [COLLECT] Gather supporting evidence for each signal:
   - Context (when, where, how)
   - Depth (solo vs team, scale, impact)
   - Recency (months/years ago)
5. [OUTPUT] Generate signal_map.yaml with extracted signals and evidence.

## OUTPUT
- signal_map.yaml: Found signals with scores and evidence
- Next step: step-46-signal-rank

## NOTES
- Quality of signal extraction determines baseline scoring quality
- Evidence gathering crucial for later narrative mapping
- Document confidence level for each extracted signal
