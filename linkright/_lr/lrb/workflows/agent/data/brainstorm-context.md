# Brainstorm Context — Agent Ideation Framework

Use this framework when designing a new agent for Linkright. Answer these questions to clarify purpose, scope, and design.

---

## Discovery Phase

### Problem Definition

**Q1: What problem does this agent solve?**
- Example: "Extracting metrics from unstructured work reflections is tedious and error-prone"
- Example: "Resume bullets are written generically without JD context awareness"

**Q2: Who needs this solved?**
- Linkright user? (Primary)
- Another agent? (Secondary)
- System-wide? (Infrastructure)

**Q3: What's the current state?**
- What are users doing manually now?
- How long does it take?
- What's failing?

---

### Agent Purpose

**Q4: What is this agent's primary job?**
- One sentence: "Extract and structure career signals from raw reflections"
- NOT aspirational, NOT a feature list
- Specific capability, not broad mission

**Q5: What are the agent's inputs?**
- Raw user reflection? (text)
- Parsed JD? (structured data)
- Cached signals? (database)
- User confirmation? (interaction)

**Q6: What are the agent's outputs?**
- Structured JSON? (data)
- Edited artifact? (file)
- Recommendation? (guidance)
- Confirmation/validation? (signal)

---

## Design Phase

### Persona Framing

