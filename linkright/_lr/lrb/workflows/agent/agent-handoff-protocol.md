# Agent Handoff Protocol

## Overview

The Agent Handoff Protocol defines how state and control are passed between agents in the Linkright ecosystem using **Beads** dependency chaining and **shared data layers** (MongoDB/Chroma).

## State Passing Mechanisms

### 1. Structured Data Handoff (MongoDB)

- **Pattern**: Agent A writes to a shared collection → Agent B reads from that collection.
- **Example**: `sync-parser` writes to `jd_profiles` → `sync-linker` reads from `jd_profiles`.
- **Validation**: Each handoff point MUST include schema validation to ensure the downstream agent receives clean data.

### 2. Semantic Context Handoff (Chroma)

- **Pattern**: Agent A indexes a document → Agent B performs a semantic query.
- **Example**: `sync-parser` embeds a JD into `career_signals_vcf` → `sync-linker` queries that collection for alignment.

### 3. Task Dependency Handoff (Beads)

- **Pattern**: Agent A creates a task → Agent B is assigned to the task → Agent C is blocked by that task.
- **Command**: `bd dep add {child_id} {parent_id}`
- **Status Propagation**: When Agent A closes a task, it automatically unblocks the "Ready to Work" task for Agent B.

## Protocol Steps

1.  **State Commitment**: The active agent must commit all changes to MongoDB/Chroma before triggering the next step.
2.  **Task Update**: The active agent marks its current task as `completed` using `bd close`.
3.  **Dependency Resolution**: Beads automatically identifies the next unblocked task.
4.  **Context Loading**: The new agent loads the relevant signals/profiles from the shared data layer using the session ID provided in the task metadata.

## Best Practices

- **Atomic Handoffs**: Each handoff should represent a clear logical boundary (e.g., Ingestion → Matching).
- **Metadata Enriched**: Include the `session_id` and any `data_reference` (e.g., MongoDB ObjectId) in the Beads task description.
- **Zero Local Handoff**: Never pass data via local temporary files; always use the shared data layer.
