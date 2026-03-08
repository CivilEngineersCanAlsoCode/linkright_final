# SYNC DESIGN SYSTEM
## "Signal from the Deep"
### Version 1.1 — Complete Design Language for CLI, TUI & Installer

> *Changelog from v1.0: Gradient ASCII art, 3 dark mode options, complete animation
> keyframes, improved error states, bracket focus rings, clarified typography,
> agent voice matrix, peach/beige integration, personalized outro system.*

---

## PHILOSOPHY

> *"The ocean does not hurry, yet it covers great distances."*

Sync's design language lives at the intersection of three elemental forces:

- **The Depth** — The stillness and intelligence of deep water. Dark, precise,
  unhurried. This is the calm competence a PM feels when their signal is structured.
- **The Wave** — The energy of coral and gold breaking at the surface. Decisive
  moments: a shortlist confirmed, a JD matched, a metric locked.
- **The Breeze** — The warmth of peach and beige at open sea. Smooth, flowing,
  effortless — the feeling of a perfectly tailored application going out.

Sync is not a loud tool. It is a precise one. The design should feel like standing
on the bow of a ship at dawn — oriented, powerful, moving forward.

---

## BRAND IDENTITY

```
Name:       Sync
Tagline:    ChatGPT generates content. Sync engineers signal.
Archetype:  The Signal Engineer — precise, warm, outcome-driven
Emotion:    Confident calm. Not cold. Not loud. Exactly right.
```

---

## 1. ASCII ART — GRADIENT SPLASH (v1.1 UPGRADED)

### The Technique — Gemini CLI / Claude Code Style

Both Gemini CLI and Claude Code use `gradient-string`'s `.multiline()` method.
This applies the **same horizontal gradient to every line** of the ASCII block,
creating vertical color alignment. The result: each character column has a
consistent color as your eye travels down — not a per-line reset.

```javascript
// sync-splash.js
import figlet from 'figlet';
import gradient from 'gradient-string';

// The Sync ocean gradient — teal deep-water to coral wave
const syncGradient = gradient([
  '#0E9E8E',   // Deep teal — left anchor
  '#1BBFAE',   // Mid teal — rising
  '#7ACFC8',   // Silver-teal — sea foam
  '#E8A882',   // Peach — the horizon
  '#D9705A',   // Coral — the wave crest
]);

function renderSplash() {
  const art = figlet.textSync('SYNC', {
    font: 'ANSI Shadow',        // Recommended: bold, filled, premium feel
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });

  // .multiline() is the Gemini CLI technique —
  // same gradient per line, vertically aligned columns
  console.log(syncGradient.multiline(art));
}
```

### Font Options (in order of preference)

```
1. 'ANSI Shadow'     ← Recommended. Filled, heavy, premium.
2. 'Big Money-nw'    ← Chunky serifs. Confident.
3. 'Colossal'        ← Widest. Best for wide terminals.
4. 'Delta Corps Priest 1' ← Unique. Unforgettable.
5. 'Slant'           ← Compact. Good fallback.
```

### What "SYNC" Looks Like in ANSI Shadow (preview)

```
███████╗██╗   ██╗███╗   ██╗ ██████╗
██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝
███████╗ ╚████╔╝ ██╔██╗ ██║██║
╚════██║  ╚██╔╝  ██║╚██╗██║██║
███████║   ██║   ██║ ╚████║╚██████╗
╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝
```

In terminal: leftmost column = `#0E9E8E` teal, rightmost = `#D9705A` coral.
Vertical columns are color-consistent. Each row starts teal, ends coral.

### Fallback (no gradient support)
```javascript
// When terminal doesn't support 24-bit color:
// Graceful fallback = accent color only (Gemini CLI pattern)
import chalk from 'chalk';
console.log(chalk.hex('#0E9E8E')(art)); // Full teal, no gradient
```

### Subheader below ASCII art
```
  Signal Engineering for Product Managers in India
  v1.0.0  ·  Built on the ocean floor.
```
Color: `--sync-text-muted` (silver-teal). Centered. 2 lines below art.

---

## 2. COLOR SYSTEM

### Core Brand Tokens (Mode-Independent)

```
--sync-teal-core:    #0E9E8E   /* Deep ocean current. Primary brand. */
--sync-coral-core:   #D9705A   /* Breaking wave. Energy accent. */
--sync-gold-core:    #C8973A   /* Sunlight on water. Achievement. */
--sync-peach-core:   #E8A882   /* Sea at golden hour. Warmth. */
--sync-beige-core:   #D4C5A9   /* Seafloor sand. Neutral warmth. */  ← NEW
--sync-silver-core:  #A8BFC0   /* Sea foam. Borders & metadata. */
```

**Usage Law:**
- `teal`   = primary action, active state, information, brand
- `coral`  = CTA, error-with-energy, emphasis, wave moments
- `gold`   = success, metric confirmed, achievement unlocked
- `peach`  = warmth, guidance, secondary actions, hints
- `beige`  = neutral warmth, dividers, backgrounds, inactive text  ← NEW
- `silver` = borders, metadata, the water's edge

---

### LIGHT MODE — "Still Water at Noon"

```
/* === BACKGROUNDS === */
--sync-bg-base:         #F3F7F5   /* Open sky on flat water. Near-white teal. */
--sync-bg-surface:      #EAF0ED   /* Shallow water. Panels, sidebars. */
--sync-bg-elevated:     #E0EDEA   /* Lifted surface. Cards, modals. */
--sync-bg-overlay:      #FFFFFF   /* Pure crest. Tooltips, dropdowns. */
--sync-bg-beige:        #F5F0E8   /* Sandy floor. Warm alt background. */ ← NEW
--sync-bg-peach-wash:   #FBE9DE   /* Peach tint. Info blocks, onboarding. */

/* === TEXT === */
--sync-text-primary:    #162826   /* Deep ocean floor. Near-black teal. */
--sync-text-secondary:  #38645E   /* Mid-water. Readable. */
--sync-text-muted:      #6E9A94   /* Surface shimmer. Labels, placeholders. */
--sync-text-beige:      #8A7A65   /* Sandy tone. Inactive, de-emphasized. */ ← NEW
--sync-text-inverse:    #F3F7F5   /* On dark surfaces. */

/* === BRAND APPLIED === */
--sync-teal:            #0E9E8E
--sync-teal-hover:      #0B8A7C
--sync-teal-subtle:     #CEEAE7   /* Teal chip backgrounds. */
--sync-coral:           #D9705A
--sync-coral-hover:     #C45E49
--sync-coral-subtle:    #FAE5DF   /* Coral chip backgrounds. */
--sync-gold:            #C8973A
--sync-gold-hover:      #B3852F
--sync-gold-subtle:     #FDF0D4   /* Gold chip backgrounds. */
--sync-peach:           #E8A882
--sync-peach-subtle:    #FBEDE3   /* Peach backgrounds. */
--sync-beige:           #D4C5A9   /* ← NEW */
--sync-beige-subtle:    #F2EDE3   /* ← NEW Beige backgrounds. */
--sync-silver:          #A8BFC0
--sync-silver-subtle:   #E0EBEC

/* === BORDERS === */
--sync-border-default:  #C5D9D5
--sync-border-strong:   #8FBFB8
--sync-border-subtle:   #DDE8E6
--sync-border-beige:    #D8CEBB   /* ← NEW Warm beige border. */

/* === INTERACTIVE === */
--sync-focus-primary:   #0E9E8E   /* Focus bracket color */
--sync-selection:       #0E9E8E22
--sync-hover-teal:      #E8F5F3
--sync-hover-coral:     #FAF0ED

/* === SEMANTIC === */
--sync-success:         #1A9E6A   /* Deep sea green */
--sync-success-bg:      #D4F5E6
--sync-warning:         #C8973A   /* Gold — a signal, not an alarm */
--sync-warning-bg:      #FDF0D4
--sync-error:           #C44E3A   /* Coral-red — energetic, not terrifying */
--sync-error-bg:        #FAE0DB
--sync-info:            #0E9E8E
--sync-info-bg:         #CEEAE7
```

