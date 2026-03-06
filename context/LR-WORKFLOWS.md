# LINKRIGHT WORKFLOWS (LR-WORKFLOWS)

## 🔄 SYNC WORKFLOWS

| ID                 | Workflow                    | Agent            | Trigger              |
| ------------------ | --------------------------- | ---------------- | -------------------- |
| `sync-jd-optimize` | 53-step JD Optimization     | `sync-parser`    | New JD PDF/URL       |
| `sync-outbound`    | Outbound Campaign Generator | `sync-publicist` | jd-profile confirmed |
| `sync-portfolio`   | Global Portfolio Deployment | `sync-styler`    | Initial setup        |

## 🔄 FLEX WORKFLOWS

| ID             | Workflow                  | Agent            | Trigger          |
| -------------- | ------------------------- | ---------------- | ---------------- |
| `flex-content` | Content Automation Engine | `flex-publicist` | Daily Reflection |

## 🔄 CORE WORKFLOWS

| ID        | Workflow              | Agent             | Trigger      |
| --------- | --------------------- | ----------------- | ------------ |
| `lr-init` | Module Initialization | `lr-orchestrator` | System setup |
