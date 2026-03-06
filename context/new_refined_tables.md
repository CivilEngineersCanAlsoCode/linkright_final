# BMAD Directory Analysis (Refined)

## Table A (Level 2 - `_bmad/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.1 | `_config` | Folder | Groups related modular substructures required by _config. |
| 1.2 | `_memory` | Folder | Groups related modular substructures required by _memory. |
| 1.3 | `bmb` | Folder | Groups related modular substructures required by bmb. |
| 1.4 | `bmm` | Folder | Groups related modular substructures required by bmm. |
| 1.5 | `cis` | Folder | Groups related modular substructures required by cis. |
| 1.6 | `core` | Folder | Groups related modular substructures required by core. |
| 1.7 | `gds` | Folder | Groups related modular substructures required by gds. |
| 1.8 | `tea` | Folder | Groups related modular substructures required by tea. |


---

## Table B (Level 3 - `_bmad/_config/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.1.1 | `agents` | Folder | Stores AI persona definitions and prompt overrides for _config agents. |
| 1.1.2 | `custom` | Folder | Groups related modular substructures required by custom. |
| 1.1.3 | `ides` | Folder | Groups related modular substructures required by ides. |
| 1.1.4 | `agent-manifest.csv` | CSV File | Maps the global registry of 'agent' items for internal routing. |
| 1.1.5 | `bmad-help.csv` | CSV File | Provides command mappings for user assistance regarding bmad-help. |
| 1.1.6 | `files-manifest.csv` | CSV File | Maps the global registry of 'files' items for internal routing. |
| 1.1.7 | `task-manifest.csv` | CSV File | Maps the global registry of 'task' items for internal routing. |
| 1.1.8 | `tool-manifest.csv` | CSV File | Maps the global registry of 'tool' items for internal routing. |
| 1.1.9 | `workflow-manifest.csv` | CSV File | Maps the global registry of 'workflow' items for internal routing. |
| 1.1.10 | `manifest.yaml` | YAML File | Defines deployment overrides for the manifest environment. |


---

## Table C (Level 4 - `_bmad/_config/agents/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.1.1.1 | `bmb-agent-builder.customize.yaml` | YAML File | Applies specific persona overrides and tool configurations for the bmb-agent-builder agent. |
| 1.1.1.2 | `bmb-module-builder.customize.yaml` | YAML File | Applies specific persona overrides and tool configurations for the bmb-module-builder agent. |
| 1.1.1.3 | `bmb-workflow-builder.customize.yaml` | YAML File | Applies specific persona overrides and tool configurations for the bmb-workflow-builder agent. |
| 1.1.1.4 | `bmm-analyst.customize.yaml` | YAML File | Applies specific persona overrides and tool configurations for the bmm-analyst agent. |

<br>*Note: We showed 4 example YAML files above. We smartly skipped the following 23 similar non-step files to keep the table concise:* `bmm-architect.customize.yaml, bmm-dev.customize.yaml, bmm-pm.customize.yaml, bmm-qa.customize.yaml, bmm-quick-flow-solo-dev.customize.yaml, bmm-sm.customize.yaml, bmm-tech-writer.customize.yaml, bmm-ux-designer.customize.yaml, cis-brainstorming-coach.customize.yaml, cis-creative-problem-solver.customize.yaml, cis-design-thinking-coach.customize.yaml, cis-innovation-strategist.customize.yaml, cis-presentation-master.customize.yaml, cis-storyteller.customize.yaml, core-bmad-master.customize.yaml, gds-game-architect.customize.yaml, gds-game-designer.customize.yaml, gds-game-dev.customize.yaml, gds-game-qa.customize.yaml, gds-game-scrum-master.customize.yaml, gds-game-solo-dev.customize.yaml, gds-tech-writer.customize.yaml, tea-tea.customize.yaml`

---

## Table D (Level 4 - `_bmad/_config/ides/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.1.3.1 | `antigravity.yaml` | YAML File | Defines deployment overrides for the antigravity environment. |
| 1.1.3.2 | `auggie.yaml` | YAML File | Defines deployment overrides for the auggie environment. |
| 1.1.3.3 | `claude-code.yaml` | YAML File | Defines deployment overrides for the claude-code environment. |
| 1.1.3.4 | `cline.yaml` | YAML File | Defines deployment overrides for the cline environment. |

<br>*Note: We showed 4 example YAML files above. We smartly skipped the following 15 similar non-step files to keep the table concise:* `codebuddy.yaml, codex.yaml, crush.yaml, cursor.yaml, gemini.yaml, github-copilot.yaml, iflow.yaml, kilo.yaml, kiro.yaml, opencode.yaml, qwen.yaml, roo.yaml, rovo-dev.yaml, trae.yaml, windsurf.yaml`

---

## Table E (Level 3 - `_bmad/_memory/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.2.1 | `storyteller-sidecar` | Folder | Groups related modular substructures required by storyteller-sidecar. |
| 1.2.2 | `tech-writer-sidecar` | Folder | Groups related modular substructures required by tech-writer-sidecar. |
| 1.2.3 | `config.yaml` | YAML File | Initializes baseline settings and module behaviors for _memory. |


---

## Table F (Level 4 - `_bmad/_memory/storyteller-sidecar/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.2.1.1 | `stories-told.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'stories-told'. |
| 1.2.1.2 | `story-preferences.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'story-preferences'. |


---

## Table G (Level 4 - `_bmad/_memory/tech-writer-sidecar/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.2.2.1 | `documentation-standards.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'documentation-standards'. |


---

## Table H (Level 3 - `_bmad/bmb/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.1 | `agents` | Folder | Stores AI persona definitions and prompt overrides for bmb agents. |
| 1.3.2 | `workflows` | Folder | Categorizes structured execution pathways for bmb processes. |
| 1.3.3 | `module-help.csv` | CSV File | Provides command mappings for user assistance regarding module-help. |
| 1.3.4 | `config.yaml` | YAML File | Initializes baseline settings and module behaviors for bmb. |


---

## Table I (Level 4 - `_bmad/bmb/agents/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.1.1 | `agent-builder.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'agent-builder'. |
| 1.3.1.2 | `module-builder.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'module-builder'. |
| 1.3.1.3 | `workflow-builder.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-builder.md' objective. |


---

## Table J (Level 4 - `_bmad/bmb/workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1 | `agent` | Folder | Groups related modular substructures required by agent. |
| 1.3.2.2 | `module` | Folder | Groups related modular substructures required by module. |
| 1.3.2.3 | `workflow` | Folder | Groups related modular substructures required by workflow. |


---

## Table K (Level 5 - `_bmad/bmb/workflows/agent/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1.1 | `data` | Folder | Provides contextual reference datasets and schemas required by agent workflows. |
| 1.3.2.1.2 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate agent workflow logic. |
| 1.3.2.1.3 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate agent workflow logic. |
| 1.3.2.1.4 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate agent workflow logic. |
| 1.3.2.1.5 | `templates` | Folder | Stores reusable output generation formats for agent artifacts. |
| 1.3.2.1.6 | `workflow-create-agent.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-create-agent.md' objective. |
| 1.3.2.1.7 | `workflow-edit-agent.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-edit-agent.md' objective. |
| 1.3.2.1.8 | `workflow-validate-agent.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-validate-agent.md' objective. |


---

## Table L (Level 6 - `_bmad/bmb/workflows/agent/data/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1.1.1 | `reference` | Folder | Groups related modular substructures required by reference. |
| 1.3.2.1.1.2 | `communication-presets.csv` | CSV File | Defines a structured matrix mapping parameters for communication-presets. |
| 1.3.2.1.1.3 | `agent-architecture.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'agent-architecture'. |
| 1.3.2.1.1.4 | `agent-compilation.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'agent-compilation'. |
| 1.3.2.1.1.5 | `agent-menu-patterns.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'agent-menu-patterns'. |
| 1.3.2.1.1.6 | `agent-metadata.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'agent-metadata'. |
| 1.3.2.1.1.7 | `agent-validation.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'agent-validation'. |
| 1.3.2.1.1.8 | `brainstorm-context.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'brainstorm-context'. |
| 1.3.2.1.1.9 | `critical-actions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'critical-actions'. |
| 1.3.2.1.1.10 | `persona-properties.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'persona-properties'. |
| 1.3.2.1.1.11 | `principles-crafting.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'principles-crafting'. |
| 1.3.2.1.1.12 | `understanding-agent-types.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'understanding-agent-types'. |


---

## Table M (Level 7 - `_bmad/bmb/workflows/agent/data/reference/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1.1.1.1 | `module-examples` | Folder | Groups related modular substructures required by module-examples. |


---

## Table N (Level 8 - `_bmad/bmb/workflows/agent/data/reference/module-examples/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1.1.1.1.1 | `architect.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'architect'. |


---

## Table O (Level 6 - `_bmad/bmb/workflows/agent/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1.2.1 | `step-01-brainstorm.md` | Markdown File | Executes the specific procedural sequence 'step-01-brainstorm' within the workflow. |
| 1.3.2.1.2.2 | `step-02-discovery.md` | Markdown File | Executes the specific procedural sequence 'step-02-discovery' within the workflow. |
| 1.3.2.1.2.3 | `step-03-sidecar-metadata.md` | Markdown File | Executes the specific procedural sequence 'step-03-sidecar-metadata' within the workflow. |
| 1.3.2.1.2.4 | `step-04-persona.md` | Markdown File | Executes the specific procedural sequence 'step-04-persona' within the workflow. |
| 1.3.2.1.2.5 | `step-05-commands-menu.md` | Markdown File | Executes the specific procedural sequence 'step-05-commands-menu' within the workflow. |
| 1.3.2.1.2.6 | `step-06-activation.md` | Markdown File | Executes the specific procedural sequence 'step-06-activation' within the workflow. |
| 1.3.2.1.2.7 | `step-07-build-agent.md` | Markdown File | Executes the specific procedural sequence 'step-07-build-agent' within the workflow. |
| 1.3.2.1.2.8 | `step-08-celebrate.md` | Markdown File | Executes the specific procedural sequence 'step-08-celebrate' within the workflow. |


---

## Table P (Level 6 - `_bmad/bmb/workflows/agent/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1.3.1 | `e-01-load-existing.md` | Markdown File | Executes the specific procedural sequence 'e-01-load-existing' within the workflow. |
| 1.3.2.1.3.2 | `e-02-discover-edits.md` | Markdown File | Executes the specific procedural sequence 'e-02-discover-edits' within the workflow. |
| 1.3.2.1.3.3 | `e-03-placeholder.md` | Markdown File | Executes the specific procedural sequence 'e-03-placeholder' within the workflow. |
| 1.3.2.1.3.4 | `e-04-sidecar-metadata.md` | Markdown File | Executes the specific procedural sequence 'e-04-sidecar-metadata' within the workflow. |
| 1.3.2.1.3.5 | `e-05-persona.md` | Markdown File | Executes the specific procedural sequence 'e-05-persona' within the workflow. |
| 1.3.2.1.3.6 | `e-06-commands-menu.md` | Markdown File | Executes the specific procedural sequence 'e-06-commands-menu' within the workflow. |
| 1.3.2.1.3.7 | `e-07-activation.md` | Markdown File | Executes the specific procedural sequence 'e-07-activation' within the workflow. |
| 1.3.2.1.3.8 | `e-08-edit-agent.md` | Markdown File | Executes the specific procedural sequence 'e-08-edit-agent' within the workflow. |
| 1.3.2.1.3.9 | `e-09-celebrate.md` | Markdown File | Executes the specific procedural sequence 'e-09-celebrate' within the workflow. |


---

## Table Q (Level 6 - `_bmad/bmb/workflows/agent/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1.4.1 | `v-01-load-review.md` | Markdown File | Executes the specific procedural sequence 'v-01-load-review' within the workflow. |
| 1.3.2.1.4.2 | `v-02a-validate-metadata.md` | Markdown File | Executes the specific procedural sequence 'v-02a-validate-metadata' within the workflow. |
| 1.3.2.1.4.3 | `v-02b-validate-persona.md` | Markdown File | Executes the specific procedural sequence 'v-02b-validate-persona' within the workflow. |
| 1.3.2.1.4.4 | `v-02c-validate-menu.md` | Markdown File | Executes the specific procedural sequence 'v-02c-validate-menu' within the workflow. |
| 1.3.2.1.4.5 | `v-02d-validate-structure.md` | Markdown File | Executes the specific procedural sequence 'v-02d-validate-structure' within the workflow. |
| 1.3.2.1.4.6 | `v-02e-validate-sidecar.md` | Markdown File | Executes the specific procedural sequence 'v-02e-validate-sidecar' within the workflow. |
| 1.3.2.1.4.7 | `v-03-summary.md` | Markdown File | Executes the specific procedural sequence 'v-03-summary' within the workflow. |


---

## Table R (Level 6 - `_bmad/bmb/workflows/agent/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.1.5.1 | `agent-plan.template.md` | Markdown File | Provides the structural skeleton for generating 'agent-plan' outputs. |
| 1.3.2.1.5.2 | `agent-template.md` | Markdown File | Provides the structural skeleton for generating 'agent' outputs. |


---

## Table S (Level 5 - `_bmad/bmb/workflows/module/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.2.1 | `data` | Folder | Provides contextual reference datasets and schemas required by module workflows. |
| 1.3.2.2.2 | `steps-b` | Folder | Compartmentalizes Phase B sequence steps to strictly isolate module workflow logic. |
| 1.3.2.2.3 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate module workflow logic. |
| 1.3.2.2.4 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate module workflow logic. |
| 1.3.2.2.5 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate module workflow logic. |
| 1.3.2.2.6 | `templates` | Folder | Stores reusable output generation formats for module artifacts. |
| 1.3.2.2.7 | `module-help-generate.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'module-help-generate'. |
| 1.3.2.2.8 | `workflow-create-module-brief.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-create-module-brief.md' objective. |
| 1.3.2.2.9 | `workflow-create-module.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-create-module.md' objective. |
| 1.3.2.2.10 | `workflow-edit-module.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-edit-module.md' objective. |
| 1.3.2.2.11 | `workflow-validate-module.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-validate-module.md' objective. |


---

## Table T (Level 6 - `_bmad/bmb/workflows/module/data/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.2.1.1 | `agent-architecture.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'agent-architecture'. |
| 1.3.2.2.1.2 | `agent-spec-template.md` | Markdown File | Provides the structural skeleton for generating 'agent-spec' outputs. |
| 1.3.2.2.1.3 | `module-standards.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'module-standards'. |
| 1.3.2.2.1.4 | `module-yaml-conventions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'module-yaml-conventions'. |


---

## Table U (Level 6 - `_bmad/bmb/workflows/module/steps-b/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.2.2.1 | `step-01-welcome.md` | Markdown File | Executes the specific procedural sequence 'step-01-welcome' within the workflow. |
| 1.3.2.2.2.2 | `step-02-spark.md` | Markdown File | Executes the specific procedural sequence 'step-02-spark' within the workflow. |
| 1.3.2.2.2.3 | `step-03-module-type.md` | Markdown File | Executes the specific procedural sequence 'step-03-module-type' within the workflow. |
| 1.3.2.2.2.4 | `step-04-vision.md` | Markdown File | Executes the specific procedural sequence 'step-04-vision' within the workflow. |
| 1.3.2.2.2.5 | `step-05-identity.md` | Markdown File | Executes the specific procedural sequence 'step-05-identity' within the workflow. |
| 1.3.2.2.2.6 | `step-06-users.md` | Markdown File | Executes the specific procedural sequence 'step-06-users' within the workflow. |
| 1.3.2.2.2.7 | `step-07-value.md` | Markdown File | Executes the specific procedural sequence 'step-07-value' within the workflow. |
| 1.3.2.2.2.8 | `step-08-agents.md` | Markdown File | Executes the specific procedural sequence 'step-08-agents' within the workflow. |
| 1.3.2.2.2.9 | `step-09-workflows.md` | Markdown File | Executes the specific procedural sequence 'step-09-workflows' within the workflow. |
| 1.3.2.2.2.10 | `step-10-tools.md` | Markdown File | Executes the specific procedural sequence 'step-10-tools' within the workflow. |
| 1.3.2.2.2.11 | `step-11-scenarios.md` | Markdown File | Executes the specific procedural sequence 'step-11-scenarios' within the workflow. |
| 1.3.2.2.2.12 | `step-12-creative.md` | Markdown File | Executes the specific procedural sequence 'step-12-creative' within the workflow. |
| 1.3.2.2.2.13 | `step-13-review.md` | Markdown File | Executes the specific procedural sequence 'step-13-review' within the workflow. |
| 1.3.2.2.2.14 | `step-14-finalize.md` | Markdown File | Executes the specific procedural sequence 'step-14-finalize' within the workflow. |


