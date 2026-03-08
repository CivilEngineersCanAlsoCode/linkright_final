# P1-6: Output Preferences System Architecture

**Date:** 2026-03-09
**Task:** Design output preferences capture and flow for resume customization system
**Status:** IN PROGRESS
**Quality Standard:** All user preferences must be captured in Phase A, applied consistently across phases D-M, validated in Phase V

---

## Executive Summary

The resume customization system outputs **personalized A4 PDFs** for specific job descriptions. However, before generating output, the system must capture user preferences about:
- **Template choice** (CV vs Portfolio vs Combined mode)
- **Company targeting** (which company are we optimizing for?)
- **Visual preferences** (brand colors, font sizes, layout density)
- **Output path** (where to save the generated resume)

This document defines the **Point 6 Output Preferences System** that captures all user decisions in Phase A and flows them through Phases D-M.

---

## Part 1: What Are "Output Preferences"?

Output Preferences = User's **customization choices** made before resume generation starts.

### Category A: Template Mode Selection

```yaml
Template Mode:
  CV Mode:
    - Definition: "Professional, single-page, strict A4 format"
    - Use Case: "Applicant tracking systems, corporate submissions"
    - Features: "One company, 5-10 bullets, 9.5pt font, bold metrics"
    - Default: YES (recommended)

  Portfolio Mode:
    - Definition: "Interactive Material 3 UI + portfolio showcase"
    - Use Case: "Direct email, portfolio links, self-promotion"
    - Features: "Left sidebar navigation, color customization, photo"
    - Default: NO (for specific roles/audience)

  Combined Mode:
    - Definition: "Printable resume + interactive portfolio view"
    - Use Case: "LinkedIn profile, personal website embedding"
    - Features: "Both views, switch via sidebar nav"
    - Default: NO (advanced use case)
```

**User Decision Point A:** "Mujhe kaun sa mode chahiye? CV / Portfolio / Combined?"

### Category B: Company Targeting

```yaml
Company Target:
  Company Name:
    - Definition: "The employer you're applying to"
    - Impact: "--target-company-name variable in template"
    - Example: "Google", "Spotify", "Amazon"
    - Capture: Text input in Phase A

  Job Description (JD):
    - Definition: "The specific role's requirements"
    - Impact: "Drives signal retrieval, gap analysis, optimization"
    - Example: "Senior Backend Engineer at Google"
    - Capture: File upload or paste in Phase A
```

**User Decision Point B:** "Company name aur JD mujhe chahiye kaunsa? Konse company ke liye optimize karun?"

### Category C: Visual Preferences (Brand Customization)

```yaml
Brand Colors:
  Primary Color (--brand-blue):
    - Usage: "Section headers, bullet points, dividers"
    - Constraint: "Must have WCAG AA contrast (4.5:1) vs white"
    - Capture: "Color picker in Phase A"
    - Example: "#4285F4" (Google Blue)

  Accent Colors (--brand-red, --brand-yellow, --brand-green):
    - Usage: "Identity horizon (top border), section dividers"
    - Constraint: "Must be visually distinct from primary"
    - Capture: "Auto-generate or manual picker"
    - Scenarios:
      - Multi-chromatic (Google, Slack): Use brand's actual colors
      - Monochromatic (Spotify, Netflix): Use variations of one color
      - Dual-tone (Amazon, Uber): Use primary + accent

  Portfolio UI Colors (--md-sys-color-primary):
    - Usage: "Download button, photo border, hover effects"
    - Capture: "Auto-linked to primary color"
    - Override: "Advanced option for different portfolio branding"
```

**User Decision Point C:** "Brand colors kaunse chahiye? Color picker ya preset scenarios?"

### Category D: Typography & Layout

