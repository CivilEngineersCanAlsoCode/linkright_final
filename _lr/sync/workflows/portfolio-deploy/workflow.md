---
name: "portfolio-deploy"
description: "Deploy the interactive career portfolio to GitHub Pages"
---

# Workflow: Portfolio Deployment

Transforms career signals and artifacts into a live, premium GitHub Pages evidence base.

```xml
<workflow id="portfolio-deploy" name="Interactive Evidence Deployment">
  <execution>
    <step n="1" id="compile">Execute ./steps-c/step-port-01-compile.md.</step>
    <step n="2" id="design">Execute ./steps-c/step-port-02-beyond-the-papers.md.</step>
    <step n="3" id="deploy">Execute ./steps-c/step-port-03-deploy.md.</step>
  </execution>
</workflow>
```

## Initialization Sequence

1.  **Configuration**: Load and read full config from `{project-root}/_lr/lr-config.yaml`.
2.  **Distribution**: Verify GitHub Pages connectivity in `distribution_settings`.
3.  **Handoff**: Proceed to compilation phase in `step-port-01-compile.md`.
