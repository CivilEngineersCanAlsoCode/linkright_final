# Workflow-to-Epic Mapping Table (Linkright Quality Mission)

This table maps the 17 core workflows targeted by the Release 4 Quality Mission to their unique Beads epic IDs. These IDs are used by the `step-01b` resumption logic to track session-specific tasks and checkpoints.

| Module | Workflow ID | Workflow Name | Beads Epic ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Sync** | `jd-optimize` | Signal-Driven JD Optimization | `sync-zas.wm-1` | Active |
| **Sync** | `outbound-campaign` | Outbound Campaign Execution | `sync-zas.wm-2` | Active |
| **Sync** | `portfolio-deploy` | Portfolio GitHub Deployment | `sync-zas.wm-3` | Active |
| **Sync** | `application-track` | Application Pipeline Tracking | `sync-zas.wm-4` | Active |
| **Sync** | `quick-optimize` | Quick Resume Optimization | `sync-zas.wm-5` | Active |
| **Sync** | `signal-capture` | Career Signal Capture | `sync-zas.wm-6` | Active |
| **Flex** | `content-automation` | Social Signal Amplification | `sync-zas.wm-7` | Active |
| **Flex** | `portfolio-deploy` | Portfolio Github View | `sync-zas.wm-8` | Active |
| **Squick**| `1-analysis` | Squick Phase 1: Analysis | `sync-zas.wm-9` | Active |
| **Squick**| `2-plan` | Squick Phase 2: Planning | `sync-zas.wm-10` | Active |
| **Squick**| `3-solutioning` | Squick Phase 3: Solutioning | `sync-zas.wm-11` | Active |
| **Squick**| `4-implementation` | Squick Phase 4: Implementation | `sync-zas.wm-12` | Active |
| **Squick**| `enterprise-ship` | Enterprise-Grade Delivery | `sync-zas.wm-13` | Active |
| **Core** | `sprint-status` | Sprint Status Review | `sync-zas.wm-14` | Active |
| **Core** | `dev-story` | Development Story Execution | `sync-zas.wm-15` | Active |
| **Core** | `context-gen` | Context Generation | `sync-zas.wm-16` | Active |
| **TEA**  | `resume-validation` | Resume Validation | `sync-zas.wm-17` | Active |

---

## Usage Instructions

When generating `step-01b` files for these workflows, replace the `[WORKFLOW-EPIC-ID]` placeholder with the corresponding **Beads Epic ID** from the table above.
