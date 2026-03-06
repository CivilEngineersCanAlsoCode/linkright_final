# Agent Menu Patterns

The agent menu is the interface users interact with. Good menu design makes agents discoverable and usable.

---

## Core Rules

1. **Hotkey is primary:** 2-letter code (XX format)
2. **Fuzzy match is backup:** Natural language matching on description
3. **Description tells the story:** `[XX] Clear action description`
4. **Max 10-15 menu items:** More = confusing
5. **Related items grouped:** Logical order, not alphabetical

---

## Menu Item Anatomy

```yaml
- trigger: SG or fuzzy match on signal
  action: '#extract-signal'
  description: '[SG] Extract work signal'
```

| Part | Purpose | Format |
|------|---------|--------|
| `trigger` | Hotkey + fuzzy search | `XX or fuzzy match on description` |
| `action` | What to execute | `'#prompt-id'` OR `'inline instruction'` |
| `description` | What user sees | `'[XX] Short action label'` |

---

## Trigger Code Rules

**Format:** Exactly 2 uppercase letters

- ✅ `SG` (Signal)
- ✅ `JD` (Job Description)
- ✅ `OPT` (Optimize) — but should be `OP`
- ❌ `S` (too short)
- ❌ `SGN` (too long)
- ❌ `sg` (must be uppercase)

**Reserved codes (DO NOT use):**
- `MH` (Meta Help — auto-injected)
- `CH` (Context Help — auto-injected)
- `PM` (Persona Menu — auto-injected)
- `DA` (Detailed About — auto-injected)

**Derivation:** Usually first 2 letters of action. Exceptions when conflict:

```
Conflicted Example:
  - Send (SE)
  - Score (SC)
  → Solution: S1, S2 OR Send (SD), Score (SC)
```

---

## Fuzzy Match Rules

Users should be able to type command or keyword:

```yaml
trigger: SG or fuzzy match on signal extraction
# User can type:
#   - SG
#   - signal
#   - extract
#   - extraction
```

**Best practices:**
- Include action verb + noun
- Match description text
- Allow partial matches
- Case-insensitive

---

## Description Format

Always: `[XX] Action Description`

- ✅ `[SG] Extract work signal`
- ✅ `[JD] Parse job description`
- ✅ `[LS] List all signals`
- ❌ `Extract signal`  (missing code)
- ❌ `SG Extract signal` (code not in brackets)
- ❌ `[Signal Extraction] Extract work signal` (full words in brackets)

---

## Action Types

### Prompt Reference
```yaml
action: '#prompt-id'
```

References a prompt in the `prompts` section. Prompt executes with agent persona context.

**Example:**
```yaml
menu:
  - trigger: SG or fuzzy match on signal
    action: '#extract-signal'
    description: '[SG] Extract work signal'

prompts:
  - id: extract-signal
    content: |
      <instructions>Extract structured signal</instructions>
      <process>1. Parse 2. Classify 3. Return</process>
```

### Inline Instruction
```yaml
action: 'Direct instruction text'
```

Immediate instruction without prompt wrapping. Use for simple actions.

**Example:**
```yaml
menu:
  - trigger: LS or fuzzy match on list
    action: 'List all signals currently in library'
    description: '[LS] List all signals'
```

---

## Menu Pattern Categories

### Pattern 1: Core Workflows (3-4 items)

Main actions users do most often.

```yaml
menu:
  - trigger: SG or fuzzy match on signal
    action: '#extract-signal'
    description: '[SG] Extract work signal'

  - trigger: JD or fuzzy match on jd
    action: '#parse-jd'
    description: '[JD] Parse job description'

  - trigger: OPT or fuzzy match on optimize
    action: '#optimize-resume'
    description: '[OPT] Optimize resume for JD'
```

### Pattern 2: Inspection/Audit (2-3 items)

View, list, check current state.

```yaml
menu:
  - trigger: LS or fuzzy match on list
    action: 'Show all signals in library'
    description: '[LS] List signals'

  - trigger: SC or fuzzy match on score
    action: '#score-alignment'
    description: '[SC] Score JD alignment'

  - trigger: VD or fuzzy match on validate
    action: '#validate-schema'
    description: '[VD] Validate signal schema'
```

### Pattern 3: Configuration (1-2 items)

Change settings, preferences, parameters.

```yaml
menu:
  - trigger: CF or fuzzy match on config
    action: '#configure-agent'
    description: '[CF] Configure settings'

  - trigger: RS or fuzzy match on reset
    action: 'Reset to default configuration'
    description: '[RS] Reset defaults'
```

### Pattern 4: Relationship-Aware (2-3 items, sidecar agents only)

Update memory, review history, manage context.

```yaml
menu:
  - trigger: HI or fuzzy match on history
    action: '#show-history'
    description: '[HI] Show conversation history'

  - trigger: MEM or fuzzy match on memories
    action: 'Update {project-root}/_lr/_memory/{sidecar}/memories.md'
    description: '[MEM] Update memories'

  - trigger: CLR or fuzzy match on clear
    action: 'Clear current session context'
    description: '[CLR] Clear context'
```

