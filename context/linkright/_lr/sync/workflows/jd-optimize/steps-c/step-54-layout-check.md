# Phase K: Layout Validation - Constraint Checking

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS validate content fits space constraints.
🛑 NEVER exceed format specifications.

## DEPENDENCIES
- Requires: `step-53-content-draft` output (content_bullets_draft.yaml)

## EXECUTION PROTOCOLS
1. [READ] Load content bullets and layout specifications.
2. [MEASURE] Assess content against constraints:
   - Word count: Expected maximum vs. actual
   - Bullet count: Expected per section vs. actual
   - Line length: Single-line vs. multi-line bullets
   - Space budget: Total available space and usage
3. [TRIM] If content exceeds limits:
   - Identify least-impactful bullets
   - Trim verbose phrasing
   - Combine similar bullets where possible
4. [OPTIMIZE] Ensure high-impact content is featured
5. [OUTPUT] Generate content_layout_validated.yaml with final bullets.

## OUTPUT
- content_layout_validated.yaml: Space-constrained, optimized content
- Next step: step-55-styling

## NOTES
- Layout constraints often force hard choices
- Prioritize impact over comprehensiveness
- Single-page resume = severe space constraints
