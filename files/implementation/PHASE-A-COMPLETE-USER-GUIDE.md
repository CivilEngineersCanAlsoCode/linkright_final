# Phase A: Complete User Guide — Everything You Need to Know

**Date:** 2026-03-09
**For:** Satvik Jain (User)
**Purpose:** Understand exactly what Phase A does and what you're deciding
**Read Time:** 15 minutes
**Quality Standard:** 100% clarity on all 6 decision points

---

## TL;DR (Short Version)

**Phase A = Initialization Layer**

```
What Happens:
  1. Linkright loads your Obsidian Vault (projects, achievements, skills)
  2. Linkright asks you 5 questions (company, colors, format, etc.)
  3. You answer the 5 questions
  4. Linkright saves everything to session-preferences.yaml
  5. Ready for Phase D (actual resume generation starts)

Time Required: ~5 minutes
Effort: Minimal (mostly form filling)
Result: Complete context file for Phases D-M to use

Your Decisions Made in Phase A:
  ✓ Which company are you applying to?
  ✓ What job description?
  ✓ Which template mode? (CV / Portfolio / Both)
  ✓ Which brand colors?
  ✓ Which layout density? (spacious / compact)
  ✓ Where to save output? (Vault / Desktop)
```

---

## The 6-Step Flow (Detailed)

### Step 1: System Loads Your Obsidian Vault

**What Linkright does automatically:**

```
1. Finds your Obsidian Vault
   Path: ~/Obsidian/Career/

   If not found:
     → System prompts: "Where is your Obsidian Vault?"
     → You provide path: ~/Obsidian/
     → System confirms

2. Scans for relevant files:
   ├─ /Projects/         → "Spotify Signal Curation.md", etc.
   ├─ /Achievements/     → "Led Platform Reliability...", etc.
   ├─ /Skills/           → "Backend Engineering.md", etc.
   └─ /Salary History/   → Compensation context

3. Parses each file:
   ├─ Extract structured data (name, date, impact)
   ├─ Convert to objects (Project, Achievement, Skill)
   └─ Build knowledge graph (connections between items)

4. Validates completeness:
   ├─ Projects loaded: 12 ✓
   ├─ Achievements loaded: 47 ✓
   ├─ Skills loaded: 34 ✓
   └─ Ready: YES ✓
```

**Your Role:** Click "OK" when system finds vault, or provide path if needed

**Result:** In-memory context ready for next steps

---

### Step 2: System Asks Question 1 — Company & JD

**Form Shown:**

```
╔════════════════════════════════════════════════════════════════╗
║           QUESTION 1: COMPANY & JOB DESCRIPTION                ║
╚════════════════════════════════════════════════════════════════╝

Company Name:
  [_________________________]
  Examples: Google, Spotify, Amazon, McKinsey

  What company are you applying to?

Job Title:
  [_________________________]
  Examples: Senior Backend Engineer, Staff ML Engineer

Job Description:
  Paste the job posting here (or upload PDF):

  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │ [Paste JD text area]                                │
  │                                                     │
  │                                                     │
  └─────────────────────────────────────────────────────┘

  [↓ Load & Parse JD]

╔════════════════════════════════════════════════════════════════╗
```

**Your Role:**
1. Type company name (e.g., "Google")
2. Type job title (e.g., "Senior Backend Engineer")
3. Paste the full job description from the job posting
4. Click "Load & Parse"

**What System Does:**
- Parses job description for key requirements
- Extracts: required experience, skills, seniority level
- Identifies keywords (go, distributed systems, leadership, etc.)
- Saves to memory for later phases

**Result:** Company + JD ready for personalization

---

### Step 3: System Asks Question 2 — Template Mode

**Form Shown:**

