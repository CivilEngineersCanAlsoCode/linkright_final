# Phase E: Signal Retrieval - Query Construction

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS ground queries in persona fit scores from Phase D.
🛑 NEVER skip query validation against signal taxonomy.

## DEPENDENCIES
- Requires: `step-43-persona-validate` output (persona_final_scores.yaml)
- Requires: `step-06-final-output` output (JD signal taxonomy)

## EXECUTION PROTOCOLS
1. [READ] Load persona_final_scores.yaml and JD signal taxonomy.
2. [MAP] Match persona gaps to searchable signals:
   - For each low-scoring persona dimension
   - Identify signals from career history that demonstrate strength
   - Create weighted query terms (high confidence → high weight)
3. [CONSTRUCT] Build signal search query with:
   - Keywords (skills, technologies, domains)
   - Proximity constraints (recency, relevance)
   - Weight assignments (critical signals 5-10 points, supporting 1-2 points)
4. [VALIDATE] Verify query completeness and non-redundancy.
5. [OUTPUT] Generate signal_query.json with search parameters.

## OUTPUT
- signal_query.json: Weighted signal search query
- Next step: step-45-signal-extract

## NOTES
- Signal retrieval depends on query quality
- Queries should be specific enough to find relevant signals
- Weight scores drive ranking in next step
