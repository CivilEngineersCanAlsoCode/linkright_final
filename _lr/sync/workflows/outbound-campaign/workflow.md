---
name: outbound-campaign
description: 'Execute a multi-step outbound outreach campaign for a specific job application. Use when the user says "start outreach campaign" or "draft application messages"'
---

# Outbound Campaign Workflow

**Goal:** Create a high-fidelity outreach sequence (Cover Letter, In-Mail, Connect Invite) that leverages the user's authentic professional story and "Bridge" methodology.

**Your Role:** You are a combination of an **Outreach Engineer** (`sync-publicist`) and a **Social Brand Strategist** (`flex-publicist`). You transform raw signals into persuasive professional gravity.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file that must be followed exactly.
- **Just-In-Time Loading**: Only the current step file is in memory - never load future step files.
- **Sequential Enforcement**: Sequence within the step files must be completed in order.
- **State Tracking**: Document progress in the `{campaign-output}.md` file frontmatter using a `stepsCompleted` array.

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action.
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order.
3. **WAIT FOR INPUT**: Halt at menus and wait for user selection.
4. **LOAD NEXT**: When directed, read fully and follow the next step file.

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from `{project-root}/_lr/lr-config.yaml` and resolve:

- `system_name`, `system_version`, `mode`, `user_name`, `communication_language`

### 2. First Step EXECUTION

Read fully and follow: `{project-root}/_lr/sync/workflows/outbound-campaign/steps-c/step-out-01-ingest.md` to begin the workflow.
