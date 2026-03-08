# Phase A: Point 6 — Output Preferences Complete Explanation

**Date:** 2026-03-09
**Point:** 6 out of 6 decision points in Phase A
**Status:** Fully Detailed
**Your Role:** Make these 5 decisions before Phase D starts

---

## Quick Context

Phase A has **6 major components:**

1. **Load Obsidian Vault** → Your projects, achievements, skills
2. **Ask Question 1** → Template mode (CV vs Portfolio vs Combined)
3. **Ask Question 2** → Company & JD targeting
4. **Ask Question 3** → Brand colors for resume
5. **Ask Question 4** → Layout density (spacious vs compact)
6. **Ask Question 5** → Output preferences ← **THIS IS POINT 6**
7. **Save Everything** → session-preferences.yaml

**Point 6** is specifically about **Output Preferences** — where, what format, and how your final resume will be saved.

---

## Point 6: Complete Explanation with Real Examples

### What is "Output"?

**Output** = Your finished resume file that Phases D-M generate

```
Phases D-M (13 phases)
       ↓
       ↓ (Generate customized resume)
       ↓
   OUTPUT ← Point 6 controls this
       ↓
Two Options:
  Option A: PDF file (printable, professional)
  Option B: HTML file (interactive, can be shared as link)
  Option C: Both files (maximum flexibility)
```

---

## Part 1: The 5 Output Preference Decisions

### Decision A: What Format Do You Want?

**Question:** "Mujhe kaunsa format chahiye? PDF ya HTML ya dono?"

**Option A1: PDF Only**
```yaml
What is PDF?
  - Printable format (print-to-paper, ATS systems)
  - Static document (no interactivity)
  - File size: ~1-2MB per resume
  - How to use: Email to recruiter, upload to job portal
  - Appearance: Matches exactly on all devices (100% consistent)

When to choose PDF?
  - Applying to formal jobs (corporate, big tech)
  - Submitting to job boards (LinkedIn, Indeed, etc.)
  - Traditional hiring process
  - You want 100% guarantee of formatting

Example Use Case:
  You apply to 10 companies → Generate 10 PDFs (one per company)
  Each PDF is customized for that company's brand colors
  Each PDF is 1.2MB, ready to email
```

**Option A2: HTML Only**
```yaml
What is HTML?
  - Interactive format (clicks, hover effects, navigation)
  - Web-based (can be opened in any browser)
  - File size: ~500KB per resume
  - How to use: Share link, embed in website, portfolio
  - Appearance: Responsive (adapts to screen size)

When to choose HTML?
  - Sharing via personal website or portfolio
  - LinkedIn profile (embed HTML resume)
  - Direct email (recipient opens in browser)
  - You want interactive Material 3 design visible
  - You want to showcase portfolio side-by-side

Example Use Case:
  You send recruiter a link: "myportfolio.com/google-resume"
  They open it in browser, see Material 3 left sidebar with:
    - Your photo
    - Interactive navigation
    - Downloadable PDF from sidebar button
    - Color-customized for Google (blue buttons, blue headers)
```

**Option A3: Both (Recommended)**
```yaml
What is Both?
  - Generate BOTH PDF and HTML in same session
  - Use PDF for formal submissions (job boards, ATS)
  - Use HTML for personal sharing (direct contact, portfolio)
  - Takes same time as single format
  - Maximum flexibility

When to choose Both?
  - You want all options available
  - Different companies prefer different formats
  - You want to send PDF to corporate, HTML to startup
  - You want a backup (if PDF breaks, use HTML)
  - You want to showcase Material 3 design

Example Use Case:
  You apply to Google AND a startup:

  → Google (corporate, formal):
     Send: Google_Satvik_Resume.pdf
     Method: Email attachment to recruiter

  → Startup (modern, tech-forward):
     Send: Link to Google_Satvik_Portfolio.html
     Method: "Check out my portfolio: [link]"
     They see: Material 3 design, interactive navigation, download button
```

**Decision A: Template Recommended**
```
If you will apply to many companies in bulk:
  → Choose: Both (PDF + HTML)
  → Logic: Maximum flexibility, use PDF for formal, HTML for personal
```

---

### Decision B: Where to Save?

**Question:** "Output files kahan save karun?"