---

## Table V (Level 6 - `_bmad/bmb/workflows/module/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.2.3.1 | `step-01-load-brief.md` | Markdown File | Executes the specific procedural sequence 'step-01-load-brief' within the workflow. |
| 1.3.2.2.3.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.3.2.2.3.3 | `step-02-structure.md` | Markdown File | Executes the specific procedural sequence 'step-02-structure' within the workflow. |
| 1.3.2.2.3.4 | `step-03-config.md` | Markdown File | Executes the specific procedural sequence 'step-03-config' within the workflow. |
| 1.3.2.2.3.5 | `step-04-agents.md` | Markdown File | Executes the specific procedural sequence 'step-04-agents' within the workflow. |
| 1.3.2.2.3.6 | `step-05-workflows.md` | Markdown File | Executes the specific procedural sequence 'step-05-workflows' within the workflow. |
| 1.3.2.2.3.7 | `step-06-docs.md` | Markdown File | Executes the specific procedural sequence 'step-06-docs' within the workflow. |
| 1.3.2.2.3.8 | `step-07-complete.md` | Markdown File | Executes the specific procedural sequence 'step-07-complete' within the workflow. |


---

## Table W (Level 6 - `_bmad/bmb/workflows/module/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.2.4.1 | `step-01-load-target.md` | Markdown File | Executes the specific procedural sequence 'step-01-load-target' within the workflow. |
| 1.3.2.2.4.2 | `step-02-select-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-select-edit' within the workflow. |
| 1.3.2.2.4.3 | `step-03-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-03-apply-edit' within the workflow. |
| 1.3.2.2.4.4 | `step-04-review.md` | Markdown File | Executes the specific procedural sequence 'step-04-review' within the workflow. |
| 1.3.2.2.4.5 | `step-05-confirm.md` | Markdown File | Executes the specific procedural sequence 'step-05-confirm' within the workflow. |


---

## Table X (Level 6 - `_bmad/bmb/workflows/module/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.2.5.1 | `step-01-load-target.md` | Markdown File | Executes the specific procedural sequence 'step-01-load-target' within the workflow. |
| 1.3.2.2.5.2 | `step-02-file-structure.md` | Markdown File | Executes the specific procedural sequence 'step-02-file-structure' within the workflow. |
| 1.3.2.2.5.3 | `step-03-module-yaml.md` | Markdown File | Executes the specific procedural sequence 'step-03-module-yaml' within the workflow. |
| 1.3.2.2.5.4 | `step-04-agent-specs.md` | Markdown File | Executes the specific procedural sequence 'step-04-agent-specs' within the workflow. |
| 1.3.2.2.5.5 | `step-05-workflow-specs.md` | Markdown File | Executes the specific procedural sequence 'step-05-workflow-specs' within the workflow. |
| 1.3.2.2.5.6 | `step-06-documentation.md` | Markdown File | Executes the specific procedural sequence 'step-06-documentation' within the workflow. |
| 1.3.2.2.5.7 | `step-07-installation.md` | Markdown File | Executes the specific procedural sequence 'step-07-installation' within the workflow. |
| 1.3.2.2.5.8 | `step-08-report.md` | Markdown File | Executes the specific procedural sequence 'step-08-report' within the workflow. |


---

## Table Y (Level 6 - `_bmad/bmb/workflows/module/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.2.6.1 | `brief-template.md` | Markdown File | Provides the structural skeleton for generating 'brief' outputs. |
| 1.3.2.2.6.2 | `workflow-spec-template.md` | Markdown File | Provides the structural skeleton for generating 'workflow-spec' outputs. |


---

## Table Z1 (Level 5 - `_bmad/bmb/workflows/workflow/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.3.1 | `data` | Folder | Provides contextual reference datasets and schemas required by workflow workflows. |
| 1.3.2.3.2 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate workflow workflow logic. |
| 1.3.2.3.3 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate workflow workflow logic. |
| 1.3.2.3.4 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate workflow workflow logic. |
| 1.3.2.3.5 | `templates` | Folder | Stores reusable output generation formats for workflow artifacts. |
| 1.3.2.3.6 | `workflow-create-workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-create-workflow.md' objective. |
| 1.3.2.3.7 | `workflow-edit-workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-edit-workflow.md' objective. |
| 1.3.2.3.8 | `workflow-rework-workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-rework-workflow.md' objective. |
| 1.3.2.3.9 | `workflow-validate-max-parallel-workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-validate-max-parallel-workflow.md' objective. |
| 1.3.2.3.10 | `workflow-validate-workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-validate-workflow.md' objective. |


---

## Table Z2 (Level 6 - `_bmad/bmb/workflows/workflow/data/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.3.1.1 | `common-workflow-tools.csv` | CSV File | Defines a structured matrix mapping parameters for common-workflow-tools. |
| 1.3.2.3.1.2 | `architecture.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'architecture'. |
| 1.3.2.3.1.3 | `csv-data-file-standards.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'csv-data-file-standards'. |
| 1.3.2.3.1.4 | `frontmatter-standards.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'frontmatter-standards'. |
| 1.3.2.3.1.5 | `input-discovery-standards.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'input-discovery-standards'. |

<br>*Note: We showed 4 example MD files above. We smartly skipped the following 10 similar non-step files to keep the table concise:* `intent-vs-prescriptive-spectrum.md, menu-handling-standards.md, output-format-standards.md, step-file-rules.md, step-type-patterns.md, subprocess-optimization-patterns.md, trimodal-workflow-structure.md, workflow-chaining-standards.md, workflow-examples.md, workflow-type-criteria.md`

---

## Table Z3 (Level 6 - `_bmad/bmb/workflows/workflow/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.3.2.1 | `step-00-conversion.md` | Markdown File | Executes the specific procedural sequence 'step-00-conversion' within the workflow. |
| 1.3.2.3.2.2 | `step-01-discovery.md` | Markdown File | Executes the specific procedural sequence 'step-01-discovery' within the workflow. |
| 1.3.2.3.2.3 | `step-01b-continuation.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continuation' within the workflow. |
| 1.3.2.3.2.4 | `step-02-classification.md` | Markdown File | Executes the specific procedural sequence 'step-02-classification' within the workflow. |
| 1.3.2.3.2.5 | `step-03-requirements.md` | Markdown File | Executes the specific procedural sequence 'step-03-requirements' within the workflow. |
| 1.3.2.3.2.6 | `step-04-tools.md` | Markdown File | Executes the specific procedural sequence 'step-04-tools' within the workflow. |
| 1.3.2.3.2.7 | `step-05-plan-review.md` | Markdown File | Executes the specific procedural sequence 'step-05-plan-review' within the workflow. |
| 1.3.2.3.2.8 | `step-06-design.md` | Markdown File | Executes the specific procedural sequence 'step-06-design' within the workflow. |
| 1.3.2.3.2.9 | `step-07-foundation.md` | Markdown File | Executes the specific procedural sequence 'step-07-foundation' within the workflow. |
| 1.3.2.3.2.10 | `step-08-build-step-01.md` | Markdown File | Executes the specific procedural sequence 'step-08-build-step-01' within the workflow. |
| 1.3.2.3.2.11 | `step-09-build-next-step.md` | Markdown File | Executes the specific procedural sequence 'step-09-build-next-step' within the workflow. |
| 1.3.2.3.2.12 | `step-10-confirmation.md` | Markdown File | Executes the specific procedural sequence 'step-10-confirmation' within the workflow. |
| 1.3.2.3.2.13 | `step-11-completion.md` | Markdown File | Executes the specific procedural sequence 'step-11-completion' within the workflow. |


---

## Table Z4 (Level 6 - `_bmad/bmb/workflows/workflow/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.3.3.1 | `step-e-01-assess-workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'step-e-01-assess-workflow.md' objective. |
| 1.3.2.3.3.2 | `step-e-02-discover-edits.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-02-discover-edits'. |
| 1.3.2.3.3.3 | `step-e-03-fix-validation.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-03-fix-validation'. |
| 1.3.2.3.3.4 | `step-e-04-direct-edit.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-04-direct-edit'. |
| 1.3.2.3.3.5 | `step-e-05-apply-edit.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-05-apply-edit'. |
| 1.3.2.3.3.6 | `step-e-06-validate-after.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-06-validate-after'. |
| 1.3.2.3.3.7 | `step-e-07-complete.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-07-complete'. |


---

## Table Z5 (Level 6 - `_bmad/bmb/workflows/workflow/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.3.4.1 | `step-01-validate-max-mode.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate-max-mode' within the workflow. |
| 1.3.2.3.4.2 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |
| 1.3.2.3.4.3 | `step-01b-structure.md` | Markdown File | Executes the specific procedural sequence 'step-01b-structure' within the workflow. |
| 1.3.2.3.4.4 | `step-02-frontmatter-validation.md` | Markdown File | Executes the specific procedural sequence 'step-02-frontmatter-validation' within the workflow. |
| 1.3.2.3.4.5 | `step-02b-path-violations.md` | Markdown File | Executes the specific procedural sequence 'step-02b-path-violations' within the workflow. |
| 1.3.2.3.4.6 | `step-03-menu-validation.md` | Markdown File | Executes the specific procedural sequence 'step-03-menu-validation' within the workflow. |
| 1.3.2.3.4.7 | `step-04-step-type-validation.md` | Markdown File | Executes the specific procedural sequence 'step-04-step-type-validation' within the workflow. |
| 1.3.2.3.4.8 | `step-05-output-format-validation.md` | Markdown File | Executes the specific procedural sequence 'step-05-output-format-validation' within the workflow. |
| 1.3.2.3.4.9 | `step-06-validation-design-check.md` | Markdown File | Executes the specific procedural sequence 'step-06-validation-design-check' within the workflow. |
| 1.3.2.3.4.10 | `step-07-instruction-style-check.md` | Markdown File | Executes the specific procedural sequence 'step-07-instruction-style-check' within the workflow. |
| 1.3.2.3.4.11 | `step-08-collaborative-experience-check.md` | Markdown File | Executes the specific procedural sequence 'step-08-collaborative-experience-check' within the workflow. |
| 1.3.2.3.4.12 | `step-08b-subprocess-optimization.md` | Markdown File | Executes the specific procedural sequence 'step-08b-subprocess-optimization' within the workflow. |
| 1.3.2.3.4.13 | `step-09-cohesive-review.md` | Markdown File | Executes the specific procedural sequence 'step-09-cohesive-review' within the workflow. |
| 1.3.2.3.4.14 | `step-10-report-complete.md` | Markdown File | Executes the specific procedural sequence 'step-10-report-complete' within the workflow. |
| 1.3.2.3.4.15 | `step-11-plan-validation.md` | Markdown File | Executes the specific procedural sequence 'step-11-plan-validation' within the workflow. |


---

## Table Z6 (Level 6 - `_bmad/bmb/workflows/workflow/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.3.2.3.5.1 | `minimal-output-template.md` | Markdown File | Provides the structural skeleton for generating 'minimal-output' outputs. |
| 1.3.2.3.5.2 | `step-01-init-continuable-template.md` | Markdown File | Executes the specific procedural sequence 'step-01-init-continuable-template' within the workflow. |
| 1.3.2.3.5.3 | `step-1b-template.md` | Markdown File | Executes the specific procedural sequence 'step-1b-template' within the workflow. |
| 1.3.2.3.5.4 | `step-template.md` | Markdown File | Provides the structural skeleton for generating 'step' outputs. |
| 1.3.2.3.5.5 | `workflow-template.md` | Markdown File | Provides the structural skeleton for generating 'workflow' outputs. |


---

## Table Z7 (Level 3 - `_bmad/bmm/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.1 | `agents` | Folder | Stores AI persona definitions and prompt overrides for bmm agents. |
| 1.4.2 | `data` | Folder | Provides contextual reference datasets and schemas required by bmm workflows. |
| 1.4.3 | `teams` | Folder | Defines multi-agent party topologies and role allocations for bmm. |
| 1.4.4 | `workflows` | Folder | Categorizes structured execution pathways for bmm processes. |
| 1.4.5 | `module-help.csv` | CSV File | Provides command mappings for user assistance regarding module-help. |
| 1.4.6 | `config.yaml` | YAML File | Initializes baseline settings and module behaviors for bmm. |


---

## Table Z8 (Level 4 - `_bmad/bmm/agents/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.1.1 | `tech-writer` | Folder | Groups related modular substructures required by tech-writer. |
| 1.4.1.2 | `analyst.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'analyst'. |
| 1.4.1.3 | `architect.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'architect'. |
| 1.4.1.4 | `dev.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'dev'. |
| 1.4.1.5 | `pm.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'pm'. |
| 1.4.1.6 | `qa.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'qa'. |
| 1.4.1.7 | `quick-flow-solo-dev.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'quick-flow-solo-dev'. |
| 1.4.1.8 | `sm.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'sm'. |
| 1.4.1.9 | `ux-designer.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'ux-designer'. |


---

## Table Z9 (Level 5 - `_bmad/bmm/agents/tech-writer/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.1.1.1 | `tech-writer.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'tech-writer'. |


---

## Table Z10 (Level 4 - `_bmad/bmm/data/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.2.1 | `project-context-template.md` | Markdown File | Provides the structural skeleton for generating 'project-context' outputs. |


---

## Table Z11 (Level 4 - `_bmad/bmm/teams/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.3.1 | `default-party.csv` | CSV File | Defines a structured matrix mapping parameters for default-party. |
| 1.4.3.2 | `team-fullstack.yaml` | YAML File | Defines deployment overrides for the team-fullstack environment. |


---

## Table Z12 (Level 4 - `_bmad/bmm/workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.1 | `1-analysis` | Folder | Groups related modular substructures required by 1-analysis. |
| 1.4.4.2 | `2-plan-workflows` | Folder | Groups related modular substructures required by 2-plan-workflows. |
| 1.4.4.3 | `3-solutioning` | Folder | Groups related modular substructures required by 3-solutioning. |
| 1.4.4.4 | `4-implementation` | Folder | Groups related modular substructures required by 4-implementation. |
| 1.4.4.5 | `bmad-quick-flow` | Folder | Groups related modular substructures required by bmad-quick-flow. |
| 1.4.4.6 | `document-project` | Folder | Groups related modular substructures required by document-project. |
| 1.4.4.7 | `generate-project-context` | Folder | Groups related modular substructures required by generate-project-context. |
| 1.4.4.8 | `qa-generate-e2e-tests` | Folder | Groups related modular substructures required by qa-generate-e2e-tests. |


