# Agent Validation

Comprehensive validation checklist for agent YAML before compilation and deployment.

---

## Validation Stages

```
Draft → Syntax Check → Persona Check → Menu Check → Prompt Check → Metadata Check → Ready
```

---

## Stage 1: Syntax Validation

**Tool:** `yamllint` or YAML validator

**Check:**
```bash
yamllint agent-name.agent.yaml
```

**Must pass:**
- [ ] Valid YAML syntax
- [ ] No tab characters (spaces only)
- [ ] Proper indentation (2 spaces per level)
- [ ] Colons and dashes correctly placed
- [ ] No trailing whitespace
- [ ] UTF-8 encoding

**Common syntax errors:**

| Error | Fix |
|-------|-----|
| `expected <block end>` | Check indentation, likely mixed tabs/spaces |
| `found duplicate key` | Remove duplicate field names |
| `found undefined alias` | Remove YAML anchors/aliases |
| `wrong indentation` | Ensure consistent 2-space indent |

---

## Stage 2: Metadata Validation

**Check:** All required metadata fields present and valid

```yaml
metadata:
  id: '_lr/{module}/{agent-name}/{agent-name}.md'        # ✅ Full path
  name: 'Persona Name'                                    # ✅ Title-cased
  title: 'Agent Title'                                    # ✅ 2-4 words
  icon: '📦'                                              # ✅ Single emoji
  module: 'sync | flex | squick | lrb'                  # ✅ Valid module
  hasSidecar: false or true                              # ✅ Lowercase boolean
```

**Validation:**

- [ ] `id` matches file location
- [ ] `id` uses kebab-case for agent-name
- [ ] `id` starts with `_lr/`
- [ ] `name` is unique across Linkright
- [ ] `name` contains no special characters except hyphens
- [ ] `title` is 2-4 words, not a persona name
- [ ] `icon` is exactly one emoji (not text)
- [ ] `module` is `sync`, `flex`, `squick`, or `lrb` (lowercase)
- [ ] `hasSidecar` is `false` or `true` (lowercase)

**If hasSidecar: true:**
- [ ] `critical_actions` section exists
- [ ] Sidecar folder exists at: `_lr/_memory/{agent-name}-sidecar/`
- [ ] `memories.md` exists in sidecar
- [ ] `instructions.md` exists in sidecar

---

## Stage 3: Persona Validation

**Check:** Four-field persona is complete and properly separated

### Field Presence
- [ ] `role` present (1-2 sentences)
- [ ] `identity` present (2-5 sentences)
- [ ] `communication_style` present (1-2 sentences)
- [ ] `principles` present (array of 3-8 items)

### Field Separation (Critical)

**role field:** ❌ MUST NOT contain
- Identity words (experienced, senior, background)
- Speech patterns (poetic, dramatic, speaks)
- Beliefs (believes, values, think)

**identity field:** ❌ MUST NOT contain
- Capabilities (analyzes, creates, builds)
- Speech patterns (speaks, talks, communicates)
- Beliefs (believes in, values, philosophy)

**communication_style field:** ❌ MUST NOT contain
- Capabilities (extracts, parses, analyzes)
- Background (experienced, trained, years)
- Beliefs (believes, thinks, philosophy)
- Action words (ensures, makes sure, always)

**principles field:** ❌ MUST NOT contain
- Capabilities (analyzes data, creates reports)
- Background (with my experience, as trained)
- Speech patterns (speaks, talks, communicates)

### Quality Check

```yaml
# Read each field aloud. Does it match the field purpose?
role: "I extract metrics" ✅ (purpose: what agent does)
identity: "Trained analyst" ✅ (purpose: who agent is)
communication_style: "Direct tone" ✅ (purpose: how agent talks)
principles: "Evidence first" ✅ (purpose: guiding beliefs)
```

### Field Content Validation

