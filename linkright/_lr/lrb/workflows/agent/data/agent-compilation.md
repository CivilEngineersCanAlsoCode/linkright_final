# Agent Compilation

LRB compiles agent YAML into executable agent commands for Claude Code CLI.
This document describes the compilation process and output format.

---

## Compilation Pipeline

```
agent-name.agent.yaml
    ↓
[Syntax Validation]
    ↓
[Persona Integrity Check]
    ↓
[Menu Code Generation]
    ↓
[Prompt Injection]
    ↓
[Critical Actions Binding]
    ↓
[XML Activation Block]
    ↓
Compiled Agent (Ready for /command execution)
```

---

## Stage 1: Syntax Validation

**Input:** Raw YAML

**Checks:**
- Valid YAML syntax
- All required fields present:
  - metadata: id, name, title, icon, module, hasSidecar
  - persona: role, identity, communication_style, principles
  - menu: at least one entry

**Output:** Syntax report or halt

---

## Stage 2: Persona Integrity Check

**Input:** Persona section

**Checks:**

### Four-Field Separation
- `role`: No identity/experience/beliefs mixed in
- `identity`: No capabilities/speech patterns/beliefs mixed in
- `communication_style`: Only speech patterns, no capabilities/background/beliefs
- `principles`: Only beliefs/rules, no capabilities/background/speech

### Field Quality
- `role`: 1-2 sentences, first-person
- `identity`: 2-5 sentences, contextual
- `communication_style`: 1-2 sentences, voice-only
- `principles`: 3-8 bullet points

**Output:** Field separation violations or pass

---

## Stage 3: Menu Code Generation

**Input:** Menu array

**Process:**

For each menu item:
```yaml
- trigger: XX or fuzzy match on description
  action: '#prompt-id' or inline
  description: '[XX] Text'
```

Generate:
```
[XX] Action trigger
  - Hotkey: XX
  - Fuzzy: description
  - Action: prompt-id or inline
  - Description: Text
```

**Validation:**
- Unique trigger codes (XX)
- No reserved codes (MH, CH, PM, DA)
- All prompt IDs referenced exist
- Description format: `[XX] Text`

**Output:** Menu handler map

---

## Stage 4: Prompt Injection

**Input:** Prompts array

**Process:**

For each prompt:
```yaml
- id: prompt-id
  content: |
    <instructions>...</instructions>
    <process>...</process>
    <example>...</example>
```

Compile into executable instruction block:
```
# Prompt: prompt-id
## Instructions
[content from <instructions>]

## Process
[content from <process>]

## Example
[content from <example>]

[Persona context injected here]
```

**Persona Context Injection:**
Agent's persona (role, identity, communication_style, principles) is merged into each prompt execution.

**Output:** Compiled prompt library

---

## Stage 5: Critical Actions Binding

**Input:** critical_actions array (optional for hasSidecar: false, REQUIRED for hasSidecar: true)

**Process:**

For hasSidecar: true agents:

```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_lr/_memory/{sidecar}/{memories.md}'
  - 'Load COMPLETE file {project-root}/_lr/_memory/{sidecar}/{instructions.md}'
  - 'ONLY read/write files in {project-root}/_lr/_memory/{sidecar}/'
```

**Validation:**
- All three required statements present (for sidecar agents)
- Sidecar path uses `{project-root}` as placeholder
- Path structure matches: `_lr/_memory/{folder}/`
- No absolute paths

**Binding:** Critical actions are bound to agent initialization. Loaded before persona execution.

**Output:** Initialization constraints

---

## Stage 6: XML Activation Block

**Input:** All compiled stages

**Process:**

Generate XML activation block (auto-generated, NOT in source YAML):

```xml
<agent>
  <activation>
    <load type="critical">
      <!-- Critical actions -->
    </load>
    <bind type="persona">
      <!-- Persona context -->
    </bind>
    <menu type="triggers">
      <!-- Menu handlers -->
    </menu>
  </activation>
</agent>
```

**Output:** XML wrapper for agent execution context

---

## Final Compiled Agent Format

What is produced after compilation:

```
---
agent: agent-name
title: Agent Title
---

# Agent Context
## Role
[persona.role text]

## Identity
[persona.identity text]

## Communication Style
[persona.communication_style text]

## Principles
- [principle 1]
- [principle 2]

---

## Available Commands

[Menu items with hotkeys and descriptions]

---

## Activation Rules
[Critical actions]

---

## Detailed Prompts

### [Prompt 1]
[Instructions, Process, Example]

### [Prompt 2]
[Instructions, Process, Example]
```