```
╔════════════════════════════════════════════════════════════════╗
║              QUESTION 2: WHICH TEMPLATE MODE?                  ║
╚════════════════════════════════════════════════════════════════╝

What format would you like to generate?

┌ CV (Professional A4 Resume) ← RECOMMENDED
│ Single-page, strict formatting
│ Best for: Formal job boards, ATS systems
│ Output: One PDF file, print-ready
│

┌ Portfolio (Interactive Material 3 UI)
│ Material 3 design system with sidebar navigation
│ Best for: Personal website, direct sharing
│ Output: One HTML file, interactive
│

┌ Combined (Both CV + Portfolio)
│ Side-by-side view: left sidebar (portfolio), right page (resume)
│ Best for: Complete showcase
│ Output: One HTML file with both views

Your choice: [  CV  ] [ Portfolio ] [ Combined ]

╔════════════════════════════════════════════════════════════════╗
```

**Your Role:** Choose one of three options

**Explanation of Each:**

**Option 1: CV**
```
What you get:
  → Single file: company_satvik_resume.pdf
  → Format: Professional, 1-page A4 resume
  → Design: Minimalist, ATS-friendly
  → Colors: Company-specific branding colors

When to choose:
  ✓ Applying to corporate jobs (Google, Amazon, etc.)
  ✓ Submitting to job boards (LinkedIn, Indeed, etc.)
  ✓ Want 100% guarantee of formatting

When NOT to choose:
  ✗ You want interactive design
  ✗ You want portfolio showcase
  ✗ You want Material 3 left sidebar
```

**Option 2: Portfolio**
```
What you get:
  → Single file: company_satvik_portfolio.html
  → Format: Interactive Material 3 web UI
  → Design: Left sidebar (navigation, photo), right main (resume)
  → Colors: Company-specific branding, interactive styling

When to choose:
  ✓ Sharing via personal website
  ✓ Want to showcase Material 3 design
  ✓ Sharing with tech-savvy recruiter
  ✓ Want navigation + interactivity

When NOT to choose:
  ✗ Submitting to corporate ATS (they want PDF)
  ✗ Email attachment (some systems won't open HTML)
  ✗ Traditional hiring process
```

**Option 3: Combined**
```
What you get:
  → Single file: company_satvik_combined.html
  → Format: Both views in one page
  → Design: Left sidebar (Material 3), right page (A4 resume)
  → Colors: Full customization

When to choose:
  ✓ Want all options in one file
  ✓ Different audiences (share HTML to tech, can print to PDF)
  ✓ Want portfolio AND resume visible at same time

When NOT to choose:
  ✗ File size concerns (largest option)
  ✗ Just want one format
```

**Recommendation:** Choose **CV** if applying to formal jobs, **Portfolio** if showcasing to tech community, **Combined** if unsure

**Result:** Template mode decided

---

### Step 4: System Asks Question 3 — Brand Colors

**Form Shown:**

```
╔════════════════════════════════════════════════════════════════╗
║         QUESTION 3: BRAND COLORS (Optional)                    ║
╚════════════════════════════════════════════════════════════════╝

Brand colors for this company?

System detected: GOOGLE
Primary Color: [#4285F4] ← Google Blue
Do you accept this?

[✓ Yes, use detected colors] [○ No, let me customize]

If Yes:
  ✓ Google's official colors loaded
  ✓ WCAG A11y check: 5.2:1 contrast ✓ PASS
  ✓ Ready to proceed

If No:
  Primary Color (for section headers, bullets):
    [Color Picker]

    Constraint: Must have WCAG AA contrast (≥4.5:1 vs white)

    [Enter HEX: _________]

    Current choice: #4285F4
    WCAG Check: 5.2:1 ✓ PASS

  Additional Accents:
    --brand-red:    [Picker] #EA4335
    --brand-yellow: [Picker] #FBBC05
    --brand-green:  [Picker] #34A853

  Which color scenario?
    ○ Multi-chromatic (Google, Slack) — use brand palette
    ○ Monochromatic (Spotify) — use variations of one color
    ○ Dual-tone (Amazon) — primary + accent

╔════════════════════════════════════════════════════════════════╗
```