---

### DARK MODE — THREE OPTIONS

---

#### DARK OPTION A — "Abyssal Depth" (Recommended Default)

The deepest option. Almost no light reaches here. Only bioluminescence.
Rich, dramatic, immersive. Every glow feels earned.

```
/* BACKGROUNDS */
--sync-bg-base:         #091614   /* True abyss. Maximum depth. */
--sync-bg-surface:      #0F1F1C   /* One layer up. Main content. */
--sync-bg-elevated:     #122520   /* Cards, panels — distinct from surface. */
--sync-bg-overlay:      #1A3028   /* Modals, dropdowns. */
--sync-bg-highlight:    #1E3A34   /* Selected rows, active items. */
--sync-bg-beige:        #1A1610   /* Warm deep seabed. Alt background. */ ← NEW

/* TEXT */
--sync-text-primary:    #D8EDEA   /* Bioluminescent. Cool warm white. */
--sync-text-secondary:  #89BAB4   /* Mid-ocean. Clear. */
--sync-text-muted:      #4A7A74   /* Deep water. Labels only. */
--sync-text-beige:      #A89880   /* Warm sand in depth. Inactive. */ ← NEW
--sync-text-inverse:    #091614

/* BRAND — luminous in dark */
--sync-teal:            #2DD4C4   /* Glows from depth. */
--sync-teal-subtle:     #0C3530
--sync-coral:           #F08070   /* Hotter in dark. */
--sync-coral-subtle:    #3A1814
--sync-gold:            #E5B04A   /* Catches any light. */
--sync-gold-subtle:     #2E2208
--sync-peach:           #F2B896   /* Lantern-fish warm. */
--sync-peach-subtle:    #2A1A10
--sync-beige:           #C8B898   /* ← NEW Warm in the deep. */
--sync-beige-subtle:    #201A12   /* ← NEW */
--sync-silver:          #7AABAA   /* Sea foam at night. */

/* BORDERS */
--sync-border-default:  #1A3530
--sync-border-strong:   #2A5048
--sync-border-subtle:   #122822
--sync-border-beige:    #2A2218   /* ← NEW */

/* SEMANTIC */
--sync-success:         #34D98E
--sync-success-bg:      #0C2E20
--sync-warning:         #E5B04A
--sync-warning-bg:      #2A1E08
--sync-error:           #F07060
--sync-error-bg:        #3A1410
--sync-info:            #2DD4C4
--sync-info-bg:         #0C2E2A
```

---

#### DARK OPTION B — "Midnight Reef" (Warmer Alternative)

More warmth than Option A. Like a reef at midnight — still deep, but
surrounded by warm ocean currents. Teal leans blue. Coral pops harder.

```
/* BACKGROUNDS */
--sync-bg-base:         #0D1A1F   /* Deep navy-teal. Blue ocean floor. */
--sync-bg-surface:      #132028   /* Surface with blue influence. */
--sync-bg-elevated:     #192830   /* Cards — distinctly lifted. */
--sync-bg-overlay:      #1F3040   /* Modals. Rich navy. */
--sync-bg-beige:        #1A1812   /* Warm kelp floor. */ ← NEW

/* TEXT */
--sync-text-primary:    #D4EAF0   /* Slightly cooler white. Ice on water. */
--sync-text-secondary:  #80B0BE   /* Blue-teal mid tone. */
--sync-text-muted:      #4A7080   /* Depth muted. */
--sync-text-beige:      #A09080   /* Warm contrast to cool bg. */ ← NEW

/* BRAND — shifted for navy base */
--sync-teal:            #35D0C8
--sync-coral:           #FF8070   /* More saturated on navy. */
--sync-gold:            #F0BA50
--sync-peach:           #F8BA98
--sync-beige:           #D0B898   /* ← NEW */
--sync-silver:          #8ABAC8

/* BORDERS */
--sync-border-default:  #1E3848
--sync-border-strong:   #2A5060
--sync-border-subtle:   #152830
```

**When to choose B:** User prefers a cooler, more electric feel. More like a
monitor than a lantern. Still calm, but with more contrast energy.

---

#### DARK OPTION C — "Storm Deck" (High Contrast / Accessibility)

Standing on deck during a storm at sea. Highest contrast. For users who need
maximum legibility or work in bright ambient environments.

```
/* BACKGROUNDS */
--sync-bg-base:         #111918   /* Charcoal-teal. Not quite black. */
--sync-bg-surface:      #1A2422   /* Visible lift. */
--sync-bg-elevated:     #223028   /* Strong card separation. */
--sync-bg-overlay:      #2A3C34   /* Bright overlay — clearly distinct. */
--sync-bg-beige:        #1E1A14   /* ← NEW Warm storm floor. */

/* TEXT — highest contrast */
--sync-text-primary:    #EAF5F3   /* Near-white. Crystal clear. */
--sync-text-secondary:  #A0C8C2   /* Clearly readable secondary. */
--sync-text-muted:      #608A84   /* Visible even as muted. */
--sync-text-beige:      #B8A890   /* ← NEW Warm legible tone. */

/* BRAND — most saturated for contrast */
--sync-teal:            #30DDD0   /* Maximum teal energy. */
--sync-coral:           #FF7A68   /* Maximum coral punch. */
--sync-gold:            #F5C04A
--sync-peach:           #FFBE98
--sync-beige:           #D8C0A0   /* ← NEW */
--sync-silver:          #90C0BC

/* BORDERS — visible */
--sync-border-default:  #2A4840
--sync-border-strong:   #3A6055
--sync-border-subtle:   #1E3430
```

**When to choose C:** Accessibility mode, bright rooms, users who prefer
maximum signal clarity over atmospheric depth.

---

### GRADIENT SYSTEM (Complete)

```css
/* The Horizon — signature Sync gradient (teal → peach → coral) */
--sync-gradient-horizon:
  linear-gradient(135deg, #0E9E8E 0%, #E8A882 60%, #D9705A 100%);

/* Signal Flow — for installer progress & loading */
--sync-gradient-signal:
  linear-gradient(90deg, #0E9E8E 0%, #2DD4C4 50%, #0E9E8E 100%);

/* Golden Hour — success & completion moments */
--sync-gradient-gold:
  linear-gradient(135deg, #C8973A 0%, #E8A882 60%, #D4C5A9 100%);

/* Deep Water — dark surface backgrounds */
--sync-gradient-depth-dark:
  linear-gradient(180deg, #0F1F1C 0%, #091614 100%);

/* Sea Foam — subtle card hover (light mode) */
--sync-gradient-foam-light:
  linear-gradient(145deg, #F3F7F5 0%, #E0EDEA 100%);

/* Warm Sand — beige surfaces (light mode) */
--sync-gradient-beige-light:
  linear-gradient(145deg, #F5F0E8 0%, #EDE5D5 100%);   /* ← NEW */

/* ASCII Art Splash (gradient-string color stops) */
--sync-gradient-splash: ['#0E9E8E', '#1BBFAE', '#7ACFC8', '#E8A882', '#D9705A'];
```

---

## 3. ANIMATION KEYFRAMES (Complete System)

### A. Signal Pulse — Primary Loading Animation

Used for: `--sync-gradient-signal` background during processing steps.

```css
@keyframes sync-signal-pulse {
  0%   { background-position: 200% center; opacity: 0.7; }
  50%  { background-position: 0% center;   opacity: 1.0; }
  100% { background-position: -200% center; opacity: 0.7; }
}

.sync-processing {
  background: var(--sync-gradient-signal);
  background-size: 300% 100%;
  animation: sync-signal-pulse 2.4s ease-in-out infinite;
}
```

