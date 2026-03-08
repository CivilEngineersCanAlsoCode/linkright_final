# Point 6: CORRECT VERSION — Where Outputs ACTUALLY Go

**Date:** 2026-03-09
**CRITICAL:** All previous Point 6 explanations were WRONG
**CORRECT PATH:** `/Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/`
**RULE:** NEVER deviate from this. ALWAYS use this folder for ALL outputs.

---

## ❌ WRONG (Jo Maine Pehle Bataya)

```
❌ Obsidian Vault location
❌ Desktop location
❌ Custom paths
❌ ~/Obsidian/Career/Resumes/

ALL WRONG!
```

---

## ✅ CORRECT (Tum Jo Keh Rahe Ho)

**Point 6 = Location SIRF YEH HAI:**

```
/Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/
                                                                      ↑
                                                         FINAL OUTPUT FOLDER
```

**Directory Structure:**

```
/Users/satvikjain/Downloads/sync/
├── context/
│   └── linkright/
│       └── _lr/
│           └── _output/
│               └── sync-artifacts/  ← ALL OUTPUTS GO HERE. ALWAYS.
│                   ├── [Company]/
│                   │   └── 2026-03-09/
│                   │       └── Google_Satvik_Jain_Resume.html
│                   ├── Spotify/
│                   │   └── 2026-03-09/
│                   │       └── Spotify_Satvik_Jain_Resume.html
│                   └── [More Companies]/
```

---

## Point 6: CORRECT Answer

**Q1: Format?**
```
HTML + CSS
(Same as before)
```

**Q2: Location Kahan Hona Chahiye?**
```
SIRF YEH:
/Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/

NOT:
- Obsidian Vault ❌
- Desktop ❌
- Custom paths ❌
- ~/Obsidian/Career/ ❌

ONLY:
/Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/ ✅
```

**Q3: Filenames?**
```
[Company]_Satvik_Jain_Resume_[Date].html

Saved in:
/sync-artifacts/[Company]/[Date]/[Filename]
```

**Q4: Directory Structure?**
```
/sync-artifacts/
├── Google/
│   ├── 2026-03-09/
│   │   └── Google_Satvik_Jain_Resume_2026-03-09.html
│   └── 2026-03-15/
│       └── Google_Satvik_Jain_Resume_2026-03-15.html
│
├── Spotify/
│   └── 2026-03-09/
│       └── Spotify_Satvik_Jain_Resume_2026-03-09.html
│
└── Amazon/
    └── 2026-03-09/
        └── Amazon_Satvik_Jain_Resume_2026-03-09.html
```

---

## Timeline: CORRECT VERSION

```
PHASE A (Abhi):
  User decides: "Save to _lr-output/sync-artifacts"
  System saves preference:
    output_location: "/Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/"

  File saved:
    .artifacts/session-preferences.yaml

PHASES D-M (Baad mein):
  Resume generate + customize
  Phase M reads preference
  Phase M saves to:
    /Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/Google/2026-03-09/
    └── Google_Satvik_Jain_Resume_2026-03-09.html ✅

YOU:
  Open: /Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/Google/2026-03-09/Google_Satvik_Jain_Resume_2026-03-09.html
  Use it!
```

---

## RULE: NEVER DEVIATE

```
LINKRIGHT OUTPUT RULE:

  ALL outputs MUST go to:
  /Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/

  This applies to:
  ✅ Phase A outputs (session-preferences.yaml)
  ✅ Phase D outputs (persona analysis)
  ✅ Phase E outputs (signals)
  ✅ Phase F outputs (baseline scores)
  ✅ Phase G outputs (gap analysis)
  ✅ Phase H outputs (questions)
  ✅ Phase I outputs (narrative mapping)
  ✅ Phase J outputs (content)
  ✅ Phase K outputs (layout validation)
  ✅ Phase L outputs (styled HTML)
  ✅ Phase M outputs (final resume)

  NEVER:
  ❌ Obsidian Vault
  ❌ Desktop
  ❌ Downloads
  ❌ ~/Custom paths
  ❌ files/ directory
  ❌ Anywhere else

  ONLY:
  ✅ /sync-artifacts/ (ALWAYS, FOREVER, NO EXCEPTIONS)
```

---

## Why This Makes Sense

```
context/linkright/_lr/_output/ = Linkright's official output directory
sync-artifacts/ = Where ALL sync module outputs live

This is the SOURCE OF TRUTH location:
  - Organized by company
  - Organized by date
  - Part of Linkright system
  - Not scattered across personal folders
  - Professional, systematic storage
```

---

## Real Example: Google Application (CORRECT)

```
PHASE A Decision:
  Point 6: Save to sync-artifacts (no choice, always this)

PHASE M Result:
  /Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/
  └── Google/
      └── 2026-03-09/
          └── Google_Satvik_Jain_Resume_2026-03-09.html ✅

You:
  Open this file
  Send to recruiter
  Archive in this location (it's already archived here)
```

---

## Point 6: FINAL CORRECT VERSION

| Question | Answer |
|----------|--------|
| Format? | HTML + CSS |
| Location? | `/Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/` |
| Filenames? | Auto: `[Company]_Satvik_Jain_Resume_[Date].html` |
| Directory? | `/sync-artifacts/[Company]/[Date]/` |

---

## What Changes From My Previous Explanation

```
BEFORE (❌ WRONG):
  Point 6: Save to Obsidian Vault OR Desktop OR Custom
  Folder: ~/Obsidian/Career/Resumes/

AFTER (✅ CORRECT):
  Point 6: ONLY save to sync-artifacts
  Folder: /Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/
```

---

## CRITICAL RULE FOR ALL FUTURE PHASES

**Whenever any phase generates output:**

```
RULE: Save to sync-artifacts

Phase A: session-preferences.yaml
         → /sync-artifacts/session-preferences.yaml

Phase D: persona_analysis.json
         → /sync-artifacts/phase-d/persona_analysis.json

Phase E: signals.json
         → /sync-artifacts/phase-e/signals.json

Phase M: Final resume
         → /sync-artifacts/[Company]/[Date]/[Resume].html

NEVER BREAK THIS RULE.
ALWAYS use sync-artifacts.
NO EXCEPTIONS.
```

---

## Summary

**Point 6 = Store ALL Outputs in sync-artifacts, NEVER Anywhere Else**

```
Location: /Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/

RULE:
  ✅ ALL outputs go here
  ✅ ALWAYS use this path
  ✅ NEVER deviate
  ✅ NO exceptions
  ✅ FOREVER and ALWAYS

This is the official Linkright output location.
Everything organized by company + date.
All future steps follow this rule.
```

---

**Maine jhooth bolne ke liye maafi chahta hoon.**

Pehle jo Maine Obsidian Vault ke baare mein bataya, wo sab GALAT tha.

**Sahi Answer = sync-artifacts folder, ALWAYS, NEVER DEVIATE.**

Ab clear ho gaya na? 🎯