- [ ] `role`: 1-2 sentences, first-person, capability-focused
- [ ] `identity`: 2-5 sentences, background/context, professional
- [ ] `communication_style`: 1-2 sentences, voice/tone only
- [ ] `principles`: 3-8 items, belief/rule statements

**Common issue:** `communication_style` becomes a catch-all dump of unrelated content
→ **Fix:** Distribute extra content into proper fields

---

## Stage 4: Critical Actions Validation

**If hasSidecar: false:**
- [ ] `critical_actions` is optional
- [ ] If present, no sidecar path references

**If hasSidecar: true:**
- [ ] `critical_actions` is REQUIRED
- [ ] Exactly 3 statements present:
  1. Load COMPLETE file `{project-root}/_lr/_memory/{sidecar}/memories.md`
  2. Load COMPLETE file `{project-root}/_lr/_memory/{sidecar}/instructions.md`
  3. ONLY read/write files in `{project-root}/_lr/_memory/{sidecar}/`

**Path validation:**
- [ ] Uses `{project-root}` as literal placeholder
- [ ] Path matches: `_lr/_memory/{sidecar-folder}/`
- [ ] No absolute paths (`/Users/...`)
- [ ] No relative paths (`./` or `../`)

---

## Stage 5: Menu Validation

**Check:** Menu is usable, consistent, and valid

### Structure
```yaml
menu:
  - trigger: XX or fuzzy match on description
    action: '#prompt-id' or inline instruction
    description: '[XX] Text'
```

### Trigger Validation
- [ ] Exactly 2 uppercase letters
- [ ] All triggers unique (no duplicates)
- [ ] No reserved codes: MH, CH, PM, DA
- [ ] Format: `XX or fuzzy match on ...`

### Description Validation
- [ ] Format: `[XX] Action Description`
- [ ] XX matches trigger code
- [ ] Description matches fuzzy match text
- [ ] Clear, concise, action-focused

### Action Validation
- [ ] Prompt reference: `'#prompt-id'` exists in prompts section
- [ ] Inline instruction: Clear and actionable
- [ ] No external script references
- [ ] No file paths in action field

### Quantity
- [ ] Minimum 2 items
- [ ] Maximum 15 items (recommend ≤8)
- [ ] Each action is distinct and useful

---

## Stage 6: Prompts Validation

**Check:** All prompts are present, complete, and valid

### Required Fields
```yaml
prompts:
  - id: prompt-id
    content: |
      <instructions>What this does</instructions>
      <process>1. Step 2. Step</process>
      <example>Optional example</example>
```

- [ ] `id` present and unique (kebab-case)
- [ ] `content` present
- [ ] `instructions` section present
- [ ] `process` section present
- [ ] `example` section optional but recommended

### Prompt Quality
- [ ] `id` is semantic (describes purpose)
- [ ] `instructions` is 1 sentence max
- [ ] `process` has 3-6 numbered steps
- [ ] Steps are atomic and sequential
- [ ] `example` shows clear input → output transformation

### Prompt References
- [ ] Every menu `action: '#prompt-id'` has matching prompt
- [ ] No orphaned prompts (unused in menu)
- [ ] All IDs unique across prompts section

---

## Stage 7: Size Validation

**If hasSidecar: false:**
- [ ] Total agent YAML ≤ 250 lines
- [ ] Metadata: ~20 lines
- [ ] Persona: ~15 lines
- [ ] Critical actions: 0-3 lines
- [ ] Menu: ~20 lines
- [ ] Prompts: ~150-200 lines

**Check:**
```bash
wc -l agent-name.agent.yaml
# Should show ≤ 250 lines
```

If exceeding 250 lines:
→ Convert to `hasSidecar: true` and move prompts to sidecar

**If hasSidecar: true:**
- [ ] YAML file ≤ 150 lines
- [ ] Complex prompts moved to sidecar/workflows/
- [ ] Sidecar folder organized (memories, instructions, custom)

---

## Pre-Deployment Validation Checklist

