# Point 6: FINAL CORRECT VERSION — Complete & Accurate

**Date:** 2026-03-09
**Status:** FINAL, CORRECT
**CRITICAL RULE:** Output location = sync-artifacts ALWAYS
**FILENAME FORMAT:** [TargetCompanyName]_[TargetRole]_Resume_[Date]

---

## Point 6: 4 Things

### Q1: Format?

```
HTML + CSS ✅
(Not PDF, not multiple options - just HTML+CSS)
```

---

### Q2: Location Kahan Hona Chahiye?

```
ONLY THIS:
/Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/

NEVER:
- Obsidian Vault ❌
- Desktop ❌
- Custom paths ❌
- Anywhere else ❌

ALWAYS:
sync-artifacts ✅
```

---

### Q3: Filename Format (CORRECTED)

```
Pattern: [TargetCompanyName]_[TargetRole]_Resume_[Date].html

Breakdown:
  [TargetCompanyName] = Company you're applying to
  [TargetRole]        = Job title/role
  Resume              = Fixed word
  [Date]              = Today's date (YYYY-MM-DD)
  .html               = File extension

Examples:

  Application 1: Google, Senior Backend Engineer, 2026-03-09
    Filename: Google_SeniorBackendEngineer_Resume_2026-03-09.html

  Application 2: Spotify, Staff ML Engineer, 2026-03-09
    Filename: Spotify_StaffMLEngineer_Resume_2026-03-09.html

  Application 3: Amazon, Principal Engineer, 2026-03-09
    Filename: Amazon_PrincipalEngineer_Resume_2026-03-09.html

  Application 4: Google again, 2026-03-15 (different role/date)
    Filename: Google_SoftwareEngineer_Resume_2026-03-15.html
    (Different role = different filename)
```

---

### Q4: Directory Structure

```
/sync-artifacts/
├── Google/
│   ├── 2026-03-09/
│   │   └── Google_SeniorBackendEngineer_Resume_2026-03-09.html
│   └── 2026-03-15/
│       └── Google_SoftwareEngineer_Resume_2026-03-15.html
│
├── Spotify/
│   └── 2026-03-09/
│       └── Spotify_StaffMLEngineer_Resume_2026-03-09.html
│
└── Amazon/
    └── 2026-03-09/
        └── Amazon_PrincipalEngineer_Resume_2026-03-09.html
```

---

## Complete Timeline

```
PHASE A (Abhi):
  User Input:
    Company: Google
    Role: Senior Backend Engineer
    Point 6:
      Q1: Format? → HTML+CSS ✅
      Q2: Location? → sync-artifacts ✅
      Q3: Filename? → Google_SeniorBackendEngineer_Resume_[Date].html ✅
      Q4: Directory? → /sync-artifacts/Google/[Date]/ ✅

  System Saves:
    session-preferences.yaml {
      company: "Google",
      role: "Senior Backend Engineer",
      output_location: "/sync-artifacts/",
      output_filename_pattern: "[Company]_[Role]_Resume_[Date].html",
      output_directory: "/sync-artifacts/Google/2026-03-09/"
    }

PHASES D-M (Baad mein):
  Phases D-L: Generate + customize + format resume

  Phase M:
    1. Read session-preferences.yaml
    2. Check: Location = /sync-artifacts/ ✅
    3. Check: Company = Google ✅
    4. Check: Role = Senior Backend Engineer ✅
    5. Check: Date = 2026-03-09 ✅
    6. Generate filename: Google_SeniorBackendEngineer_Resume_2026-03-09.html
    7. Create directory: /sync-artifacts/Google/2026-03-09/
    8. Save file there ✅

RESULT:
  /Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/Google/2026-03-09/
  └── Google_SeniorBackendEngineer_Resume_2026-03-09.html ✅

YOU:
  Open this file
  Share with recruiter
  Archive (already in organized location)
```

---

## Point 6: Complete Summary

| Q | What | Answer |
|---|------|--------|
| 1 | Format? | HTML + CSS |
| 2 | Location? | `/sync-artifacts/` (ONLY) |
| 3 | Filename? | `[Company]_[Role]_Resume_[Date].html` |
| 4 | Directory? | `/sync-artifacts/[Company]/[Date]/` |

