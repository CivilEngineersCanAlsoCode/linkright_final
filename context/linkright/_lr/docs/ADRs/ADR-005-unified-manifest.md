# ADR-005: Unified IDE Manifest

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
As Linkright grows, identifying and accessing specific agents, workflows, and configuration files becomes increasingly difficult for both human developers and AI automation tools. A centralized source of truth is needed to index the entire ecosystem.

## Decision
Implement a **Unified IDE Manifest** system using a set of standardized CSV files (agent-manifest, workflow-manifest, task-manifest, files-manifest) located at the project root or `_config/`.

## Rationale
- **Discoverability**: Provides a single point of entry for exploring all system components.
- **Interoperability**: CSV format is easily readable by standard CLI tools (awk, grep), IDE extensions, and AI agents.
- **Automation**: Enables automated validation of file existence and system integrity.
- **Schema-first**: Enforces a consistent metadata schema for all indexed entities.

## Consequences
- All new components must be registered in the appropriate manifest.
- Regular validation runs are required to ensure manifest accuracy.
- Requires maintenance of the `validate-manifests.sh` script.

## Alternatives Considered
- **Decentralized Configs (READMEs)**: Difficult to parse programmatically and prone to going out of sync.
- **JSON/YAML Manifests**: More structured but harder to manipulate with standard UNIX line-processing tools compared to CSV.
- **Database-only indexing**: Lacks the visibility and version-control transparency of file-based manifests.
