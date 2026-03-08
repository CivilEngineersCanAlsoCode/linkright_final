# ADR-005: Unified IDE Manifest (vs Per-IDE Duplication)

**Status:** Accepted
**Date:** 2026-03-09

---

## Context

Linkright integrates with 33+ IDE integrations (VS Code, Cursor, Zed, etc.). Each IDE needs command definitions. Previous approach: duplicate definitions per IDE.

---

## Decision

**Single unified manifest file that all IDEs read:**
- `_config/ide-commands.csv` (one source of truth)
- Each row: command_name, module, workflow_path, description
- IDEs parse this and generate UI commands

---

## Rationale

- ✅ One place to update = all IDEs updated
- ✅ No sync issues
- ✅ Smaller codebase (33 files → 1 file)

---

## Consequences

+ ✅ Maintainability: Update once, propagate everywhere
+ ✅ Consistency: All IDEs have same commands

- ⚠️ IDE-specific features require adapters (slight added complexity)
