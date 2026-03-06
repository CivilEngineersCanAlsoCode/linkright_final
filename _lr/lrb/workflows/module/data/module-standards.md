# Module Standards (Linkright Builder)

**Purpose:** Defines what a Linkright module is, its structure, and the three types of modules.

---

## What is a Linkright Module?

A **Linkright module** is a self-contained package of functionality that extends the Linkright framework. Modules provide:

- **Agents** — AI personas with specialized expertise and menu-driven commands
- **Workflows** — Structured processes for accomplishing complex tasks
- **Configuration** — module.yaml for user customization

---

## Module Types

### 1. Standalone Module

A new, independent module focused on a specific domain.
**Characteristics:**

- Own module code (e.g., `sync`, `flex`, `squick`)
- Independent of other modules
- Has its own agents, workflows, configuration
  **Location:** `_lr/{module-code}/`

### 2. Extension Module

Extends an existing Linkright module with additional functionality.
**Location:** `_lr/{base-module}/extensions/{extension-code}/`

### 3. Global Module

Affects the entire Linkright framework and all modules.
**Location:** `_lr/{module-code}/` with `global: true` in module.yaml

---

## Required Module Structure

```
{module-code}/
├── module.yaml                 # Module configuration (REQUIRED)
├── README.md                   # Module documentation (REQUIRED)
├── agents/                     # Agent definitions
├── workflows/                  # Workflow definitions
└── {other folders}             # Tasks, templates, data as needed
```

---

## Required Files

### module.yaml (REQUIRED)

Every module MUST have a `module.yaml` file. See `module-yaml-conventions.md` for full specification.

### README.md (REQUIRED)

Every module MUST have a README.md detailing its purpose, components, and quick start guide.
