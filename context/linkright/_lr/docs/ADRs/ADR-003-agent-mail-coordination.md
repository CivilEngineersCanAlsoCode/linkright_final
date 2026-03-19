# ADR-003: Agent Mail for Coordination

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
Linkright's multi-agent environment requires a reliable way for agents to communicate, synchronize their activities, and manage access to shared resources (files).

## Decision
Adopt **Agent Mail (MCP version)** as the primary coordination and file reservation system for all Linkright agents.

## Rationale
- **Asynchronous Communication**: Provides a reliable, git-backed messaging system for agents.
- **Resource Locking**: Includes a built-in file reservation system to prevent multiple agents from editing the same file simultaneously.
- **Auditability**: All messages and reservations are tracked in a persistent, searchable index.
- **Standardized Handoffs**: Enables clear signaling when a task is completed and ready for the next agent in the pipeline.

## Consequences
- Agents must register with the Agent Mail system at the start of each session.
- Mandatory file reservation protocol before any editing operations.
- Requires the Agent Mail MCP server to be active and connected.

## Alternatives Considered
- **Direct Socket Communication**: Too complex to implement and lacks the persistence of Agent Mail.
- **Shared Files (Locks)**: Error-prone and lacks the structured messaging needed for complex handoffs.
- **Manual Coordination**: Does not scale for autonomous operations.
