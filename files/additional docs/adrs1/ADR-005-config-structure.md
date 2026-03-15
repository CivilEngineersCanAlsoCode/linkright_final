# ADR-005: Configuration File Structure and Naming Convention

**Status:** Accepted

**Date:** 2026-03-08

---

## Context

Linkright requires centralized configuration management for agents, workflows, tools, and data models. BMAD-METHOD specifies config/ directory with structured YAML files. Current state:
- Multiple manifests (agent-manifest.csv, workflow-manifest.csv, etc.)
- Distributed configs (mongodb-config, chromadb-config, others)
- Mixed formats (YAML, CSV, JSON)
- No unified schema

Release 4 includes audit of config file structure and decision on standardization.

---

## Decision

Adopt unified configuration structure:
1. **Registry Format**: All manifests use CSV format for agent discovery
2. **Schema Format**: All configs use YAML with JSON Schema validation
3. **Organization**: _lr/_config/ directory contains all manifests (*.csv)
4. **Module Configs**: Module-specific configs in module directories (e.g., _lr/sync/_config/)
5. **Naming**: Manifest files: `{entity}-manifest.csv` (agent-manifest.csv, workflow-manifest.csv)

---

## Rationale

1. **Consistency**: Single format reduces tool complexity, improves discoverability
2. **BMAD Alignment**: CSV for manifests (agent discovery), YAML for configs (detailed settings)
3. **Extensibility**: JSON Schema validation allows future format evolution
4. **Tooling**: CSV manifests directly consumable by agents for discovery
5. **Version Control**: YAML + JSON Schema friendly to git, diff tools

---

## Consequences

### Positive
- Unified discovery mechanism for all entity types
- Reduced tool fragmentation
- Clear naming conventions prevent confusion
- Validation schema ensures data quality

### Negative
- Migration effort for existing configs (one-time cost)
- Schema changes require validation update
- Tool ecosystem needs CSV/YAML support
- Learning curve for new contributors

**Mitigation**:
- Config migration documented in Release 4 Improvement Plan
- Schema templates provided for each entity type
- Validation tooling created (linter script)

---

## Alternatives Considered

1. **Keep mixed format**: More flexible but confusing, poor discoverability
2. **Adopt JSON for all configs**: More verbose, less human-readable than YAML
3. **Adopt YAML for everything**: CSV better for tabular data (manifests)

---

## Related ADRs

- ADR-XXX: (Future) Config validation and linting strategy
- ADR-XXX: Config versioning and change tracking

---

## References

- Config Directory: _lr/_config/
- Manifest Examples: workflow-manifest.csv, agent-manifest.csv
- JSON Schema Spec: https://json-schema.org/
- BMAD Configuration: https://github.com/anthropics/BMAD-METHOD/config/