### Syntax & Metadata
- [ ] YAML is syntactically valid
- [ ] All metadata fields present and correct
- [ ] `id` matches file location
- [ ] `module` is valid Linkright module
- [ ] `hasSidecar` boolean is correct

### Persona
- [ ] All 4 fields present (role, identity, communication_style, principles)
- [ ] Fields are separated (no mixing)
- [ ] Each field matches its purpose
- [ ] Principles are 3-8 items

### Critical Actions (if applicable)
- [ ] If hasSidecar: false, optional (if present, no sidecar paths)
- [ ] If hasSidecar: true, REQUIRED with all 3 statements
- [ ] Paths use `{project-root}` placeholder
- [ ] Paths point to `_lr/_memory/` directory

### Menu
- [ ] 2-15 items (recommend 5-8)
- [ ] All triggers unique, 2 uppercase letters
- [ ] No reserved codes (MH, CH, PM, DA)
- [ ] All descriptions format: `[XX] Text`
- [ ] All actions reference existing prompts or clear instructions

### Prompts
- [ ] At least 1 prompt present
- [ ] All IDs unique and semantic
- [ ] All menu references have matching prompt
- [ ] Each prompt has instructions + process
- [ ] Optional: examples helpful for clarity

### Size
- [ ] If hasSidecar: false, ≤ 250 lines
- [ ] If hasSidecar: true, ≤ 150 lines (YAML only)

---

## Validation Script (Quick Check)

```bash
#!/bin/bash
# Save as: validate-agent.sh

AGENT_FILE="$1"

echo "Validating: $AGENT_FILE"
echo "================================"

# Syntax check
echo "1. YAML Syntax..."
yamllint "$AGENT_FILE" || { echo "   ❌ Syntax error"; exit 1; }
echo "   ✅ Valid YAML"

# Line count
LINES=$(wc -l < "$AGENT_FILE")
echo "2. Line Count: $LINES lines"
if [ "$LINES" -gt 250 ]; then
  echo "   ⚠️  Exceeds 250 lines (consider sidecar)"
else
  echo "   ✅ Within limits"
fi

# Required fields
echo "3. Checking required fields..."
grep -q "metadata:" "$AGENT_FILE" && echo "   ✅ metadata" || echo "   ❌ Missing metadata"
grep -q "id:" "$AGENT_FILE" && echo "   ✅ id" || echo "   ❌ Missing id"
grep -q "persona:" "$AGENT_FILE" && echo "   ✅ persona" || echo "   ❌ Missing persona"
grep -q "menu:" "$AGENT_FILE" && echo "   ✅ menu" || echo "   ❌ Missing menu"
grep -q "prompts:" "$AGENT_FILE" && echo "   ✅ prompts" || echo "   ❌ Missing prompts"

echo "================================"
echo "Validation complete. Review results above."
```

---

## Common Validation Failures

| Issue | Check | Fix |
|-------|-------|-----|
| Syntax error | `yamllint agent.yaml` | Fix YAML format (indentation, colons) |
| Missing fields | Each required field | Add missing: metadata, persona, menu, prompts |
| Field overlap | Persona field mixing | Separate content into correct fields |
| Trigger duplicate | `grep "trigger:" agent.yaml` | Rename trigger to unique 2-letter code |
| Prompt missing | Menu action references non-existent prompt | Add prompt or update menu action |
| Path incorrect | `grep "project-root" agent.yaml` | Use `{project-root}` not absolute paths |
| Size exceed | Line count | Convert to sidecar if > 250 lines |

---

## Validation Before Deployment

**Before running `bd create` for agent:**

1. Run syntax validation
2. Check metadata completeness
3. Verify persona separation
4. Validate menu uniqueness
5. Check all prompts exist
6. Confirm size limits
7. If sidecar: verify folder exists

Once all pass → safe to compile and deploy

---

*Last updated: 2026-03-06*
*Reference: LRB agent validation guide*