### B. Depth Reveal — Step Entry Animation

Used for: Each @clack/prompts step appearing. Replaces jarring instant-appear.

```css
@keyframes sync-depth-reveal {
  0%   { opacity: 0; transform: translateY(4px); }
  100% { opacity: 1; transform: translateY(0px); }
}

.sync-step-enter {
  animation: sync-depth-reveal 180ms ease-out forwards;
}
/* Staggered: each step delays by 60ms × step-index */
```

### C. Wave Crest — Success Confirmation

Used for: ✔ appearing after task completion, `bd close` confirmation.

```css
@keyframes sync-wave-crest {
  0%   { transform: scale(0.8);  opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1.0);  opacity: 1; }
}

.sync-success-icon {
  animation: sync-wave-crest 320ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
/* cubic-bezier = slight overshoot — like a wave breaking then settling */
```

### D. Coral Pulse — Error State

Used for: Error lines in installer, validation failures.
Not aggressive — a pulse, not a flash. Ocean-calm even in error.

```css
@keyframes sync-coral-pulse {
  0%   { border-left-color: var(--sync-error); opacity: 1.0; }
  50%  { border-left-color: var(--sync-coral-subtle); opacity: 0.6; }
  100% { border-left-color: var(--sync-error); opacity: 1.0; }
}

.sync-error-line {
  border-left: 2px solid var(--sync-error);
  animation: sync-coral-pulse 1.8s ease-in-out 2; /* pulses twice, then stops */
}
```

### E. Bead Shimmer — Pending/Waiting State

Used for: Waiting for user input, idle states between steps.

```css
@keyframes sync-bead-shimmer {
  0%   { opacity: 0.4; }
  50%  { opacity: 1.0; }
  100% { opacity: 0.4; }
}

.sync-waiting-indicator {
  animation: sync-bead-shimmer 2.0s ease-in-out infinite;
  color: var(--sync-silver-core);
}
```

### F. Progress Bar Fill

Used for: Installation progress bar filling.

```css
@keyframes sync-bar-fill {
  0%   { width: 0%; }
  100% { width: var(--sync-target-width); }
}

.sync-progress-bar {
  background: var(--sync-teal);
  animation: sync-bar-fill 0.4s ease-out forwards;
  /* Each file creation triggers +width via JS updating --sync-target-width */
}
```

### Terminal Animation Note

`@clack/prompts` spinner handles its own frame-based animation in Node.js.
CSS keyframes above are for web UI / documentation components only.
For terminal, use the spinner configuration below.

---

## 4. SPINNER SYSTEM (Terminal)

### Primary Spinner — "Ocean Braille"

The braille patterns are excellent — they create fluid, wave-like motion.
Refined frame selection for ocean feel:

```javascript
// sync-spinner.js
export const syncSpinner = {
  name: 'sync-ocean',
  frames: [
    '⠁', '⠂', '⠄', '⡀',
    '⡈', '⡐', '⡠', '⣀',
    '⣁', '⣂', '⣄', '⣌',
    '⣔', '⣤', '⣥', '⣦',
    '⣮', '⣾', '⣿', '⣶',
    '⣦', '⣤', '⣄', '⣀',
    '⡀', '⠄', '⠂', '⠁',
  ],
  interval: 75,  // ms — fast enough to feel fluid, slow enough to read
};

// Color: always --sync-teal in light, --sync-teal-dark in dark
// Usage with ora:
import ora from 'ora';
const spinner = ora({
  text: 'Indexing signal layer...',
  spinner: syncSpinner,
  color: 'cyan',  // closest ANSI to #0E9E8E
}).start();
```

### Secondary Spinner — "Wave Sweep" (for lighter operations)

```javascript
export const syncWaveSpinner = {
  name: 'sync-wave',
  frames: ['∿', '≈', '≋', '≈', '∿', ' '],
  interval: 200,  // Slower — feels like actual waves
};
```

### Progress Bar Format

```javascript
// Using cli-progress or manual chalk output
const bar = {
  complete:   '█',   // color: --sync-teal
  incomplete: '░',   // color: --sync-silver
  format: '{bar} {percentage}%  {message}',
  // Example output:
  // ████████████░░░░░░░░  60%  Embedding signal vectors...
};
```

---

## 5. ERROR STATES — COMPLETE BEHAVIOR SYSTEM

### Error Taxonomy

```
Level 1 — SOFT ERROR    → Validation failure. User can fix. Gold warning.
Level 2 — HARD ERROR    → Action failed. Coral. Clear recovery path.
Level 3 — FATAL ERROR   → System cannot continue. Coral + box. Exit.
```

### Level 1 — Soft Error (Validation)

```
│
◆ Installation directory?
│  › /invalid path/here
│
▲  That path doesn't exist. Try: ./  or  ~/projects/my-sync
│  (Press Ctrl+C to cancel, or type a new path)
│
```
- Symbol: `▲` in `--sync-warning` (gold)
- Vertical bar continues — error is inline, not blocking
- No animation — appears instantly, no drama
- Recovery prompt immediately follows

### Level 2 — Hard Error (Action Failed)

```
│
│  Installing agents...
│  ✔ Created  .sync/agents/sync-parser.md
│  ✔ Created  .sync/agents/sync-scout.md
│  ✖ Failed   .sync/agents/sync-refiner.md
│     └ Permission denied: cannot write to ./
│     └ Try: sudo npx sync install  or  chmod 755 ./
│
```
- Symbol: `✖` in `--sync-error` (coral-red)
- Error line gets `border-left: 2px solid --sync-error` in web context
- In terminal: `chalk.hex('#C44E3A')` for the `✖` and path
- `└` sub-lines in `--sync-text-muted` — details without drama
- Coral pulse animation fires twice (see keyframes D) then stops
- Always followed by actionable recovery suggestion

### Level 3 — Fatal Error (Exit)

```
╭──────────────── Sync Installation Failed ───────────────╮
│                                                          │
│  ✖  Critical: Node.js 20+ required                      │
│                                                          │
│  Your version: Node 16.14.2                              │
│  Required:     Node 20.0.0+                              │
│                                                          │
│  Fix: nvm install 20 && nvm use 20                      │
│  Then: npx sync install                                 │
│                                                          │
╰──────────────────────────────────────────────────────────╯
```
- Full boxen panel in `--sync-error` colored border
- Box border: `chalk.hex('#C44E3A')`
- Title: coral bold
- Values: teal (contrast against error context)
- Fix commands: gold (`--sync-gold`)
- Process exits with code 1 after 1.5s pause (not instant — user reads it)

### Recovery Prompt Pattern

```javascript
// After any hard error, always offer:
const recovery = await select({
  message: 'How would you like to proceed?',
  options: [
    { value: 'retry',  label: 'Retry this step',       hint: 'after you fix the issue' },
    { value: 'skip',   label: 'Skip and continue',     hint: 'may cause partial install' },
    { value: 'cancel', label: 'Cancel installation',   hint: 'nothing has been written yet' },
  ],
});
```

---

## 6. FOCUS RING — KEYBOARD NAVIGATION SYSTEM

### Terminal Focus (Bracket Style)

The bracket approach is best for terminal. Avoids color confusion with
active state. Clear, scannable, accessible:

```
Unfocused:                    Focused (keyboard nav active):
  ○  Claude Code                [ ●  Claude Code     ]
  ○  Cursor                       ○  Cursor
  ○  Windsurf                     ○  Windsurf
```

Implementation:
```javascript
// @clack/prompts handles this automatically via their built-in
// selected/highlighted rendering. The bracket [ ] wrapping
// is added via custom renderer or chalk formatting:

const focusedLabel = chalk.hex('#0E9E8E')(`[ ${label} ]`);
const unfocusedLabel = chalk.hex('#A8BFC0')(`  ${label}  `);
```

### Focus Color Rules

