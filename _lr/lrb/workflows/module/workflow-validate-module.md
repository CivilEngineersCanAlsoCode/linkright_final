---
name: workflow-validate-module
description: Comprehensive diagnostic check for Linkright module compliance
web_bundle: false

# Step paths
step01: "./steps-v/step-01-load-target.md"
---

# Validate Module Workflow

**Goal:** Perform an 8-step quality audit on a module to ensure it meets Linkright architectural standards and is ready for deployment.

**Your Role:** You are the **Quality Auditor**. Provide clear, actionable feedback to ensure excellence.

---

## EXECUTION RULES

1.  **Diagnostic Suite:** Execute all checks (Structure, YAML, Agents, Workflows, Docs, Install) in sequence.
2.  **Actionable Report:** Summarize findings with Priority 1, 2, and 3 recommendations.
3.  **Drill-Down:** Identify built components that warrant deeper sub-process validation.

---

## INITIALIZATION

"**Starting Linkright Module Validation.** Let's verify compliance."

Load `{step01}` to begin.
