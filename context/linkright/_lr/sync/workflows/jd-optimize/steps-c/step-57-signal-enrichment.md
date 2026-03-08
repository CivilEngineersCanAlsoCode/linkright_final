# Phase E (Extended): Signal Enrichment - Evidence Details

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS capture rich evidence for each signal.
🛑 NEVER settle for vague signal descriptions.

## DEPENDENCIES
- Requires: `step-46-signal-rank` output (signal_ranked.yaml)

## EXECUTION PROTOCOLS
1. [READ] Load ranked signals requiring evidence enrichment.
2. [DETAIL] For each top-20 signal, add structured evidence:
   - Situation: What was the context/challenge?
   - Action: What specifically did you do?
   - Result: What was the quantified impact?
   - Learning: What did this teach you about the field?
3. [VERIFY] Cross-check evidence with user career records.
4. [ATTRIBUTE] Assign evidence strength scores (high/medium/low).
5. [OUTPUT] Generate signal_evidence_detailed.yaml with full context.

## OUTPUT
- signal_evidence_detailed.yaml: Rich evidence for each signal
- Next step: Content creation

## NOTES
- SCAR format (Situation-Challenge-Action-Result) effective
- Strong evidence converts to compelling narrative
- Quantified results particularly valuable