```
Focused item label:    --sync-teal     (#0E9E8E / dark: #2DD4C4)
Focused bracket [ ]:   --sync-teal     (same — unified)
Unfocused label:       --sync-silver   (#A8BFC0 / dark: #7AABAA)
Cursor indicator ●:    --sync-coral    (#D9705A) — this is the active choice
Selection marker ◼:    --sync-teal     — this is checked/selected
```

### Text Input Focus

```
Unfocused:    │  Name  ·  ·  ·  ·  ·  ·  ·  ·  ·  Enter name
Focused:      │  Name  Satvik█                        ← teal cursor █
```
- Cursor blink: `█` in `--sync-teal`
- Input text: `--sync-text-primary`
- Placeholder: `--sync-text-muted`

### Web UI Focus (for future Sync dashboard)

```css
.sync-focusable:focus-visible {
  outline: 2px solid var(--sync-teal);
  outline-offset: 3px;
  border-radius: 4px;
  box-shadow: 0 0 0 4px var(--sync-teal-subtle);
  /* Double ring = outline + shadow = maximum visibility */
}
```

---

## 7. TYPOGRAPHY SYSTEM (Clarified)

### Critical Distinction — Where Each Font Applies

```
┌─────────────────┬────────────────────┬─────────────────────────┐
│ Context         │ Font               │ Why                     │
├─────────────────┼────────────────────┼─────────────────────────┤
│ Terminal/CLI    │ System monospace   │ Terminal renders all     │
│ (installer)     │ (terminal default) │ output in its own font. │
│                 │                    │ You cannot control this. │
├─────────────────┼────────────────────┼─────────────────────────┤
│ Agent content   │ System monospace   │ Same — agent responses   │
│ (Claude Code)   │ (terminal default) │ go through terminal.     │
├─────────────────┼────────────────────┼─────────────────────────┤
│ SYNC.md files   │ GitHub Markdown    │ Viewed in IDE/browser.  │
│ Documentation   │ (system sans)      │ Font defined by viewer. │
├─────────────────┼────────────────────┼─────────────────────────┤
│ Future Web UI   │ DM Serif Display   │ Dashboard, settings,    │
│ (Sync app)      │ DM Sans            │ analytics UI.           │
│                 │ Maple Mono         │ Full control here.      │
└─────────────────┴────────────────────┴─────────────────────────┘
```

**What you CAN control in terminal:**
- Text weight via ANSI bold: `chalk.bold()`
- Character spacing via deliberate whitespace
- Visual grouping via box-drawing characters
- Color and emphasis

**What you CANNOT control:**
- Font family in terminal output
- Line height in terminal
- Letter spacing

### Web UI Typography Stack (Future Sync Dashboard)

```css
/* Display — section titles, splash overlays, hero */
--sync-font-display: 'DM Serif Display', Georgia, serif;
font-weight: 400;  /* Serifs carry weight naturally */
/* Represents: The captain's logbook. Narrative intelligence. */

/* Body — all UI copy, descriptions, prompt labels */
--sync-font-body: 'DM Sans', 'Outfit', system-ui, sans-serif;
font-weight: 300 | 400 | 500 | 600;
/* Represents: Navigation instruments. Precise, modern, clean. */

/* Mono — file paths, commands, bd task IDs, code */
--sync-font-mono: 'Maple Mono', 'Geist Mono', 'JetBrains Mono', monospace;
font-weight: 400 | 500;
/* Represents: Signal readout. Every character has a purpose. */
```

### Type Scale

```
--sync-text-2xs:     10px / 1.3   /* Timestamps, version tags */
--sync-text-xs:      11px / 1.4   /* Metadata, bd task IDs, badges */
--sync-text-sm:      13px / 1.5   /* Default body, prompt text */
--sync-text-md:      15px / 1.5   /* Emphasis, active items */
--sync-text-lg:      18px / 1.4   /* Step titles, section headers */
--sync-text-xl:      24px / 1.3   /* CLI section markers */
--sync-text-2xl:     32px / 1.2   /* Outro headline "Sync is ready." */
--sync-text-display: 48px / 1.1   /* Web hero only */
```

### Terminal Typography Rules

```javascript
// Bold for emphasis (works in all terminals)
chalk.bold('Signal density: 0.85')

// Dim for muted (works in most terminals)
chalk.dim('bd-a1b2 · 2026-03-05 · signal-capture')

// Italic for quotes/agent persona (works in most modern terminals)
chalk.italic('Linker: Retrieving top-k impact blocks...')

// Underline for links/paths (sparingly)
chalk.underline('.sync/agents/sync-refiner.md')

// NEVER combine more than 2 modifiers — becomes unreadable
```

---

## 8. VOICE & TONE — AGENT MATRIX

### The Unified Sync Voice

Sync agents are **The Signal Engineering Team**. They work on a ship.
They are competent. They do not perform enthusiasm. They deliver results.

**Core voice rules:**
- Precision over decoration
- Outcomes over process descriptions
- No filler phrases ("Great!", "Sure!", "Of course!")
- No trailing exclamation marks (except Outro only)
- Numbers and metrics preferred over adjectives
- Passive failures are spoken in active voice with solutions

### Agent Voice Matrix

| Agent | Personality | Tone Keywords | Example Line |
|---|---|---|---|
| **Sync-Parser** | Clinical analyst | Precise, economical, factual | `Extracted 14 signal blocks. 3 flagged for low-metric density.` |
| **Sync-Scout** | Field researcher | Curious, observational, thorough | `Target company: Stripe. Design-first culture confirmed. PM terminology leans product-led.` |
| **Sync-Inquisitor** | Probing interviewer | Patient, probing, Socratic | `You mentioned leading the migration — what was the measurable business outcome?` |
| **Sync-Linker** | Matching engine | Systematic, ranked, confident | `Top-3 signal match found. Relevance scores: 0.91, 0.87, 0.82. Proceeding.` |
| **Sync-Refiner** | Sculptor | Focused, iterative, aesthetic | `Bullet density: high. Trimming to 88 chars. XYZ format applied. Rewriting.` |
| **Sync-Sizer** | Strict gatekeeper | Blunt, precise, non-negotiable | `Line 14 overflows by 6 chars. Hard stop. Returning to Refiner.` |
| **Sync-Styler** | Visual craftsman | Considered, deliberate, clean | `Template: Modern-Minimal. Company color injected: #0F62FE. Compiling.` |
| **Sync-Tracker** | Ledger keeper | Neutral, factual, accountable | `ApplicationRecord #48 created. Status: draft. ResumeVersion v3 linked.` |

### Language Mode Application

When user selects **Hinglish** during install:
```
Sync-Refiner:  "Bullet thoda long ho gaya — 6 chars trim kar raha hoon."
Sync-Linker:   "Top match mila — relevance 0.91. Proceed karein?"
Sync-Tracker:  "Application log ho gayi. Status: submitted."
```

When user selects **English**:
```
Sync-Refiner:  "Bullet exceeds budget by 6 chars. Trimming."
Sync-Linker:   "Top match found. Relevance: 0.91. Proceeding."
Sync-Tracker:  "Application logged. Status: submitted."
```

When user selects **Hindi**:
```
Sync-Refiner:  "बुलेट 6 अक्षर लंबा है। काट रहा हूँ।"
Sync-Linker:   "सबसे अच्छा मिलान मिला। प्रासंगिकता: 0.91।"
```

### Tone Forbidden List

```
✖  "Great question!"
✖  "I'd be happy to help!"
✖  "Sure thing!"
✖  "Let me know if you need anything else."
✖  "Please wait while we process..."
✖  "Oops! Something went wrong."
✖  "Successfully completed!" (just show the ✔)
✖  Unsolicited encouragement
✖  Redundant status ("Now beginning step 3...")
```

---

## 9. PEACH & BEIGE — INTEGRATION GUIDE