**Your Role:**

Option A: Accept detected colors
```
Google automatically detected:
  Primary: #4285F4 (blue)
  Accents: Red, Yellow, Green (official Google colors)

Click [✓ Accept]
→ Done! Colors selected
```

Option B: Customize colors
```
If you want different colors:
  1. Open color picker
  2. Choose your color
  3. System checks WCAG compliance
  4. If it fails: suggests darker shade
  5. You accept and move on
```

**What is WCAG Compliance?**
```
WCAG = Web Content Accessibility Guidelines

In simple terms:
  Your chosen color must be DARK ENOUGH to read against white

Example:
  ✓ Dark Blue (#4285F4) vs White: 5.2:1 ratio → GOOD
  ✓ Dark Green (#1DB954) vs White: 4.1:1 ratio → BORDERLINE
  ✗ Light Yellow (#FBBC05) vs White: 1.5:1 ratio → BAD
    → System suggests: #9A7305 (darker yellow)

Why it matters:
  - Legal requirement (ADA compliance)
  - Users with vision impairment can read it
  - Employer impressed: "This person cares about accessibility"
```

**Color Scenarios Explained:**

```
Scenario A: Multi-Chromatic (Google, Slack, etc.)
  → Use company's actual brand colors
  → Primary color: Darkest/most legible
  → Accents: Red, Yellow, Green from brand
  → Result: Recognizable as company's palette

Scenario B: Monochromatic (Spotify, Netflix, etc.)
  → All colors from ONE color (company's signature color)
  → Style 1 (Block): Same color all across
  → Style 2 (Fade): Gradient of that color
  → Result: Cohesive, branded appearance

Scenario C: Dual-Tone (Amazon, Uber, etc.)
  → Two main colors from brand (primary + secondary)
  → Map colors strategically to sections
  → Result: Modern, minimalist appearance
```

**Result:** Brand colors set, WCAG validated

---

### Step 5: System Asks Question 4 — Layout Density

**Form Shown:**

```
╔════════════════════════════════════════════════════════════════╗
║      QUESTION 4: LAYOUT DENSITY & TYPOGRAPHY                   ║
╚════════════════════════════════════════════════════════════════╝

How dense should the resume be?

┌ Spacious (more whitespace)
│ Font size: 10pt (larger)
│ Spacing: 1.5x line height
│ Bullets per company: ~6-8
│ Total bullets: ~8 max
│
│ Pros: Easy to read, elegant, whitespace
│ Cons: May not fit all content
│

┌ Compact (maximum content) ← RECOMMENDED
│ Font size: 9.5pt (optimal)
│ Spacing: 1.25x line height
│ Bullets per company: ~5
│ Total bullets: ~10 max
│
│ Pros: Fits more content, still readable
│ Cons: Denser, less whitespace
│

Your choice: [ Spacious ] [ Compact ✓ ]

Font sizes will be:
  Your Name: 20pt (always)
  Section Headers: 13pt (always)
  Company/Degree: 10.5pt (always)
  Bullet Points: [DEPENDS ON YOUR CHOICE]
    → Spacious: 10pt
    → Compact: 9.5pt ← RECOMMENDED
  Contact Info: 9pt (always)

╔════════════════════════════════════════════════════════════════╗
```

**Your Role:** Choose between Spacious or Compact

**Explanation:**

**Spacious:**
```
When to choose:
  - You have fewer high-impact achievements
  - You prefer clean, open look
  - Company values design/aesthetics
  - You don't have enough content to fill 1 page anyway

What happens:
  - 9-10pt body text (larger, easier to read)
  - 1.5x line spacing (more breathing room)
  - ~6-8 bullets per company (fewer per job)
  - ~8 total bullets across all companies

Example layout:
  EXPERIENCE

  Spotify, Senior ML Engineer (2024-2025)
  • Led data pipeline optimization saving 40% latency
  • Mentored 3 engineers in ML best practices
  • Published 2 papers on recommendation algorithms

  [More spacious than compact version]

Google, Backend Engineer (2023-2024)
  • Designed distributed cache reducing costs by $2M
  • Improved query performance by 35%
```

