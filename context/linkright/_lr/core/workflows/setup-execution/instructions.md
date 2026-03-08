# Execution Setup & Module Introduction

<critical>This is the required entry point workflow for Linkright. It must be run BEFORE any other workflow.</critical>

## Overview

Initialize the execution environment, generate a full execution graph, setup `beads` (bd) issue tracking, and orient the user to the available Linkright modules.

## Sequence

### 1. Initialize Linkright Dependencies & Graph
- Scan `_lr/*` to map all available workflows and their steps.
- Output a Clean Execution Graph (`_lr-output/execution-graph.md`) showing exactly how work will flow and the dependencies between modules.
- Output a clear visual graph to the user in the chat.

### 2. Setup Issue Tracking (Beads)
- Check `bd` status in the project directory.
- Run `bd onboard` if beads is not initialized.
- Create an initial `Epic: Linkright Session [Date]` to track today's execution.

### 3. Module Introduction & User Intent
- Introduce the user to the core Linkright modules available to them:
  - **Squick (`squick`)**: Rapid SDLC (Analysis -> Solutioning -> Implementation).
  - **Sync (`sync`)**: Career identity, resume optimization, and application tracking.
  - **Flex (`flex`)**: Content automation and outbound campaigns.
  - **CIS (`cis`)**: Narrative crafting and core positioning.
  - **Core (`core`)**: Project documentation and sprint management.
- Ask the user: **"What would you like to build or achieve today?"**
- Wait for user input.

### 4. Route to Module
- Based on the user's intent, route them to the appropriate next workflow (e.g., `/bmad:lr:squick:workflows:1-analysis` or `/bmad:lr:sync:workflows:jd-optimize`).
- Update the Beads epic with specific Task issues for the selected path.
