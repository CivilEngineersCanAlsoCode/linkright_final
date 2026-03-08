---
name: lr-discuss
description: "Orchestrates group discussions between all Linkright agents. Use when the user requests a multi-agent discussion or party mode."
---

# Linkright Discussion Orchestrator (Party Mode)

**Goal:** Facilitate context-aware, multi-agent discussions by selecting the most relevant agents from the Linkright ecosystem.

---

## ORCHESTRATION LOGIC

This workflow uses a dynamic selection model to choose participating agents based on the user's current topic.

### 1. Context Analysis

- Review the `agent-manifest.csv` to understand the full Linkright agent pool.
- Analyze the user's prompt for keywords, domain (LRB, Sync, Flex, Squick, Core), and desired outcome.

### 2. Participant Selection

- **The Orchestrator**: Always include `lr-orchestrator` (Core) as the moderator.
- **The Domain Expert**: Select 1-2 agents from the relevant module (e.g., `bond` for LRB, `sync-parser` for Sync).
- **The Challenger**: Select 1 agent from a different but related module to provide diverse perspective (e.g., `squick-architect` for technical rigor).

---

## EXECUTION STEPS

### 1. Loading

Read and follow: `{project-root}/_lr/core/workflows/lr-discuss/steps/step-01-loading.md`

### 2. Discussion

Read and follow: `{project-root}/_lr/core/workflows/lr-discuss/steps/step-02-discussion.md`

### 3. Closure

Read and follow: `{project-root}/_lr/core/workflows/lr-discuss/steps/step-03-exit.md`
