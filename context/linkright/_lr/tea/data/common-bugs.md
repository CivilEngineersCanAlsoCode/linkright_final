# Linkright Common Bugs & Failure Patterns

This document catalogs recurring bugs and failure modes identified during the Release 1-4 audit cycles.

---

## 1. System & Infrastructure Patterns

| ID | Pattern Name | Description | Remediation |
| :--- | :--- | :--- | :--- |
| SYS-001 | Zero-Byte Configuration | Config files exist but contain no data, causing agent crash. | Populate from template or fallback. |
| SYS-002 | Broken Manifest Ref | Manifest CSV points to a file or directory that has been moved/deleted. | Run `validate-manifests.sh`. |
| SYS-003 | DB Lock Contention | Multiple agents attempting to write to Beads/Dolt simultaneously. | Implement retries or merge slots. |
| SYS-004 | Shell Expansion Fail | Bash-style `${VAR}` in YAML not expanded by template loader. | Standardize on `{{VAR}}` (ADR-006). |
| SYS-005 | Missing Sidecar | Agent MD file exists but the corresponding sidecar directory is missing. | Verify `hasSidecar` property. |

## 2. Workflow & Step Patterns

| ID | Pattern Name | Description | Remediation |
| :--- | :--- | :--- | :--- |
| WRK-001 | Atomicity Violation | A single step combines multiple cognitive operations (e.g., Parse + Plan). | Split into independent atomic steps. |
| WRK-002 | Dead-End Step | A step file missing the `NEXT STEP` or `Next:` instruction. | Use standardized step templates. |
| WRK-003 | Context window overflow | Workflow instructions too long for agent's context window. | Trim instructions or use JIT loading. |
| WRK-004 | Input schema mismatch | Step receives data in a format it cannot parse (e.g., JSON vs YAML). | Enforce strict schema contracts. |
| WRK-005 | Missing Pre-condition | Step runs before its necessary prerequisites are satisfied. | Add PRE-GATE validation logic. |

## 3. Data & Signal Patterns

| ID | Pattern Name | Description | Remediation |
| :--- | :--- | :--- | :--- |
| DAT-001 | Low Metric Density | Career signals lack quantifiable numbers (%, $, #). | Trigger Inquisitor deepening. |
| DAT-002 | Persona Drift | Resume copy tone doesn't match the selected primary persona. | Re-run narrator with persona anchor. |
| DAT-003 | Orphaned Signal | Signal exists in DB but is not linked to any professional role. | Audit signal-to-role mapping. |
| DAT-004 | Duplicate Signal | Same career event captured multiple times with slight variations. | Implement cosine-similarity dedupe. |
| DAT-005 | Placeholder Leaking | Bracketed tokens like `[User Name]` appear in final artifacts. | Add post-gate placeholder scan. |

## 4. Coordination Patterns

| ID | Pattern Name | Description | Remediation |
| :--- | :--- | :--- | :--- |
| CRD-001 | Unclaimed Bead | Task remains in `open` state while work is being performed. | Enforce `bd update --claim` protocol. |
| CRD-002 | Evidence Gap | Bead closed with generic "Done" reason instead of structured evidence. | Enforce `verify-beads-evidence.sh`. |
| CRD-003 | Handoff Failure | Agent A finishes work but Agent B is never notified. | Use Agent Mail `ack_required` messages. |
| CRD-004 | Stale Memories | Beads memories out of sync with current system architecture. | Periodic `bd memories` audit. |
| CRD-005 | Ghost Task | Implementation exists but no corresponding Beads issue found. | Run `bd orphans` check. |

---

*Last Updated: 2026-03-19*
*Maintained by: TEA Module*