**Option B1: Obsidian Vault (Recommended)**
```yaml
What is Obsidian Vault?
  - Your personal knowledge base
  - Path: ~/Obsidian/Career/
  - Organized, searchable, backed up
  - Part of your existing system

Folder Structure Created:
  ~/Obsidian/
  └── Career/
      └── Resumes/
          ├── Google/
          │   └── 2026-03-09/
          │       ├── Google_Satvik_Resume.pdf
          │       └── Google_Satvik_Portfolio.html
          ├── Spotify/
          │   └── 2026-03-09/
          │       ├── Spotify_Satvik_Resume.pdf
          │       └── Spotify_Satvik_Portfolio.html
          ├── Amazon/
          │   └── 2026-03-09/
          │       ├── Amazon_Satvik_Resume.pdf
          │       └── Amazon_Satvik_Portfolio.html
          └── ... (more companies)

Filename Format:
  [CompanyName]_[YourName]_Resume_[Date].[pdf/html]
  Examples:
    - Google_Satvik_Jain_Resume_2026-03-09.pdf
    - Spotify_Satvik_Jain_Portfolio_2026-03-09.html

Benefits:
  ✅ Organized by company (easy to find later)
  ✅ Organized by date (track revisions)
  ✅ Part of your vault (searchable via Obsidian)
  ✅ Backed up with vault
  ✅ Historical record (see how you optimized for each company)
  ✅ No cleanup needed (organized archive)

When to choose Vault?
  - You want to keep all resumes organized
  - You want historical record
  - You want searchable archive
  - You value long-term organization
```

**Option B2: Desktop (Quick Access)**
```yaml
What is Desktop?
  - Quick, temporary location
  - Path: ~/Desktop/
  - Easy to find, easy to share
  - Less organized

Files Saved:
  ~/Desktop/
  ├── Google_Satvik_Resume.pdf
  ├── Google_Satvik_Portfolio.html
  ├── Spotify_Satvik_Resume.pdf
  ├── Spotify_Satvik_Portfolio.html
  └── ... (more files, gets messy)

Problems:
  ❌ Desktop gets cluttered (10+ files)
  ❌ Hard to find old resumes (which Google one? from when?)
  ❌ No date tracking
  ❌ Manual cleanup needed
  ❌ Not backed up with vault

When to choose Desktop?
  - Quick one-off resume generation
  - You're applying to ONE company right now
  - You'll delete files after using them
  - Temporary workflow (not recurring)
```

**Option B3: Custom Path**
```yaml
What is Custom Path?
  - You specify exact folder
  - Example: ~/Downloads/Resumes/
  - Example: ~/Documents/Job Applications/
  - Anywhere you want

When to choose Custom?
  - You have specific folder structure
  - You're integrating with another system
  - You want non-standard location
```

**Decision B: Recommendation**
```
Recommended Setup:
  Primary: Obsidian Vault (organized, long-term)
  Secondary: Desktop (quick access, temporary)

Best Practice:
  1. Save to Vault by default (main location)
  2. Copy to Desktop when needed for immediate sharing
  3. Clean Desktop weekly (don't accumulate)
```

---

### Decision C: Filename & Date Convention

**Question:** "Files kaunse naam se save ho?"

**Standard Convention:**
```yaml
Format: [CompanyName]_[YourName]_[Type]_[Date].ext

Examples:
  Google_Satvik_Jain_Resume_2026-03-09.pdf
  Google_Satvik_Jain_Portfolio_2026-03-09.html
  Spotify_Satvik_Jain_Resume_2026-03-09.pdf
  Amazon_Satvik_Jain_Resume_2026-03-09.pdf

Why this convention?
  ✅ Company name first (easy to find for that company)
  ✅ Your name (clear who this is for)
  ✅ Type (pdf vs html, at a glance)
  ✅ Date (track which version from when)
  ✅ Easy to sort in file explorer (alphabetical = by company)

Alternative Convention (if applying multiple times to same company):
  Google_Satvik_Jain_Resume_2026-03-09_v1.pdf
  Google_Satvik_Jain_Resume_2026-03-15_v2.pdf ← Updated for different role
  (Date changes each time you re-optimize for same company)
```

**Decision C: Auto-Generated**
```
You don't manually choose filenames.
Linkright auto-generates them using:
  - Company name from Phase A (Question B)
  - Your name (hardcoded as "Satvik Jain")
  - Type (pdf or html based on Decision A)
  - Current date
```

