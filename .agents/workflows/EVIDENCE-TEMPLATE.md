# Beads Evidence Collection Template

**Purpose:** Standardized format for providing proof of work when closing Beads issues.

---

## Template (Copy this into your `bd close --reason` string)

\`\`\`text
EVIDENCE:
- Input: [What did you start with? e.g., raw JD text, existing config]
- Operation: [What specific action was performed? e.g., refactored steps, fixed bug]
- Output: [What was produced? e.g., 5 new step files, updated CSV]
- Metrics: [How do we know it succeeded? e.g., validation script passed, line count >= 40]
- Files: [List of modified/created files]
- Tests: [Test results or verification commands run]
\`\`\`

---

## Field Definitions

1. **Input**: Context or data consumed by the task.
2. **Operation**: Brief technical summary of the work done.
3. **Output**: The tangible artifact(s) resulting from the task.
4. **Metrics**: Satisfied success criteria from the step/story definition.
5. **Files**: Relative paths to all affected files.
6. **Tests**: Proof of verification (commands, pass/fail status).

---

## Worked Example

\`\`\`bash
bd close sync-zas.1.3.1 --reason "
EVIDENCE:
- Input: scanned workflow directories and mapping table
- Operation: populated workflow-manifest.csv with 17 rows
- Output: updated workflow-manifest.csv with 8-column schema
- Metrics: 17 workflows listed, all mandatory columns present
- Files: context/linkright/_lr/workflow-manifest.csv
- Tests: ran bash scripts/validate-manifests.sh (PASSED)
"
\`\`\`
