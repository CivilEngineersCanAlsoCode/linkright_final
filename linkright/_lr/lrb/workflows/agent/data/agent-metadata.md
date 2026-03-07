# Agent Metadata

Agent metadata provides identification, context, and configuration. Every field is required.

---

## Required Metadata Fields

```yaml
agent:
  metadata:
    id: '_lr/{module}/{agent-name}/{agent-name}.md'    # Full path identifier
    name: 'Persona Name'                                # Human name
    title: 'Agent Title'                                # Role/specialty
    icon: '📦'                                          # Single emoji
    module: 'sync | flex | squick | lrb'              # Which Linkright module
    hasSidecar: false or true                          # State persistence
```

---

## Field Specifications

### id

**Purpose:** Unique identifier matching file location.

**Format:** `_lr/{module}/{agent-name}/{agent-name}.md`

**Rules:**
- MUST match actual file path
- Use kebab-case for agent-name (no underscores, no spaces)
- MUST start with `_lr/`
- Path structure: {module}/{agent-name}/{agent-name}.md

**Examples:**
```yaml
# ✅ CORRECT
id: '_lr/sync/sync-parser/sync-parser.md'
id: '_lr/sync/sync-scout/sync-scout.md'
id: '_lr/flex/flex-publicist/flex-publicist.md'
id: '_lr/lrb/signal-extractor/signal-extractor.md'

# ❌ WRONG
id: '_lr/sync/SyncParser'                    # Not full path
id: '_lr/sync/sync_parser/sync_parser.md'    # Underscores, not kebab-case
id: 'sync-parser'                            # Missing _lr/module/
id: '.sync/agents/sync-parser/sync-parser.md' # Wrong directory (.sync vs _lr)
id: '_bmad/agents/...'                       # BMAD path, not Linkright
```

**Validation:**
```bash
# id must match file location
File: _lr/sync/sync-parser/sync-parser.md
id: '_lr/sync/sync-parser/sync-parser.md'  ✅
```

---

### name

**Purpose:** Agent's persona name — how it introduces itself.

**Format:** Title-cased persona name (2-4 words)

**Rules:**
- Human-readable, unique across Linkright
- First letter of each word capitalized
- Can include special characters for personality (e.g., "Inkwell Von Comitizen")
- NOT a title or job description

**Examples:**
```yaml
# ✅ CORRECT (persona names)
name: 'Sync-Parser'
name: 'Scout The Explorer'
name: 'Inquisitor Deepfield'
name: 'The Sizer'

# ❌ WRONG
name: 'sync-parser'               # Must be title-cased
name: 'Sync Parser'               # First letter caps for each word
name: 'Signal Extraction Agent'   # Too long, sounds like title
name: 'parser'                    # Lowercase
```

---

### title

**Purpose:** Agent's role or specialty — what it does.

**Format:** 2-4 word title describing specialization