---

## Part 2: How Point 6 Flows to Phases D-M

### Phase D → E → F → ... → M

```
Phase A (Your Decisions)
  ↓
  ├─ Decision A: Format = "PDF + HTML"
  ├─ Decision B: Location = "Obsidian Vault"
  └─ Saves to: session-preferences.yaml

Phase D → E → F → G → H → I → J → K → L
  ↓
  (13 phases generate content, optimize signals, score, write bullets)

Phase M (Final)
  ↓
  Reads: session-preferences.yaml

  "Where should I save the final resume?"
  → Check: preferences.output_location = "obsidian-vault"
  → Check: preferences.output_format = "pdf+html"

  "Create what?"
  → Create: Google_Satvik_Jain_Resume_2026-03-09.pdf
  → Create: Google_Satvik_Jain_Portfolio_2026-03-09.html

  "Save where?"
  → Save to: ~/Obsidian/Career/Resumes/Google/2026-03-09/

  "Done! Files saved. Verify below:
    ✓ PDF rendered correctly
    ✓ HTML interactive
    ✓ Files in correct location
    ✓ Ready to use"
```

---

## Part 3: Real-World Scenario Examples

### Scenario 1: You're Applying to Google

```yaml
Point 6 Decisions (Phase A):

  A. Format?
     → Both (PDF + HTML)
     Reasoning: I want to send PDF to formal recruiter,
                but also share HTML portfolio with friends

  B. Where to save?
     → Obsidian Vault
     Reasoning: I'll apply to many companies, want organized archive

Result (Phase M):
  Files created:
    ~/Obsidian/Career/Resumes/Google/2026-03-09/
      ├── Google_Satvik_Jain_Resume_2026-03-09.pdf
      └── Google_Satvik_Jain_Portfolio_2026-03-09.html

How you use it:
  Step 1: Email resume to recruiter
    → Attach: Google_Satvik_Jain_Resume_2026-03-09.pdf
    → Subject: "Satvik Jain — Senior Backend Engineer Application"
    → Recruiter downloads PDF, uploads to ATS

  Step 2: Share with friend who works at Google
    → Message: "Check out my portfolio: [link to HTML]"
    → Friend opens in browser, sees Material 3 design,
      Google colors, interactive navigation
    → Friend impressed, refers you

  Step 3: Archive for later
    → File stays in Obsidian vault
    → 6 months later, Google re-opens requisition
    → You find resume: "Ah, I already optimized this"
    → You can see what you emphasized before
```

### Scenario 2: You're Applying to Spotify

```yaml
Point 6 Decisions (Phase A):

  A. Format?
     → PDF only
     Reasoning: Spotify's hiring pipeline uses ATS,
                they won't read HTML anyway

  B. Where to save?
     → Obsidian Vault
     Reasoning: Keep everything organized in vault

Result (Phase M):
  Files created:
    ~/Obsidian/Career/Resumes/Spotify/2026-03-09/
      └── Spotify_Satvik_Jain_Resume_2026-03-09.pdf
             (No HTML file, only PDF)

How you use it:
  Step 1: Apply via Spotify Careers website
    → Upload: Spotify_Satvik_Jain_Resume_2026-03-09.pdf
    → ATS parses it automatically
    → Your Spotify-brand-colored resume goes through screening

  Step 2: No need to share HTML
    → Spotify is corporate, not startup
    → They won't appreciate interactive design
    → PDF is enough
```

### Scenario 3: Quick Desktop Test

```yaml
Point 6 Decisions (Phase A):

  A. Format?
     → Both
     Reasoning: I want to see both formats

  B. Where to save?
     → Desktop (temporary, quick test)
     Reasoning: I'll delete after testing, not keeping

Result (Phase M):
  Files created:
    ~/Desktop/
      ├── Amazon_Satvik_Jain_Resume_2026-03-09.pdf
      └── Amazon_Satvik_Jain_Portfolio_2026-03-09.html

How you use it:
  Step 1: Test in browser
    → Open: Amazon_Satvik_Jain_Portfolio_2026-03-09.html
    → Browser shows Material 3 design
    → You test: "Do colors look good? Is layout correct?"

  Step 2: Test in PDF viewer
    → Open: Amazon_Satvik_Jain_Resume_2026-03-09.pdf
    → Adobe Reader shows printable resume
    → You test: "Does it fit one page? Are metrics bold?"

  Step 3: Approve
    → Both look good
    → You move them to Vault: mv ~/Desktop/Amazon*.* ~/Obsidian/Career/Resumes/Amazon/2026-03-09/

  Step 4: Keep vault as long-term archive
    → Desktop is now clean
```

