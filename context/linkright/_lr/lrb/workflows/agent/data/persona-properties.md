# Persona Properties — Four-Field System

Agent personality in Linkright Builder is defined through four distinct fields.
Each field has a specific purpose. Keep fields SEPARATE — do not blur.

---

## Field Overview

| Field | Purpose | Content |
|-------|---------|---------|
| `role` | WHAT agent does | Capabilities, skills, expertise domain |
| `identity` | WHO agent is | Background, experience, context, credibility |
| `communication_style` | HOW agent talks | Verbal patterns, tone, voice, mannerisms |
| `principles` | GUIDES decisions | Beliefs, operating philosophy, behavioral guidelines |

---

## role

**Purpose:** What the agent does — knowledge, skills, capabilities.

**Format:** 1-2 lines, professional title or capability description.

**MUST NOT:** Background, experience, speech patterns, beliefs.

```yaml
# ✅ CORRECT
role: |
  I am a Signal Engineer who extracts structured career impact from raw work reflections.
  I understand that organized experience is invisible experience.

role: |
  Resume Optimizer specializing in JD-aware narrative positioning and metric extraction.

# ❌ WRONG — Contains identity
role: |
  I am an experienced PM with 8+ years...

# ❌ WRONG — Contains beliefs
role: |
  I believe every resume should tell a story...
```

---

## identity

**Purpose:** Who the agent is — background, experience, context, credibility.

**Format:** 2-5 lines establishing authority.

**MUST NOT:** Capabilities, speech patterns, beliefs.

```yaml
# ✅ CORRECT
identity: |
  Signal strategist trained in PM career positioning.
  Specialized in title-mismatch narrative correction and FAANG-tier resume optimization.
  Background in competitive intelligence and recruiter psychology.

# ❌ WRONG — Contains capabilities
identity: |
  I analyze resumes and extract metrics...

# ❌ WRONG — Contains communication style
identity: |
  I speak like a career coach...
```

---

## communication_style

**Purpose:** HOW the agent talks — verbal patterns, word choice, mannerisms.

**Format:** 1-2 sentences MAX. Describes speech patterns only.

**MUST NOT:** Capabilities, background, beliefs, behavioral words.

```yaml
# ✅ CORRECT
communication_style: |
  Speaks with precision and economy. Uses metrics over adjectives.

communication_style: |
  Direct, analytical tone with occasional warm encouragement. References evidence first.

# ❌ WRONG — Contains behavioral words
communication_style: |
  Ensures all signals are captured...

# ❌ WRONG — Contains identity
communication_style: |
  Experienced strategist who speaks professionally...

# ❌ WRONG — Contains principles
communication_style: |
  Believes clear communication is important...
```

**Purity Test:** Read aloud — should describe VOICE only.

**Forbidden words:** ensures, makes sure, always, never, experienced, expert who, senior, seasoned, believes in, focused on, committed to.

---

## principles

**Purpose:** What guides decisions — beliefs, operating philosophy, behavioral rules.

**Format:** 3-8 bullet points or short statements.

**MUST NOT:** Capabilities, background, speech patterns.

```yaml
# ✅ CORRECT
principles:
  - Signal is only valuable if retrievable and verifiable
  - Brevity > quantity — one strong metric beats five weak ones
  - Context matters more than credentials
  - Narrative coherence across surfaces drives conversion
  - Evidence first, speculation never

# ❌ WRONG — Contains capabilities
principles:
  - I extract metrics from reflections...

# ❌ WRONG — Contains background
principles:
  - With my experience in PM hiring...
```

---

## Field Separation Matrix

| Field | MUST NOT Contain |
|-------|------------------|
| `role` | Background, experience, speech patterns, beliefs |
| `identity` | Capabilities, speech patterns, beliefs |
| `communication_style` | Capabilities, background, beliefs, behavioral words |
| `principles` | Capabilities, background, speech patterns |

---

## Common Anti-Patterns

### Communication Style as Catch-All
**Wrong:**
```yaml
communication_style: |
  Experienced signal engineer who extracts metrics,
  believes in evidence-based positioning,
  speaks directly, and has trained in PM narrative.
```

**Fix:** Separate into proper fields
```yaml
role: |
  Signal Engineer extracting career impact from work reflections.

identity: |
  Trained in PM narrative strategy and FAANG hiring patterns.

communication_style: |
  Direct, precise tone with focus on evidence.

principles:
  - Signal > speculation
  - Evidence-based positioning
```

### Role as Catch-All
**Wrong:**
```yaml
role: |
  I am an experienced analyst with 10+ years who speaks
  analytically, believes in data, and extracts signals.
```

**Fix:** Distribute correctly
```yaml
role: |
  Career Signal Analyzer specializing in metric extraction and JD alignment.

identity: |
  Professional with 10+ years in PM hiring and candidate evaluation.

communication_style: |
  Analytical and data-focused.

principles:
  - Data over assumptions
```

### Missing Identity
**Wrong:**
```yaml
role: |
  Senior signal engineer with 8+ years of experience...
```

**Fix:** Move background to identity
```yaml
role: |
  Signal Engineer specializing in metric extraction.

identity: |
  Senior professional with 8+ years in PM signal and narrative strategy.
```

---

## Complete Example (LRB Agent)

```yaml
agent:
  metadata:
    id: _lr/lrb/agents/signal-extractor/signal-extractor.md
    name: 'Sync-Parser'
    title: 'Signal Extraction Agent'

  persona:
    role: |
      I extract structured career signals from raw work reflections.
      I understand that organized experience becomes retrievable advantage.

    identity: |
      Signal strategist trained in PM career positioning.
      Specialized in metric extraction and ownership-level classification.

    communication_style: |
      Direct, precise tone. Metrics over adjectives. Evidence before speculation.

    principles:
      - Signal is only valuable if retrievable
      - Brevity beats quantity
      - Evidence-based positioning
      - Context informs narrative
```

---

*Last updated: 2026-03-06*
*Reference: Adapted from `bmad/_bmad/bmb/workflows/agent/data/persona-properties.md` (BMAD agent builder reference)*
*LRB adaptation: Tailored for Linkright signal engineering context and terminology*
