# Retroactive Closure Evidence Retrofit Strategy

**Purpose**: Establish a systematic approach for retrofitting historical Beads issues (R1-R3) with evidence-based closure records, enabling traceability across releases.

**Status**: Template for Phase C implementation  
**Created**: 2026-03-08

---

## Challenge & Context

**Problem**: Historical Beads issues from R1-R3 may lack detailed closure evidence, making it difficult to:
- Trace what changed between releases
- Understand closure rationale
- Verify work completion
- Learn from past decisions

**Solution**: Retroactive retrofit using:
1. Git history (commits, tags, diffs)
2. Manifest records (files created, modified)
3. Release notes (R1, R2, R3 documentation)
4. Logical inference (from code/feature availability)

---

## Retrofit Pattern by Issue Type

### Pattern A: Infrastructure/Configuration Issues
**Identifying Markers**:
- Issue title mentions "audit", "cleanup", "manifest", "configuration"
- Issue created in early release (Week 1-2)
- Files exist in git history related to the issue

**Retrofit Strategy**:
1. Search git log for commits mentioning issue number or concept
2. Find first commit introducing files related to issue
3. Link to git tag (v1.0, v2.0, v3.0) where feature appeared
4. Document as: "Feature deployed in Release X, verified in Y, confirmed in Z"

**Evidence Template**:
```
Issue: R2 Cleanup: Audit agent manifests
Retrofit Evidence:
- First commit: <hash> "feat: Create agent manifest CSV"
- Release deployed: v2.0 (Release 2)
- File: _lr/_config/agent-manifest.csv (exists in v2.0+)
- Verification: 29 agents registered, CSV parseable
Resolution: Feature implemented and deployed in Release 2.
```

### Pattern B: Bug Fixes
**Identifying Markers**:
- Issue title contains "fix", "bug", "issue", "broken"
- Issue references specific symptom or failing test
- Mentions code location or module

**Retrofit Strategy**:
1. Search for commits with "fix:" prefix matching issue scope
2. Find commit that resolved the problem (usually mentions issue)
3. Verify the fix exists in release git tag
4. Document regression prevention (test added, linter, etc.)

**Evidence Template**:
```
Issue: R2 Bug: Workflow routing broken in sync module
Retrofit Evidence:
- Fix commit: <hash> "fix: Sync workflow discovery routing"
- Released in: v2.1 (Release 2.1 patch)
- Prevention: Added smoke test for workflow discovery
- Verified: No regression in v3.0 testing
Resolution: Bug fixed and deployed in Release 2.1.
```

### Pattern C: Feature Implementation
**Identifying Markers**:
- Issue title describes new capability
- References one or more related files/modules
- Shows completion evidence (e.g., "deployment blocked on X")

**Retrofit Strategy**:
1. Find feature commits (usually "feat:" prefix)
2. Identify when feature appeared in production (version tag)
3. Verify feature still works in current release
4. Note any subsequent enhancements

**Evidence Template**:
```
Issue: R3 Feature: Multi-agent party mode orchestration
Retrofit Evidence:
- Implementation: commits <hash1>, <hash2>, <hash3>
- Deployed in: v3.0 (Release 3)
- Status: Active in current codebase
- Enhancement: Improved in Release 4 (see sync-mro.2.3)
Resolution: Feature implemented in Release 3, enhanced in Release 4.
```

### Pattern D: Uncertain/Ambiguous Closures
**Identifying Markers**:
- Original closure reason is vague ("Completed", "Done", "Fixed")
- Missing evidence link
- Unclear what was actually accomplished

**Retrofit Strategy**:
1. Mark as "requires-verification" tag
2. Document investigation findings
3. Link to related working feature as proxy evidence
4. Escalate for manual review if uncertain

**Evidence Template**:
```
Issue: R2 Task: Update documentation
Retrofit Evidence:
- Status: Requires-verification (original closure vague)
- Finding: No documentation files created in Release 2 timeline
- Possible: Related doc work in R1 (sync-doc-1) or R3 (sync-mro.1)
- Recommendation: Merge with doc-related issues or reopen if incomplete
Resolution: Marked requires-verification; manual review recommended.
```

---

## Automated Retrofit Process

### Step 1: Identify Candidate Issues
```bash
# Find all closed issues from R1-R3
bd list --closed-before 2026-03-01 --status=closed | \
  grep -E "R1|R2|R3" > /tmp/r123_closed_issues.txt

# Sample 35 random issues for manual retrofit
shuf -e $(cat /tmp/r123_closed_issues.txt) | head -35
```

