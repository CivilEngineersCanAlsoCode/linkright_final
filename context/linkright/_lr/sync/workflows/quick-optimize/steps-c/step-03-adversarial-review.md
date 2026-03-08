# Step 03: Adversarial Review


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)

🛑 NEVER generate content without user validation.
✅ ALWAYS strictly follow the defined sequence below.
🚫 FORBIDDEN to load next step until discovery and extraction are complete.

## CONTEXT BOUNDARIES

- Available configurations from parent: {system_version}, {mode}

## EXECUTION PROTOCOLS

1. [READ] The drafted text block from Step 02.
2. [ANALYZE] Adopt a hyper-critical persona. Attack the draft for generic buzzwords, lost context, or hallucinated metrics.
3. [VALIDATE] Output maximum 3 critical flaws found. If none, output "PASS".

## INPUT CONTRACT

- Draft updated text block.

## OUTPUT CONTRACT

- Adversarial critique or PASS signal.