---

## Compilation Output Validation

### Structure Check
- [ ] Frontmatter with agent name and title
- [ ] Persona section formatted and complete
- [ ] Menu section with all triggers
- [ ] Prompts section with all ids
- [ ] Activation rules documented

### Execution Check
- [ ] Can hotkey trigger menu item? (XX works)
- [ ] Can fuzzy match find action? (typed command works)
- [ ] Does action resolve to prompt or instruction?
- [ ] Does persona load into prompt context?
- [ ] Do critical actions bind before execution?

---

## Compilation Errors and Recovery

| Error | Cause | Fix |
|-------|-------|-----|
| Syntax Error | Invalid YAML | Check YAML syntax, use validator |
| Missing Field | Required field absent | Add metadata, persona, menu fields |
| Field Separation | Persona field contains wrong content | Review persona-properties.md and fix |
| Duplicate Trigger | Two menu items same code | Rename trigger code |
| Unknown Prompt ID | Menu references non-existent prompt | Add prompt to prompts section |
| Sidecar Path Wrong | Path doesn't match pattern | Use `{project-root}/_lr/_memory/{folder}/` |
| Over-Size | Stateless agent > 250 lines | Convert to sidecar-based agent |

---

## Compilation Checklist

### Pre-Compilation
- [ ] YAML is valid (use `yamllint`)
- [ ] All required metadata fields present
- [ ] Persona fields are separated correctly
- [ ] At least one menu item exists
- [ ] All prompt IDs are unique
- [ ] Menu triggers are unique (no duplicate XX codes)
- [ ] Reserved codes not used (MH, CH, PM, DA)
- [ ] If hasSidecar: true, sidecar folder exists
- [ ] If hasSidecar: true, critical_actions has all 3 required statements

### Compilation
- [ ] Syntax validation passes
- [ ] Persona integrity check passes
- [ ] Menu codes are unique and valid
- [ ] All prompt IDs resolve
- [ ] Critical actions parse correctly
- [ ] No conflicting trigger codes

### Post-Compilation
- [ ] Agent appears in Claude Code CLI
- [ ] Menu items respond to hotkey (XX)
- [ ] Menu items respond to fuzzy match
- [ ] Prompts execute with persona context
- [ ] If sidecar: memories load on activation
- [ ] If sidecar: file access restricted to sidecar folder

---

## Compilation Configuration

LRB compiler settings (in `_lr/lrb/config.yaml`):

```yaml
compilation:
  syntax_strict: true                  # Fail on any YAML syntax error
  persona_separation_strict: true      # Fail on field mixing
  size_limit_stateless: 250            # Lines max for hasSidecar: false
  reserved_triggers:
    - MH
    - CH
    - PM
    - DA
  sidecar_path_pattern: '_lr/_memory/{folder}/'
  prompt_id_pattern: '^[a-z-]+$'       # Kebab-case required
```

---

## Compiler Output

Successful compilation produces:

**For hasSidecar: false:**
- Single compiled agent YAML
- Ready for immediate use

**For hasSidecar: true:**
- Compiled agent YAML
- Verification that sidecar folder exists
- Path binding confirmation

**All agents:**
- Menu map (hotkeys + fuzzy matches)
- Prompt library (all prompts + persona context)
- Activation rules (critical actions)

---

## Debugging Compilation

### Check compilation log:
```bash
bd show {phase-task-id} --json | grep compilation
```

### Common issues:

**Issue: "Agent not appearing in menu"**
→ Check: menu section exists, trigger codes unique, no syntax errors

**Issue: "Persona not loading"**
→ Check: persona fields present, XML activation block generated

**Issue: "Sidecar files not accessible"**
→ Check: critical_actions path matches pattern, folder exists, files present

**Issue: "Prompt not executing"**
→ Check: prompt ID matches action reference, prompt syntax valid

---

## Performance Notes

Compilation is fast: ~100-200ms per agent.

If compilation slow:
- Check YAML file size (should be <500 lines)
- Check prompt count (should be <20)
- Check menu items (should be <15)

If any exceed, consider splitting into multiple agents.

---

*Last updated: 2026-03-06*
*Reference: LRB agent compilation process*