### Step 2: For Each Issue, Gather Evidence
```bash
# For issue <id>, search git history
git log --grep="<id>" --oneline  # Search for issue reference in commits
git log --after="<created>" --before="<closed>" -- <likely_files>  # Find relevant commits
git tag --contains <commit_hash>  # Find which release contains the commit
```

### Step 3: Generate Evidence Summary
For each of 35 sampled issues:
- Issue ID
- Original title
- Original closure date
- Detected evidence type (commit hash / files / release)
- Confidence level (high / medium / requires-verification)
- Proposed retrofit reason (100-200 words)

### Step 4: Document Pattern
Create pattern summary from 35 samples:
- Evidence distribution (e.g., "72% have commit hash, 15% file-based, 13% uncertain")
- Common closure reasons (e.g., "deployed in release X", "bug fixed in commit Y")
- Retrofit confidence (e.g., "80% of closures have strong evidence")

### Step 5: Apply Pattern to Remaining 138
- Generate automated retrofit for similar issues (matching issue type + timeline)
- Use highest-confidence pattern for each
- Flag 20-30 "requires-verification" for manual review
- Output: spreadsheet with all 173 retroactive closure reasons

---

## Sample Retrofit Spreadsheet

| Issue ID | Title | Created | Closed | Evidence Type | Commit | Files | Release | Confidence | Retrofit Status |
|----------|-------|---------|--------|---------------|--------|-------|---------|------------|-----------------|
| R1-001 | Setup initial beads database | 2025-11-15 | 2025-11-22 | Commit hash | a1b2c3d | .beads/* | v1.0 | High | Complete |
| R2-045 | Fix agent discovery routing | 2026-01-10 | 2026-01-15 | Commit hash | x9y8z7w | _config/* | v2.1 | High | Complete |
| R3-089 | Audit workflow manifests | 2026-02-01 | 2026-02-08 | Files + Commit | e5f6g7h | manifest.csv | v3.0 | Medium | Complete |
| R2-132 | Update docs | 2026-01-20 | 2026-01-25 | Unknown | ? | ? | ? | Low | Requires-verification |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

---

## Confidence Scoring

**High Confidence (80-100%)**:
- Commit hash found in git history
- Files directly correspond to issue
- Release tag confirms deployment
- Evidence is verifiable and specific

**Medium Confidence (50-80%)**:
- One form of evidence present (commit OR files OR release tag)
- Logical inference needed to connect evidence to issue
- Requires some interpretation

**Low Confidence (0-50%)**:
- Multiple evidence sources missing
- Vague original closure reason
- Cannot verify completion with certainty
- Requires manual investigation

**Retrofit Strategy by Confidence**:
- High: Auto-retrofit with confidence level "High"
- Medium: Auto-retrofit but flag for spot-check
- Low: Mark "requires-verification", escalate for review

---

## Phase C Execution Plan

**Week 1 of Phase C**:
1. Gather all closed issues from R1-R3 (estimated 173 issues)
2. Randomly sample 35 issues
3. For each of 35: gather evidence from git history
4. Create 35-issue sample spreadsheet with retrofit reasons
5. Identify closure pattern (A, B, C, or D above)
6. Assign confidence levels

**Following Weeks**:
7. Apply identified pattern to remaining 138 issues
8. Generate automated retrofit for high-confidence matches
9. Flag 20-30 for requires-verification
10. Create final spreadsheet with all 173 issues
11. Close bd-trace2 with evidence

---

## Quality Gates for Retrofit

**All retrofits must have**:
- [ ] Clear evidence type identified (commit, files, release, or requires-verification)
- [ ] Specific reference (commit hash, file path, or issue ID needing review)
- [ ] Confidence level assigned (high, medium, low)
- [ ] 1-2 sentence explanation of retrofit reasoning

**Retrofit is complete when**:
- ✅ 35 sampled issues updated in beads
- ✅ Closure pattern documented with examples
- ✅ Spreadsheet created with all 35 samples
- ✅ Proposed retrofit for remaining 138 issues created
- ✅ Confidence levels assigned

---

## References

- Beads Closure Standard: docs/BEADS-CLOSURE-STANDARD.md
- Release History: releases/ (Release_1.md, Release_2.md, Release_3.md)
- Git Log: `git log --all` shows all commits across history
- Version Tags: `git tag -l` shows release version tags (v1.0, v2.0, v3.0)

