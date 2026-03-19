# ADR-001: Beads for Task Persistence

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
Linkright requires a persistent, distributed, and dependency-aware task tracking system to manage complex, multi-agent workflows. Standard markdown TODOs and traditional issue trackers lack the granular, programmatic, and version-controlled features needed for autonomous AI coordination.

## Decision
Adopt **Beads (Go version)** as the primary governance and task persistence layer for all Linkright projects.

## Rationale
- **Dolt-Backed**: Built on Dolt, providing cell-level merging, SQL access, and full version history of the issue database.
- **Dependency Support**: Native support for complex dependency graphs (blocks/depends-on), enabling "Ready Work" detection.
- **Agent-Optimized**: Designed for AI agents with JSON output, memory features (`remember`, `memories`), and CLI-first interaction.
- **Persistence**: Ensures session context and task state survive across restarts and different environments.

## Consequences
- All agents must be "Beads-aware" and update task status programmatically.
- A local `.beads/` directory is required in every project.
- Mandatory training for agents on the Beads CLI (`bd`).

## Alternatives Considered
- **Redis**: High performance but lacks complex dependency management and versioned history.
- **PostgreSQL**: Robust but requires infrastructure overhead and doesn't offer the unique merging capabilities of Dolt for distributed planning.
- **Pure Markdown**: Simple but impossible to scale for multi-agent synchronization and lacks atomic state management.
