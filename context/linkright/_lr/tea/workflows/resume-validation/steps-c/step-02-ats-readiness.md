# Step 2: ATS Readiness Check

> **Can the resume survive ATS parsing?**

---

## Dependencies

- ✓ Step 1 (Integrity Check) must PASS before executing this step
- Input: `data/optimized-resume.md`
- Reference: `data/jd-profile.yaml` (keyword targets)

---

## Mandatory Execution Rules

1. **Parse resume** for ATS-hostile formatting
   - ❌ Tables, images, special characters, complex formatting
   - ✅ Simple linear bullet structure, standard fonts
2. **Extract keywords** from JD profile; count occurrences in resume
3. **Simulate ATS** parsing; verify name/dates/contact survive
4. **Score formatting**: 0–30 points (parsing integrity)
5. **Score keywords**: 0–70 points (keyword coverage vs JD)

---

## Execution Protocols

### Protocol A: Format Parsing (10 points)
```
SCAN resume for:
  - Tables (any <table> or multi-column layouts)
  - Images (any embedded images, except PDF icons)
  - Special characters (©, ™, ®, bullets outside ASCII)
  - Non-standard fonts (assume OCR/monospace only safe)

SCORE:
  ✓ 0 ATS-hostile elements = +10
  - 1–2 elements = +5
  - ≥3 elements = 0
```

### Protocol B: Name/Date/Contact Extraction (10 points)
```
VERIFY:
  - Contact info on line 1–2 (name, email, phone, LinkedIn)
  - Dates in YYYY-MM or YYYY format (not "March 2024")
  - No wrapped phone numbers (single line)

SCORE:
  ✓ All present & standard format = +10
  - 1 item non-standard = +5
  - ≥2 items problematic = 0
```

### Protocol C: Keyword Scoring (70 points)
```
EXTRACT keywords from jd-profile.yaml:
  - Role keywords (e.g., "Full-stack Engineer", "Product Manager")
  - Technical keywords (tech stack, tools, frameworks)
  - Business keywords (domains, industry context)

COUNT occurrences in resume (case-insensitive):
  - Role keywords: Weight 2× (most important)
  - Technical: Weight 1× (critical)
  - Business: Weight 0.5× (nice-to-have)

SCORE (0–70):
  - ≥80% keyword coverage = 70
  - 60–80% = 50
  - 40–60% = 30
  - <40% = 10
  - 0 keywords = 0
```

### Protocol D: ATS-Simulated Parsing (10 points)
```
SIMULATE ATS parsing (text extraction only):
  - Extract as plain text (ignore formatting)
  - Preserve line breaks
  - Verify readability without formatting

COMPARE:
  - Original resume ≥80% readable as ATS output = +10
  - 60–80% = +5
  - <60% (e.g., table collapsed into gibberish) = 0
```

---

## Output Contract

**Output file**: `steps-v/step-02-validate.md` (validation results)

```yaml
step: 02-ats-readiness
status: PASS | CONCERNS | FAIL
ats_score: integer (0–100)
format_score: integer (0–30)
keyword_score: integer (0–70)
keyword_coverage_percent: float (0–100)
missing_keywords: list of string
remediation: string (if CONCERNS/FAIL)
timestamp: ISO-8601
```

**Gate Decision**:
- **PASS**: ≥75 ATS score + all subsections ≥50
- **CONCERNS**: 60–74 ATS score (can fix with minor edits)
- **FAIL**: <60 ATS score (major ATS parsing issues; recommend reformat)

---

## Example Findings

| Finding | Type | Severity | Remediation |
|---------|------|----------|-------------|
| Contact email wrapped to second line | Format | Minor | Move to single line |
| Table in "Projects" section | Format | Major | Convert to bullet list |
| Keyword "React" missing (JD requires it) | Keyword | Major | Add specific React project |
| Keyword "Agile" appears 1× (JD avg: 3×) | Keyword | Minor | Emphasize Agile context in experience |

---

**Last Updated**: 2026-03-08
