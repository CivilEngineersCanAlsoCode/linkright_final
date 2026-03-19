# ADR-009: Hybrid Workflow Definitions (YAML + Markdown)

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
Linkright workflows need both structured metadata for automation (input patterns, paths, triggers) and detailed, human-readable instructions for agents. Using a single format for both leads to either poor instructability (XML/YAML only) or poor automation (Markdown only).

## Decision
Adopt a **Hybrid Workflow Definition** standard: Use **YAML** (`workflow.yaml`) for structured configuration and **Markdown** (`workflow.md`, `instructions.md`, `step-*.md`) for the instructional and procedural content.

## Rationale
- **Automation-Friendly**: YAML is natively parseable by all programming languages and CLI tools, making it ideal for the "orchestrator" logic.
- **Instructability**: Markdown provides the rich text formatting needed to provide clear, high-context instructions to LLM-based agents.
- **B-MAD Compliance**: Aligns with the B-MAD standard of using Markdown for agent procedures while maintaining machine-readable metadata.
- **Readability**: Easier for human maintainers to audit instructions in Markdown than nested in YAML strings.

## Consequences
- Every workflow must have at least one `workflow.yaml` file.
- The `workflow-manifest.csv` should prioritize the YAML file as the primary entry point.
- Consistency between metadata in YAML and references in Markdown must be maintained.

## Alternatives Considered
- **Markdown-only**: Harder to build reliable automation/validation tools.
- **YAML/JSON-only**: Extremely difficult to write complex, multi-page agent instructions with proper formatting.
- **XML-only**: Robust but significantly more verbose and less readable for human maintainers than YAML/Markdown.
