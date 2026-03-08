# Validation Step Template

**Purpose**: Standard validation pattern for all Linkright workflows to ensure quality gates are consistently applied.

## Template Structure

### 1. Validation Objective
Clear statement of what is being validated and why it matters.

**Example:**
```
Objective: Verify that all 28 workflows resolve in the filesystem and workflow.yaml files are parseable.
Why: Broken workflow paths block agent discovery and workflow routing.
```

### 2. Acceptance Criteria
Explicit, measurable criteria for the validation to pass.

**Template:**
- [ ] Criterion 1: [Specific, measurable requirement]
- [ ] Criterion 2: [Specific, measurable requirement]
- [ ] Criterion 3: [Specific, measurable requirement]

**Example:**
- [ ] All 28 workflow paths exist in filesystem
- [ ] All workflow.yaml files are valid YAML (parseability check)
- [ ] Zero orphaned workflow directories (all have entries in manifest)

### 3. Validation Procedure
Step-by-step process to validate the criteria.

**Template:**
1. [Setup/Preparation step]
2. [Execution step with specific command or check]
3. [Data collection step]
4. [Verification step]
5. [Result documentation step]

**Example:**
```bash
# Step 2a: Scan all workflow directories
find _lr/*/workflows -name "workflow.yaml" -type f | wc -l

# Step 2b: Parse each workflow.yaml for validity
for file in $(find _lr/*/workflows -name "workflow.yaml"); do
  yaml-lint "$file" || echo "INVALID: $file"
done

# Step 3: Document results
echo "Validation Results:" > validation_report.md
echo "Paths found: $(count)" >> validation_report.md
echo "Invalid files: $(invalid_count)" >> validation_report.md
```

### 4. Expected Output
Description of what success looks like.

**Template:**
- Console output showing all criteria met
- Report file with detailed results
- Summary statement confirming pass/fail

**Example:**
```
✅ Validation PASSED
- All 28 workflow paths exist
- All 28 workflow.yaml files parse correctly
- Zero orphaned entries
```

### 5. Failure Handling
Specific actions to take if validation fails.

**Template:**
- [ ] If [Criterion 1 fails], then [Action 1]
- [ ] If [Criterion 2 fails], then [Action 2]
- [ ] If [Multiple criteria fail], then [Escalation action]

**Example:**
- [ ] If any workflow.yaml is invalid: Fix syntax errors, re-run validation
- [ ] If workflow path missing: Add to workflow-manifest.csv, create directory
- [ ] If multiple failures: Stop release, file blocking issue, notify team lead

### 6. Quality Metrics
Quantitative measures of validation strength.

**Template:**
- Coverage: [percentage/count of items validated]
- False positive rate: [acceptable threshold]
- False negative rate: [acceptable threshold]
- Time to execute: [expected runtime]

**Example:**
- Coverage: 28/28 workflows (100%)
- False positive rate: < 1% (YAML parser errors vs actual syntax)
- False negative rate: < 5% (missed invalid files)
- Time to execute: < 2 minutes

## Integration with Release Workflow

This template is used in:
- Pre-release validation gates (verify before tag)
- Smoke testing (quick validation post-deployment)
- Continuous integration checks (automated validation on PR)

## Related BMAD Patterns

- Quality Gate: Blocking validation that prevents release
- Smoke Test: Quick sanity check for critical functionality
- Regression Test: Ensure existing functionality wasn't broken

---

**Last Updated:** 2026-03-08  
**Template Version:** 1.0  
**Status:** Active