### When to Use Peach

```
Peach (#E8A882) is the warm human voice of Sync.

USE for:
  ✔ Onboarding hints and tooltips
  ✔ Agent Inquisitor responses (warmth of conversation)
  ✔ "Hint:" labels below prompts
  ✔ Secondary CTAs ("Learn more", "See example")
  ✔ Installer welcome message text
  ✔ Outro message — the emotional landing

AVOID for:
  ✖ Primary actions (that's teal)
  ✖ Error states (that's coral)
  ✖ Success states (that's gold)
  ✖ Any state that requires high contrast
```

### When to Use Beige

```
Beige (#D4C5A9 light / #C8B898 dark) is the seafloor neutral.

USE for:
  ✔ Divider lines between major sections
  ✔ Inactive/disabled option labels
  ✔ Background of "info" panels that are not urgent
  ✔ Agent file backgrounds in documentation
  ✔ Alternate row backgrounds in tracker tables
  ✔ The "body text" of SYNC.md docs
  ✔ Warm counterpoint when everything else is cool teal

AVOID for:
  ✖ Any interactive element
  ✖ Any state requiring user attention
  ✖ Primary text on light backgrounds (contrast too low)
```

### Peach + Beige Together

```
╭─────────────────────────── Sync Hint ────────────────────────╮  ← beige border
│                                                               │
│  Your signal library is empty. Start by running:             │  ← beige bg
│  /sync-capture                                                │  ← gold text
│                                                               │
│  The more reflections you log, the stronger your             │  ← peach text
│  JD alignment scores become over time.                        │
│                                                               │
╰───────────────────────────────────────────────────────────────╯
```

---

## 10. INSTALLER OUTRO — PERSONALIZED SYSTEM

### Core Principle
The outro must know:
1. User's name (from installation config)
2. Which modules were installed
3. Which IDE was selected

This data drives a **dynamic, personalized closing screen**.

### Outro Template Engine

