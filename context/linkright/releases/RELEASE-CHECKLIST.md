# Linkright Release Checklist

**Release:** 4.0.0  
**Date:** 2026-03-08 - 2026-04-19 (6 weeks)  
**Status:** In Progress

---

## PRE-RELEASE VALIDATION GATES (Week 1-5)

These gates MUST all pass before release tagging. Blocking gates prevent release if failed.

### Phase A: Critical Infrastructure (Blocking)
- [ ] **Zero-byte Files**: `find _lr/ -type f -size 0` returns ONLY .gitkeep files (no critical configs)
- [ ] **Workflow Manifest**: All 28 workflows resolve, no broken paths, CSV parseable
- [ ] **Agent Manifest**: All 29 agents have ≥40 lines, complete XML structure
- [ ] **Context Z Mapping**: Phases A-C verified implemented, phases D-M step files created

**Acceptance**: All 4 items checked and verified. If ANY fails → STOP and fix before Phase B.

### Phase B: System Health (Blocking)
- [ ] **Monolithic Steps**: No steps exceed single responsibility (all ≤25 lines with 1 operation)
- [ ] **Phase D-M Steps**: 24+ new step files created, all with DEPENDENCIES sections, all > 25 lines
- [ ] **ADR Documentation**: 5 pilot ADRs created, each > 70 lines, covering key decisions
- [ ] **Agent Depth**: All 29 agents have `<rules>`, `<menu-handlers>`, `<activation>`, `<persona>`
- [ ] **Config Manifests**: All 5 manifests (agent, workflow, files, task, tool) valid and cross-referenced

**Acceptance**: All 5 items verified. Indicates system is ready for Phase C wiring.

### Phase C: Beads Integration (Blocking)
- [ ] **Task Closure**: All Phase A-B beads issues closed with evidence
- [ ] **Dependency Wiring**: All blocking relationships documented and verified in beads
- [ ] **Memory Capture**: Key decisions and lessons recorded via `bd remember`

**Acceptance**: All 3 items checked. Indicates documentation is complete for future reference.

### Quality Gates (Blocking)
- [ ] **YAML Validation**: All config files (*.yaml) pass `yaml-lint` with zero errors
- [ ] **CSV Validation**: All manifest files (*.csv) are parseable, zero syntax errors
- [ ] **Markdown Syntax**: All documentation (*.md) renders without errors
- [ ] **Path Resolution**: No broken symlinks, all referenced paths exist and are accessible

**Acceptance**: All 4 quality checks pass. If ANY fails → Fix and re-validate before release.

---

## RELEASE GATES (Release Day)

These gates execute ON the day of release (after pre-release gates pass).

### Version & Changelog (Non-blocking)
- [ ] **Version Bump**: Update version in _lr/lr-config.yaml to 4.0.0
- [ ] **Changelog**: Create CHANGELOG.md entry summarizing:
  - Phase A: Critical fixes completed
  - Phase B: Major remediation (24 new steps, 5 ADRs, manifests)
  - Known gaps (TEA KB, Phase D-M detailed implementation)
- [ ] **Release Notes**: Generate releases/Release_4.md with full audit summary

### Git & Tagging (Non-blocking)
- [ ] **Git Status**: `git status` shows clean working tree
- [ ] **Recent Commits**: Last commit includes all Phase B work
- [ ] **Tag Creation**: `git tag -a v4.0.0 -m "Release 4: BMAD Alignment & Quality Audit"`
- [ ] **Tag Verification**: `git tag -l v4.0.0` confirms tag exists locally

### Deployment (Non-blocking)
- [ ] **Build**: Run test suite (if applicable) - should pass
- [ ] **Staging**: Deploy to staging environment (if applicable)
- [ ] **Smoke Test**: Quick sanity check of critical workflows
- [ ] **Production**: Deploy to production (if applicable)

---

## POST-RELEASE CLEANUP (Release + 1 day)

These items ensure hygiene after release.

### Documentation & Memory (Non-blocking)
- [ ] **Session Compaction**: Run `bd sync` and `git push` to finalize remote state
- [ ] **Memory Cleanup**: Archive old session memories, summarize lessons learned
- [ ] **Release Documentation**: Ensure Release_4.md and RELEASE-CHECKLIST.md are complete
- [ ] **Feedback Capture**: Document any release issues or improvements for Release 5

### Technical Debt & Planning (Non-blocking)
- [ ] **Debt Tracking**: File beads issues for deferred work (TEA KB, Phase D-M enrichment)
- [ ] **Release 5 Planning**: Create Release 5 epic in beads with timeline
- [ ] **Known Issues**: Document any known limitations or workarounds
- [ ] **Next Steps**: Publish Release 5 priorities and success metrics

---

## Critical Success Metrics

**Release 4 is SUCCESSFUL if:**

✅ All blocking gates pass (Phases A, B, C + Quality)  
✅ All 24 new phase D-M step files are committed to git  
✅ All 5 ADRs document key architectural decisions  
✅ All 29 agents meet XML depth and structure requirements  
✅ All 5 config manifests enable agent discovery  
✅ Zero critical data loss or broken workflows  
✅ Complete audit trail in beads (all issues closed with evidence)

**Release 4 is NOT READY if:**

❌ Any Phase A-C blocking gate fails  
❌ Step files are incomplete or missing DEPENDENCIES  
❌ Agents lack required XML blocks (<rules>, <activation>, etc.)  
❌ Manifests have orphaned or broken entries  
❌ Quality checks find errors in configs/syntax  
❌ Any beads tasks remain open without closure evidence

---

## Release Timeline

| Week | Phase | Key Deliverables | Gate Type |
|------|-------|------------------|-----------|
| 1 (Mar 8-14) | A | Zero-byte audit, Workflow manifest, Context Z mapping | Blocking |
| 2-3 (Mar 15-28) | B | 24 new steps, 5 ADRs, Agent normalization, Manifests | Blocking |
| 4 (Mar 29-Apr 4) | C | Beads wiring, Task closure, Dependency documentation | Blocking |
| 5-6 (Apr 5-19) | Final Polish | Bug fixes, Documentation, Release tagging & deployment | Non-blocking |

---

## Sign-Off

**Prepared By:** Claude Haiku (AI Agent)  
**Date Prepared:** 2026-03-08  
**Status:** ACTIVE (Updated regularly during release cycle)

**Sign-Off Verification** (to be completed at release):
- [ ] All blocking gates passed
- [ ] Release artifacts (CHANGELOG, Release_4.md) complete
- [ ] Git tag created and pushed
- [ ] No critical issues reported in QA
- [ ] Ready for production deployment

---

## References

- **Phase A-C Work**: Documented in beads (bd show sync-mro.1, sync-mro.2, sync-mro.3)
- **Validation Template**: _lr/core/workflows/common/validation-template.md
- **ADRs**: _lr/docs/adrs/ADR-*.md
- **Release Notes**: releases/Release_4.md
- **Config Manifests**: _lr/_config/*-manifest.csv