**Compact (Recommended):**
```
When to choose:
  - You have lots of achievements
  - You want to show maximum impact
  - You want to fit 1 page strictly
  - ATS parsing is important (more content = better match)

What happens:
  - 9.5pt body text (optimal density)
  - 1.25x line spacing (efficient)
  - ~5 bullets per company (more per job)
  - ~10 total bullets across all companies

Example layout:
  EXPERIENCE

  Spotify, Senior ML Engineer (2024-2025)
  • Led data pipeline optimization saving 40% latency
  • Mentored 3 engineers in ML best practices
  • Published 2 papers on recommendation algorithms
  • Presented at 3 major ML conferences
  • Reduced model inference latency by 35%

  [Denser, more content than spacious version]

Google, Backend Engineer (2023-2024)
  • Designed distributed cache reducing costs by $2M
  • Improved query performance by 35%
  • Led RFC review process for 8+ infrastructure changes
```

**Result:** Layout density decided

---

### Step 6: System Asks Question 5 — Output Preferences (POINT 6)

**THIS IS THE POINT 6 EXPLANATION YOU ASKED FOR**

```
╔════════════════════════════════════════════════════════════════╗
║     QUESTION 5: OUTPUT PREFERENCES (WHERE TO SAVE)              ║
╚════════════════════════════════════════════════════════════════╝

Sub-Question A: What Format?

  ○ PDF only
    → One file: Google_Satvik_Resume.pdf
    → Printable, professional, formal
    → Best for: Email attachments, job board uploads

  ○ HTML only
    → One file: Google_Satvik_Portfolio.html
    → Interactive, Material 3 design
    → Best for: Portfolio websites, direct sharing

  ◉ Both (PDF + HTML) ← RECOMMENDED
    → Two files: .pdf + .html
    → Maximum flexibility
    → Best for: Apply everywhere, have options

Sub-Question B: Where to Save?

  ◉ Obsidian Vault ← RECOMMENDED
    Path: ~/Obsidian/Career/Resumes/Google/2026-03-09/
    ✓ Organized by company
    ✓ Organized by date
    ✓ Backed up
    ✓ Searchable

  ○ Desktop
    Path: ~/Desktop/
    ✓ Quick access
    ✗ Gets cluttered
    ✗ Not backed up

  ○ Custom Path
    [_________________________]

Sub-Question C: File Details

  Filenames (auto-generated):
    Format: [Company]_[YourName]_[Type]_[Date]

    Examples:
      Google_Satvik_Jain_Resume_2026-03-09.pdf
      Google_Satvik_Jain_Portfolio_2026-03-09.html

  Storage location:
    ~/Obsidian/Career/Resumes/Google/2026-03-09/

    System creates directories automatically if missing.

  Disk space required:
    ~1.5 MB for PDF
    ~500 KB for HTML
    ~2 MB total (both)

[Continue to Validation]
```

**Detailed Explanation of Point 6:**

See earlier document: **PHASE-A-POINT-6-DETAILED-EXPLANATION.md**

But here's the quick summary:

```
Point 6 = Output Configuration

Your Decisions:
  1. Format → PDF, HTML, or Both?
     → Answer: Both (flexible, use PDF for formal, HTML for sharing)

  2. Location → Where to save?
     → Answer: Obsidian Vault (organized, long-term)

  3. Filenames → How to name?
     → Answer: Auto-generated ([Company]_[Name]_[Type]_[Date])

Why Point 6 Matters:
  - Tells Phases D-M where to put final resume
  - Ensures organized file structure
  - Enables historical tracking (see what you emphasized before)
  - Separates different company optimizations
```

---

### Step 7: System Validates Everything

**Validation Checklist:**

