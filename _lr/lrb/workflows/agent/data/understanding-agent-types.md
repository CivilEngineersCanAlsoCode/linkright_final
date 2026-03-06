# Understanding Agent Types

All Linkright agents use the same structure with a `hasSidecar` boolean.
The difference lies only in state management, not capability.

---

## Decision Tree

```
Is this a single agent with one clear purpose?
├── NO → Use LRB Module Builder (creates multiple agents within module)
└── YES → Single Agent
    └── Does agent need memory across sessions?
        ├── YES → hasSidecar: true
        └── NO → hasSidecar: false
```

**Key principle:** All agents have equal capability. The only difference is whether they maintain state.

---

## Without Sidecar (hasSidecar: false)

**Single file, stateless, approximately 250 lines max.**

### Structure
```
agent-name.agent.yaml                          (~200-250 lines)
```

### Characteristics
- Single YAML file (no sidecar folder)
- Stateless — each session is independent
- No persistent memory across invocations
- All logic, prompts, menu fit within file
- Fast and lightweight

### Use When
- Single-purpose utility
- Each session independent (no memory needed)
- Fits comfortably within 250 lines
- Menu-driven interaction (prompts in YAML)
- Personality-driven value

### Examples
- **Sync-Parser:** Extracts signal from single reflection
- **Sync-Scout:** Researches company context (no memory needed)
- **Sync-Sizer:** Validates layout constraints
- **Sync-Styler:** Applies template and colors
- **Flex-Analyzer:** Analyzes viral insights from post

### Constraints
- Under 250 lines total
- No sidecar folder needed
- No cross-session memory
- Prompts inline in YAML

### Validation Checklist
- [ ] One clear, focused purpose
- [ ] No cross-session memory required
- [ ] Fits under 250 lines
- [ ] Menu items don't exceed 15
- [ ] Independent interactions (no session context needed)

---

## With Sidecar (hasSidecar: true)

**Persistent memory, knowledge, and workflows**

### Structure
```
agent-name.agent.yaml                          (~100-150 lines)
└── agent-name-sidecar/
    ├── memories.md                            (user profile, history)
    ├── instructions.md                        (protocols, boundaries)
    ├── [custom-files].md                      (optional: tracking, goals)
    ├── workflows/                             (optional: complex workflows)
    └── knowledge/                             (optional: domain reference)
```

### Characteristics
- YAML + sidecar folder structure
- Persistent memory across sessions
- User preferences tracked
- Can reference external knowledge
- Complex workflows split into sidecar files
- File access restricted to sidecar folder

### Use When
- Memory across sessions required
- User preferences or settings to track
- Personal knowledge base growing over time
- Domain-specific expertise with restricted access
- Progress tracking / history important
- Complex multi-step workflows (>100 lines in prompts)

### Examples
- **Sync-Inquisitor:** Remembers signal library, user responses, follow-ups
- **Sync-Tracker:** Maintains application ledger, user pipeline status
- **Sync-Refiner:** Tracks user writing preferences, style choices
- **Flex-Publicist:** Remembers brand voice, content calendar, scheduling
- **Journal Companion:** Personal reflection tracking (hypothetical)

### Sidecar Structure

#### memories.md
```markdown
# User Profile
- Name: [user name]
- PM Persona: [tech | growth | strategy | product]
- Career Stage: [early | mid | senior]
- Signal Library Index: [cached links to indexed signals]
- Preferences: [configured settings]

# Session History
- Last signal extracted: [signal-id]
- Current JD optimization: [jd-id]
- Pending follow-ups: [list]
```

#### instructions.md
```markdown
# Operating Boundaries
- Scope: [what agent owns vs. doesn't own]
- Rules: [non-negotiable constraints]
- Escalation: [when to ask user, when to proceed autonomously]

# Data Integrity
- What can be modified: [boundaries]
- What is read-only: [protected data]
- Audit trail: [how changes are logged]
```

#### Custom Files (Optional)
- `signal-tracking.md` — signal indexing progress
- `optimization-cache.md` — cached JD optimizations
- `style-profile.md` — user writing preferences
- `brand-voice.md` — user's communication style guidelines