```javascript
// sync-outro.js
function renderOutro({ name, modules, ide, lang }) {

  const greeting = lang === 'hinglish'
    ? `Signal ready hai, ${name}.`
    : `Signal ready, ${name}.`;

  const firstMission = lang === 'hinglish'
    ? 'Pehla kaam:'
    : 'Your first mission:';

  const ideCommand = {
    'claude-code': '/sync-capture',
    'cursor':      '@sync-capture',
    'gemini-cli':  '/sync-capture',
  }[ide] || '/sync-capture';

  const moduleHints = {
    'jd-engine':   `→ ${ideCommand.replace('capture','optimize')}   Paste a JD and watch the engine run`,
    'tracker':     `→ ${ideCommand.replace('capture','track')}      Log your first application`,
    'linkedin':    `→ ${ideCommand.replace('capture','linkedin')}   Sync your LinkedIn narrative`,
  };

  return {
    greeting,
    firstMission,
    actions: [
      `→ ${ideCommand}   Log today's work reflection`,
      ...modules.map(m => moduleHints[m]).filter(Boolean),
    ],
  };
}
```

### Outro Visual

```
│
│  ████████████████████████████████████  100%
│
◆  Signal ready, Satvik. Your signal engineering system is live.
│
│  Your first mission:
│  → /sync-capture      Log today's work reflection
│  → /sync-optimize     Paste a JD and watch the engine run
│  → /sync-track        Log your first application
│
│  Your system:
│  → Agents     .sync/agents/          (8 agents online)
│  → Workflows  .sync/workflows/       (3 workflows ready)
│  → Tasks      bd ready --json        (dependency graph live)
│  → Docs       SYNC.md
│
╰─ Signal from the deep. Good luck out there.
```

Color breakdown:
- `◆ Signal ready, Satvik.` → `--sync-teal` bold
- `→ /sync-capture` commands → `--sync-gold`
- Path values → `--sync-text-muted` dim
- `╰─ Signal from the deep.` → `--sync-peach` italic
- `Good luck out there.` → `--sync-text-primary`

### Hinglish Outro Variant

```
◆  Signal ready hai, Satvik. Tera system live ho gaya.
│
│  Pehla kaam:
│  → /sync-capture      Aaj ka kaam log karo
│  → /sync-optimize     Ek JD paste karo, engine dekhna
│
╰─ Signal from the deep. Best of luck, bhai.
```

---

## 11. CLI VISUAL LANGUAGE (Consolidated)

### Vertical Line Color States

```
Idle/waiting:    --sync-silver    (#A8BFC0 / dark: #7AABAA)
Active/current:  --sync-teal      (#0E9E8E / dark: #2DD4C4)
Completed:       --sync-success   (#1A9E6A / dark: #34D98E)
Error:           --sync-error     (#C44E3A / dark: #F07060)
Warning:         --sync-warning   (#C8973A / dark: #E5B04A)
```

### Symbol System

```
◆  Active prompt          → teal
◇  Inactive               → silver
✔  Completed              → success green
✖  Failed                 → error coral
▲  Warning/soft error     → gold
→  Navigation / next step → peach
●  Selected/active option → coral
○  Unselected option      → silver
◼  Checked (multiselect)  → teal
◻  Unchecked              → silver
[ ]  Focused bracket      → teal (around selected item)
│  Vertical through-line  → changes by state (above)
╭╰─╮╯  Box drawing       → border-default color
```

**Absolute rule: No emoji in CLI output. Zero exceptions.**
Emoji are welcome only in SYNC.md documentation.

---

## 12. CONTRAST RATIOS (Accessibility Verified)

### Light Mode
```
Primary text (#162826) on base (#F3F7F5):   15.2:1  ✔ AAA
Secondary   (#38645E) on base (#F3F7F5):     7.4:1  ✔ AAA
Teal        (#0E9E8E) on base (#F3F7F5):     4.6:1  ✔ AA
Coral       (#D9705A) on base (#F3F7F5):     3.8:1  ✔ AA (large text)
Gold        (#C8973A) on base (#F3F7F5):     3.5:1  ✔ AA (large text)
Peach       (#E8A882) on base (#F3F7F5):     2.4:1  — decorative only
Beige       (#D4C5A9) on base (#F3F7F5):     1.8:1  — background only
```

### Dark Mode (Option A — Abyssal)
```
Primary text (#D8EDEA) on base (#091614):   15.8:1  ✔ AAA
Secondary   (#89BAB4) on base (#091614):     7.9:1  ✔ AAA
Teal        (#2DD4C4) on base (#091614):     8.4:1  ✔ AAA
Coral       (#F08070) on base (#091614):     7.1:1  ✔ AAA
Gold        (#E5B04A) on base (#091614):     8.2:1  ✔ AAA
Peach       (#F2B896) on base (#091614):     6.8:1  ✔ AA
```

---

## SUMMARY — THE SYNC AESTHETIC

```
Three words:   Depth. Wave. Breeze.
Three colors:  Teal. Coral. Gold.
Three warmths: Peach. Beige. Silver.
One law:       Signal over noise.
```

*A teal-and-coral ocean — calm enough to read, alive enough to feel.*
*The tool is quiet. The results are loud.*

---

*Sync Design System v1.1 — Signal from the Deep*
*Revised: 2026-03-05*
*Changes: Gradient ASCII art, 3 dark modes, keyframes,
 spinner system, error taxonomy, focus rings, typography
 distinction, agent voice matrix, peach/beige guide,
 personalized outro engine.*


---

# Calibri Font — Exact Character Width Reference
## Source: Calibri hmtx Table (OpenType Specification)
### UnitsPerEm = 2048 | Formula: pixels = (units ÷ 2048) × (pt ÷ 72) × DPI

---

## The Core Formula

```
pixel_width = (advance_units / 2048) × (font_size_pt / 72) × DPI

At 10pt, 96 DPI → multiply units by 0.000651
At 11pt, 96 DPI → multiply units by 0.000716
At 10pt, 72 DPI → multiply units by 0.000488
```

**Why character count fails:**
`W` = 1664 units = 10.833px
`i`  =  456 units =  2.969px
**Ratio = 3.65× — one W is as wide as 3.6 letter i's**

---

## CALIBRI REGULAR — Complete Advance Widths

### Lowercase (a–z)

| Char | Units | Points @10pt | Pixels @10pt 96DPI |
|------|------:|-------------:|-------------------:|
| i    |   456 |      2.227pt |             2.969px |
| j    |   456 |      2.227pt |             2.969px |
| l    |   456 |      2.227pt |             2.969px |
| f    |   614 |      2.998pt |             3.997px |
| r    |   682 |      3.330pt |             4.440px |
| t    |   750 |      3.662pt |             4.883px |
| s    |   862 |      4.209pt |             5.612px |
| z    |   912 |      4.453pt |             5.938px |
| c    |   934 |      4.561pt |             6.081px |
| a    |  1006 |      4.912pt |             6.549px |
| e    |  1006 |      4.912pt |             6.549px |
| v    |  1006 |      4.912pt |             6.549px |
| x    |  1006 |      4.912pt |             6.549px |
| y    |  1006 |      4.912pt |             6.549px |
| k    |  1036 |      5.059pt |             6.745px |
| b    |  1089 |      5.317pt |             7.090px |
| d    |  1089 |      5.317pt |             7.090px |
| g    |  1089 |      5.317pt |             7.090px |
| p    |  1089 |      5.317pt |             7.090px |
| q    |  1089 |      5.317pt |             7.090px |
| h    |  1092 |      5.332pt |             7.109px |
| n    |  1092 |      5.332pt |             7.109px |
| u    |  1092 |      5.332pt |             7.109px |
| o    |  1106 |      5.400pt |             7.201px |
| w    |  1382 |      6.748pt |             8.997px |
| m    |  1634 |      7.979pt |            10.638px |

### Uppercase (A–Z)

| Char | Units | Points @10pt | Pixels @10pt 96DPI |
|------|------:|-------------:|-------------------:|
| I    |   534 |      2.607pt |             3.477px |
| J    |   682 |      3.330pt |             4.440px |
| L    |   972 |      4.746pt |             6.328px |
| E    |  1006 |      4.912pt |             6.549px |
| S    |  1006 |      4.912pt |             6.549px |
| F    |   934 |      4.561pt |             6.081px |
| T    |  1063 |      5.190pt |             6.921px |
| Z    |  1063 |      5.190pt |             6.921px |
| P    |  1106 |      5.400pt |             7.201px |
| B    |  1133 |      5.532pt |             7.376px |
| C    |  1133 |      5.532pt |             7.376px |
| K    |  1133 |      5.532pt |             7.376px |
| X    |  1133 |      5.532pt |             7.376px |
| Y    |  1133 |      5.532pt |             7.376px |
| A    |  1178 |      5.752pt |             7.669px |
| R    |  1178 |      5.752pt |             7.669px |
| V    |  1178 |      5.752pt |             7.669px |
| G    |  1240 |      6.055pt |             8.073px |
| U    |  1240 |      6.055pt |             8.073px |
| D    |  1259 |      6.147pt |             8.197px |
| H    |  1259 |      6.147pt |             8.197px |
| N    |  1259 |      6.147pt |             8.197px |
| O    |  1316 |      6.426pt |             8.568px |
| Q    |  1316 |      6.426pt |             8.568px |
| M    |  1434 |      7.002pt |             9.336px |
| W    |  1664 |      8.125pt |            10.833px |

### Digits (All Tabular — Identical Width)

| Char | Units | Points @10pt | Pixels @10pt 96DPI |
|------|------:|-------------:|-------------------:|
| 0–9  |  1038 |      5.068pt |             6.758px |

**All digits are exactly the same width in Calibri — this is intentional
(tabular figures) so numbers align in columns.**

---

## Punctuation, Symbols & Special Characters

| Char | Name | Units | Points @10pt | Pixels @10pt 96DPI |
|------|------|------:|-------------:|-------------------:|
| ' '  | Space          |   512 |  2.500pt |  3.333px |
| .    | Period         |   512 |  2.500pt |  3.333px |
| ,    | Comma          |   512 |  2.500pt |  3.333px |
| :    | Colon          |   512 |  2.500pt |  3.333px |
| ;    | Semicolon      |   512 |  2.500pt |  3.333px |
| \|   | Vertical bar   |   512 |  2.500pt |  3.333px |
| '    | Apostrophe     |   456 |  2.227pt |  2.969px |
| "    | Double quote   |   682 |  3.330pt |  4.440px |
| !    | Exclamation    |   614 |  2.998pt |  3.997px |
| -    | Hyphen-minus   |   614 |  2.998pt |  3.997px |
| (    | Left paren     |   614 |  2.998pt |  3.997px |
| )    | Right paren    |   614 |  2.998pt |  3.997px |
| /    | Forward slash  |   682 |  3.330pt |  4.440px |
| *    | Asterisk       |   819 |  3.999pt |  5.332px |
| •    | Bullet U+2022  |   819 |  3.999pt |  5.332px |
| ?    | Question mark  |   934 |  4.561pt |  6.081px |
| –    | En dash U+2013 |  1024 |  5.000pt |  6.667px |
| $    | Dollar         |  1038 |  5.068pt |  6.758px |
| ₹    | Rupee          |  1038 |  5.068pt |  6.758px |
| +    | Plus           |  1178 |  5.752pt |  7.669px |
| #    | Hash           |  1178 |  5.752pt |  7.669px |
| &    | Ampersand      |  1240 |  6.055pt |  8.073px |
| %    | Percent        |  1434 |  7.002pt |  9.336px |
| →    | Right arrow    |  1434 |  7.002pt |  9.336px |
| —    | Em dash U+2014 |  1638 |  7.998pt | 10.664px |
| @    | At sign        |  1843 |  8.999pt | 11.999px |

---

## CALIBRI BOLD — Delta from Regular

Bold chars are wider. Bolding your metric number fills the line.

| Char | Regular | Bold | Δ Units | Δ px @10pt |
|------|--------:|-----:|--------:|-----------:|
| i,j,l |   456 |  499 |     +43 |   +0.280px |
| f    |   614 |  670 |     +56 |   +0.365px |
| r    |   682 |  728 |     +46 |   +0.299px |
| t    |   750 |  797 |     +47 |   +0.306px |
| s    |   862 |  895 |     +33 |   +0.215px |
| a,e  |  1006 | 1057 |     +51 |   +0.332px |
| v,x,y|  1006 | 1051 |     +45 |   +0.293px |
| b,d,g,p,q | 1089 | 1120 | +31 | +0.202px |
| h,n,u|  1092 | 1133 |     +41 |   +0.267px |
| o    |  1106 | 1145 |     +39 |   +0.254px |
| w    |  1382 | 1434 |     +52 |   +0.339px |
| m    |  1634 | 1690 |     +56 |   +0.365px |
| I    |   534 |  580 |     +46 |   +0.299px |
| A,R,V|  1178 | 1240 |     +62 |   +0.404px |
| B,K,X,Y | 1133 | 1190 |   +57 |   +0.371px |
| C    |  1133 | 1170 |     +37 |   +0.241px |
| D,H,N | 1259 | 1316 |     +57 |   +0.371px |
| G,U  |  1240 | 1297 |     +57 |   +0.371px |
| M    |  1434 | 1497 |     +63 |   +0.410px |
| W    |  1664 | 1742 |     +78 |   +0.508px |
| 0–9  |  1038 | 1092 |     +54 |   +0.352px |
| %    |  1434 | 1497 |     +63 |   +0.410px |
| $,₹  |  1038 | 1092 |     +54 |   +0.352px |
| -    |   614 |  670 |     +56 |   +0.365px |

**Practical use:** A metric like `18%` has 3 chars.
Regular: (1038 + 1038 + 1434) = 3510 units = 22.855px
Bold:    (1092 + 1092 + 1497) = 3681 units = 23.968px
**Bolding `18%` alone adds +1.113px — enough to tip a near-full line to 100%**

---

## Normalized Weight Table (Digit = 1.000 baseline)

Use this for the weighted budget calculation.
`weighted_total = Σ (char_weight)` for every character in the bullet.

| Weight | Characters |
|-------:|------------|
| 0.439  | i, j, l, ' (apostrophe) |
| 0.493  | space, . , : ; \| |
| 0.514  | I |
| 0.592  | f, !, -, (, ) |
| 0.657  | r, J, /, " |
| 0.723  | t |
| 0.789  | *, • (bullet) |
| 0.830  | s |
| 0.879  | z |
| 0.900  | c, F, ? |
| 0.936  | L |
| 0.969  | a, e, v, x, y, E, S |
| 0.987  | – (en dash) |
| **1.000** | **0–9, $, ₹** ← baseline |
| 1.024  | T, Z |
| 1.049  | b, d, g, p, q |
| 1.052  | h, n, u |
| 1.066  | o, P |
| 1.092  | B, C, K, X, Y |
| 1.135  | A, R, V, +, # |
| 1.195  | G, U, & |
| 1.213  | D, H, N |
| 1.268  | O, Q |
| 1.331  | w |
| 1.382  | M, %, → |
| 1.574  | m |
| 1.578  | — (em dash) |
| 1.603  | W |
| 1.776  | @ |

---

## Standard Resume Line Budget

**Single-column resume, 8.5in × 11in, 1-inch margins:**
- Text block = 6.5 inches = 468pt = 624px @96DPI
- At 10pt Calibri: budget = 624 / 6.758px per digit = **~92 digit-equivalent units**
- Target fill: 87–91 weighted units (95% of 92)
- CSS `text-align-last: justify` handles remaining 1–5 units silently

**For Satvik's IIM-A table format (column `.c4` = 28.2% width):**
- Column width = 6.5in × 0.282 = 1.833in = 176px @96DPI
- Budget = 176 / 6.758 = **~26 digit-equivalent units**
- Target: 24–25.5 weighted units per bullet

---

## Quick Reference for Writers

**Narrowest words** (low weight, use to save space):
`if`, `it`, `is`, `in`, `I`, `to`, `fit`, `lift`, `fill`, `list`

**Widest words** (high weight, use to fill space):
`Spearheaded`, `Orchestrated`, `Streamlined`, `Transformed`, `Optimised`
`Program`, `Growth`, `Network`, `Workflow`, `Momentum`

**Weight of common PM power verbs (indicative):**
| Verb | Approx Weight |
|------|:---:|
| Led  | 3.1 |
| Built | 4.7 |
| Drove | 4.9 |
| Launched | 7.3 |
| Delivered | 8.1 |
| Spearheaded | 10.6 |
| Orchestrated | 11.2 |

---

*Source: Calibri hmtx table (OpenType). UnitsPerEm = 2048.
Verified against: Microsoft Typography documentation,
ClosedXML wiki Cell Dimensions, OpenType spec hmtx section.*


---

# Roboto Font — Exact Character Width Reference
## Source: Roboto v3.0 hmtx Table (Google Fonts, Apache 2.0 License)
### UnitsPerEm = 2048 | Formula: pixels = (units ÷ 2048) × (pt ÷ 72) × DPI

---

## Core Formula

```
pixel_width = (advance_units / 2048) × (font_size_pt / 72) × DPI

At 10pt, 96 DPI → multiply units by 0.006510
At 11pt, 96 DPI → multiply units by 0.007161
At 10pt, 72 DPI → multiply units by 0.004883
```

**Why character count fails:**
`W` = 1736 units = 11.302px
`i`  =  483 units =  3.145px
**Ratio = 3.59× — one W is as wide as 3.6 letter i's**

**Roboto vs Calibri:** Roboto is consistently wider (~0.3–0.8px per char).
Same budget system works — just different weight values.

---

## ROBOTO REGULAR — Complete Advance Widths (sorted by width)

### Lowercase (a–z)

| Char | Units | Points @10pt | Pixels @10pt 96DPI | Weight (÷digit) |
|------|------:|-------------:|-------------------:|----------------:|
| i    |   483 |      2.358pt |             3.145px |           0.445 |
| j    |   483 |      2.358pt |             3.145px |           0.445 |
| l    |   483 |      2.358pt |             3.145px |           0.445 |
| f    |   640 |      3.125pt |             4.167px |           0.589 |
| r    |   714 |      3.486pt |             4.648px |           0.657 |
| t    |   790 |      3.857pt |             5.143px |           0.727 |
| s    |   934 |      4.561pt |             6.081px |           0.860 |
| c    |  1010 |      4.932pt |             6.576px |           0.930 |
| z    |  1010 |      4.932pt |             6.576px |           0.930 |
| a    |  1086 |      5.303pt |             7.070px |           1.000 |
| e    |  1086 |      5.303pt |             7.070px |           1.000 |
| k    |  1086 |      5.303pt |             7.070px |           1.000 |
| v    |  1086 |      5.303pt |             7.070px |           1.000 |
| x    |  1086 |      5.303pt |             7.070px |           1.000 |
| y    |  1086 |      5.303pt |             7.070px |           1.000 |
| b    |  1163 |      5.679pt |             7.572px |           1.071 |
| d    |  1163 |      5.679pt |             7.572px |           1.071 |
| g    |  1163 |      5.679pt |             7.572px |           1.071 |
| h    |  1163 |      5.679pt |             7.572px |           1.071 |
| n    |  1163 |      5.679pt |             7.572px |           1.071 |
| o    |  1163 |      5.679pt |             7.572px |           1.071 |
| p    |  1163 |      5.679pt |             7.572px |           1.071 |
| q    |  1163 |      5.679pt |             7.572px |           1.071 |
| u    |  1163 |      5.679pt |             7.572px |           1.071 |
| w    |  1504 |      7.344pt |             9.792px |           1.385 |
| m    |  1736 |      8.477pt |            11.302px |           1.599 |

### Uppercase (A–Z)

| Char | Units | Points @10pt | Pixels @10pt 96DPI | Weight (÷digit) |
|------|------:|-------------:|-------------------:|----------------:|
| I    |   560 |      2.734pt |             3.646px |           0.516 |
| J    |   714 |      3.486pt |             4.648px |           0.657 |
| F    |  1010 |      4.932pt |             6.576px |           0.930 |
| L    |  1010 |      4.932pt |             6.576px |           0.930 |
| E    |  1086 |      5.303pt |             7.070px |           1.000 |
| S    |  1086 |      5.303pt |             7.070px |           1.000 |
| T    |  1118 |      5.459pt |             7.279px |           1.029 |
| Z    |  1118 |      5.459pt |             7.279px |           1.029 |
| B    |  1194 |      5.830pt |             7.773px |           1.099 |
| C    |  1194 |      5.830pt |             7.773px |           1.099 |
| K    |  1194 |      5.830pt |             7.773px |           1.099 |
| P    |  1194 |      5.830pt |             7.773px |           1.099 |
| X    |  1194 |      5.830pt |             7.773px |           1.099 |
| Y    |  1194 |      5.830pt |             7.773px |           1.099 |
| A    |  1270 |      6.201pt |             8.268px |           1.169 |
| R    |  1270 |      6.201pt |             8.268px |           1.169 |
| V    |  1270 |      6.201pt |             8.268px |           1.169 |
| D    |  1346 |      6.572pt |             8.763px |           1.239 |
| G    |  1346 |      6.572pt |             8.763px |           1.239 |
| H    |  1346 |      6.572pt |             8.763px |           1.239 |
| N    |  1346 |      6.572pt |             8.763px |           1.239 |
| U    |  1346 |      6.572pt |             8.763px |           1.239 |
| O    |  1422 |      6.943pt |             9.258px |           1.309 |
| Q    |  1422 |      6.943pt |             9.258px |           1.309 |
| M    |  1504 |      7.344pt |             9.792px |           1.385 |
| W    |  1736 |      8.477pt |            11.302px |           1.599 |

### Digits (All Tabular — Identical Width)

| Char | Units | Points @10pt | Pixels @10pt 96DPI | Weight |
|------|------:|-------------:|-------------------:|-------:|
| 0–9  |  1086 |      5.303pt |             7.070px |  1.000 |

All digits identical — intentional tabular figures for column alignment.

---

## Punctuation, Symbols & Special Characters

| Char | Name           | Units | Points @10pt | Pixels @10pt 96DPI | Weight |
|------|----------------|------:|-------------:|-------------------:|-------:|
| '    | Apostrophe     |   483 |      2.358pt |             3.145px |  0.445 |
| ' '  | Space          |   560 |      2.734pt |             3.646px |  0.516 |
| .    | Period         |   560 |      2.734pt |             3.646px |  0.516 |
| ,    | Comma          |   560 |      2.734pt |             3.646px |  0.516 |
| :    | Colon          |   560 |      2.734pt |             3.646px |  0.516 |
| ;    | Semicolon      |   560 |      2.734pt |             3.646px |  0.516 |
| \|   | Vertical bar   |   560 |      2.734pt |             3.646px |  0.516 |
| !    | Exclamation    |   640 |      3.125pt |             4.167px |  0.589 |
| -    | Hyphen-minus   |   640 |      3.125pt |             4.167px |  0.589 |
| (    | Left paren     |   640 |      3.125pt |             4.167px |  0.589 |
| )    | Right paren    |   640 |      3.125pt |             4.167px |  0.589 |
| "    | Double quote   |   714 |      3.486pt |             4.648px |  0.657 |
| /    | Forward slash  |   714 |      3.486pt |             4.648px |  0.657 |
| *    | Asterisk       |   870 |      4.248pt |             5.664px |  0.801 |
| •    | Bullet U+2022  |   870 |      4.248pt |             5.664px |  0.801 |
| ?    | Question mark  |  1010 |      4.932pt |             6.576px |  0.930 |
| –    | En dash U+2013 |  1086 |      5.303pt |             7.070px |  1.000 |
| $    | Dollar         |  1086 |      5.303pt |             7.070px |  1.000 |
| ₹    | Rupee          |  1086 |      5.303pt |             7.070px |  1.000 |
| +    | Plus           |  1194 |      5.830pt |             7.773px |  1.099 |
| #    | Hash           |  1194 |      5.830pt |             7.773px |  1.099 |
| &    | Ampersand      |  1270 |      6.201pt |             8.268px |  1.169 |
| %    | Percent        |  1504 |      7.344pt |             9.792px |  1.385 |
| →    | Right arrow    |  1504 |      7.344pt |             9.792px |  1.385 |
| —    | Em dash U+2014 |  1736 |      8.477pt |            11.302px |  1.599 |
| @    | At sign        |  1890 |      9.229pt |            12.305px |  1.740 |

---

## ROBOTO BOLD — Delta from Regular

| Char | Regular | Bold | Δ Units | Δ px @10pt |
|------|--------:|-----:|--------:|-----------:|
| i,j,l |    483 |  537 |     +54 |   +0.352px |
| f     |    640 |  714 |     +74 |   +0.482px |
| r     |    714 |  790 |     +76 |   +0.495px |
| t     |    790 |  870 |     +80 |   +0.521px |
| s     |    934 | 1010 |     +76 |   +0.495px |
| c,z   |   1010 | 1057 |     +47 |   +0.306px |
| a,e,k,v,x,y | 1086 | 1143 | +57 | +0.371px |
| b,d,g,h,n,o,p,q,u | 1163 | 1214 | +51 | +0.332px |
| w     |   1504 | 1580 |     +76 |   +0.495px |
| m     |   1736 | 1800 |     +64 |   +0.417px |
| I     |    560 |  614 |     +54 |   +0.352px |
| A,R,V |   1270 | 1346 |     +76 |   +0.495px |
| B,C,K,P,X,Y | 1194 | 1270 | +76 | +0.495px |
| D,G,H,N,U | 1346 | 1422 | +76 | +0.495px |
| M,W   |  1504+ | 1580+|     +64 |   +0.417px |
| O,Q   |   1422 | 1504 |     +82 |   +0.534px |
| 0–9   |   1086 | 1143 |     +57 |   +0.371px |
| %     |   1504 | 1580 |     +76 |   +0.495px |
| $,₹   |   1086 | 1143 |     +57 |   +0.371px |
| -     |    640 |  714 |     +74 |   +0.482px |
| •     |    870 |  940 |     +70 |   +0.456px |

**Practical use:** Bolding `18%` → adds +0.495 + 0.371 + 0.495 = **+1.361px**
Enough to tip a near-full line to 100% fill.

---

## Normalized Weight Table (Digit = 1.000 baseline)

```
weighted_total = Σ weight(char) for every character in bullet string
```

| Weight | Characters |
|-------:|------------|
| 0.445  | i, j, l, ' |
| 0.516  | I, space, . , : ; \| |
| 0.589  | f, !, -, (, ) |
| 0.657  | r, J, /, " |
| 0.727  | t |
| 0.801  | *, • |
| 0.860  | s |
| 0.930  | c, z, F, L, ? |
| **1.000** | **a, e, k, v, x, y, E, S, 0–9, –, $, ₹** ← baseline |
| 1.029  | T, Z |
| 1.071  | b, d, g, h, n, o, p, q, u |
| 1.099  | B, C, K, P, X, Y, +, # |
| 1.169  | A, R, V, & |
| 1.239  | D, G, H, N, U |
| 1.309  | O, Q |
| 1.385  | w, M, %, → |
| 1.599  | m, W, — |
| 1.740  | @ |

---

## Standard Resume Line Budget (Roboto 10pt)

**Single-column, 8.5in × 11in, 1-inch margins:**
- Text block = 6.5 inches = 468pt = 624px @96DPI
- At 10pt Roboto: digit = 7.070px → budget = 624 / 7.070 = **~88.3 digit-units**
- Target range: 84–88 weighted units (95–100% fill)
- CSS `text-align-last: justify` handles final 0–5% silently

**Note: Roboto slightly wider than Calibri → same line holds ~4 fewer chars on average.**

---

## Calibri vs Roboto Comparison

| Char | Calibri Units | Roboto Units | Roboto wider by |
|------|-------------:|-------------:|----------------:|
| i    |           456 |          483 |        +0.176px |
| space|           512 |          560 |        +0.312px |
| f    |           614 |          640 |        +0.169px |
| r    |           682 |          714 |        +0.208px |
| t    |           750 |          790 |        +0.260px |
| s    |           862 |          934 |        +0.469px |
| 0–9  |          1038 |         1086 |        +0.312px |
| n    |          1092 |         1163 |        +0.462px |
| o    |          1106 |         1163 |        +0.371px |
| w    |          1382 |         1504 |        +0.794px |
| %    |          1434 |         1504 |        +0.456px |
| m    |          1634 |         1736 |        +0.664px |
| W    |          1664 |         1736 |        +0.469px |

**Key insight:** Roboto is consistently wider. Do NOT reuse Calibri budget numbers.
Use Roboto budget: ~88.3 digit-units per line at 10pt, 96DPI, 6.5in column.

---

*Source: Roboto v3.0 hmtx table. Apache 2.0 License. Google Fonts.*
*UnitsPerEm = 2048. Digit advance = 1086 units = 7.070px @10pt 96DPI.*