---

## Part 4: Complete Input Form for Point 6

This is what you actually fill out in Phase A:

```
═══════════════════════════════════════════════════════════════════
  PHASE A: POINT 6 — OUTPUT PREFERENCES
═══════════════════════════════════════════════════════════════════

Question A: Output Format
  What would you like to generate?

  ○ PDF only
    (Professional, printable, for formal submissions)

  ○ HTML only
    (Interactive portfolio, shareable via link)

  ◉ Both PDF and HTML ← RECOMMENDED
    (Maximum flexibility, use for different contexts)

Question B: Save Location
  Where should I save the files?

  ◉ Obsidian Vault ← RECOMMENDED
    └── ~/Obsidian/Career/Resumes/[Company]/[Date]/
    ✓ Organized by company
    ✓ Organized by date
    ✓ Backed up
    ✓ Searchable

  ○ Desktop
    └── ~/Desktop/
    ✓ Quick access
    ✓ Easy to share
    ✗ Gets cluttered
    ✗ Not backed up

  ○ Custom Path
    └── [_____________________]

[Continue to Validation]

═══════════════════════════════════════════════════════════════════
  SUMMARY OF YOUR POINT 6 DECISIONS
═══════════════════════════════════════════════════════════════════

Format:          ◉ Both (PDF + HTML)
Location:        ◉ Obsidian Vault
Company:         Google
Date:            2026-03-09

Files will be saved to:
  ~/Obsidian/Career/Resumes/Google/2026-03-09/
    ├── Google_Satvik_Jain_Resume_2026-03-09.pdf
    └── Google_Satvik_Jain_Portfolio_2026-03-09.html

Next: Continue to Phase D (Persona Scoring)
[✓ Confirm] [← Back to Edit] [? Help]
```

---

## Part 5: Validation (Phase A Exit)

Before Phase D starts, system validates Point 6:

```yaml
Validation Checklist for Point 6:

  ✓ Output format selected (pdf | html | both)

  ✓ Output location provided
    - Obsidian Vault accessible (path exists, writable)
    - OR Desktop accessible (path exists, writable)
    - OR custom path accessible

  ✓ Filename format valid
    - [Company]_[YourName]_[Type]_[Date].ext pattern
    - No invalid characters
    - Reasonable length

  ✓ Storage space available
    - Vault folder has space for files (10+ MB)
    - OR Desktop has space

  ✓ Date picked sensibly
    - Not in the future
    - Matches session date (today)

If ALL checks pass:
  ✅ Point 6 is VALID
  ✅ Move to Phase D

If ANY check fails:
  ❌ Ask user to fix
  Example:
    "Obsidian Vault path not found. Please provide correct path."
    → User enters: ~/Obsidian/Career/
    → System checks again
    → ✅ Valid
```

---

## Part 6: FAQ About Point 6

**Q: Do I have to decide right now? Can I change my mind later?**
```
A: You decide in Phase A (now). You CAN'T change mid-workflow.
   Rationale: Phases D-M depend on knowing where to save output.
   If you're unsure, choose defaults:
     - Format: Both (covers all cases)
     - Location: Obsidian Vault (organized, safe)
```

**Q: What if my Obsidian Vault path is different?**
```
A: Tell Linkright in Phase A.
   Default: ~/Obsidian/Career/
   Custom: User can enter any path
   System will create subdirectories automatically:
     /Resumes/[Company]/[Date]/ if doesn't exist
```

**Q: Can I generate multiple PDFs for different companies?**
```
A: YES! Generate once per company:
   - Company: Google → outputs Google_*.pdf
   - Company: Spotify → outputs Spotify_*.pdf
   - Company: Amazon → outputs Amazon_*.pdf
   Each will have:
     - Different brand colors
     - Different signals emphasized
     - Different content (tailored to JD)
   All saved in same vault, organized by company folder
```