#### workflows/ (Optional)
Large multi-step workflows that don't fit in YAML prompts.
- `deep-research.md` — detailed research protocol
- `audit-checklist.md` — comprehensive validation

#### knowledge/ (Optional)
Reference material, taxonomy, frameworks.
- `signal-taxonomy.md` — signal classification rules
- `pm-archetypes.md` — PM persona definitions
- `ats-keywords.md` — ATS keyword reference

### Constraints
- YAML ≤ 150 lines (main logic)
- Sidecar folder required
- `critical_actions` MANDATORY (all 3 statements)
- All paths use `{project-root}/_lr/_memory/{sidecar}/`
- File access restricted to sidecar only

### Validation Checklist
- [ ] Memory needed across sessions (confirmed)
- [ ] Sidecar folder exists with required files
- [ ] memories.md populated with user profile structure
- [ ] instructions.md documents boundaries and rules
- [ ] critical_actions has all 3 required statements
- [ ] Paths match `{project-root}/_lr/_memory/{sidecar}/` pattern
- [ ] File access restricted to sidecar folder
- [ ] Optional folders (workflows/, knowledge/) organized

---

## Comparison Matrix

| Aspect | Without Sidecar | With Sidecar |
|--------|-----------------|--------------|
| **Structure** | Single YAML file | YAML + sidecar/ |
| **Persistent memory** | No | Yes |
| **User history** | Not tracked | Tracked in memories.md |
| **Cross-session context** | None | Full context available |
| **File access** | Project-wide | Restricted to sidecar/ |
| **critical_actions** | Optional | MANDATORY |
| **Size limit** | ~250 lines YAML | ~150 lines YAML, unlimited sidecar |
| **Complexity** | Simple tasks | Complex workflows |
| **Setup time** | ~30 minutes | ~1-2 hours (includes sidecar setup) |
| **Maintenance** | Minimal | Requires memory management |

---

## Selection Decision Guide

### Choose WITHOUT Sidecar if:
- ✅ Agent does ONE specific thing (extract, parse, score, format)
- ✅ No need to remember user preferences
- ✅ No cross-session context required
- ✅ Each invocation is independent
- ✅ All logic fits in ~250 lines
- ✅ User interaction is menu-driven (hotkeys + fuzzy)
- ✅ Output is immediate (not deferred/tracked)

**Readiness indicator:**
- Agent purpose is one sentence
- Can explain "done" concretely
- No mention of "remember", "track", "history", "preferences"

