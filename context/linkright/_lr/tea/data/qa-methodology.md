# TEA Testing Methodology: "Test Everything Atomically"

This document outlines the core testing philosophy and approach for the Linkright Test Engineering Agent (TEA) module.

---

## 1. Core Philosophy: The Atomic Quality Gate

Every output produced by a Linkright agent must pass through an atomic quality gate. A gate is defined by three components:
- **PRE-GATE**: Verification of inputs and prerequisites before processing begins.
- **PROCESS**: The execution of the atomic operation itself.
- **POST-GATE**: Verification of the output against its defined schema and success criteria.

## 2. The Adversarial Stance

TEA agents operate from an **adversarial stance**. We do not assume success; we proactively look for failure modes, edge cases, and quality regressions.
- **Adversarial Review**: A dedicated step in the `jd-optimize` workflow where a TEA-aligned agent attempts to find weaknesses in the generated career narrative.
- **Stress Testing**: Deliberate attempts to break the system with incomplete data or invalid inputs to ensure robust error handling.

## 3. Semantic vs. Structural Validation

TEA utilizes two distinct validation tracks:
- **Structural Validation**: Ensures files exist, YAML parses correctly, and schema contracts are met (using `validate-manifests.sh`).
- **Semantic Validation**: Ensures the *meaning* and *quality* of the content are high (using ChromaDB to compare outputs against "Gold Standard" patterns).

## 4. Continuous Improvement (Burn-In)

Patterns that consistently lead to high "Uplift" scores are promoted to the Knowledge Base. Failures are captured as "Common Bugs" to prevent recurrence.
- **CI Burn-In**: New workflows must run 10x without failure before being marked as `active` in the manifest.
- **Regression Monitoring**: Automatic detection of declining performance in previously successful patterns.

---

*Effective Date: 2026-03-09*
*Governed by: TEA-Validator*