---

## Examples: Different Scenarios

### Scenario A: Google Application

```
Input:
  Company: Google
  Role: Senior Backend Engineer
  Date: 2026-03-09

Result:
  Directory: /sync-artifacts/Google/2026-03-09/
  Filename: Google_SeniorBackendEngineer_Resume_2026-03-09.html
  Full path: /sync-artifacts/Google/2026-03-09/Google_SeniorBackendEngineer_Resume_2026-03-09.html
```

### Scenario B: Spotify Application

```
Input:
  Company: Spotify
  Role: Staff ML Engineer
  Date: 2026-03-09

Result:
  Directory: /sync-artifacts/Spotify/2026-03-09/
  Filename: Spotify_StaffMLEngineer_Resume_2026-03-09.html
  Full path: /sync-artifacts/Spotify/2026-03-09/Spotify_StaffMLEngineer_Resume_2026-03-09.html
```

### Scenario C: Google Again (Different Role, Different Date)

```
Input:
  Company: Google
  Role: Software Engineer (different from first)
  Date: 2026-03-15 (different date)

Result:
  Directory: /sync-artifacts/Google/2026-03-15/
  Filename: Google_SoftwareEngineer_Resume_2026-03-15.html
  Full path: /sync-artifacts/Google/2026-03-15/Google_SoftwareEngineer_Resume_2026-03-15.html

Note: Both Google applications stored separately by role + date
```

---

## CRITICAL RULES (NEVER BREAK)

```
RULE 1: Output Location
  ✅ ALWAYS: /sync-artifacts/
  ❌ NEVER: Anywhere else

RULE 2: Filename Format
  ✅ ALWAYS: [Company]_[Role]_Resume_[Date].html
  ❌ NEVER: Include your name (Satvik Jain)
  ❌ NEVER: Use custom names

RULE 3: Directory Structure
  ✅ ALWAYS: /sync-artifacts/[Company]/[Date]/
  ❌ NEVER: Flat structure
  ❌ NEVER: Different organization

RULE 4: All Phases
  ✅ ALWAYS: All outputs go to sync-artifacts
  ❌ NEVER: Save phase outputs elsewhere
```

---

## What Changed From Previous Versions

```
BEFORE (❌ WRONG):
  Location: Obsidian Vault OR Desktop
  Filename: [Company]_Satvik_Jain_Resume_[Date].html

AFTER (✅ CORRECT):
  Location: ONLY /sync-artifacts/
  Filename: [Company]_[Role]_Resume_[Date].html
  (No "Satvik Jain" in filename, includes target role)
```

---

## Point 6 Form (Final Version)

```
╔════════════════════════════════════════════════════════════════╗
║              POINT 6: OUTPUT PREFERENCES (FINAL)                ║
╚════════════════════════════════════════════════════════════════╝

Q1: Format?
    ✅ HTML + CSS

Q2: Location kahan hona chahiye?
    ✅ /Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/
    (NO other option)

Q3: Filename Pattern?
    ✅ [TargetCompanyName]_[TargetRole]_Resume_[Date].html

    Example: Google_SeniorBackendEngineer_Resume_2026-03-09.html
    (Auto-generated from your company + role input)

Q4: Directory Structure?
    ✅ /sync-artifacts/[Company]/[Date]/
    (Auto-created by system)

[✅ CONFIRM & PROCEED]
```

---

## Summary: Point 6 FINAL & CORRECT

```
Location:   /sync-artifacts/ (ALWAYS, NEVER elsewhere)
Format:     HTML + CSS (ONLY)
Filename:   [Company]_[Role]_Resume_[Date].html (AUTO)
Directory:  /sync-artifacts/[Company]/[Date]/ (AUTO)

RULE:       NEVER DEVIATE. ALWAYS use sync-artifacts.
            FOREVER. NO EXCEPTIONS.

This is the official Linkright output system.
```

---

**Ab bilkul FINAL aur CORRECT ho gaya na?** 🎯

- Location: sync-artifacts ✅
- Filename: [Company]_[Role]_Resume_[Date].html ✅
- RULE: ALWAYS, NEVER deviate ✅
