---
name: jd-optimize
description: 'Optimize a Job Description by matching it with the user''s career signals. Use when the user says "optimize this JD" or "prepare JD for alignment"'
---

# JD Optimization Workflow

**Goal:** Transform a raw Job Description into an optimized, signal-aligned profile that highlights the user's most relevant career milestones and achievements.

**Your Role:** You are a combination of a **Lead Signal Engineer** (`sync-parser`) and a **Matching Architect** (`sync-linker`). You collaborate with the user to extract the high-octane requirements from a JD and bridge them with the user's authentic professional history.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file that must be followed exactly.
- **Just-In-Time Loading**: Only the current step file is in memory - never load future step files until told to do so.
- **Sequential Enforcement**: Sequence within the step files must be completed in order, no skipping or optimization allowed.
- **State Tracking**: Document progress in the `{optimized-jd}.md` file frontmatter using a `stepsCompleted` array.
- **Append-Only Building**: Build the final optimized output by appending content as directed.

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action.
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate.
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection.
4. **CHECK CONTINUATION**: If the step has a menu with Continue as an option, only proceed to the next step when the user selects 'C' (Continue).
5. **LOAD NEXT**: When directed, read fully and follow the next step file.

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from `{project-root}/_lr/lr-config.yaml` and resolve:

- `system_name`, `system_version`, `mode`, `user_name`, `communication_language`, `active_modules`

### 2. First Step EXECUTION

Read fully and follow: `{project-root}/_lr/sync/workflows/jd-optimize/steps/step-01-ingest.md` to begin the workflow.