---

## Menu Design Guidelines

### Organization Principle

Group by **user workflow**, not alphabetical:

```yaml
# ❌ WRONG — Alphabetical
menu:
  - trigger: CF or fuzzy...  # Configure
  - trigger: ES or fuzzy...  # Extract Signal
  - trigger: LS or fuzzy...  # List Signals
  - trigger: OPT or fuzzy... # Optimize

# ✅ RIGHT — Workflow order
menu:
  - trigger: SG or fuzzy...  # Extract Signal (first: input)
  - trigger: LS or fuzzy...  # List Signals (second: review)
  - trigger: JD or fuzzy...  # Parse JD (third: target)
  - trigger: OPT or fuzzy... # Optimize (fourth: output)
  - trigger: CF or fuzzy...  # Configure (fifth: settings)
```

### Logical Grouping

Use comments to section menus:

```yaml
menu:
  # Core Workflow
  - trigger: SG or fuzzy match on signal
    action: '#extract-signal'
    description: '[SG] Extract work signal'

  - trigger: JD or fuzzy match on jd
    action: '#parse-jd'
    description: '[JD] Parse job description'

  # Optimization
  - trigger: OPT or fuzzy match on optimize
    action: '#optimize-resume'
    description: '[OPT] Optimize resume'

  # Inspection
  - trigger: LS or fuzzy match on list
    action: 'Show all signals'
    description: '[LS] List signals'

  # Settings
  - trigger: CF or fuzzy match on config
    action: '#configure'
    description: '[CF] Configure'
```

### Quantity Guidelines

| Scenario | Items | Rationale |
|----------|-------|-----------|
| Simple utility agent | 2-3 | Single-purpose, minimal options |
| Standard agent | 5-8 | Core + inspection + settings |
| Complex agent | 8-12 | Workflows + variations + settings |
| Very complex | >12 | Should be a Module, not single agent |

If exceeding 15 items: split into multiple agents or promote to Module.

---

## Common Menu Mistakes

### Mistake 1: Too Many Items
**Wrong:**
```yaml
menu:
  - trigger: SG ...  # Signal
  - trigger: SV ...  # Signal Validation
  - trigger: SC ...  # Score Signal
  - trigger: SP ...  # Signal Properties
  - trigger: SE ...  # Signal Embedding
  - trigger: SX ...  # Signal Export
  # 6 signal-related items — confusing
```

**Fix:** Consolidate into one "Signal Management" with sub-actions

### Mistake 2: Inconsistent Format
**Wrong:**
```yaml
menu:
  - trigger: SG or fuzzy match on signal
    description: '[SG] Extract work signal'

  - trigger: JD or fuzzy match
    description: 'Parse job description'  # Missing [JD]

  - trigger: OPT
    description: '[OPT] Optimize'  # Missing fuzzy match
```

**Fix:** Consistent format for all

### Mistake 3: Unclear Description
**Wrong:**
```yaml
- trigger: SG or fuzzy...
  description: '[SG] Signal'  # Too vague

- trigger: JD or fuzzy...
  description: '[JD] System processes job descriptions'  # Too long
```

**Fix:** Clear, concise, action-focused

### Mistake 4: Non-Semantic Trigger Code
**Wrong:**
```yaml
- trigger: AB or fuzzy match on extract  # AB = ?
- trigger: XY or fuzzy match on optimize # XY = ?
```

**Fix:** Derive from action name

---

## Menu Testing Checklist

- [ ] Hotkey is exactly 2 uppercase letters
- [ ] Hotkey is NOT reserved (MH, CH, PM, DA)
- [ ] All hotkeys unique (no duplicates)
- [ ] Description format: `[XX] Text`
- [ ] Fuzzy match text matches description
- [ ] Action references existing prompt OR clear instruction
- [ ] Menu items ordered by workflow, not alphabetical
- [ ] Total items ≤ 15 (ideally 5-8)
- [ ] Each action is useful and distinct

---

## Auto-Injected Menu Items (DO NOT CREATE)

LRB compiler auto-adds these. Don't manually create them:

```yaml
menu:
  # Auto-added — don't create
  - trigger: MH or fuzzy match on menu help
    description: '[MH] Show this menu'

  - trigger: CH or fuzzy match on context
    description: '[CH] Show context/persona'

  - trigger: PM or fuzzy match on persona menu
    description: '[PM] Show persona details'

  - trigger: DA or fuzzy match on detailed about
    description: '[DA] Detailed information'
```

These are injected automatically. If you create them, compiler will error.

---

## Quick Reference

```yaml
# Hotkey + Fuzzy
trigger: XX or fuzzy match on description

# Action Type 1: Prompt
action: '#prompt-id'

# Action Type 2: Inline
action: 'Direct instruction'

# Description
description: '[XX] Action label'
```

**Menu item limit:** 15 maximum (5-8 recommended)

**Hotkey format:** Exactly 2 uppercase letters

**Description format:** `[XX] Description`

---

*Last updated: 2026-03-06*
*Reference: LRB menu pattern guide*