**Q7: If this agent were a person, who would it be?**
- Background? Profession? Experience?
- Voice? Tone? Mannerisms?
- Beliefs? Principles? Philosophy?
- (Don't overthink — 2-3 attributes sufficient)

**Q8: What's this agent's specialty?**
- What makes it uniquely suited for this problem?
- What does it know that others don't?

---

### Scope & Boundaries

**Q9: What is this agent RESPONSIBLE FOR?**
- Specific functions/capabilities
- Example: "Extract metrics, classify signal type, validate schema"

**Q10: What is this agent NOT responsible for?**
- Draw clear boundaries
- Example: "NOT responsible for scoring relevance, NOT responsible for storage"

**Q11: How does this agent interact with other agents?**
- Upstream: What data comes in?
- Downstream: Who uses this agent's output?
- Example: "Receives raw reflection → outputs structured signal → sent to Linker"

---

### State & Memory

**Q12: Does this agent need to remember things across sessions?**
- NO → `hasSidecar: false` (stateless, single-file)
- YES → `hasSidecar: true` (sidecar with memories, instructions)

**Q13: If memory needed, what specifically?**
- User preferences?
- Session history?
- Personal knowledge base?
- Progress tracking?

---

### Interaction Model

**Q14: How will users interact with this agent?**
- Menu-driven? (Most common)
- Automatic trigger? (Workflow orchestration)
- Conversation-style? (Chat)
- Batch processing? (Fire and forget)

**Q15: What menu items make sense?**
- Main action (required)
- Inspection/audit? (optional)
- Configuration? (optional)
- Memory management? (if sidecar)

---

## Validation Phase

### Feasibility

**Q16: Can this agent's purpose be achieved within ~250 lines (if stateless)?**
- If NO → plan for sidecar
- If UNCLEAR → design might be too broad (split into multiple agents)

**Q17: Is the scope clear and bounded?**
- Could you explain it to someone in one sentence?
- Could you define "done" concretely?

**Q18: Are dependencies clear?**
- What data must exist before this agent runs?
- What agents must run before this one?
- What happens if upstream data is missing?

---

### Design Validation

**Q19: Do the 4 persona fields make sense?**
- role: Can you describe what it does clearly?
- identity: Can you give it credibility/context?
- communication_style: Can you describe its voice distinctly?
- principles: Can you define 5-8 operating rules?

**Q20: Are the menu items necessary and sufficient?**
- Can user do everything needed with these items?
- Are there redundant items?
- Are all items discoverable (clear hotkey + fuzzy match)?

**Q21: Is the agent name memorable and distinctive?**
- First letter unique (among Sync/Flex/Squick agents)?
- Persona-driven (not generic "Signal Parser")?
- Consistent with naming conventions?

---

## Integration Phase

### Linkright Alignment

**Q22: Which module owns this agent?**
- `sync` (outbound positioning)
- `flex` (inbound branding)
- `squick` (enterprise shipping)
- `lrb` (meta-building)

**Q23: How does this agent strengthen user signal?**
- Does it extract signal? (Sync-Parser does)
- Does it amplify signal? (Flex-Publicist does)
- Does it score signal? (Sync-Linker does)
- Does it structure signal? (Sync-Tracker does)

**Q24: Are there existing agents doing similar work?**
- If YES: Can this agent complement rather than duplicate?
- If NO: Is this a gap that needs filling?

---

## Design Anti-Patterns (Watch For)

### Too Broad
**Problem:** "Universal AI assistant that handles everything"
**Fix:** Constrain to one specific capability

### Too Narrow
**Problem:** "Validates that signal type matches taxonomy"
**Fix:** Expand to include adjacent, natural operations

### Weak Persona
**Problem:** No distinctive voice, just a generic function
**Fix:** Ground persona in Linkright philosophy + character

### Missing Boundaries
**Problem:** Unclear what agent is/isn't responsible for
**Fix:** Explicitly list "RESPONSIBLE FOR" and "NOT responsible for"

### No Clear Output
**Problem:** Agent does something but unclear what user gets
**Fix:** Define concrete output (JSON, file, recommendation, confirmation)

---

## Example: Designing Sync-Parser

### Problem
"Work reflections contain valuable metrics but are unstructured and hard to retrieve"

### Purpose
"Extract and structure career signals from raw user reflections"

### Inputs
- Raw user reflection (text): "Led payment gateway launch for 2M users in 8 weeks"

### Outputs
- Structured signal JSON with: type, ownership, metrics, stakeholders, skills

### Persona
- **Role:** Signal extraction specialist
- **Identity:** Trained in PM career positioning, experienced with signal models
- **Communication:** Direct, precise, evidence-focused
- **Principles:** Signal density > volume, metrics verified, ownership clear

### Scope
- **RESPONSIBLE FOR:** Extract type, ownership, metrics, stakeholders, skills, validate schema
- **NOT FOR:** Scoring relevance, storing to DB, user confirmation (Inquisitor does that)

### State
- `hasSidecar: false` (stateless — single reflection → single signal)

### Interaction
- Single main menu item: "Extract signal"
- Optional: validation/audit menu (show schema, check completeness)

### Output
- Structured JSON (stored separately by Tracker)
- User sees: "Signal extracted: 1 metric found (2M users), type: execution, ownership: sole"

---

## Brainstorm Template

**Use this template when designing a new agent:**

```markdown
# Agent Brainstorm: [Agent Name]

## Problem
[What problem does this solve?]

## Purpose
[One sentence: What does this agent do?]

## Inputs/Outputs
- IN: [data structure]
- OUT: [data structure]

## Persona
- Role: [capability]
- Identity: [context/credibility]
- Communication: [voice/tone]
- Principles: [3-5 core beliefs]

## Scope
**RESPONSIBLE FOR:**
- [responsibility 1]
- [responsibility 2]

**NOT responsible for:**
- [what other agents do]

## Dependencies
- Upstream: [agents that feed data to this]
- Downstream: [agents that consume this output]
- Requires: [external data/context]

## State
- hasSidecar: false | true
- Reason: [why this choice]

## Menu Items
- Main: [primary action]
- Secondary: [optional actions]

## Design Decisions
- [Key tradeoff 1]
- [Key tradeoff 2]
```

---

## Quick Validation Questions

Before coding, ask:

1. ✅ Can I explain this agent's purpose in one sentence?
2. ✅ Are inputs and outputs concrete and clear?
3. ✅ Is scope bounded (not too broad, not too narrow)?
4. ✅ Does persona feel natural (not forced)?
5. ✅ Are menu items necessary and sufficient?
6. ✅ Does it fit within size limits (~250 lines stateless)?
7. ✅ Could I audit whether agent followed its principles?
8. ✅ Would another agent benefit from this existing agent's output?

If you can confidently answer YES to 7-8 of these → ready to design

---

*Last updated: 2026-03-06*
*Reference: LRB agent brainstorm and ideation framework*