```yaml
Font Sizes:
  --font-size-name: 20pt          # Your name (Hero text)
  --font-size-header: 13pt        # Section titles
  --font-size-subhead: 10.5pt     # Company names, degrees
  --font-size-body: 9.5pt         # Bullet points (optimal density)
  --font-size-contact: 9pt        # Contact info

Density Preference:
  Spacious:
    - font-size-body: 10pt
    - line-height: 1.5
    - bullet-margin: 1mm
    - Impact: "More whitespace, fewer bullets"

  Compact:
    - font-size-body: 9.5pt
    - line-height: 1.25
    - bullet-margin: 0.5mm
    - Impact: "Maximum content density"

  Default: Compact (recommended for ATS parsing)
```

**User Decision Point D:** "Layout density kaisa chahiye? Spacious ya Compact?"

### Category E: Output Path & Format

```yaml
Output Format:
  PDF (Primary):
    - Format: "PDF file (print-ready)"
    - Method: "Print to PDF from browser"
    - Filename: "[Company]_[YourName]_Resume_[Date].pdf"

  HTML (Interactive):
    - Format: "HTML file with Material 3 styling"
    - Method: "Save HTML with embedded CSS"
    - Filename: "[Company]_[YourName]_Portfolio.html"

  Both:
    - Generate both PDF and HTML in same session
    - Recommended for "Portfolio + CV" dual-channel approach

Output Location:
  Obsidian Vault Path:
    - Base: "~/Obsidian/Career/Resumes/[Company]/[Date]/"
    - Creates: "[Company]_resume.pdf" + "[Company]_portfolio.html"

  Desktop (Quick):
    - Path: "~/Desktop/"
    - For: "Quick share, email attachment"
```

**User Decision Point E:** "Output kahan save karun? Obsidian vault ya Desktop? PDF ya HTML ya both?"

---

## Part 2: Phase A Input Capture (step-01-load-session-context.md)

### Input Flow: Phase A → Data Structure

```yaml
PHASE-A-OUTPUTS:
  file: .artifacts/session-preferences.yaml

  session_id: "satvik-jain-sync-[timestamp]"

  # User Decisions
  preferences:
    # A. Template Mode
    template_mode: "cv"  # Options: cv | portfolio | combined

    # B. Company Targeting
    company_name: "[user-input]"           # e.g., "Google"
    job_description_path: "[user-input]"   # Path to JD file or URL
    job_description_raw: "[pasted-text]"   # If pasted directly

    # C. Visual Preferences
    brand_colors:
      primary: "[hex-value]"           # --brand-blue
      accent_1: "[hex-value]"          # --brand-red
      accent_2: "[hex-value]"          # --brand-yellow
      accent_3: "[hex-value]"          # --brand-green
      color_scenario: "multi-chromatic" # Detection: which scenario?

    # D. Typography & Layout
    layout_density: "compact"  # Options: spacious | compact
    custom_font_sizes: null    # If user wants to override

    # E. Output
    output_format: "pdf"       # Options: pdf | html | both
    output_location: "obsidian-vault"  # Options: vault | desktop | custom
    obsidian_vault_path: "[user-path]" # If vault selected

  # System-Generated
  session_context:
    source_of_truth: "[obsidian-vault-path]"
    loaded_projects: [...]             # Projects imported from vault
    loaded_achievements: [...]         # Achievements imported from vault
    loaded_skills: [...]               # Skills imported from vault

  # Validation
  validation:
    brand_colors_wcag_compliant: true   # A11y check: primary vs white
    jd_loaded_successfully: true
    vault_context_loaded: true
    ready_for_phase_d: true
```

### Input Form (INTERACTIVE - shown to user in Phase A)