---

## Table Z13 (Level 5 - `_bmad/bmm/workflows/1-analysis/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.1.1 | `create-product-brief` | Folder | Groups related modular substructures required by create-product-brief. |
| 1.4.4.1.2 | `research` | Folder | Groups related modular substructures required by research. |


---

## Table Z14 (Level 6 - `_bmad/bmm/workflows/1-analysis/create-product-brief/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.1.1.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.4.4.1.1.2 | `product-brief.template.md` | Markdown File | Provides the structural skeleton for generating 'product-brief' outputs. |
| 1.4.4.1.1.3 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z15 (Level 7 - `_bmad/bmm/workflows/1-analysis/create-product-brief/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.1.1.1.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.4.4.1.1.1.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.4.4.1.1.1.3 | `step-02-vision.md` | Markdown File | Executes the specific procedural sequence 'step-02-vision' within the workflow. |
| 1.4.4.1.1.1.4 | `step-03-users.md` | Markdown File | Executes the specific procedural sequence 'step-03-users' within the workflow. |
| 1.4.4.1.1.1.5 | `step-04-metrics.md` | Markdown File | Executes the specific procedural sequence 'step-04-metrics' within the workflow. |
| 1.4.4.1.1.1.6 | `step-05-scope.md` | Markdown File | Executes the specific procedural sequence 'step-05-scope' within the workflow. |
| 1.4.4.1.1.1.7 | `step-06-complete.md` | Markdown File | Executes the specific procedural sequence 'step-06-complete' within the workflow. |


---

## Table Z16 (Level 6 - `_bmad/bmm/workflows/1-analysis/research/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.1.2.1 | `domain-steps` | Folder | Groups related modular substructures required by domain-steps. |
| 1.4.4.1.2.2 | `market-steps` | Folder | Groups related modular substructures required by market-steps. |
| 1.4.4.1.2.3 | `technical-steps` | Folder | Groups related modular substructures required by technical-steps. |
| 1.4.4.1.2.4 | `research.template.md` | Markdown File | Provides the structural skeleton for generating 'research' outputs. |
| 1.4.4.1.2.5 | `workflow-domain-research.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-domain-research.md' objective. |
| 1.4.4.1.2.6 | `workflow-market-research.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-market-research.md' objective. |
| 1.4.4.1.2.7 | `workflow-technical-research.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-technical-research.md' objective. |


---

## Table Z17 (Level 7 - `_bmad/bmm/workflows/1-analysis/research/domain-steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.1.2.1.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.4.4.1.2.1.2 | `step-02-domain-analysis.md` | Markdown File | Executes the specific procedural sequence 'step-02-domain-analysis' within the workflow. |
| 1.4.4.1.2.1.3 | `step-03-competitive-landscape.md` | Markdown File | Executes the specific procedural sequence 'step-03-competitive-landscape' within the workflow. |
| 1.4.4.1.2.1.4 | `step-04-regulatory-focus.md` | Markdown File | Executes the specific procedural sequence 'step-04-regulatory-focus' within the workflow. |
| 1.4.4.1.2.1.5 | `step-05-technical-trends.md` | Markdown File | Executes the specific procedural sequence 'step-05-technical-trends' within the workflow. |
| 1.4.4.1.2.1.6 | `step-06-research-synthesis.md` | Markdown File | Executes the specific procedural sequence 'step-06-research-synthesis' within the workflow. |


---

## Table Z18 (Level 7 - `_bmad/bmm/workflows/1-analysis/research/market-steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.1.2.2.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.4.4.1.2.2.2 | `step-02-customer-behavior.md` | Markdown File | Executes the specific procedural sequence 'step-02-customer-behavior' within the workflow. |
| 1.4.4.1.2.2.3 | `step-03-customer-pain-points.md` | Markdown File | Executes the specific procedural sequence 'step-03-customer-pain-points' within the workflow. |
| 1.4.4.1.2.2.4 | `step-04-customer-decisions.md` | Markdown File | Executes the specific procedural sequence 'step-04-customer-decisions' within the workflow. |
| 1.4.4.1.2.2.5 | `step-05-competitive-analysis.md` | Markdown File | Executes the specific procedural sequence 'step-05-competitive-analysis' within the workflow. |
| 1.4.4.1.2.2.6 | `step-06-research-completion.md` | Markdown File | Executes the specific procedural sequence 'step-06-research-completion' within the workflow. |


---

## Table Z19 (Level 7 - `_bmad/bmm/workflows/1-analysis/research/technical-steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.1.2.3.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.4.4.1.2.3.2 | `step-02-technical-overview.md` | Markdown File | Executes the specific procedural sequence 'step-02-technical-overview' within the workflow. |
| 1.4.4.1.2.3.3 | `step-03-integration-patterns.md` | Markdown File | Executes the specific procedural sequence 'step-03-integration-patterns' within the workflow. |
| 1.4.4.1.2.3.4 | `step-04-architectural-patterns.md` | Markdown File | Executes the specific procedural sequence 'step-04-architectural-patterns' within the workflow. |
| 1.4.4.1.2.3.5 | `step-05-implementation-research.md` | Markdown File | Executes the specific procedural sequence 'step-05-implementation-research' within the workflow. |
| 1.4.4.1.2.3.6 | `step-06-research-synthesis.md` | Markdown File | Executes the specific procedural sequence 'step-06-research-synthesis' within the workflow. |


---

## Table Z20 (Level 5 - `_bmad/bmm/workflows/2-plan-workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.1 | `create-prd` | Folder | Groups related modular substructures required by create-prd. |
| 1.4.4.2.2 | `create-ux-design` | Folder | Groups related modular substructures required by create-ux-design. |


---

## Table Z21 (Level 6 - `_bmad/bmm/workflows/2-plan-workflows/create-prd/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.1.1 | `data` | Folder | Provides contextual reference datasets and schemas required by create-prd workflows. |
| 1.4.4.2.1.2 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate create-prd workflow logic. |
| 1.4.4.2.1.3 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate create-prd workflow logic. |
| 1.4.4.2.1.4 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate create-prd workflow logic. |
| 1.4.4.2.1.5 | `templates` | Folder | Stores reusable output generation formats for create-prd artifacts. |
| 1.4.4.2.1.6 | `workflow-create-prd.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-create-prd.md' objective. |
| 1.4.4.2.1.7 | `workflow-edit-prd.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-edit-prd.md' objective. |
| 1.4.4.2.1.8 | `workflow-validate-prd.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-validate-prd.md' objective. |


---

## Table Z22 (Level 7 - `_bmad/bmm/workflows/2-plan-workflows/create-prd/data/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.1.1.1 | `domain-complexity.csv` | CSV File | Defines a structured matrix mapping parameters for domain-complexity. |
| 1.4.4.2.1.1.2 | `project-types.csv` | CSV File | Defines a structured matrix mapping parameters for project-types. |
| 1.4.4.2.1.1.3 | `prd-purpose.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'prd-purpose'. |


---

## Table Z23 (Level 7 - `_bmad/bmm/workflows/2-plan-workflows/create-prd/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.1.2.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.4.4.2.1.2.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.4.4.2.1.2.3 | `step-02-discovery.md` | Markdown File | Executes the specific procedural sequence 'step-02-discovery' within the workflow. |
| 1.4.4.2.1.2.4 | `step-02b-vision.md` | Markdown File | Executes the specific procedural sequence 'step-02b-vision' within the workflow. |
| 1.4.4.2.1.2.5 | `step-02c-executive-summary.md` | Markdown File | Executes the specific procedural sequence 'step-02c-executive-summary' within the workflow. |
| 1.4.4.2.1.2.6 | `step-03-success.md` | Markdown File | Executes the specific procedural sequence 'step-03-success' within the workflow. |
| 1.4.4.2.1.2.7 | `step-04-journeys.md` | Markdown File | Executes the specific procedural sequence 'step-04-journeys' within the workflow. |
| 1.4.4.2.1.2.8 | `step-05-domain.md` | Markdown File | Executes the specific procedural sequence 'step-05-domain' within the workflow. |
| 1.4.4.2.1.2.9 | `step-06-innovation.md` | Markdown File | Executes the specific procedural sequence 'step-06-innovation' within the workflow. |
| 1.4.4.2.1.2.10 | `step-07-project-type.md` | Markdown File | Executes the specific procedural sequence 'step-07-project-type' within the workflow. |
| 1.4.4.2.1.2.11 | `step-08-scoping.md` | Markdown File | Executes the specific procedural sequence 'step-08-scoping' within the workflow. |
| 1.4.4.2.1.2.12 | `step-09-functional.md` | Markdown File | Executes the specific procedural sequence 'step-09-functional' within the workflow. |
| 1.4.4.2.1.2.13 | `step-10-nonfunctional.md` | Markdown File | Executes the specific procedural sequence 'step-10-nonfunctional' within the workflow. |
| 1.4.4.2.1.2.14 | `step-11-polish.md` | Markdown File | Executes the specific procedural sequence 'step-11-polish' within the workflow. |
| 1.4.4.2.1.2.15 | `step-12-complete.md` | Markdown File | Executes the specific procedural sequence 'step-12-complete' within the workflow. |


---

## Table Z24 (Level 7 - `_bmad/bmm/workflows/2-plan-workflows/create-prd/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.1.3.1 | `step-e-01-discovery.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-01-discovery'. |
| 1.4.4.2.1.3.2 | `step-e-01b-legacy-conversion.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-01b-legacy-conversion'. |
| 1.4.4.2.1.3.3 | `step-e-02-review.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-02-review'. |
| 1.4.4.2.1.3.4 | `step-e-03-edit.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-03-edit'. |
| 1.4.4.2.1.3.5 | `step-e-04-complete.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-04-complete'. |


---

## Table Z25 (Level 7 - `_bmad/bmm/workflows/2-plan-workflows/create-prd/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.1.4.1 | `step-v-01-discovery.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-v-01-discovery'. |
| 1.4.4.2.1.4.2 | `step-v-02-format-detection.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-v-02-format-detection'. |
| 1.4.4.2.1.4.3 | `step-v-02b-parity-check.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-v-02b-parity-check'. |
| 1.4.4.2.1.4.4 | `step-v-03-density-validation.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-v-03-density-validation'. |

<br>*Note: We showed 4 example MD files above. We smartly skipped the following 10 similar non-step files to keep the table concise:* `step-v-04-brief-coverage-validation.md, step-v-05-measurability-validation.md, step-v-06-traceability-validation.md, step-v-07-implementation-leakage-validation.md, step-v-08-domain-compliance-validation.md, step-v-09-project-type-validation.md, step-v-10-smart-validation.md, step-v-11-holistic-quality-validation.md, step-v-12-completeness-validation.md, step-v-13-report-complete.md`

---

## Table Z26 (Level 7 - `_bmad/bmm/workflows/2-plan-workflows/create-prd/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.1.5.1 | `prd-template.md` | Markdown File | Provides the structural skeleton for generating 'prd' outputs. |


---

## Table Z27 (Level 6 - `_bmad/bmm/workflows/2-plan-workflows/create-ux-design/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.2.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.4.4.2.2.2 | `ux-design-template.md` | Markdown File | Provides the structural skeleton for generating 'ux-design' outputs. |
| 1.4.4.2.2.3 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z28 (Level 7 - `_bmad/bmm/workflows/2-plan-workflows/create-ux-design/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.2.2.1.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.4.4.2.2.1.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.4.4.2.2.1.3 | `step-02-discovery.md` | Markdown File | Executes the specific procedural sequence 'step-02-discovery' within the workflow. |
| 1.4.4.2.2.1.4 | `step-03-core-experience.md` | Markdown File | Executes the specific procedural sequence 'step-03-core-experience' within the workflow. |
| 1.4.4.2.2.1.5 | `step-04-emotional-response.md` | Markdown File | Executes the specific procedural sequence 'step-04-emotional-response' within the workflow. |
| 1.4.4.2.2.1.6 | `step-05-inspiration.md` | Markdown File | Executes the specific procedural sequence 'step-05-inspiration' within the workflow. |
| 1.4.4.2.2.1.7 | `step-06-design-system.md` | Markdown File | Executes the specific procedural sequence 'step-06-design-system' within the workflow. |
| 1.4.4.2.2.1.8 | `step-07-defining-experience.md` | Markdown File | Executes the specific procedural sequence 'step-07-defining-experience' within the workflow. |
| 1.4.4.2.2.1.9 | `step-08-visual-foundation.md` | Markdown File | Executes the specific procedural sequence 'step-08-visual-foundation' within the workflow. |
| 1.4.4.2.2.1.10 | `step-09-design-directions.md` | Markdown File | Executes the specific procedural sequence 'step-09-design-directions' within the workflow. |
| 1.4.4.2.2.1.11 | `step-10-user-journeys.md` | Markdown File | Executes the specific procedural sequence 'step-10-user-journeys' within the workflow. |
| 1.4.4.2.2.1.12 | `step-11-component-strategy.md` | Markdown File | Executes the specific procedural sequence 'step-11-component-strategy' within the workflow. |
| 1.4.4.2.2.1.13 | `step-12-ux-patterns.md` | Markdown File | Executes the specific procedural sequence 'step-12-ux-patterns' within the workflow. |
| 1.4.4.2.2.1.14 | `step-13-responsive-accessibility.md` | Markdown File | Executes the specific procedural sequence 'step-13-responsive-accessibility' within the workflow. |
| 1.4.4.2.2.1.15 | `step-14-complete.md` | Markdown File | Executes the specific procedural sequence 'step-14-complete' within the workflow. |


---

## Table Z29 (Level 5 - `_bmad/bmm/workflows/3-solutioning/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.1 | `check-implementation-readiness` | Folder | Groups related modular substructures required by check-implementation-readiness. |
| 1.4.4.3.2 | `create-architecture` | Folder | Groups related modular substructures required by create-architecture. |
| 1.4.4.3.3 | `create-epics-and-stories` | Folder | Groups related modular substructures required by create-epics-and-stories. |


---

## Table Z30 (Level 6 - `_bmad/bmm/workflows/3-solutioning/check-implementation-readiness/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.1.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.4.4.3.1.2 | `templates` | Folder | Stores reusable output generation formats for check-implementation-readiness artifacts. |
| 1.4.4.3.1.3 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z31 (Level 7 - `_bmad/bmm/workflows/3-solutioning/check-implementation-readiness/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.1.1.1 | `step-01-document-discovery.md` | Markdown File | Executes the specific procedural sequence 'step-01-document-discovery' within the workflow. |
| 1.4.4.3.1.1.2 | `step-02-prd-analysis.md` | Markdown File | Executes the specific procedural sequence 'step-02-prd-analysis' within the workflow. |
| 1.4.4.3.1.1.3 | `step-03-epic-coverage-validation.md` | Markdown File | Executes the specific procedural sequence 'step-03-epic-coverage-validation' within the workflow. |
| 1.4.4.3.1.1.4 | `step-04-ux-alignment.md` | Markdown File | Executes the specific procedural sequence 'step-04-ux-alignment' within the workflow. |
| 1.4.4.3.1.1.5 | `step-05-epic-quality-review.md` | Markdown File | Executes the specific procedural sequence 'step-05-epic-quality-review' within the workflow. |
| 1.4.4.3.1.1.6 | `step-06-final-assessment.md` | Markdown File | Executes the specific procedural sequence 'step-06-final-assessment' within the workflow. |


---

## Table Z32 (Level 7 - `_bmad/bmm/workflows/3-solutioning/check-implementation-readiness/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.1.2.1 | `readiness-report-template.md` | Markdown File | Provides the structural skeleton for generating 'readiness-report' outputs. |


---

## Table Z33 (Level 6 - `_bmad/bmm/workflows/3-solutioning/create-architecture/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.2.1 | `data` | Folder | Provides contextual reference datasets and schemas required by create-architecture workflows. |
| 1.4.4.3.2.2 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.4.4.3.2.3 | `architecture-decision-template.md` | Markdown File | Provides the structural skeleton for generating 'architecture-decision' outputs. |
| 1.4.4.3.2.4 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z34 (Level 7 - `_bmad/bmm/workflows/3-solutioning/create-architecture/data/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.2.1.1 | `domain-complexity.csv` | CSV File | Defines a structured matrix mapping parameters for domain-complexity. |
| 1.4.4.3.2.1.2 | `project-types.csv` | CSV File | Defines a structured matrix mapping parameters for project-types. |


---

## Table Z35 (Level 7 - `_bmad/bmm/workflows/3-solutioning/create-architecture/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.2.2.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.4.4.3.2.2.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.4.4.3.2.2.3 | `step-02-context.md` | Markdown File | Executes the specific procedural sequence 'step-02-context' within the workflow. |
| 1.4.4.3.2.2.4 | `step-03-starter.md` | Markdown File | Executes the specific procedural sequence 'step-03-starter' within the workflow. |
| 1.4.4.3.2.2.5 | `step-04-decisions.md` | Markdown File | Executes the specific procedural sequence 'step-04-decisions' within the workflow. |
| 1.4.4.3.2.2.6 | `step-05-patterns.md` | Markdown File | Executes the specific procedural sequence 'step-05-patterns' within the workflow. |
| 1.4.4.3.2.2.7 | `step-06-structure.md` | Markdown File | Executes the specific procedural sequence 'step-06-structure' within the workflow. |
| 1.4.4.3.2.2.8 | `step-07-validation.md` | Markdown File | Executes the specific procedural sequence 'step-07-validation' within the workflow. |
| 1.4.4.3.2.2.9 | `step-08-complete.md` | Markdown File | Executes the specific procedural sequence 'step-08-complete' within the workflow. |


---

## Table Z36 (Level 6 - `_bmad/bmm/workflows/3-solutioning/create-epics-and-stories/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.3.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.4.4.3.3.2 | `templates` | Folder | Stores reusable output generation formats for create-epics-and-stories artifacts. |
| 1.4.4.3.3.3 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z37 (Level 7 - `_bmad/bmm/workflows/3-solutioning/create-epics-and-stories/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.3.1.1 | `step-01-validate-prerequisites.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate-prerequisites' within the workflow. |
| 1.4.4.3.3.1.2 | `step-02-design-epics.md` | Markdown File | Executes the specific procedural sequence 'step-02-design-epics' within the workflow. |
| 1.4.4.3.3.1.3 | `step-03-create-stories.md` | Markdown File | Executes the specific procedural sequence 'step-03-create-stories' within the workflow. |
| 1.4.4.3.3.1.4 | `step-04-final-validation.md` | Markdown File | Executes the specific procedural sequence 'step-04-final-validation' within the workflow. |


---

## Table Z38 (Level 7 - `_bmad/bmm/workflows/3-solutioning/create-epics-and-stories/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.3.3.2.1 | `epics-template.md` | Markdown File | Provides the structural skeleton for generating 'epics' outputs. |


---

## Table Z39 (Level 5 - `_bmad/bmm/workflows/4-implementation/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.4.1 | `code-review` | Folder | Groups related modular substructures required by code-review. |
| 1.4.4.4.2 | `correct-course` | Folder | Groups related modular substructures required by correct-course. |
| 1.4.4.4.3 | `create-story` | Folder | Groups related modular substructures required by create-story. |
| 1.4.4.4.4 | `dev-story` | Folder | Groups related modular substructures required by dev-story. |
| 1.4.4.4.5 | `retrospective` | Folder | Groups related modular substructures required by retrospective. |
| 1.4.4.4.6 | `sprint-planning` | Folder | Groups related modular substructures required by sprint-planning. |
| 1.4.4.4.7 | `sprint-status` | Folder | Groups related modular substructures required by sprint-status. |


---

## Table Z40 (Level 6 - `_bmad/bmm/workflows/4-implementation/code-review/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.4.1.1 | `instructions.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for instructions. |
| 1.4.4.4.1.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.4.1.3 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |


---

## Table Z41 (Level 6 - `_bmad/bmm/workflows/4-implementation/correct-course/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.4.2.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.4.2.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.4.4.4.2.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z42 (Level 6 - `_bmad/bmm/workflows/4-implementation/create-story/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.4.3.1 | `instructions.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for instructions. |
| 1.4.4.4.3.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.4.3.3 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.4.4.4.3.4 | `template.md` | Markdown File | Provides the structural skeleton for generating 'template' outputs. |


---

## Table Z43 (Level 6 - `_bmad/bmm/workflows/4-implementation/dev-story/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.4.4.1 | `instructions.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for instructions. |
| 1.4.4.4.4.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.4.4.3 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |


---

## Table Z44 (Level 6 - `_bmad/bmm/workflows/4-implementation/retrospective/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.4.5.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.4.5.2 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z45 (Level 6 - `_bmad/bmm/workflows/4-implementation/sprint-planning/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.4.6.1 | `sprint-status-template.yaml` | YAML File | Defines deployment overrides for the sprint-status-template environment. |
| 1.4.4.4.6.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.4.6.3 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.4.4.4.6.4 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z46 (Level 6 - `_bmad/bmm/workflows/4-implementation/sprint-status/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.4.7.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.4.7.2 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z47 (Level 5 - `_bmad/bmm/workflows/bmad-quick-flow/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.5.1 | `quick-dev` | Folder | Groups related modular substructures required by quick-dev. |
| 1.4.4.5.2 | `quick-spec` | Folder | Groups related modular substructures required by quick-spec. |


---

## Table Z48 (Level 6 - `_bmad/bmm/workflows/bmad-quick-flow/quick-dev/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.5.1.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.4.4.5.1.2 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z49 (Level 7 - `_bmad/bmm/workflows/bmad-quick-flow/quick-dev/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.5.1.1.1 | `step-01-mode-detection.md` | Markdown File | Executes the specific procedural sequence 'step-01-mode-detection' within the workflow. |
| 1.4.4.5.1.1.2 | `step-02-context-gathering.md` | Markdown File | Executes the specific procedural sequence 'step-02-context-gathering' within the workflow. |
| 1.4.4.5.1.1.3 | `step-03-execute.md` | Markdown File | Executes the specific procedural sequence 'step-03-execute' within the workflow. |
| 1.4.4.5.1.1.4 | `step-04-self-check.md` | Markdown File | Executes the specific procedural sequence 'step-04-self-check' within the workflow. |
| 1.4.4.5.1.1.5 | `step-05-adversarial-review.md` | Markdown File | Executes the specific procedural sequence 'step-05-adversarial-review' within the workflow. |
| 1.4.4.5.1.1.6 | `step-06-resolve-findings.md` | Markdown File | Executes the specific procedural sequence 'step-06-resolve-findings' within the workflow. |


---

## Table Z50 (Level 6 - `_bmad/bmm/workflows/bmad-quick-flow/quick-spec/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.5.2.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.4.4.5.2.2 | `tech-spec-template.md` | Markdown File | Provides the structural skeleton for generating 'tech-spec' outputs. |
| 1.4.4.5.2.3 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z51 (Level 7 - `_bmad/bmm/workflows/bmad-quick-flow/quick-spec/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.5.2.1.1 | `step-01-understand.md` | Markdown File | Executes the specific procedural sequence 'step-01-understand' within the workflow. |
| 1.4.4.5.2.1.2 | `step-02-investigate.md` | Markdown File | Executes the specific procedural sequence 'step-02-investigate' within the workflow. |
| 1.4.4.5.2.1.3 | `step-03-generate.md` | Markdown File | Executes the specific procedural sequence 'step-03-generate' within the workflow. |
| 1.4.4.5.2.1.4 | `step-04-review.md` | Markdown File | Executes the specific procedural sequence 'step-04-review' within the workflow. |


---

## Table Z52 (Level 5 - `_bmad/bmm/workflows/document-project/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.6.1 | `templates` | Folder | Stores reusable output generation formats for document-project artifacts. |
| 1.4.4.6.2 | `workflows` | Folder | Categorizes structured execution pathways for document-project processes. |
| 1.4.4.6.3 | `documentation-requirements.csv` | CSV File | Defines a structured matrix mapping parameters for documentation-requirements. |
| 1.4.4.6.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.6.5 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.4.4.6.6 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z53 (Level 6 - `_bmad/bmm/workflows/document-project/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.6.1.1 | `deep-dive-template.md` | Markdown File | Provides the structural skeleton for generating 'deep-dive' outputs. |
| 1.4.4.6.1.2 | `index-template.md` | Markdown File | Provides the structural skeleton for generating 'index' outputs. |
| 1.4.4.6.1.3 | `project-overview-template.md` | Markdown File | Provides the structural skeleton for generating 'project-overview' outputs. |
| 1.4.4.6.1.4 | `source-tree-template.md` | Markdown File | Provides the structural skeleton for generating 'source-tree' outputs. |
| 1.4.4.6.1.5 | `project-scan-report-schema.json` | JSON File | Supports the project-scan-report-schema configuration. |


---

## Table Z54 (Level 6 - `_bmad/bmm/workflows/document-project/workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.6.2.1 | `deep-dive.yaml` | YAML File | Defines deployment overrides for the deep-dive environment. |
| 1.4.4.6.2.2 | `full-scan.yaml` | YAML File | Defines deployment overrides for the full-scan environment. |
| 1.4.4.6.2.3 | `deep-dive-instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'deep-dive-instructions'. |
| 1.4.4.6.2.4 | `full-scan-instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'full-scan-instructions'. |


---

## Table Z55 (Level 5 - `_bmad/bmm/workflows/generate-project-context/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.7.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.4.4.7.2 | `project-context-template.md` | Markdown File | Provides the structural skeleton for generating 'project-context' outputs. |
| 1.4.4.7.3 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z56 (Level 6 - `_bmad/bmm/workflows/generate-project-context/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.7.1.1 | `step-01-discover.md` | Markdown File | Executes the specific procedural sequence 'step-01-discover' within the workflow. |
| 1.4.4.7.1.2 | `step-02-generate.md` | Markdown File | Executes the specific procedural sequence 'step-02-generate' within the workflow. |
| 1.4.4.7.1.3 | `step-03-complete.md` | Markdown File | Executes the specific procedural sequence 'step-03-complete' within the workflow. |


---

## Table Z57 (Level 5 - `_bmad/bmm/workflows/qa-generate-e2e-tests/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.4.4.8.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.4.4.8.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.4.4.8.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z58 (Level 3 - `_bmad/cis/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.1 | `agents` | Folder | Stores AI persona definitions and prompt overrides for cis agents. |
| 1.5.2 | `teams` | Folder | Defines multi-agent party topologies and role allocations for cis. |
| 1.5.3 | `workflows` | Folder | Categorizes structured execution pathways for cis processes. |
| 1.5.4 | `module-help.csv` | CSV File | Provides command mappings for user assistance regarding module-help. |
| 1.5.5 | `config.yaml` | YAML File | Initializes baseline settings and module behaviors for cis. |


---

## Table Z59 (Level 4 - `_bmad/cis/agents/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.1.1 | `storyteller` | Folder | Groups related modular substructures required by storyteller. |
| 1.5.1.2 | `brainstorming-coach.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'brainstorming-coach'. |
| 1.5.1.3 | `creative-problem-solver.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'creative-problem-solver'. |
| 1.5.1.4 | `design-thinking-coach.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'design-thinking-coach'. |
| 1.5.1.5 | `innovation-strategist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'innovation-strategist'. |
| 1.5.1.6 | `presentation-master.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'presentation-master'. |


---

## Table Z60 (Level 5 - `_bmad/cis/agents/storyteller/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.1.1.1 | `storyteller.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'storyteller'. |


---

## Table Z61 (Level 4 - `_bmad/cis/teams/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.2.1 | `default-party.csv` | CSV File | Defines a structured matrix mapping parameters for default-party. |
| 1.5.2.2 | `creative-squad.yaml` | YAML File | Defines deployment overrides for the creative-squad environment. |


---

## Table Z62 (Level 4 - `_bmad/cis/workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.3.1 | `design-thinking` | Folder | Groups related modular substructures required by design-thinking. |
| 1.5.3.2 | `innovation-strategy` | Folder | Groups related modular substructures required by innovation-strategy. |
| 1.5.3.3 | `problem-solving` | Folder | Groups related modular substructures required by problem-solving. |
| 1.5.3.4 | `storytelling` | Folder | Groups related modular substructures required by storytelling. |
| 1.5.3.5 | `README.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'README'. |


---

## Table Z63 (Level 5 - `_bmad/cis/workflows/design-thinking/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.3.1.1 | `design-methods.csv` | CSV File | Defines a structured matrix mapping parameters for design-methods. |
| 1.5.3.1.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.5.3.1.3 | `README.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'README'. |
| 1.5.3.1.4 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.5.3.1.5 | `template.md` | Markdown File | Provides the structural skeleton for generating 'template' outputs. |


---

## Table Z64 (Level 5 - `_bmad/cis/workflows/innovation-strategy/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.3.2.1 | `innovation-frameworks.csv` | CSV File | Defines a structured matrix mapping parameters for innovation-frameworks. |
| 1.5.3.2.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.5.3.2.3 | `README.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'README'. |
| 1.5.3.2.4 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.5.3.2.5 | `template.md` | Markdown File | Provides the structural skeleton for generating 'template' outputs. |


---

## Table Z65 (Level 5 - `_bmad/cis/workflows/problem-solving/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.3.3.1 | `solving-methods.csv` | CSV File | Defines a structured matrix mapping parameters for solving-methods. |
| 1.5.3.3.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.5.3.3.3 | `README.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'README'. |
| 1.5.3.3.4 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.5.3.3.5 | `template.md` | Markdown File | Provides the structural skeleton for generating 'template' outputs. |


---

## Table Z66 (Level 5 - `_bmad/cis/workflows/storytelling/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.5.3.4.1 | `story-types.csv` | CSV File | Defines a structured matrix mapping parameters for story-types. |
| 1.5.3.4.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.5.3.4.3 | `README.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'README'. |
| 1.5.3.4.4 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.5.3.4.5 | `template.md` | Markdown File | Provides the structural skeleton for generating 'template' outputs. |


---

## Table Z67 (Level 3 - `_bmad/core/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.1 | `agents` | Folder | Stores AI persona definitions and prompt overrides for core agents. |
| 1.6.2 | `tasks` | Folder | Groups related modular substructures required by tasks. |
| 1.6.3 | `workflows` | Folder | Categorizes structured execution pathways for core processes. |
| 1.6.4 | `module-help.csv` | CSV File | Provides command mappings for user assistance regarding module-help. |
| 1.6.5 | `config.yaml` | YAML File | Initializes baseline settings and module behaviors for core. |


---

## Table Z68 (Level 4 - `_bmad/core/agents/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.1.1 | `bmad-master.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'bmad-master'. |


---

## Table Z69 (Level 4 - `_bmad/core/tasks/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.2.1 | `editorial-review-prose.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for editorial-review-prose. |
| 1.6.2.2 | `editorial-review-structure.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for editorial-review-structure. |
| 1.6.2.3 | `index-docs.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for index-docs. |
| 1.6.2.4 | `review-adversarial-general.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for review-adversarial-general. |
| 1.6.2.5 | `review-edge-case-hunter.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for review-edge-case-hunter. |
| 1.6.2.6 | `shard-doc.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for shard-doc. |
| 1.6.2.7 | `workflow.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for workflow. |
| 1.6.2.8 | `help.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'help'. |


---

## Table Z70 (Level 4 - `_bmad/core/workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.3.1 | `advanced-elicitation` | Folder | Groups related modular substructures required by advanced-elicitation. |
| 1.6.3.2 | `brainstorming` | Folder | Groups related modular substructures required by brainstorming. |
| 1.6.3.3 | `party-mode` | Folder | Groups related modular substructures required by party-mode. |


---

## Table Z71 (Level 5 - `_bmad/core/workflows/advanced-elicitation/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.3.1.1 | `workflow.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for workflow. |
| 1.6.3.1.2 | `methods.csv` | CSV File | Defines a structured matrix mapping parameters for methods. |


---

## Table Z72 (Level 5 - `_bmad/core/workflows/brainstorming/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.3.2.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.6.3.2.2 | `brain-methods.csv` | CSV File | Defines a structured matrix mapping parameters for brain-methods. |
| 1.6.3.2.3 | `template.md` | Markdown File | Provides the structural skeleton for generating 'template' outputs. |
| 1.6.3.2.4 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z73 (Level 6 - `_bmad/core/workflows/brainstorming/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.3.2.1.1 | `step-01-session-setup.md` | Markdown File | Executes the specific procedural sequence 'step-01-session-setup' within the workflow. |
| 1.6.3.2.1.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.6.3.2.1.3 | `step-02a-user-selected.md` | Markdown File | Executes the specific procedural sequence 'step-02a-user-selected' within the workflow. |
| 1.6.3.2.1.4 | `step-02b-ai-recommended.md` | Markdown File | Executes the specific procedural sequence 'step-02b-ai-recommended' within the workflow. |
| 1.6.3.2.1.5 | `step-02c-random-selection.md` | Markdown File | Executes the specific procedural sequence 'step-02c-random-selection' within the workflow. |
| 1.6.3.2.1.6 | `step-02d-progressive-flow.md` | Markdown File | Executes the specific procedural sequence 'step-02d-progressive-flow' within the workflow. |
| 1.6.3.2.1.7 | `step-03-technique-execution.md` | Markdown File | Executes the specific procedural sequence 'step-03-technique-execution' within the workflow. |
| 1.6.3.2.1.8 | `step-04-idea-organization.md` | Markdown File | Executes the specific procedural sequence 'step-04-idea-organization' within the workflow. |


---

## Table Z74 (Level 5 - `_bmad/core/workflows/party-mode/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.3.3.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.6.3.3.2 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z75 (Level 6 - `_bmad/core/workflows/party-mode/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.6.3.3.1.1 | `step-01-agent-loading.md` | Markdown File | Executes the specific procedural sequence 'step-01-agent-loading' within the workflow. |
| 1.6.3.3.1.2 | `step-02-discussion-orchestration.md` | Markdown File | Executes the specific procedural sequence 'step-02-discussion-orchestration' within the workflow. |
| 1.6.3.3.1.3 | `step-03-graceful-exit.md` | Markdown File | Executes the specific procedural sequence 'step-03-graceful-exit' within the workflow. |


---

## Table Z76 (Level 3 - `_bmad/gds/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.1 | `agents` | Folder | Stores AI persona definitions and prompt overrides for gds agents. |
| 1.7.2 | `gametest` | Folder | Houses specialized QA evaluation logic and automated test frameworks for gds. |
| 1.7.3 | `teams` | Folder | Defines multi-agent party topologies and role allocations for gds. |
| 1.7.4 | `workflows` | Folder | Categorizes structured execution pathways for gds processes. |
| 1.7.5 | `module-help.csv` | CSV File | Provides command mappings for user assistance regarding module-help. |
| 1.7.6 | `config.yaml` | YAML File | Initializes baseline settings and module behaviors for gds. |


---

## Table Z77 (Level 4 - `_bmad/gds/agents/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.1.1 | `tech-writer` | Folder | Groups related modular substructures required by tech-writer. |
| 1.7.1.2 | `game-architect.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'game-architect'. |
| 1.7.1.3 | `game-designer.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'game-designer'. |
| 1.7.1.4 | `game-dev.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'game-dev'. |
| 1.7.1.5 | `game-qa.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'game-qa'. |
| 1.7.1.6 | `game-scrum-master.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'game-scrum-master'. |
| 1.7.1.7 | `game-solo-dev.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'game-solo-dev'. |


---

## Table Z78 (Level 5 - `_bmad/gds/agents/tech-writer/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.1.1.1 | `tech-writer.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'tech-writer'. |


---

## Table Z79 (Level 4 - `_bmad/gds/gametest/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.2.1 | `knowledge` | Folder | Groups related modular substructures required by knowledge. |
| 1.7.2.2 | `qa-index.csv` | CSV File | Defines a structured matrix mapping parameters for qa-index. |


---

## Table Z80 (Level 5 - `_bmad/gds/gametest/knowledge/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.2.1.1 | `balance-testing.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'balance-testing'. |
| 1.7.2.1.2 | `certification-testing.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'certification-testing'. |
| 1.7.2.1.3 | `compatibility-testing.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'compatibility-testing'. |
| 1.7.2.1.4 | `e2e-testing.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'e2e-testing'. |

<br>*Note: We showed 4 example MD files above. We smartly skipped the following 13 similar non-step files to keep the table concise:* `godot-testing.md, input-testing.md, localization-testing.md, multiplayer-testing.md, performance-testing.md, playtesting.md, qa-automation.md, regression-testing.md, save-testing.md, smoke-testing.md, test-priorities.md, unity-testing.md, unreal-testing.md`

---

## Table Z81 (Level 4 - `_bmad/gds/teams/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.3.1 | `default-party.csv` | CSV File | Defines a structured matrix mapping parameters for default-party. |
| 1.7.3.2 | `team-gamedev.yaml` | YAML File | Defines deployment overrides for the team-gamedev environment. |


---

## Table Z82 (Level 4 - `_bmad/gds/workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.1 | `1-preproduction` | Folder | Groups related modular substructures required by 1-preproduction. |
| 1.7.4.2 | `2-design` | Folder | Groups related modular substructures required by 2-design. |
| 1.7.4.3 | `3-technical` | Folder | Groups related modular substructures required by 3-technical. |
| 1.7.4.4 | `4-production` | Folder | Groups related modular substructures required by 4-production. |
| 1.7.4.5 | `document-project` | Folder | Groups related modular substructures required by document-project. |
| 1.7.4.6 | `gametest` | Folder | Houses specialized QA evaluation logic and automated test frameworks for workflows. |
| 1.7.4.7 | `gds-quick-flow` | Folder | Groups related modular substructures required by gds-quick-flow. |


---

## Table Z83 (Level 5 - `_bmad/gds/workflows/1-preproduction/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.1.1 | `brainstorm-game` | Folder | Groups related modular substructures required by brainstorm-game. |
| 1.7.4.1.2 | `game-brief` | Folder | Groups related modular substructures required by game-brief. |


---

## Table Z84 (Level 6 - `_bmad/gds/workflows/1-preproduction/brainstorm-game/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.1.1.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.7.4.1.1.2 | `game-brain-methods.csv` | CSV File | Defines a structured matrix mapping parameters for game-brain-methods. |
| 1.7.4.1.1.3 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.1.1.4 | `game-context.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'game-context'. |
| 1.7.4.1.1.5 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.7.4.1.1.6 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z85 (Level 7 - `_bmad/gds/workflows/1-preproduction/brainstorm-game/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.1.1.1.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.7.4.1.1.1.2 | `step-02-context.md` | Markdown File | Executes the specific procedural sequence 'step-02-context' within the workflow. |
| 1.7.4.1.1.1.3 | `step-03-ideation.md` | Markdown File | Executes the specific procedural sequence 'step-03-ideation' within the workflow. |
| 1.7.4.1.1.1.4 | `step-04-complete.md` | Markdown File | Executes the specific procedural sequence 'step-04-complete' within the workflow. |


---

## Table Z86 (Level 6 - `_bmad/gds/workflows/1-preproduction/game-brief/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.1.2.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.7.4.1.2.2 | `templates` | Folder | Stores reusable output generation formats for game-brief artifacts. |
| 1.7.4.1.2.3 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.1.2.4 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.1.2.5 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.7.4.1.2.6 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z87 (Level 7 - `_bmad/gds/workflows/1-preproduction/game-brief/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.1.2.1.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.7.4.1.2.1.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.7.4.1.2.1.3 | `step-02-vision.md` | Markdown File | Executes the specific procedural sequence 'step-02-vision' within the workflow. |
| 1.7.4.1.2.1.4 | `step-03-market.md` | Markdown File | Executes the specific procedural sequence 'step-03-market' within the workflow. |
| 1.7.4.1.2.1.5 | `step-04-fundamentals.md` | Markdown File | Executes the specific procedural sequence 'step-04-fundamentals' within the workflow. |
| 1.7.4.1.2.1.6 | `step-05-scope.md` | Markdown File | Executes the specific procedural sequence 'step-05-scope' within the workflow. |
| 1.7.4.1.2.1.7 | `step-06-references.md` | Markdown File | Executes the specific procedural sequence 'step-06-references' within the workflow. |
| 1.7.4.1.2.1.8 | `step-07-content.md` | Markdown File | Executes the specific procedural sequence 'step-07-content' within the workflow. |
| 1.7.4.1.2.1.9 | `step-08-complete.md` | Markdown File | Executes the specific procedural sequence 'step-08-complete' within the workflow. |


---

## Table Z88 (Level 7 - `_bmad/gds/workflows/1-preproduction/game-brief/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.1.2.2.1 | `game-brief-template.md` | Markdown File | Provides the structural skeleton for generating 'game-brief' outputs. |


---

## Table Z89 (Level 5 - `_bmad/gds/workflows/2-design/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.2.1 | `gdd` | Folder | Groups related modular substructures required by gdd. |
| 1.7.4.2.2 | `narrative` | Folder | Groups related modular substructures required by narrative. |


---

## Table Z90 (Level 6 - `_bmad/gds/workflows/2-design/gdd/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.2.1.1 | `game-types` | Folder | Groups related modular substructures required by game-types. |
| 1.7.4.2.1.2 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.7.4.2.1.3 | `templates` | Folder | Stores reusable output generation formats for gdd artifacts. |
| 1.7.4.2.1.4 | `game-types.csv` | CSV File | Defines a structured matrix mapping parameters for game-types. |
| 1.7.4.2.1.5 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.2.1.6 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.2.1.7 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z91 (Level 7 - `_bmad/gds/workflows/2-design/gdd/game-types/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.2.1.1.1 | `action-platformer.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'action-platformer'. |
| 1.7.4.2.1.1.2 | `adventure.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'adventure'. |
| 1.7.4.2.1.1.3 | `card-game.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'card-game'. |
| 1.7.4.2.1.1.4 | `fighting.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'fighting'. |

<br>*Note: We showed 4 example MD files above. We smartly skipped the following 20 similar non-step files to keep the table concise:* `horror.md, idle-incremental.md, metroidvania.md, moba.md, party-game.md, puzzle.md, racing.md, rhythm.md, roguelike.md, rpg.md, sandbox.md, shooter.md, simulation.md, sports.md, strategy.md, survival.md, text-based.md, tower-defense.md, turn-based-tactics.md, visual-novel.md`

---

## Table Z92 (Level 7 - `_bmad/gds/workflows/2-design/gdd/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.2.1.2.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.7.4.2.1.2.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.7.4.2.1.2.3 | `step-02-context.md` | Markdown File | Executes the specific procedural sequence 'step-02-context' within the workflow. |
| 1.7.4.2.1.2.4 | `step-03-platforms.md` | Markdown File | Executes the specific procedural sequence 'step-03-platforms' within the workflow. |
| 1.7.4.2.1.2.5 | `step-04-vision.md` | Markdown File | Executes the specific procedural sequence 'step-04-vision' within the workflow. |
| 1.7.4.2.1.2.6 | `step-05-core-gameplay.md` | Markdown File | Executes the specific procedural sequence 'step-05-core-gameplay' within the workflow. |
| 1.7.4.2.1.2.7 | `step-06-mechanics.md` | Markdown File | Executes the specific procedural sequence 'step-06-mechanics' within the workflow. |
| 1.7.4.2.1.2.8 | `step-07-game-type.md` | Markdown File | Executes the specific procedural sequence 'step-07-game-type' within the workflow. |
| 1.7.4.2.1.2.9 | `step-08-progression.md` | Markdown File | Executes the specific procedural sequence 'step-08-progression' within the workflow. |
| 1.7.4.2.1.2.10 | `step-09-levels.md` | Markdown File | Executes the specific procedural sequence 'step-09-levels' within the workflow. |
| 1.7.4.2.1.2.11 | `step-10-art-audio.md` | Markdown File | Executes the specific procedural sequence 'step-10-art-audio' within the workflow. |
| 1.7.4.2.1.2.12 | `step-11-technical.md` | Markdown File | Executes the specific procedural sequence 'step-11-technical' within the workflow. |
| 1.7.4.2.1.2.13 | `step-12-epics.md` | Markdown File | Executes the specific procedural sequence 'step-12-epics' within the workflow. |
| 1.7.4.2.1.2.14 | `step-13-metrics.md` | Markdown File | Executes the specific procedural sequence 'step-13-metrics' within the workflow. |
| 1.7.4.2.1.2.15 | `step-14-complete.md` | Markdown File | Executes the specific procedural sequence 'step-14-complete' within the workflow. |


---

## Table Z93 (Level 7 - `_bmad/gds/workflows/2-design/gdd/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.2.1.3.1 | `gdd-template.md` | Markdown File | Provides the structural skeleton for generating 'gdd' outputs. |


---

## Table Z94 (Level 6 - `_bmad/gds/workflows/2-design/narrative/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.2.2.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.7.4.2.2.2 | `templates` | Folder | Stores reusable output generation formats for narrative artifacts. |
| 1.7.4.2.2.3 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.2.2.4 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.2.2.5 | `instructions-narrative.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions-narrative'. |
| 1.7.4.2.2.6 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z95 (Level 7 - `_bmad/gds/workflows/2-design/narrative/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.2.2.1.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.7.4.2.2.1.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.7.4.2.2.1.3 | `step-02-foundation.md` | Markdown File | Executes the specific procedural sequence 'step-02-foundation' within the workflow. |
| 1.7.4.2.2.1.4 | `step-03-story.md` | Markdown File | Executes the specific procedural sequence 'step-03-story' within the workflow. |
| 1.7.4.2.2.1.5 | `step-04-characters.md` | Markdown File | Executes the specific procedural sequence 'step-04-characters' within the workflow. |
| 1.7.4.2.2.1.6 | `step-05-world.md` | Markdown File | Executes the specific procedural sequence 'step-05-world' within the workflow. |
| 1.7.4.2.2.1.7 | `step-06-dialogue.md` | Markdown File | Executes the specific procedural sequence 'step-06-dialogue' within the workflow. |
| 1.7.4.2.2.1.8 | `step-07-environmental.md` | Markdown File | Executes the specific procedural sequence 'step-07-environmental' within the workflow. |
| 1.7.4.2.2.1.9 | `step-08-delivery.md` | Markdown File | Executes the specific procedural sequence 'step-08-delivery' within the workflow. |
| 1.7.4.2.2.1.10 | `step-09-integration.md` | Markdown File | Executes the specific procedural sequence 'step-09-integration' within the workflow. |
| 1.7.4.2.2.1.11 | `step-10-production.md` | Markdown File | Executes the specific procedural sequence 'step-10-production' within the workflow. |
| 1.7.4.2.2.1.12 | `step-11-complete.md` | Markdown File | Executes the specific procedural sequence 'step-11-complete' within the workflow. |


---

## Table Z96 (Level 7 - `_bmad/gds/workflows/2-design/narrative/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.2.2.2.1 | `narrative-template.md` | Markdown File | Provides the structural skeleton for generating 'narrative' outputs. |


---

## Table Z97 (Level 5 - `_bmad/gds/workflows/3-technical/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.3.1 | `game-architecture` | Folder | Groups related modular substructures required by game-architecture. |
| 1.7.4.3.2 | `generate-project-context` | Folder | Groups related modular substructures required by generate-project-context. |


---

## Table Z98 (Level 6 - `_bmad/gds/workflows/3-technical/game-architecture/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.3.1.1 | `knowledge` | Folder | Groups related modular substructures required by knowledge. |
| 1.7.4.3.1.2 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.7.4.3.1.3 | `templates` | Folder | Stores reusable output generation formats for game-architecture artifacts. |
| 1.7.4.3.1.4 | `pattern-categories.csv` | CSV File | Defines a structured matrix mapping parameters for pattern-categories. |
| 1.7.4.3.1.5 | `architecture-patterns.yaml` | YAML File | Defines deployment overrides for the architecture-patterns environment. |
| 1.7.4.3.1.6 | `decision-catalog.yaml` | YAML File | Defines deployment overrides for the decision-catalog environment. |
| 1.7.4.3.1.7 | `engine-mcps.yaml` | YAML File | Defines deployment overrides for the engine-mcps environment. |
| 1.7.4.3.1.8 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.3.1.9 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.3.1.10 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.7.4.3.1.11 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z99 (Level 7 - `_bmad/gds/workflows/3-technical/game-architecture/knowledge/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.3.1.1.1 | `godot-engine.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'godot-engine'. |
| 1.7.4.3.1.1.2 | `phaser-engine.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'phaser-engine'. |
| 1.7.4.3.1.1.3 | `unity-engine.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'unity-engine'. |
| 1.7.4.3.1.1.4 | `unreal-engine.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'unreal-engine'. |


---

## Table Z100 (Level 7 - `_bmad/gds/workflows/3-technical/game-architecture/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.3.1.2.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.7.4.3.1.2.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.7.4.3.1.2.3 | `step-02-context.md` | Markdown File | Executes the specific procedural sequence 'step-02-context' within the workflow. |
| 1.7.4.3.1.2.4 | `step-03-starter.md` | Markdown File | Executes the specific procedural sequence 'step-03-starter' within the workflow. |
| 1.7.4.3.1.2.5 | `step-04-decisions.md` | Markdown File | Executes the specific procedural sequence 'step-04-decisions' within the workflow. |
| 1.7.4.3.1.2.6 | `step-05-crosscutting.md` | Markdown File | Executes the specific procedural sequence 'step-05-crosscutting' within the workflow. |
| 1.7.4.3.1.2.7 | `step-06-structure.md` | Markdown File | Executes the specific procedural sequence 'step-06-structure' within the workflow. |
| 1.7.4.3.1.2.8 | `step-07-patterns.md` | Markdown File | Executes the specific procedural sequence 'step-07-patterns' within the workflow. |
| 1.7.4.3.1.2.9 | `step-08-validation.md` | Markdown File | Executes the specific procedural sequence 'step-08-validation' within the workflow. |
| 1.7.4.3.1.2.10 | `step-09-complete.md` | Markdown File | Executes the specific procedural sequence 'step-09-complete' within the workflow. |


---

## Table Z101 (Level 7 - `_bmad/gds/workflows/3-technical/game-architecture/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.3.1.3.1 | `architecture-template.md` | Markdown File | Provides the structural skeleton for generating 'architecture' outputs. |


---

## Table Z102 (Level 6 - `_bmad/gds/workflows/3-technical/generate-project-context/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.3.2.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.7.4.3.2.2 | `project-context-template.md` | Markdown File | Provides the structural skeleton for generating 'project-context' outputs. |
| 1.7.4.3.2.3 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z103 (Level 7 - `_bmad/gds/workflows/3-technical/generate-project-context/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.3.2.1.1 | `step-01-discover.md` | Markdown File | Executes the specific procedural sequence 'step-01-discover' within the workflow. |
| 1.7.4.3.2.1.2 | `step-02-generate.md` | Markdown File | Executes the specific procedural sequence 'step-02-generate' within the workflow. |
| 1.7.4.3.2.1.3 | `step-03-complete.md` | Markdown File | Executes the specific procedural sequence 'step-03-complete' within the workflow. |


---

## Table Z104 (Level 5 - `_bmad/gds/workflows/4-production/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.4.1 | `code-review` | Folder | Groups related modular substructures required by code-review. |
| 1.7.4.4.2 | `correct-course` | Folder | Groups related modular substructures required by correct-course. |
| 1.7.4.4.3 | `create-story` | Folder | Groups related modular substructures required by create-story. |
| 1.7.4.4.4 | `dev-story` | Folder | Groups related modular substructures required by dev-story. |
| 1.7.4.4.5 | `retrospective` | Folder | Groups related modular substructures required by retrospective. |
| 1.7.4.4.6 | `sprint-planning` | Folder | Groups related modular substructures required by sprint-planning. |
| 1.7.4.4.7 | `sprint-status` | Folder | Groups related modular substructures required by sprint-status. |


---

## Table Z105 (Level 6 - `_bmad/gds/workflows/4-production/code-review/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.4.1.1 | `instructions.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for instructions. |
| 1.7.4.4.1.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.4.1.3 | `backlog-template.md` | Markdown File | Provides the structural skeleton for generating 'backlog' outputs. |
| 1.7.4.4.1.4 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |


---

## Table Z106 (Level 6 - `_bmad/gds/workflows/4-production/correct-course/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.4.2.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.4.2.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.4.2.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z107 (Level 6 - `_bmad/gds/workflows/4-production/create-story/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.4.3.1 | `instructions.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for instructions. |
| 1.7.4.4.3.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.4.3.3 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.4.3.4 | `template.md` | Markdown File | Provides the structural skeleton for generating 'template' outputs. |


---

## Table Z108 (Level 6 - `_bmad/gds/workflows/4-production/dev-story/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.4.4.1 | `instructions.xml` | XML File | Defines strict LLM prompt schemas and structured task instructions for instructions. |
| 1.7.4.4.4.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.4.4.3 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |


---

## Table Z109 (Level 6 - `_bmad/gds/workflows/4-production/retrospective/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.4.5.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.4.5.2 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z110 (Level 6 - `_bmad/gds/workflows/4-production/sprint-planning/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.4.6.1 | `sprint-status-template.yaml` | YAML File | Defines deployment overrides for the sprint-status-template environment. |
| 1.7.4.4.6.2 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.4.6.3 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.4.6.4 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z111 (Level 6 - `_bmad/gds/workflows/4-production/sprint-status/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.4.7.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.4.7.2 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z112 (Level 5 - `_bmad/gds/workflows/document-project/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.5.1 | `templates` | Folder | Stores reusable output generation formats for document-project artifacts. |
| 1.7.4.5.2 | `workflows` | Folder | Categorizes structured execution pathways for document-project processes. |
| 1.7.4.5.3 | `documentation-requirements.csv` | CSV File | Defines a structured matrix mapping parameters for documentation-requirements. |
| 1.7.4.5.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.5.5 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.5.6 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z113 (Level 6 - `_bmad/gds/workflows/document-project/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.5.1.1 | `deep-dive-template.md` | Markdown File | Provides the structural skeleton for generating 'deep-dive' outputs. |
| 1.7.4.5.1.2 | `index-template.md` | Markdown File | Provides the structural skeleton for generating 'index' outputs. |
| 1.7.4.5.1.3 | `project-overview-template.md` | Markdown File | Provides the structural skeleton for generating 'project-overview' outputs. |
| 1.7.4.5.1.4 | `source-tree-template.md` | Markdown File | Provides the structural skeleton for generating 'source-tree' outputs. |
| 1.7.4.5.1.5 | `project-scan-report-schema.json` | JSON File | Supports the project-scan-report-schema configuration. |


---

## Table Z114 (Level 6 - `_bmad/gds/workflows/document-project/workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.5.2.1 | `deep-dive.yaml` | YAML File | Defines deployment overrides for the deep-dive environment. |
| 1.7.4.5.2.2 | `full-scan.yaml` | YAML File | Defines deployment overrides for the full-scan environment. |
| 1.7.4.5.2.3 | `deep-dive-instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'deep-dive-instructions'. |
| 1.7.4.5.2.4 | `full-scan-instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'full-scan-instructions'. |


---

## Table Z115 (Level 5 - `_bmad/gds/workflows/gametest/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.6.1 | `automate` | Folder | Groups related modular substructures required by automate. |
| 1.7.4.6.2 | `e2e-scaffold` | Folder | Groups related modular substructures required by e2e-scaffold. |
| 1.7.4.6.3 | `performance` | Folder | Groups related modular substructures required by performance. |
| 1.7.4.6.4 | `playtest-plan` | Folder | Groups related modular substructures required by playtest-plan. |
| 1.7.4.6.5 | `test-design` | Folder | Groups related modular substructures required by test-design. |
| 1.7.4.6.6 | `test-framework` | Folder | Groups related modular substructures required by test-framework. |
| 1.7.4.6.7 | `test-review` | Folder | Groups related modular substructures required by test-review. |


---

## Table Z116 (Level 6 - `_bmad/gds/workflows/gametest/automate/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.6.1.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.6.1.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.6.1.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z117 (Level 6 - `_bmad/gds/workflows/gametest/e2e-scaffold/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.6.2.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.6.2.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.6.2.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z118 (Level 6 - `_bmad/gds/workflows/gametest/performance/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.6.3.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.6.3.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.6.3.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.7.4.6.3.4 | `performance-template.md` | Markdown File | Provides the structural skeleton for generating 'performance' outputs. |


---

## Table Z119 (Level 6 - `_bmad/gds/workflows/gametest/playtest-plan/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.6.4.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.6.4.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.6.4.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.7.4.6.4.4 | `playtest-template.md` | Markdown File | Provides the structural skeleton for generating 'playtest' outputs. |


---

## Table Z120 (Level 6 - `_bmad/gds/workflows/gametest/test-design/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.6.5.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.6.5.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.6.5.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.7.4.6.5.4 | `test-design-template.md` | Markdown File | Provides the structural skeleton for generating 'test-design' outputs. |


---

## Table Z121 (Level 6 - `_bmad/gds/workflows/gametest/test-framework/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.6.6.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.6.6.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.6.6.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |


---

## Table Z122 (Level 6 - `_bmad/gds/workflows/gametest/test-review/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.6.7.1 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.7.4.6.7.2 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.7.4.6.7.3 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.7.4.6.7.4 | `test-review-template.md` | Markdown File | Provides the structural skeleton for generating 'test-review' outputs. |


---

## Table Z123 (Level 5 - `_bmad/gds/workflows/gds-quick-flow/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.7.1 | `quick-dev` | Folder | Groups related modular substructures required by quick-dev. |
| 1.7.4.7.2 | `quick-spec` | Folder | Groups related modular substructures required by quick-spec. |


---

## Table Z124 (Level 6 - `_bmad/gds/workflows/gds-quick-flow/quick-dev/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.7.1.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.7.4.7.1.2 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z125 (Level 7 - `_bmad/gds/workflows/gds-quick-flow/quick-dev/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.7.1.1.1 | `step-01-mode-detection.md` | Markdown File | Executes the specific procedural sequence 'step-01-mode-detection' within the workflow. |
| 1.7.4.7.1.1.2 | `step-02-context-gathering.md` | Markdown File | Executes the specific procedural sequence 'step-02-context-gathering' within the workflow. |
| 1.7.4.7.1.1.3 | `step-03-execute.md` | Markdown File | Executes the specific procedural sequence 'step-03-execute' within the workflow. |
| 1.7.4.7.1.1.4 | `step-04-self-check.md` | Markdown File | Executes the specific procedural sequence 'step-04-self-check' within the workflow. |
| 1.7.4.7.1.1.5 | `step-05-adversarial-review.md` | Markdown File | Executes the specific procedural sequence 'step-05-adversarial-review' within the workflow. |
| 1.7.4.7.1.1.6 | `step-06-resolve-findings.md` | Markdown File | Executes the specific procedural sequence 'step-06-resolve-findings' within the workflow. |


---

## Table Z126 (Level 6 - `_bmad/gds/workflows/gds-quick-flow/quick-spec/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.7.2.1 | `steps` | Folder | Groups related modular substructures required by steps. |
| 1.7.4.7.2.2 | `tech-spec-template.md` | Markdown File | Provides the structural skeleton for generating 'tech-spec' outputs. |
| 1.7.4.7.2.3 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z127 (Level 7 - `_bmad/gds/workflows/gds-quick-flow/quick-spec/steps/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.7.4.7.2.1.1 | `step-01-understand.md` | Markdown File | Executes the specific procedural sequence 'step-01-understand' within the workflow. |
| 1.7.4.7.2.1.2 | `step-02-investigate.md` | Markdown File | Executes the specific procedural sequence 'step-02-investigate' within the workflow. |
| 1.7.4.7.2.1.3 | `step-03-generate.md` | Markdown File | Executes the specific procedural sequence 'step-03-generate' within the workflow. |
| 1.7.4.7.2.1.4 | `step-04-review.md` | Markdown File | Executes the specific procedural sequence 'step-04-review' within the workflow. |


---

## Table Z128 (Level 3 - `_bmad/tea/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.1 | `agents` | Folder | Stores AI persona definitions and prompt overrides for tea agents. |
| 1.8.2 | `teams` | Folder | Defines multi-agent party topologies and role allocations for tea. |
| 1.8.3 | `testarch` | Folder | Maintains testing architecture configurations for tea quality gates. |
| 1.8.4 | `workflows` | Folder | Categorizes structured execution pathways for tea processes. |
| 1.8.5 | `module-help.csv` | CSV File | Provides command mappings for user assistance regarding module-help. |
| 1.8.6 | `config.yaml` | YAML File | Initializes baseline settings and module behaviors for tea. |


---

## Table Z129 (Level 4 - `_bmad/tea/agents/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.1.1 | `tea.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'tea'. |


---

## Table Z130 (Level 4 - `_bmad/tea/teams/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.2.1 | `default-party.csv` | CSV File | Defines a structured matrix mapping parameters for default-party. |


---

## Table Z131 (Level 4 - `_bmad/tea/testarch/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.3.1 | `knowledge` | Folder | Groups related modular substructures required by knowledge. |
| 1.8.3.2 | `tea-index.csv` | CSV File | Defines a structured matrix mapping parameters for tea-index. |


---

## Table Z132 (Level 5 - `_bmad/tea/testarch/knowledge/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.3.1.1 | `adr-quality-readiness-checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'adr-quality-readiness-checklist'. |
| 1.8.3.1.2 | `api-request.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'api-request'. |
| 1.8.3.1.3 | `api-testing-patterns.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'api-testing-patterns'. |
| 1.8.3.1.4 | `auth-session.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'auth-session'. |

<br>*Note: We showed 4 example MD files above. We smartly skipped the following 36 similar non-step files to keep the table concise:* `burn-in.md, ci-burn-in.md, component-tdd.md, contract-testing.md, data-factories.md, email-auth.md, error-handling.md, feature-flags.md, file-utils.md, fixture-architecture.md, fixtures-composition.md, intercept-network-call.md, log.md, network-error-monitor.md, network-first.md, network-recorder.md, nfr-criteria.md, overview.md, pact-mcp.md, pactjs-utils-consumer-helpers.md, pactjs-utils-overview.md, pactjs-utils-provider-verifier.md, pactjs-utils-request-filter.md, playwright-cli.md, playwright-config.md, probability-impact.md, recurse.md, risk-governance.md, selective-testing.md, selector-resilience.md, test-healing-patterns.md, test-levels-framework.md, test-priorities-matrix.md, test-quality.md, timing-debugging.md, visual-debugging.md`

---

## Table Z133 (Level 4 - `_bmad/tea/workflows/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1 | `testarch` | Folder | Maintains testing architecture configurations for workflows quality gates. |


---

## Table Z134 (Level 5 - `_bmad/tea/workflows/testarch/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.1 | `atdd` | Folder | Groups related modular substructures required by atdd. |
| 1.8.4.1.2 | `automate` | Folder | Groups related modular substructures required by automate. |
| 1.8.4.1.3 | `ci` | Folder | Groups related modular substructures required by ci. |
| 1.8.4.1.4 | `framework` | Folder | Groups related modular substructures required by framework. |
| 1.8.4.1.5 | `nfr-assess` | Folder | Groups related modular substructures required by nfr-assess. |
| 1.8.4.1.6 | `teach-me-testing` | Folder | Groups related modular substructures required by teach-me-testing. |
| 1.8.4.1.7 | `test-design` | Folder | Groups related modular substructures required by test-design. |
| 1.8.4.1.8 | `test-review` | Folder | Groups related modular substructures required by test-review. |
| 1.8.4.1.9 | `trace` | Folder | Groups related modular substructures required by trace. |
| 1.8.4.1.10 | `README.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'README'. |


---

## Table Z135 (Level 6 - `_bmad/tea/workflows/testarch/atdd/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.1.1 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate atdd workflow logic. |
| 1.8.4.1.1.2 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate atdd workflow logic. |
| 1.8.4.1.1.3 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate atdd workflow logic. |
| 1.8.4.1.1.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.8.4.1.1.5 | `atdd-checklist-template.md` | Markdown File | Provides the structural skeleton for generating 'atdd-checklist' outputs. |
| 1.8.4.1.1.6 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.1.7 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.1.8 | `validation-report-20260127-095021.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-095021'. |
| 1.8.4.1.1.9 | `validation-report-20260127-102401.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-102401'. |
| 1.8.4.1.1.10 | `workflow-plan.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan.md' objective. |
| 1.8.4.1.1.11 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z136 (Level 7 - `_bmad/tea/workflows/testarch/atdd/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.1.1.1 | `step-01-preflight-and-context.md` | Markdown File | Executes the specific procedural sequence 'step-01-preflight-and-context' within the workflow. |
| 1.8.4.1.1.1.2 | `step-01b-resume.md` | Markdown File | Executes the specific procedural sequence 'step-01b-resume' within the workflow. |
| 1.8.4.1.1.1.3 | `step-02-generation-mode.md` | Markdown File | Executes the specific procedural sequence 'step-02-generation-mode' within the workflow. |
| 1.8.4.1.1.1.4 | `step-03-test-strategy.md` | Markdown File | Executes the specific procedural sequence 'step-03-test-strategy' within the workflow. |
| 1.8.4.1.1.1.5 | `step-04-generate-tests.md` | Markdown File | Executes the specific procedural sequence 'step-04-generate-tests' within the workflow. |
| 1.8.4.1.1.1.6 | `step-04a-subagent-api-failing.md` | Markdown File | Executes the specific procedural sequence 'step-04a-subagent-api-failing' within the workflow. |
| 1.8.4.1.1.1.7 | `step-04b-subagent-e2e-failing.md` | Markdown File | Executes the specific procedural sequence 'step-04b-subagent-e2e-failing' within the workflow. |
| 1.8.4.1.1.1.8 | `step-04c-aggregate.md` | Markdown File | Executes the specific procedural sequence 'step-04c-aggregate' within the workflow. |
| 1.8.4.1.1.1.9 | `step-05-validate-and-complete.md` | Markdown File | Executes the specific procedural sequence 'step-05-validate-and-complete' within the workflow. |


---

## Table Z137 (Level 7 - `_bmad/tea/workflows/testarch/atdd/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.1.2.1 | `step-01-assess.md` | Markdown File | Executes the specific procedural sequence 'step-01-assess' within the workflow. |
| 1.8.4.1.1.2.2 | `step-02-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-apply-edit' within the workflow. |


---

## Table Z138 (Level 7 - `_bmad/tea/workflows/testarch/atdd/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.1.3.1 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |


---

## Table Z139 (Level 6 - `_bmad/tea/workflows/testarch/automate/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.2.1 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate automate workflow logic. |
| 1.8.4.1.2.2 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate automate workflow logic. |
| 1.8.4.1.2.3 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate automate workflow logic. |
| 1.8.4.1.2.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.8.4.1.2.5 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.2.6 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.2.7 | `validation-report-20260127-095021.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-095021'. |
| 1.8.4.1.2.8 | `validation-report-20260127-102401.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-102401'. |
| 1.8.4.1.2.9 | `workflow-plan.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan.md' objective. |
| 1.8.4.1.2.10 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z140 (Level 7 - `_bmad/tea/workflows/testarch/automate/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.2.1.1 | `step-01-preflight-and-context.md` | Markdown File | Executes the specific procedural sequence 'step-01-preflight-and-context' within the workflow. |
| 1.8.4.1.2.1.2 | `step-01b-resume.md` | Markdown File | Executes the specific procedural sequence 'step-01b-resume' within the workflow. |
| 1.8.4.1.2.1.3 | `step-02-identify-targets.md` | Markdown File | Executes the specific procedural sequence 'step-02-identify-targets' within the workflow. |
| 1.8.4.1.2.1.4 | `step-03-generate-tests.md` | Markdown File | Executes the specific procedural sequence 'step-03-generate-tests' within the workflow. |
| 1.8.4.1.2.1.5 | `step-03a-subagent-api.md` | Markdown File | Executes the specific procedural sequence 'step-03a-subagent-api' within the workflow. |
| 1.8.4.1.2.1.6 | `step-03b-subagent-backend.md` | Markdown File | Executes the specific procedural sequence 'step-03b-subagent-backend' within the workflow. |
| 1.8.4.1.2.1.7 | `step-03b-subagent-e2e.md` | Markdown File | Executes the specific procedural sequence 'step-03b-subagent-e2e' within the workflow. |
| 1.8.4.1.2.1.8 | `step-03c-aggregate.md` | Markdown File | Executes the specific procedural sequence 'step-03c-aggregate' within the workflow. |
| 1.8.4.1.2.1.9 | `step-04-validate-and-summarize.md` | Markdown File | Executes the specific procedural sequence 'step-04-validate-and-summarize' within the workflow. |


---

## Table Z141 (Level 7 - `_bmad/tea/workflows/testarch/automate/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.2.2.1 | `step-01-assess.md` | Markdown File | Executes the specific procedural sequence 'step-01-assess' within the workflow. |
| 1.8.4.1.2.2.2 | `step-02-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-apply-edit' within the workflow. |


---

## Table Z142 (Level 7 - `_bmad/tea/workflows/testarch/automate/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.2.3.1 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |


---

## Table Z143 (Level 6 - `_bmad/tea/workflows/testarch/ci/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.3.1 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate ci workflow logic. |
| 1.8.4.1.3.2 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate ci workflow logic. |
| 1.8.4.1.3.3 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate ci workflow logic. |
| 1.8.4.1.3.4 | `azure-pipelines-template.yaml` | YAML File | Defines deployment overrides for the azure-pipelines-template environment. |
| 1.8.4.1.3.5 | `github-actions-template.yaml` | YAML File | Defines deployment overrides for the github-actions-template environment. |
| 1.8.4.1.3.6 | `gitlab-ci-template.yaml` | YAML File | Defines deployment overrides for the gitlab-ci-template environment. |
| 1.8.4.1.3.7 | `harness-pipeline-template.yaml` | YAML File | Defines deployment overrides for the harness-pipeline-template environment. |
| 1.8.4.1.3.8 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.8.4.1.3.9 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.3.10 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.3.11 | `validation-report-20260127-095021.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-095021'. |
| 1.8.4.1.3.12 | `validation-report-20260127-102401.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-102401'. |
| 1.8.4.1.3.13 | `workflow-plan.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan.md' objective. |
| 1.8.4.1.3.14 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |
| 1.8.4.1.3.15 | `jenkins-pipeline-template.groovy` | GROOVY File | Supports the jenkins-pipeline-template configuration. |


---

## Table Z144 (Level 7 - `_bmad/tea/workflows/testarch/ci/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.3.1.1 | `step-01-preflight.md` | Markdown File | Executes the specific procedural sequence 'step-01-preflight' within the workflow. |
| 1.8.4.1.3.1.2 | `step-01b-resume.md` | Markdown File | Executes the specific procedural sequence 'step-01b-resume' within the workflow. |
| 1.8.4.1.3.1.3 | `step-02-generate-pipeline.md` | Markdown File | Executes the specific procedural sequence 'step-02-generate-pipeline' within the workflow. |
| 1.8.4.1.3.1.4 | `step-03-configure-quality-gates.md` | Markdown File | Executes the specific procedural sequence 'step-03-configure-quality-gates' within the workflow. |
| 1.8.4.1.3.1.5 | `step-04-validate-and-summary.md` | Markdown File | Executes the specific procedural sequence 'step-04-validate-and-summary' within the workflow. |


---

## Table Z145 (Level 7 - `_bmad/tea/workflows/testarch/ci/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.3.2.1 | `step-01-assess.md` | Markdown File | Executes the specific procedural sequence 'step-01-assess' within the workflow. |
| 1.8.4.1.3.2.2 | `step-02-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-apply-edit' within the workflow. |


---

## Table Z146 (Level 7 - `_bmad/tea/workflows/testarch/ci/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.3.3.1 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |


---

## Table Z147 (Level 6 - `_bmad/tea/workflows/testarch/framework/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.4.1 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate framework workflow logic. |
| 1.8.4.1.4.2 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate framework workflow logic. |
| 1.8.4.1.4.3 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate framework workflow logic. |
| 1.8.4.1.4.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.8.4.1.4.5 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.4.6 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.4.7 | `validation-report-20260127-095021.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-095021'. |
| 1.8.4.1.4.8 | `validation-report-20260127-102401.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-102401'. |
| 1.8.4.1.4.9 | `workflow-plan.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan.md' objective. |
| 1.8.4.1.4.10 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z148 (Level 7 - `_bmad/tea/workflows/testarch/framework/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.4.1.1 | `step-01-preflight.md` | Markdown File | Executes the specific procedural sequence 'step-01-preflight' within the workflow. |
| 1.8.4.1.4.1.2 | `step-01b-resume.md` | Markdown File | Executes the specific procedural sequence 'step-01b-resume' within the workflow. |
| 1.8.4.1.4.1.3 | `step-02-select-framework.md` | Markdown File | Executes the specific procedural sequence 'step-02-select-framework' within the workflow. |
| 1.8.4.1.4.1.4 | `step-03-scaffold-framework.md` | Markdown File | Executes the specific procedural sequence 'step-03-scaffold-framework' within the workflow. |
| 1.8.4.1.4.1.5 | `step-04-docs-and-scripts.md` | Markdown File | Executes the specific procedural sequence 'step-04-docs-and-scripts' within the workflow. |
| 1.8.4.1.4.1.6 | `step-05-validate-and-summary.md` | Markdown File | Executes the specific procedural sequence 'step-05-validate-and-summary' within the workflow. |


---

## Table Z149 (Level 7 - `_bmad/tea/workflows/testarch/framework/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.4.2.1 | `step-01-assess.md` | Markdown File | Executes the specific procedural sequence 'step-01-assess' within the workflow. |
| 1.8.4.1.4.2.2 | `step-02-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-apply-edit' within the workflow. |


---

## Table Z150 (Level 7 - `_bmad/tea/workflows/testarch/framework/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.4.3.1 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |


---

## Table Z151 (Level 6 - `_bmad/tea/workflows/testarch/nfr-assess/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.5.1 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate nfr-assess workflow logic. |
| 1.8.4.1.5.2 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate nfr-assess workflow logic. |
| 1.8.4.1.5.3 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate nfr-assess workflow logic. |
| 1.8.4.1.5.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.8.4.1.5.5 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.5.6 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.5.7 | `nfr-report-template.md` | Markdown File | Provides the structural skeleton for generating 'nfr-report' outputs. |
| 1.8.4.1.5.8 | `validation-report-20260127-095021.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-095021'. |
| 1.8.4.1.5.9 | `validation-report-20260127-102401.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-102401'. |
| 1.8.4.1.5.10 | `workflow-plan.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan.md' objective. |
| 1.8.4.1.5.11 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z152 (Level 7 - `_bmad/tea/workflows/testarch/nfr-assess/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.5.1.1 | `step-01-load-context.md` | Markdown File | Executes the specific procedural sequence 'step-01-load-context' within the workflow. |
| 1.8.4.1.5.1.2 | `step-01b-resume.md` | Markdown File | Executes the specific procedural sequence 'step-01b-resume' within the workflow. |
| 1.8.4.1.5.1.3 | `step-02-define-thresholds.md` | Markdown File | Executes the specific procedural sequence 'step-02-define-thresholds' within the workflow. |
| 1.8.4.1.5.1.4 | `step-03-gather-evidence.md` | Markdown File | Executes the specific procedural sequence 'step-03-gather-evidence' within the workflow. |
| 1.8.4.1.5.1.5 | `step-04-evaluate-and-score.md` | Markdown File | Executes the specific procedural sequence 'step-04-evaluate-and-score' within the workflow. |
| 1.8.4.1.5.1.6 | `step-04a-subagent-security.md` | Markdown File | Executes the specific procedural sequence 'step-04a-subagent-security' within the workflow. |
| 1.8.4.1.5.1.7 | `step-04b-subagent-performance.md` | Markdown File | Executes the specific procedural sequence 'step-04b-subagent-performance' within the workflow. |
| 1.8.4.1.5.1.8 | `step-04c-subagent-reliability.md` | Markdown File | Executes the specific procedural sequence 'step-04c-subagent-reliability' within the workflow. |
| 1.8.4.1.5.1.9 | `step-04d-subagent-scalability.md` | Markdown File | Executes the specific procedural sequence 'step-04d-subagent-scalability' within the workflow. |
| 1.8.4.1.5.1.10 | `step-04e-aggregate-nfr.md` | Markdown File | Executes the specific procedural sequence 'step-04e-aggregate-nfr' within the workflow. |
| 1.8.4.1.5.1.11 | `step-05-generate-report.md` | Markdown File | Executes the specific procedural sequence 'step-05-generate-report' within the workflow. |


---

## Table Z153 (Level 7 - `_bmad/tea/workflows/testarch/nfr-assess/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.5.2.1 | `step-01-assess.md` | Markdown File | Executes the specific procedural sequence 'step-01-assess' within the workflow. |
| 1.8.4.1.5.2.2 | `step-02-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-apply-edit' within the workflow. |


---

## Table Z154 (Level 7 - `_bmad/tea/workflows/testarch/nfr-assess/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.5.3.1 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |


---

## Table Z155 (Level 6 - `_bmad/tea/workflows/testarch/teach-me-testing/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.6.1 | `data` | Folder | Provides contextual reference datasets and schemas required by teach-me-testing workflows. |
| 1.8.4.1.6.2 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate teach-me-testing workflow logic. |
| 1.8.4.1.6.3 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate teach-me-testing workflow logic. |
| 1.8.4.1.6.4 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate teach-me-testing workflow logic. |
| 1.8.4.1.6.5 | `templates` | Folder | Stores reusable output generation formats for teach-me-testing artifacts. |
| 1.8.4.1.6.6 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.6.7 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.6.8 | `workflow-plan-teach-me-testing.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan-teach-me-testing.md' objective. |
| 1.8.4.1.6.9 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z156 (Level 7 - `_bmad/tea/workflows/testarch/teach-me-testing/data/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.6.1.1 | `curriculum.yaml` | YAML File | Defines deployment overrides for the curriculum environment. |
| 1.8.4.1.6.1.2 | `quiz-questions.yaml` | YAML File | Defines deployment overrides for the quiz-questions environment. |
| 1.8.4.1.6.1.3 | `role-paths.yaml` | YAML File | Defines deployment overrides for the role-paths environment. |
| 1.8.4.1.6.1.4 | `session-content-map.yaml` | YAML File | Defines deployment overrides for the session-content-map environment. |
| 1.8.4.1.6.1.5 | `tea-resources-index.yaml` | YAML File | Defines deployment overrides for the tea-resources-index environment. |


---

## Table Z157 (Level 7 - `_bmad/tea/workflows/testarch/teach-me-testing/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.6.2.1 | `step-01-init.md` | Markdown File | Executes the specific procedural sequence 'step-01-init' within the workflow. |
| 1.8.4.1.6.2.2 | `step-01b-continue.md` | Markdown File | Executes the specific procedural sequence 'step-01b-continue' within the workflow. |
| 1.8.4.1.6.2.3 | `step-02-assess.md` | Markdown File | Executes the specific procedural sequence 'step-02-assess' within the workflow. |
| 1.8.4.1.6.2.4 | `step-03-session-menu.md` | Markdown File | Executes the specific procedural sequence 'step-03-session-menu' within the workflow. |
| 1.8.4.1.6.2.5 | `step-04-session-01.md` | Markdown File | Executes the specific procedural sequence 'step-04-session-01' within the workflow. |
| 1.8.4.1.6.2.6 | `step-04-session-02.md` | Markdown File | Executes the specific procedural sequence 'step-04-session-02' within the workflow. |
| 1.8.4.1.6.2.7 | `step-04-session-03.md` | Markdown File | Executes the specific procedural sequence 'step-04-session-03' within the workflow. |
| 1.8.4.1.6.2.8 | `step-04-session-04.md` | Markdown File | Executes the specific procedural sequence 'step-04-session-04' within the workflow. |
| 1.8.4.1.6.2.9 | `step-04-session-05.md` | Markdown File | Executes the specific procedural sequence 'step-04-session-05' within the workflow. |
| 1.8.4.1.6.2.10 | `step-04-session-06.md` | Markdown File | Executes the specific procedural sequence 'step-04-session-06' within the workflow. |
| 1.8.4.1.6.2.11 | `step-04-session-07.md` | Markdown File | Executes the specific procedural sequence 'step-04-session-07' within the workflow. |
| 1.8.4.1.6.2.12 | `step-05-completion.md` | Markdown File | Executes the specific procedural sequence 'step-05-completion' within the workflow. |


---

## Table Z158 (Level 7 - `_bmad/tea/workflows/testarch/teach-me-testing/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.6.3.1 | `step-e-01-assess-workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'step-e-01-assess-workflow.md' objective. |
| 1.8.4.1.6.3.2 | `step-e-02-apply-edits.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-e-02-apply-edits'. |


---

## Table Z159 (Level 7 - `_bmad/tea/workflows/testarch/teach-me-testing/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.6.4.1 | `step-v-01-validate.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'step-v-01-validate'. |


---

## Table Z160 (Level 7 - `_bmad/tea/workflows/testarch/teach-me-testing/templates/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.6.5.1 | `progress-template.yaml` | YAML File | Defines deployment overrides for the progress-template environment. |
| 1.8.4.1.6.5.2 | `certificate-template.md` | Markdown File | Provides the structural skeleton for generating 'certificate' outputs. |
| 1.8.4.1.6.5.3 | `session-notes-template.md` | Markdown File | Provides the structural skeleton for generating 'session-notes' outputs. |


---

## Table Z161 (Level 6 - `_bmad/tea/workflows/testarch/test-design/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.7.1 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate test-design workflow logic. |
| 1.8.4.1.7.2 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate test-design workflow logic. |
| 1.8.4.1.7.3 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate test-design workflow logic. |
| 1.8.4.1.7.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.8.4.1.7.5 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.7.6 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.7.7 | `test-design-architecture-template.md` | Markdown File | Provides the structural skeleton for generating 'test-design-architecture' outputs. |
| 1.8.4.1.7.8 | `test-design-handoff-template.md` | Markdown File | Provides the structural skeleton for generating 'test-design-handoff' outputs. |
| 1.8.4.1.7.9 | `test-design-qa-template.md` | Markdown File | Provides the structural skeleton for generating 'test-design-qa' outputs. |
| 1.8.4.1.7.10 | `test-design-template.md` | Markdown File | Provides the structural skeleton for generating 'test-design' outputs. |
| 1.8.4.1.7.11 | `validation-report-20260127-095021.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-095021'. |
| 1.8.4.1.7.12 | `validation-report-20260127-102401.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-102401'. |
| 1.8.4.1.7.13 | `workflow-plan.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan.md' objective. |
| 1.8.4.1.7.14 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z162 (Level 7 - `_bmad/tea/workflows/testarch/test-design/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.7.1.1 | `step-01-detect-mode.md` | Markdown File | Executes the specific procedural sequence 'step-01-detect-mode' within the workflow. |
| 1.8.4.1.7.1.2 | `step-01b-resume.md` | Markdown File | Executes the specific procedural sequence 'step-01b-resume' within the workflow. |
| 1.8.4.1.7.1.3 | `step-02-load-context.md` | Markdown File | Executes the specific procedural sequence 'step-02-load-context' within the workflow. |
| 1.8.4.1.7.1.4 | `step-03-risk-and-testability.md` | Markdown File | Executes the specific procedural sequence 'step-03-risk-and-testability' within the workflow. |
| 1.8.4.1.7.1.5 | `step-04-coverage-plan.md` | Markdown File | Executes the specific procedural sequence 'step-04-coverage-plan' within the workflow. |
| 1.8.4.1.7.1.6 | `step-05-generate-output.md` | Markdown File | Executes the specific procedural sequence 'step-05-generate-output' within the workflow. |


---

## Table Z163 (Level 7 - `_bmad/tea/workflows/testarch/test-design/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.7.2.1 | `step-01-assess.md` | Markdown File | Executes the specific procedural sequence 'step-01-assess' within the workflow. |
| 1.8.4.1.7.2.2 | `step-02-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-apply-edit' within the workflow. |


---

## Table Z164 (Level 7 - `_bmad/tea/workflows/testarch/test-design/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.7.3.1 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |


---

## Table Z165 (Level 6 - `_bmad/tea/workflows/testarch/test-review/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.8.1 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate test-review workflow logic. |
| 1.8.4.1.8.2 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate test-review workflow logic. |
| 1.8.4.1.8.3 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate test-review workflow logic. |
| 1.8.4.1.8.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.8.4.1.8.5 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.8.6 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.8.7 | `test-review-template.md` | Markdown File | Provides the structural skeleton for generating 'test-review' outputs. |
| 1.8.4.1.8.8 | `validation-report-20260127-095021.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-095021'. |
| 1.8.4.1.8.9 | `validation-report-20260127-102401.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-102401'. |
| 1.8.4.1.8.10 | `workflow-plan.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan.md' objective. |
| 1.8.4.1.8.11 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z166 (Level 7 - `_bmad/tea/workflows/testarch/test-review/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.8.1.1 | `step-01-load-context.md` | Markdown File | Executes the specific procedural sequence 'step-01-load-context' within the workflow. |
| 1.8.4.1.8.1.2 | `step-01b-resume.md` | Markdown File | Executes the specific procedural sequence 'step-01b-resume' within the workflow. |
| 1.8.4.1.8.1.3 | `step-02-discover-tests.md` | Markdown File | Executes the specific procedural sequence 'step-02-discover-tests' within the workflow. |
| 1.8.4.1.8.1.4 | `step-03-quality-evaluation.md` | Markdown File | Executes the specific procedural sequence 'step-03-quality-evaluation' within the workflow. |
| 1.8.4.1.8.1.5 | `step-03a-subagent-determinism.md` | Markdown File | Executes the specific procedural sequence 'step-03a-subagent-determinism' within the workflow. |
| 1.8.4.1.8.1.6 | `step-03b-subagent-isolation.md` | Markdown File | Executes the specific procedural sequence 'step-03b-subagent-isolation' within the workflow. |
| 1.8.4.1.8.1.7 | `step-03c-subagent-maintainability.md` | Markdown File | Executes the specific procedural sequence 'step-03c-subagent-maintainability' within the workflow. |
| 1.8.4.1.8.1.8 | `step-03e-subagent-performance.md` | Markdown File | Executes the specific procedural sequence 'step-03e-subagent-performance' within the workflow. |
| 1.8.4.1.8.1.9 | `step-03f-aggregate-scores.md` | Markdown File | Executes the specific procedural sequence 'step-03f-aggregate-scores' within the workflow. |
| 1.8.4.1.8.1.10 | `step-04-generate-report.md` | Markdown File | Executes the specific procedural sequence 'step-04-generate-report' within the workflow. |


---

## Table Z167 (Level 7 - `_bmad/tea/workflows/testarch/test-review/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.8.2.1 | `step-01-assess.md` | Markdown File | Executes the specific procedural sequence 'step-01-assess' within the workflow. |
| 1.8.4.1.8.2.2 | `step-02-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-apply-edit' within the workflow. |


---

## Table Z168 (Level 7 - `_bmad/tea/workflows/testarch/test-review/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.8.3.1 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |


---

## Table Z169 (Level 6 - `_bmad/tea/workflows/testarch/trace/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.9.1 | `steps-c` | Folder | Compartmentalizes Phase C sequence steps to strictly isolate trace workflow logic. |
| 1.8.4.1.9.2 | `steps-e` | Folder | Compartmentalizes Phase E sequence steps to strictly isolate trace workflow logic. |
| 1.8.4.1.9.3 | `steps-v` | Folder | Compartmentalizes Phase V sequence steps to strictly isolate trace workflow logic. |
| 1.8.4.1.9.4 | `workflow.yaml` | YAML File | Defines deployment overrides for the workflow environment. |
| 1.8.4.1.9.5 | `checklist.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'checklist'. |
| 1.8.4.1.9.6 | `instructions.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'instructions'. |
| 1.8.4.1.9.7 | `trace-template.md` | Markdown File | Provides the structural skeleton for generating 'trace' outputs. |
| 1.8.4.1.9.8 | `validation-report-20260127-095021.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-095021'. |
| 1.8.4.1.9.9 | `validation-report-20260127-102401.md` | Markdown File | Documents context, standards, or guidelines specifically regarding 'validation-report-20260127-102401'. |
| 1.8.4.1.9.10 | `workflow-plan.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow-plan.md' objective. |
| 1.8.4.1.9.11 | `workflow.md` | Markdown File | Documents the overarching path constraints to accomplish the 'workflow.md' objective. |


---

## Table Z170 (Level 7 - `_bmad/tea/workflows/testarch/trace/steps-c/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.9.1.1 | `step-01-load-context.md` | Markdown File | Executes the specific procedural sequence 'step-01-load-context' within the workflow. |
| 1.8.4.1.9.1.2 | `step-01b-resume.md` | Markdown File | Executes the specific procedural sequence 'step-01b-resume' within the workflow. |
| 1.8.4.1.9.1.3 | `step-02-discover-tests.md` | Markdown File | Executes the specific procedural sequence 'step-02-discover-tests' within the workflow. |
| 1.8.4.1.9.1.4 | `step-03-map-criteria.md` | Markdown File | Executes the specific procedural sequence 'step-03-map-criteria' within the workflow. |
| 1.8.4.1.9.1.5 | `step-04-analyze-gaps.md` | Markdown File | Executes the specific procedural sequence 'step-04-analyze-gaps' within the workflow. |
| 1.8.4.1.9.1.6 | `step-05-gate-decision.md` | Markdown File | Executes the specific procedural sequence 'step-05-gate-decision' within the workflow. |


---

## Table Z171 (Level 7 - `_bmad/tea/workflows/testarch/trace/steps-e/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.9.2.1 | `step-01-assess.md` | Markdown File | Executes the specific procedural sequence 'step-01-assess' within the workflow. |
| 1.8.4.1.9.2.2 | `step-02-apply-edit.md` | Markdown File | Executes the specific procedural sequence 'step-02-apply-edit' within the workflow. |


---

## Table Z172 (Level 7 - `_bmad/tea/workflows/testarch/trace/steps-v/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 1.8.4.1.9.3.1 | `step-01-validate.md` | Markdown File | Executes the specific procedural sequence 'step-01-validate' within the workflow. |


---

## Table Z173 (Level 2 - `_bmad-output/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 2.1 | `bmb-creations` | Folder | Groups related modular substructures required by bmb-creations. |
| 2.2 | `implementation-artifacts` | Folder | Groups related modular substructures required by implementation-artifacts. |
| 2.3 | `planning-artifacts` | Folder | Groups related modular substructures required by planning-artifacts. |
| 2.4 | `test-artifacts` | Folder | Groups related modular substructures required by test-artifacts. |


---

## Table ć (Level 2 - `docs/`)

| S.No | Artifact Name | Artifact Type | Purpose |
|---|---|---|---|
| 3.1 | *(Empty)* | - | Designed to hold long-term project documentation. |

---