```
╔════════════════════════════════════════════════════════════════╗
║                    VALIDATION RESULTS                          ║
╚════════════════════════════════════════════════════════════════╝

Vault Context:
  ✓ Obsidian Vault accessible
  ✓ Projects loaded: 12
  ✓ Achievements loaded: 47
  ✓ Skills loaded: 34

Your Preferences:
  ✓ Company name: Google
  ✓ JD loaded and parsed
  ✓ Template mode: CV
  ✓ Brand colors: #4285F4 (primary)
  ✓ WCAG compliance: 5.2:1 ✓ PASS
  ✓ Layout density: Compact
  ✓ Output format: PDF + HTML
  ✓ Output location: Obsidian Vault
  ✓ Output path accessible: ~/Obsidian/Career/Resumes/Google/2026-03-09/

Cross-Validation:
  ✓ No conflicting settings
  ✓ Enough context loaded (47 achievements for 10 bullets)
  ✓ All fields complete
  ✓ Ready for Phase D: YES

Files to be created in Phase M:
  → Google_Satvik_Jain_Resume_2026-03-09.pdf
  → Google_Satvik_Jain_Portfolio_2026-03-09.html

[✓ PROCEED TO PHASE D: PERSONA SCORING]
```

---

### Step 8: System Saves Everything

**Behind the Scenes:**

```
System writes: .artifacts/session-preferences.yaml

File contains:
  ✓ Your Obsidian Vault context (12 projects, 47 achievements, 34 skills)
  ✓ Your Point 6 decisions (format, location, filenames)
  ✓ Your brand color choices (validated WCAG)
  ✓ Your layout preferences (spacious vs compact)
  ✓ JD analysis (parsed requirements, keywords)
  ✓ Signal hints for Phase E (what to emphasize)

File size: ~8-10 KB
Timestamp: 2026-03-09T14:30:22Z
Status: Ready for Phases D-M
```

**Result:** All preferences persisted, ready for next phases

---

## Summary Table: All 6 Decision Points

| Point | Question | Example Answer | Used In | Why |
|-------|----------|---|---|---|
| 1 | Company & JD | Google, Senior Backend Engineer | Phases D-M | Drives personalization |
| 2 | Template Mode | CV | Phase K-M | Determines output structure |
| 3 | Brand Colors | #4285F4, Multi-chromatic | Phase L | Visual customization |
| 4 | Layout Density | Compact | Phase K | Font sizes, spacing |
| 5 | Format | PDF + HTML | Phase M | Export format |
| 6 | Output Location | Obsidian Vault | Phase M | File destination |

---

## Timeline: Phase A → Phases D-M

```
Phase A (You, Right Now)
  ├─ Load vault
  ├─ Answer 6 questions
  └─ Save session-preferences.yaml

           ↓ (5 minute wait)

Phase D: Persona Scoring
  ├─ Reads: session-preferences.yaml
  ├─ Analyzes: Your persona vs company requirements
  └─ Outputs: persona_score.json

Phase E → L: Content Generation
  ├─ Reads: session-preferences.yaml
  ├─ Generates: Optimized resume content
  └─ Outputs: draft_resume.md

Phase M: Final Export
  ├─ Reads: session-preferences.yaml
  ├─ Injects: CSS variables (brand colors, fonts)
  ├─ Renders: Final HTML
  ├─ Exports: PDF + HTML
  └─ Saves: ~/Obsidian/Career/Resumes/Google/2026-03-09/
             ├─ Google_Satvik_Resume_2026-03-09.pdf
             └─ Google_Satvik_Portfolio_2026-03-09.html

           ↓ (You download/use)

You: Download, Review, Use
  ├─ Email PDF to recruiter
  ├─ Share HTML portfolio link with friend
  └─ Archive in vault for future reference
```

---

## FAQ