```
═══════════════════════════════════════════════════════════════════
  LINKRIGHT: PERSONALIZATION & OUTPUT SETUP (PHASE A)
═══════════════════════════════════════════════════════════════════

📋 STEP 1: TEMPLATE MODE SELECTION
  Which format would you like to generate?

  ○ CV (Professional A4 Resume) [RECOMMENDED]
  ○ Portfolio (Interactive Material 3 UI)
  ○ Combined (Both views in one file)

🎯 STEP 2: COMPANY & JD TARGETING
  Company Name: [_____________________]
    Example: Google, Spotify, Amazon

  Job Description:
  ○ Upload JD file (.pdf / .txt)
  ○ Paste JD text directly

  [Paste Area or File Upload]

🎨 STEP 3: BRAND COLORS (Optional - Auto-Detected)
  Primary Color (Section Headers, Bullets):
  [Color Picker] #4285F4 (detected: Google Blue)

  ○ Auto-Detect Brand Colors (scan company name)
  ○ Manual Color Selection

  Accent Colors:
  ○ Multi-chromatic (Google, Slack) - Use brand palette
  ○ Monochromatic (Spotify, Netflix) - Gradient of primary
  ○ Dual-tone (Amazon, Uber) - Primary + secondary

  WCAG A11y Check: ✅ Primary color has sufficient contrast

📐 STEP 4: LAYOUT PREFERENCES
  Layout Density:
  ○ Spacious (more whitespace, fewer bullets)
  ○ Compact (maximum content, optimal density) [DEFAULT]

  Font Size Override (Advanced):
  ○ Use default sizes (9.5pt body, 13pt headers)
  ○ Custom sizes [toggle advanced]

💾 STEP 5: OUTPUT CONFIGURATION
  Output Format:
  ○ PDF (Print-ready A4 resume)
  ○ HTML (Interactive portfolio)
  ○ Both (PDF + HTML)

  Save Location:
  ○ Obsidian Vault (~/Obsidian/Career/Resumes/[Company]/)
  ○ Desktop (~/Desktop/)
  ○ Custom path: [_____________________]

🔍 STEP 6: VAULT CONTEXT CONFIRMATION
  Loaded from Obsidian Vault:
  ✅ Projects: 12
  ✅ Achievements: 47
  ✅ Skills: 34
  ✅ Source of Truth: Ready

  [Continue to Phase D] or [Edit Preferences]
```

---

## Part 3: Variable Resolution in Phases D-M

### How Preferences Flow to Template

```
PHASE D → PHASE E → PHASE F → PHASE G → PHASE H → PHASE I → PHASE J → PHASE K → PHASE L → PHASE M

      ↓
      Reads session-preferences.yaml

      ↓
      Resolves CSS variables:

      --target-company-name = preferences.company_name
      --md-sys-color-primary = preferences.brand_colors.primary
      --brand-blue = preferences.brand_colors.primary
      --brand-red = preferences.brand_colors.accent_1
      --brand-yellow = preferences.brand_colors.accent_2
      --brand-green = preferences.brand_colors.accent_3
      --font-size-body = preferences.layout_density → (spacious: 10pt | compact: 9.5pt)

      ↓
      Passes to Template Engine (Phase K - Layout)

      ↓
      Renders Final HTML/PDF (Phase L - Styling, Phase M - Final)
```

### Example: Google Application

```yaml
# User Input (Phase A)
preferences:
  company_name: "Google"
  template_mode: "cv"
  brand_colors:
    primary: "#4285F4"    # Google Blue
    accent_1: "#EA4335"   # Google Red
    accent_2: "#FBBC05"   # Google Yellow
    accent_3: "#34A853"   # Google Green
  layout_density: "compact"
  output_format: "pdf"
  output_location: "obsidian-vault"

# Result in Phases D-M
CSS Variables Applied:
  --target-company-name: "Google"
  --md-sys-color-primary: "#4285F4"
  --brand-blue: "#4285F4"
  --brand-red: "#EA4335"
  --brand-yellow: "#FBBC05"
  --brand-green: "#34A853"
  --font-size-body: "9.5pt"

# Output Generated
~/Obsidian/Career/Resumes/Google/2026-03-09/
  ├── Google_Satvik_Jain_Resume_2026-03-09.pdf
  └── Google_Satvik_Jain_Portfolio.html
```

---

## Part 4: Validation & Quality Gates

### Pre-Phase D Validation (Phase A Exit Criteria)

