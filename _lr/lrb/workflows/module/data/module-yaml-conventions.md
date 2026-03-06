# module.yaml Conventions (Linkright)

**Purpose:** Defines how module.yaml works, including variables, templates, and how they provide context to agents and workflows.

---

## Overview

`module.yaml` is the configuration file for a Linkright module. It defines metadata, collects user input via prompts, and makes those inputs available as variables.

---

## Frontmatter Fields

```yaml
code: { module-code } # kebab-case identifier
name: "Display Name" # Human-readable name
header: "Brief description" # One-line summary
subheader: "Additional context" # More detail
default_selected: false # Auto-select on install?
```

---

## Variables System

### Core Config Variables (Injected)

- `user_name`
- `communication_language`
- `document_output_language`
- `output_folder`

### Custom Variables

```yaml
variable_name:
  prompt: "Question to ask the user?"
  default: "{default_value}"
  result: "{template_for_final_value}"
```

---

## Variable Templates

| Template           | Expands To                     |
| ------------------ | ------------------------------ |
| `{value}`          | The user's input               |
| `{directory_name}` | Current directory name         |
| `{output_folder}`  | Output folder from core config |
| `{project-root}`   | Project root path              |

---

## Best Practices

- Keep prompts clear and concise.
- Provide sensible defaults.
- Use `result: "{project-root}/{value}"` for paths.
