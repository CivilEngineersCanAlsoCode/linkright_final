# Coverage Rules: Linkright Builder

This document defines the mandatory coverage thresholds and critical path requirements for Linkright modules.

---

## 📈 Mandatory Thresholds

| Category             | Requirement              | Level     |
| -------------------- | ------------------------ | --------- |
| **Core Logic**       | 90% Line Coverage        | MANDATORY |
| **Workflow Steps**   | 100% Path Coverage       | MANDATORY |
| **Agent Personas**   | Tone & activation check  | REQUIRED  |
| **Integrity Checks** | SHA256 Hash Verification | MANDATORY |

---

## 🚨 Critical Paths

Any failure in these paths results in an immediate **FAIL** status:

1.  **Module Initialization**: Cannot load `module.yaml` or standard data files.
2.  **Creation Flow**: Failure to generate the `_lr/{code}/` directory structure.
3.  **Security**: Exposure of sensitive environment variables in logs.
4.  **Integrity**: Mismatch between `files-manifest.csv` and actual file hashes.

---

## 📝 Reporting Standards

- All test results must be appended to the `validation-report-{timestamp}.md`.
- Failures must include a **Priority Level** (1: Critical, 2: High, 3: Medium).
- Recommendations must be actionable (e.g., "Step 4 missing input validation").