### Choose WITH Sidecar if:
- ✅ Agent maintains state across sessions
- ✅ Must remember user preferences or settings
- ✅ Personal knowledge base that grows
- ✅ Complex workflows > 100 lines in prompts
- ✅ Progress tracking or history important
- ✅ Restricted file access (agent shouldn't touch project root)
- ✅ Multi-step reasoning (workflows/, custom files)
- ✅ Long-term relationship with user (coaching, mentoring, tracking)

**Readiness indicator:**
- "Agent remembers...", "Tracks...", "Learns...", "Evolves..."
- Complex workflows split across multiple steps
- User-specific customization needed

### Escalate to Module Builder if:
- Multiple distinct agents working together
- Shared workflows across agents
- Complex permission model (multiple users)
- Many specialized sub-agents (>5)
- Agents need to coordinate state

**Example:**
Not "one giant agent", but rather a module with:
- **Sync-Parser** (extract signals)
- **Sync-Inquisitor** (fill gaps)
- **Sync-Linker** (match to JDs)
- **Sync-Refiner** (write bullets)
- **Sync-Sizer** (layout validate)

---

## Common Mistakes

### Mistake 1: Choosing Sidecar Too Early
**Wrong:** "I might need memory someday"
**Right:** Choose sidecar only when memory IS required now

**Cost of being wrong:**
- Extra complexity (memories.md, instructions.md)
- Sidecar folder management overhead
- File access restrictions (harder to debug)

### Mistake 2: Choosing Stateless When Memory Needed
**Wrong:** Forcing complex workflows into 250-line YAML
**Right:** Use sidecar if memory or complex workflows needed

**Cost of being wrong:**
- Can't track user state
- Can't remember preferences
- Workflows become unmaintainable

### Mistake 3: One Gigantic Agent
**Wrong:** "I'll put all PM signal work in one agent"
**Right:** Split by responsibility (Parser extracts, Inquisitor deepens, Linker matches)

**Cost of being wrong:**
- Impossible to test independently
- Hard to reuse capabilities
- Performance issues
- Violates single responsibility principle

### Mistake 4: Forgetting critical_actions for Sidecar
**Wrong:** hasSidecar: true without critical_actions
**Right:** All 3 required statements in critical_actions

**Cost of being wrong:**
- Agent initialization fails
- Memories not loaded
- File access not restricted

---

## Migration Path

If you choose wrong:

**From Stateless to Sidecar:**
1. Create sidecar folder: `_lr/_memory/{agent-name}-sidecar/`
2. Move complex workflows to `sidecar/workflows/`
3. Create `memories.md` template
4. Create `instructions.md` with boundaries
5. Add critical_actions (all 3 required statements)
6. Update agent YAML: `hasSidecar: true`
7. Test file access restriction

**From Sidecar to Stateless:**
1. Ensure no cross-session state needed
2. Move everything to YAML (compress if needed)
3. Delete sidecar folder
4. Remove critical_actions (or make optional)
5. Update agent YAML: `hasSidecar: false`
6. Test as independent invocations

**Avoid:** Direct migration for production agents. Create new agent version, deprecate old.

---

## Quick Tips

- **Unsure?** Ask: "Does this agent need to remember things?" YES → sidecar, NO → stateless
- **Multiple personas?** Not one big agent, use Module Builder
- **Complex workflows?** Put complex logic in sidecar/workflows/, keep YAML clean
- **User-specific data?** Goes in memories.md, not scattered in YAML
- **Reference knowledge?** Goes in sidecar/knowledge/, not in prompts
- **Simple utility?** Usually stateless (fast, lightweight)
- **Long-term relationship?** Usually sidecar (remembers, evolves, tracks)

---

## Real-World Examples

### Sync-Parser (Stateless)
- **Purpose:** Extract metrics from raw reflection
- **Input:** One reflection text
- **Output:** Structured signal JSON
- **Memory needed:** No
- **Result:** hasSidecar: false ✅

### Sync-Inquisitor (Sidecar)
- **Purpose:** Interview user to fill gaps in signals
- **Input:** Incomplete signal + user responses
- **Output:** Deepened signal with filled metrics
- **Memory needed:** YES (track what's been asked, user's previous answers)
- **Result:** hasSidecar: true ✅

### Sync-Tracker (Sidecar)
- **Purpose:** Track applications, outcomes, pipeline metrics
- **Input:** New application record + status updates
- **Output:** Application ledger + metrics dashboard
- **Memory needed:** YES (application history, status state machine)
- **Result:** hasSidecar: true ✅

### Flex-Publicist (Sidecar)
- **Purpose:** Generate social media content based on signals
- **Input:** Work reflection → turn into post
- **Output:** Scheduled posts, archived content
- **Memory needed:** YES (brand voice, content calendar, scheduling)
- **Result:** hasSidecar: true ✅

---

## Testing Your Choice

Before committing, test:

**For stateless agents:**
```bash
# Test independence
1. Invoke agent with input A → output A1
2. Invoke same agent with same input A → should output A1 identically
3. No state persisted between invocations
```

**For sidecar agents:**
```bash
# Test memory
1. Invoke with input A → output A1, store in memories.md
2. Invoke with input B → output B1, references A1 from step 1
3. Memories persist across sessions
4. File access restricted to sidecar/
```

---

*Last updated: 2026-03-06*
*Reference: LRB agent type decision framework (adapted from bmad/_bmad/bmb/workflows/agent/data/understanding-agent-types.md)*