**Q: Can I change the filename?**
```
A: No, system auto-generates based on:
   - Company name (from Phase A)
   - Your name (hardcoded)
   - Format type (pdf/html)
   - Date (today)

   Filename is: [Company]_Satvik_Jain_[Type]_[Date].ext

   You can manually rename after if needed, but system generates
   the standard format.
```

**Q: What if I want to save to multiple places?**
```
A: Not supported in Point 6.
   Choose ONE primary location.
   After generation, you can manually copy to other places.

   OR:
   - Generate to Vault (primary)
   - Download to Desktop manually when needed
   - Delete from Desktop after use
   - Keep Vault as long-term archive
```

**Q: How much disk space do I need?**
```
A: Per resume:
   - PDF: ~1-2 MB (printable, self-contained)
   - HTML: ~500KB (web-based, includes CSS)
   - Both: ~1.5-2.5 MB per company

   If applying to 10 companies:
   - 10 PDFs = ~15 MB
   - 10 HTMLs = ~5 MB
   - 10 Both = ~20 MB total

   Minimal storage requirement.
```

---

## Summary

**Point 6: Output Preferences** answers 3 questions:

1. **Format:** PDF, HTML, or Both?
   - **Best answer:** Both (flexibility)

2. **Location:** Where to save?
   - **Best answer:** Obsidian Vault (organized, backed up)

3. **Filenames:** How to name?
   - **Auto-generated:** [Company]_Satvik_Jain_[Type]_[Date].ext

**These decisions are made in Phase A, used in Phase M.**

After Point 6, you're ready for Phase D. All context + preferences are saved in `session-preferences.yaml`.

---

## Visual Flow: Phase A Complete (All 6 Points)

```
PHASE A: LOAD SESSION CONTEXT
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Load Obsidian Vault Context                               │
│  ├─ Projects: [______] loaded                              │
│  ├─ Achievements: [______] loaded                          │
│  └─ Skills: [______] loaded                                │
│                                                             │
│  Point 1: Company & JD                                     │
│  ├─ Company: [________________]                            │
│  └─ JD: [________________________]                          │
│                                                             │
│  Point 2: Template Mode                                    │
│  ├─ ○ CV  ○ Portfolio  ◉ Combined                           │
│                                                             │
│  Point 3: Brand Colors                                     │
│  ├─ Primary: [#4285F4]                                     │
│  ├─ Scenario: [Multi-chromatic/Mono/Dual-tone]            │
│  └─ WCAG: ✓ Compliant                                      │
│                                                             │
│  Point 4: Typography & Layout                              │
│  ├─ Density: [Spacious / ◉ Compact]                         │
│  └─ Font Size: [9.5pt / 10pt]                              │
│                                                             │
│  Point 5: Output Format & Location ← THIS IS POINT 6      │
│  ├─ Format: [PDF / HTML / ◉ Both]                           │
│  ├─ Location: [◉ Vault / Desktop / Custom]                  │
│  ├─ Path: [~/Obsidian/Career/Resumes/Google/2026-03-09/]  │
│  └─ Filenames (auto): [Google_Satvik_*.pdf/html]           │
│                                                             │
│  Save All Decisions                                        │
│  └─ session-preferences.yaml ✓                            │
│                                                             │
│  Validation                                                │
│  ├─ ✓ All context loaded                                   │
│  ├─ ✓ All preferences complete                             │
│  ├─ ✓ Colors WCAG compliant                                │
│  ├─ ✓ Output location accessible                           │
│  └─ ✓ Ready for Phase D                                    │
│                                                             │
│  [→ PROCEED TO PHASE D: PERSONA SCORING]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

For engineers implementing Point 6:

```yaml
Beads Task: P1-6-E: Output Path Handling

Subtasks:
  ☐ Create output path configuration system
  ☐ Obsidian Vault path detection (auto-find if exists)
  ☐ Desktop path fallback
  ☐ Custom path input validation
  ☐ Auto-create subdirectories if missing
  ☐ Filename generation: [Company]_[Name]_[Type]_[Date]
  ☐ File write permissions validation
  ☐ Disk space check (warn if <10MB available)
  ☐ Validation gate: ensure path is writable before Phase D
  ☐ Unit tests for all path scenarios
  ☐ Integration with Phase M export (read preferences, write files)
```

This is **Point 6** explained completely: **Output Preferences** that tell Phases D-M where and how to save your final resume.