**Rules:**
- Professional tone
- Describes capability or specialty
- NOT a persona name (that's `name`)
- Title-cased (first letter of each word)

**Examples:**
```yaml
# ✅ CORRECT (roles/specialties)
title: 'Signal Extraction Agent'
title: 'Resume Optimizer'
title: 'JD Parser'
title: 'Social Media Ghostwriter'
title: 'Application Tracker'

# ❌ WRONG
title: 'Satvik'                    # That's a name, not a role
title: 'signal extraction agent'   # Not title-cased
title: 'I extract signals'         # Not a title format
```

---

### icon

**Purpose:** Visual identifier for agent.

**Format:** Exactly one Unicode emoji

**Rules:**
- Exactly 1 emoji (not 2, not 3)
- Relevant to agent's role
- Consistent visual taxonomy
- No emoji sequences, skin tone modifiers, or special variants

**Examples:**
```yaml
# ✅ CORRECT
icon: '📦'   # Parsing/organizing
icon: '🔍'   # Searching/analyzing
icon: '📝'   # Writing/editing
icon: '📊'   # Data/metrics
icon: '🎯'   # Targeting/matching
icon: '🚀'   # Launching/deployment
icon: '💾'   # Storage/tracking
icon: '⚙️'   # Configuration

# ❌ WRONG
icon: '📦📝' # Two emojis
icon: '👨‍💼'  # Emoji sequence (multiple Unicode code points)
icon: '👩🏻'  # Skin tone modifier
icon: 'parsing' # Text, not emoji
```

**Visual Taxonomy (Recommended):**

| Category | Emoji | Use For |
|----------|-------|---------|
| Input | 📝 📥 | Signal capture, ingestion |
| Analysis | 🔍 📊 🎯 | Parsing, scoring, matching |
| Output | 📤 🚀 | Resume generation, publishing |
| Storage | 💾 📦 | Tracking, persistence |
| Config | ⚙️ 🔧 | Settings, administration |
| Meta | ❓ ℹ️ | Help, information |

---

### module

**Purpose:** Identifies which Linkright module owns this agent.

**Format:** Enum — exactly one of: `sync | flex | squick | lrb`

**Rules:**
- MUST be valid Linkright module
- Case-sensitive (lowercase)
- NO other values
- Determines agent's resource access and context

**Module Reference:**

| Module | Purpose | Agent Examples |
|--------|---------|-----------------|
| `sync` | Outbound career positioning | Parser, Scout, Refiner, Sizer, Styler, Tracker |
| `flex` | Inbound brand building | Publicist, Analyzer, Scheduler |
| `squick` | Enterprise rapid shipping | Architect, Engineer, Validator |
| `lrb` | Meta-builder (builds agents) | Agent-crafter, Module-architect |

**Examples:**
```yaml
# ✅ CORRECT
module: 'sync'
module: 'flex'
module: 'squick'
module: 'lrb'

# ❌ WRONG
module: 'Sync'              # Must be lowercase
module: 'sync-module'       # Module name only, no suffixes
module: 'bmad'              # BMAD is not Linkright
module: 'core'              # Not valid module name
```

---

### hasSidecar

**Purpose:** Boolean flag indicating if agent has persistent memory across sessions.

**Format:** Boolean (lowercase)

**Rules:**
- Exactly `false` or `true` (lowercase)
- `false` = stateless, single file, ~250 lines max
- `true` = persistent memory, sidecar folder required, critical_actions MANDATORY

**Decision Logic:**

```yaml
# hasSidecar: false (Stateless Agent)
hasSidecar: false
# Use when:
# - Single-purpose utility
# - No memory needed across sessions
# - Fits under 250 lines
# - Independent interactions
# - Personality-driven value

# hasSidecar: true (Memory Agent)
hasSidecar: true
# Use when:
# - Memory across sessions required
# - User preferences to track
# - Personal knowledge base
# - Domain-specific with restricted access
# - Progress tracking / history
# - Complex workflows
```

**Examples:**
```yaml
# ✅ CORRECT
hasSidecar: false          # Stateless agent
hasSidecar: true           # Agent with memory

# ❌ WRONG
hasSidecar: False          # Capital F (must be lowercase)
hasSidecar: 'true'         # String, not boolean
hasSidecar: yes            # YAML yes, not boolean true
hasSidecar: 1              # Number, not boolean
```

**Implication:**
- If `hasSidecar: true`:
  - `critical_actions` is MANDATORY
  - Sidecar folder must exist: `_lr/_memory/{agent-name}-sidecar/`
  - Sidecar must contain: `memories.md`, `instructions.md`
  - critical_actions must include all 3 required statements

- If `hasSidecar: false`:
  - `critical_actions` is optional
  - No sidecar folder required
  - Agent size ≤ 250 lines
  - All state within YAML

---

## Complete Metadata Examples

### Example 1: Stateless Signal Extractor
```yaml
agent:
  metadata:
    id: '_lr/sync/sync-parser/sync-parser.md'
    name: 'Sync-Parser'
    title: 'Signal Extraction Agent'
    icon: '📦'
    module: 'sync'
    hasSidecar: false
```

### Example 2: Memory-Enabled Inquisitor
```yaml
agent:
  metadata:
    id: '_lr/sync/sync-inquisitor/sync-inquisitor.md'
    name: 'The Inquisitor'
    title: 'Gap-Fill Interviewer'
    icon: '❓'
    module: 'sync'
    hasSidecar: true

  critical_actions:
    - 'Load COMPLETE file {project-root}/_lr/_memory/sync-inquisitor-sidecar/memories.md'
    - 'Load COMPLETE file {project-root}/_lr/_memory/sync-inquisitor-sidecar/instructions.md'
    - 'ONLY read/write files in {project-root}/_lr/_memory/sync-inquisitor-sidecar/'
```

### Example 3: LRB Agent Builder
```yaml
agent:
  metadata:
    id: '_lr/lrb/agent-crafter/agent-crafter.md'
    name: 'Agent Crafter'
    title: 'LRB Agent Builder'
    icon: '🔨'
    module: 'lrb'
    hasSidecar: true

  critical_actions:
    - 'Load COMPLETE file {project-root}/_lr/_memory/agent-crafter-sidecar/memories.md'
    - 'Load COMPLETE file {project-root}/_lr/_memory/agent-crafter-sidecar/instructions.md'
    - 'ONLY read/write files in {project-root}/_lr/_memory/agent-crafter-sidecar/'
```

---

## Metadata Validation Checklist

- [ ] `id` matches actual file path exactly
- [ ] `id` uses kebab-case for agent-name
- [ ] `id` starts with `_lr/`
- [ ] `name` is unique across Linkright
- [ ] `name` is title-cased (first letter of each word)
- [ ] `title` describes role/specialty, not a persona name
- [ ] `title` is title-cased
- [ ] `icon` is exactly one emoji
- [ ] `icon` is relevant to role
- [ ] `module` is one of: sync, flex, squick, lrb
- [ ] `module` is lowercase
- [ ] `hasSidecar` is `true` or `false` (lowercase boolean)
- [ ] If `hasSidecar: true`:
  - [ ] `critical_actions` is present
  - [ ] `critical_actions` has all 3 required statements
  - [ ] Sidecar folder exists at correct path
  - [ ] `memories.md` exists in sidecar
  - [ ] `instructions.md` exists in sidecar

---

## Metadata in Agent Discovery

When users list agents, metadata is used:

```
Linkright Agents
  [📦] Sync-Parser          Signal Extraction Agent       (sync)
  [🔍] Scout The Explorer   Company Intelligence          (sync)
  [📝] The Refiner          Resume Bullet Sculptor        (sync)
  [❓] The Inquisitor       Gap-Fill Interviewer          (sync)
  [🚀] The Styler           Resume HTML Compiler          (sync)
  [💾] Sync-Tracker         Application Ledger Keeper     (sync)
  [🎯] Linker               Signal Matcher                (sync)
```

The display uses: `[icon] name` and `title` from metadata.

---

## Metadata Update Rules

**When safe to change:**
- ✅ `name` (persona name) — purely cosmetic
- ✅ `title` (role description) — purely cosmetic
- ✅ `icon` — purely cosmetic

**When NOT safe to change (breaking):**
- ❌ `id` — breaks file references
- ❌ `module` — breaks resource access
- ❌ `hasSidecar` — changes architecture

If you need to change `id`, `module`, or `hasSidecar`:
1. Create new agent with updated metadata
2. Migrate data (if sidecar)
3. Deprecate old agent (mark as archived)
4. Do NOT modify in place

---

*Last updated: 2026-03-06*
*Reference: LRB agent metadata specification*
