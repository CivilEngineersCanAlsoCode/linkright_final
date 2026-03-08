# Phase M (Extended): Success Validation - Criteria Assessment

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS validate portfolio against success criteria.
🛑 NEVER assume success without evidence.

## DEPENDENCIES
- Requires: `step-56-final-quality` output (final_quality_report.md)
- Requires: `step-62-portfolio-assemble` output (final_portfolio)

## EXECUTION PROTOCOLS
1. [READ] Load quality report and final portfolio.
2. [ASSESS] Evaluate portfolio against success criteria:
   - Content accuracy: All claims verified and factual?
   - JD alignment: Does it directly address JD requirements?
   - Differentiation: What makes this applicant stand out?
   - Interview readiness: Would reviewer want to interview?
   - Positioning clarity: Is the value proposition clear?
3. [SCORE] Generate success_validation.yaml with assessment scores.
4. [FLAG] Identify any gaps or risks that might impact interview success.
5. [OUTPUT] Provide success probability assessment.

## OUTPUT
- success_validation.yaml: Success criteria assessment
- interview_probability.md: Success likelihood analysis

## NOTES
- Success validation is final gate before delivery
- Provides realistic feedback on interview likelihood
- Identifies residual risks or weak areas