```yaml
Checklist:
  ✓ Template mode selected (cv | portfolio | combined)
  ✓ Company name provided (non-empty string)
  ✓ Job description loaded (parsed successfully)
  ✓ Brand colors provided (primary mandatory, accents optional)
  ✓ Brand colors WCAG AA compliant (primary vs white ≥4.5:1)
  ✓ Layout density selected (spacious | compact)
  ✓ Output format selected (pdf | html | both)
  ✓ Output location provided (vault path or desktop)
  ✓ Obsidian Vault context loaded (projects, achievements, skills)
  ✓ session-preferences.yaml written and validated

Failure Modes:
  ❌ Missing company name → Block Phase D, ask user
  ❌ JD parsing failed → Show error, offer retry
  ❌ Vault context incomplete → Warn user, allow continue with reduced context
  ❌ Color contrast fails → Show WCAG failure, suggest darker shade
  ❌ Invalid output path → Suggest default, confirm with user
```

### Phase M Output Validation (Pre-Export)

```yaml
Final Resume Quality Checks:
  ✓ All CSS variables resolved (no {{UNRESOLVED}} in output)
  ✓ Company name appears in "Strategic Fit" section
  ✓ Font sizes match preferences (9.5pt if compact, 10pt if spacious)
  ✓ Colors match brand preferences (primary, accents)
  ✓ Page fits A4 (210mm × 297mm) with no overflow
  ✓ PDF renders correctly (test print preview)
  ✓ All signals from Obsidian Vault integrated
  ✓ JD alignment metrics displayed

Success Criteria:
  All checks pass → Generate PDF/HTML
  Any check fails → Show error, rollback to last successful phase
```

---

## Part 5: Implementation Roadmap

### Beads Tasks for Point 6

```
P1-6-A: Create Phase A Input Form
  - Interactive HTML form with color picker
  - Form validation (required fields, WCAG check)
  - Save preferences to session-preferences.yaml
  - Status: Ready for Vulcan/Hephaestus

P1-6-B: Create Preference Resolution System
  - Read session-preferences.yaml in Phase D
  - Map user preferences to CSS variables
  - Pass to template engine
  - Status: Ready for engineers

P1-6-C: Add Validation Gates
  - Phase A exit validation
  - Phase M pre-export validation
  - Error handling + user feedback
  - Status: Ready for engineers

P1-6-D: Template Variable System
  - Create CSS variable injection mechanism
  - Test with Google, Spotify, Amazon scenarios
  - Verify WCAG compliance
  - Status: Ready for engineers

P1-6-E: Output Path Handling
  - Obsidian Vault path generation
  - Desktop fallback
  - Filename templating ([Company]_[Date]_Resume.pdf)
  - Status: Ready for engineers
```

---

## Part 6: Key Decisions

**Decision 1:** Should color preferences be optional or mandatory?
- **Answer:** Optional (auto-detect from company name), but allow manual override
- **Rationale:** Users applying to many companies shouldn't repeat color selection

**Decision 2:** Should template choice be per-company or per-session?
- **Answer:** Per-session (one template mode for entire session), but allow re-select if needed
- **Rationale:** User typically applies in bulk to similar roles; efficiency over flexibility

**Decision 3:** Should vault context be auto-loaded or user-selected?
- **Answer:** Auto-loaded from configured vault path, with confirmation in Phase A
- **Rationale:** Vault is source of truth; always include complete context

**Decision 4:** Should output go to Obsidian Vault by default?
- **Answer:** Yes (Obsidian Vault default), with Desktop quick-save option
- **Rationale:** Maintains organized career history; easier to reference later

---

## Summary

**Point 6: Output Preferences System** captures 5 categories of user decisions in Phase A:
1. **Template Mode:** CV / Portfolio / Combined
2. **Company Targeting:** Company name + JD
3. **Visual Preferences:** Brand colors + WCAG validation
4. **Typography & Layout:** Density (spacious / compact)
5. **Output:** Format (PDF/HTML) + Location (Vault/Desktop)

These preferences flow through Phases D-M as CSS variable injections, ensuring every resume is customized for the target company while maintaining professional quality and accessibility standards.

**Quality Metric:** 100% of generated resumes must have WCAG AA color contrast + all CSS variables resolved + output saved to correct location.