**Q: Can I skip Phase A and just generate a resume?**
```
A: No. Phase A sets up context for all later phases.
   Without Phase A decisions, Phases D-M don't know:
     - Which company to optimize for
     - Which colors to use
     - Where to save the file
   Phase A is mandatory, ~5 minutes.
```

**Q: What if I want to generate for 3 different companies?**
```
A: Run Phase A three times (once per company):
   Session 1: Company = Google, output = Google_Satvik_*.pdf/html
   Session 2: Company = Spotify, output = Spotify_Satvik_*.pdf/html
   Session 3: Company = Amazon, output = Amazon_Satvik_*.pdf/html

   Each session generates its own resume with custom colors + content
   All saved in organized vault structure
```

**Q: Can I change my mind mid-way?**
```
A: Not during Phase A itself (form is modal).
   After Phase A saves, you could delete session-preferences.yaml
   and start over, but that's not recommended.

   Better: Use different output location for different attempts
     Session 1: ~/Obsidian/Career/Resumes/Google/attempt-1/
     Session 2: ~/Obsidian/Career/Resumes/Google/attempt-2/
```

**Q: What if Obsidian Vault path is wrong?**
```
A: System detects and asks you:
   "Obsidian Vault not found. Please provide path."

   You provide: ~/Obsidian/
   System validates and continues.

   Or you choose Desktop as fallback.
```

**Q: Do I need to fill out every field?**
```
A: Yes. Phase A requires all fields before proceeding:
   - Company name (mandatory)
   - JD (mandatory)
   - Template mode (mandatory)
   - Brand colors (mandatory, auto-detected is fine)
   - Layout density (mandatory)
   - Output format (mandatory)
   - Output location (mandatory)

   If any field is blank, system shows error: "Please fill out [field]"
```

---

## Next Steps

**After Phase A Completes:**

1. **Wait for Phase D to Start**
   - Linkright automatically starts Phase D
   - Phase D: Persona Scoring (analyze your fit for the role)

2. **Phases D-M Run Automatically**
   - You can monitor progress
   - ~5-10 minutes for full workflow

3. **Phase M Outputs Final Resume**
   - PDF saved to: ~/Obsidian/Career/Resumes/Google/2026-03-09/Google_Satvik_Resume.pdf
   - HTML saved to: ~/Obsidian/Career/Resumes/Google/2026-03-09/Google_Satvik_Portfolio.html

4. **You Review & Use**
   - Download PDF for formal submission
   - Share HTML for personal showcasing
   - Archive in vault for future reference

---

## Checklist: Before Phase A Completes

```
Before clicking "Proceed to Phase D":

  ✓ Obsidian Vault found and loaded
  ✓ Company name entered (e.g., "Google")
  ✓ JD pasted and parsed
  ✓ Template mode selected (CV / Portfolio / Combined)
  ✓ Brand colors chosen (auto-detected or manual)
  ✓ WCAG compliance confirmed (✓ PASS)
  ✓ Layout density selected (Spacious / Compact)
  ✓ Output format selected (PDF / HTML / Both)
  ✓ Output location accessible (Vault or Desktop)
  ✓ Filenames understood ([Company]_[Name]_[Type]_[Date])
  ✓ All validation checks passed

If all checked: [✓ PROCEED TO PHASE D]
If any unchecked: Go back and fix
```

---

## Summary

**Phase A:** Initialize everything before resume generation starts

**What you do:** Answer 6 questions (5 minutes)
**What system does:** Load context, validate, save preferences
**Result:** Ready for Phases D-M to generate your customized resume

**Point 6 Specifically:** Where and how to save the final resume
- Format: PDF, HTML, or Both?
- Location: Obsidian Vault (organized) or Desktop (quick)?
- Filenames: Auto-generated based on your choices

**Next:** Phase D (Persona Scoring) → Phases E-L (Content) → Phase M (Final Export)

---

Ab tum poora Phase A samajh gaye ho! 🎯

Koi bhi question hai to pooch le. Otherwise ready ho jao Phase D ke liye.
