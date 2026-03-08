# Release 3 Theming System Design: Company Presets, Accessibility, and Identity Horizon

**Spec Version:** 1.0
**Date:** 2026-03-07
**Scope:** PLAN-06c (Company Preset Format), PLAN-06d (Accessibility & Contrast), PLAN-06e (Identity Horizon Auto-Adaptation)
**Depends On:** PLAN-06a (CSS Custom Property Taxonomy), PLAN-06b (Typography Variable System), PLAN-01 (CV Template Audit), PLAN-09 (Cross-Cutting Concerns)

---

## Table of Contents

1. [PLAN-06c: Company-Specific Preset File Format](#plan-06c)
2. [PLAN-06d: Accessibility and Contrast System](#plan-06d)
3. [PLAN-06e: Identity Horizon Brand Bar Auto-Adaptation](#plan-06e)
4. [Appendix A: Cross-Reference Matrix](#appendix-a)
5. [Appendix B: Implementation Order](#appendix-b)

---

<a id="plan-06c"></a>
## 1. PLAN-06c: Company-Specific Preset File Format

### 1.1 Design Goals

PLAN-06a (Section 1.6) established the CSS-level brand preset pattern using `html[data-brand="..."]` selectors and defined a preliminary JSON schema (Section 1.7). PLAN-01b documented the existing 4-color brand system (`--brand-blue` through `--brand-green`) and the Decision Tree for mono/dual/multi-chromatic brands. PLAN-01e identified the CSS `content` property injection mechanism for `--target-company-name`.

This specification extends the CSS-level pattern into a **file-based preset system** that:

- Defines a canonical JSON file format for company-specific branding presets
- Maps preset fields to the full `--lr-*` CSS custom property taxonomy from PLAN-06a
- Specifies the directory structure within `_lr/` for storing and discovering presets
- Defines how the build/deploy pipeline reads a preset file and applies it to portfolio HTML
- Provides a default preset (no company specified) and example presets for 3 companies
- Supports font overrides, logo URLs, and Identity Horizon gradient stops as first-class fields

### 1.2 Preset File Format: JSON Schema

The preset file format uses JSON (not YAML) for three reasons: (1) the existing `cover_letter_payload.json` and `outreach_strategy.json` in the pipeline are JSON, (2) JSON is natively parsable in the browser if runtime switching is ever needed, and (3) JSON Schema validation tooling is more mature.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://linkright.dev/schemas/brand-preset.v1.json",
  "title": "LinkrightBrandPreset",
  "description": "Company-specific branding preset that maps to --lr-* CSS custom properties. Used by the portfolio-deploy pipeline to generate themed portfolio HTML.",
  "type": "object",
  "required": ["preset_version", "brand_id", "brand_name", "colors"],
  "properties": {
    "preset_version": {
      "type": "string",
      "const": "1.0",
      "description": "Schema version. Allows future format evolution."
    },
    "brand_id": {
      "type": "string",
      "pattern": "^[a-z0-9][a-z0-9-]*[a-z0-9]$",
      "minLength": 2,
      "maxLength": 40,
      "description": "Kebab-case identifier. Used in data-brand attribute, file name, and CSS selector. Must match the preset filename: {brand_id}.preset.json"
    },
    "brand_name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "Full display name of the target company. Maps to --lr-target-company-name CSS variable."
    },
    "brand_name_short": {
      "type": "string",
      "maxLength": 20,
      "description": "Abbreviated name for tight spaces (sidebar nav subtext). Maps to --lr-target-company-short. Defaults to brand_name if omitted."
    },
    "brand_scenario": {
      "type": "string",
      "enum": ["multi-chromatic", "dual-tone", "monochromatic"],
      "description": "Maps to the CV template Decision Tree (PLAN-01b Section 'Theme/Brand Adaptation Points'). Determines how the 4-slot color system is populated: multi-chromatic = 4 distinct hues (Google, Microsoft), dual-tone = 2 alternating hues (Amazon, Uber), monochromatic = 1 hue with lightness variants (Spotify, Netflix)."
    },
    "logo": {
      "type": "object",
      "description": "Company logo references for optional display in portfolio header or favicon.",
      "properties": {
        "url": {
          "type": "string",
          "format": "uri",
          "description": "URL to the company logo image (SVG preferred, PNG fallback). Used as a visual reference during design; NOT automatically embedded in the portfolio to avoid trademark issues."
        },
        "favicon_url": {
          "type": "string",
          "format": "uri",
          "description": "URL to a small icon version (16x16 or 32x32). Can be used as the portfolio favicon when deployed for a specific company."
        },
        "usage_note": {
          "type": "string",
          "description": "Guidance on logo usage rights. E.g., 'Fair use for personal portfolio targeting this company.'"
        }
      }
    },
    "colors": {
      "type": "object",
      "required": ["primary"],
      "description": "Brand color palette. At minimum, primary must be specified. All others have computed defaults based on brand_scenario.",
      "properties": {
        "primary": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "The dominant brand hue. Maps to --lr-brand-primary. Used for CTAs, active states, section titles, links, Identity Horizon segment 1."
        },
        "secondary": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Supporting brand hue #2. Maps to --lr-brand-secondary. For monochromatic brands, defaults to primary."
        },
        "tertiary": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Supporting brand hue #3. Maps to --lr-brand-tertiary."
        },
        "quaternary": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Supporting brand hue #4. Maps to --lr-brand-quaternary."
        },
        "accent": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "High-energy variant for emphasis and CTAs. Maps to --lr-brand-accent. Defaults to primary if omitted."
        },
        "neutral": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Desaturated tone for muted text, borders, secondary backgrounds. Maps to --lr-brand-neutral. Defaults to #5F6368 if omitted."
        }
      }
    },
    "semantic_overrides": {
      "type": "object",
      "description": "Optional overrides for semantic color tokens. If omitted, semantic tokens are auto-derived from the brand colors using the default derivation rules in PLAN-06a Section 1.3.",
      "properties": {
        "nav_active_bg": {
          "type": "string",
          "description": "Background for active navigation pill. Maps to --lr-color-nav-active-bg. Auto-derived: primary at 15% opacity on white."
        },
        "nav_active_text": {
          "type": "string",
          "description": "Text color for active navigation pill. Maps to --lr-color-nav-active-text. Auto-derived: darkened primary."
        },
        "footer_bg": {
          "type": "string",
          "description": "Footer/dark section background. Maps to --lr-color-footer-bg. Auto-derived: primary or neutral, whichever is darker."
        },
        "page_bg": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Page background override. Maps to --lr-color-page-bg. Defaults to #FFFFFF."
        },
        "sidebar_bg": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Sidebar background override. Maps to --lr-color-sidebar-bg. Defaults to #F8F9FA."
        },
        "body_bg": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Dark body background (Beyond Papers). Maps to --lr-color-body-bg. Defaults to #1d1b1b."
        }
      }
    },
    "identity_horizon": {
      "type": "object",
      "description": "Overrides for the Identity Horizon gradient bar. If omitted, the bar uses the 4-segment flat color system from brand colors (primary, secondary, tertiary, quaternary).",
      "properties": {
        "mode": {
          "type": "string",
          "enum": ["segments", "gradient"],
          "default": "segments",
          "description": "segments = 4 flat color blocks (default, as in current CV template). gradient = continuous CSS gradient across the full bar width."
        },
        "gradient_start": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Gradient start color. Maps to --lr-ih-start. Only used when mode is 'gradient'."
        },
        "gradient_mid": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Gradient midpoint color. Maps to --lr-ih-mid. Optional; omit for 2-stop gradient."
        },
        "gradient_end": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Gradient end color. Maps to --lr-ih-end."
        },
        "gradient_angle": {
          "type": "number",
          "minimum": 0,
          "maximum": 360,
          "default": 90,
          "description": "CSS gradient angle in degrees. Maps to --lr-ih-angle. 90 = left-to-right (default)."
        }
      }
    },
    "gradients": {
      "type": "object",
      "description": "CSS gradient overrides for Beyond the Papers decorative gradients. If omitted, gradients are auto-derived from brand colors.",
      "properties": {
        "name": {
          "type": "string",
          "description": "CSS gradient for the hero name heading. Maps to --lr-gradient-name. E.g., 'linear-gradient(90deg, #4285F4, #34A853)'."
        },
        "story": {
          "type": "string",
          "description": "CSS gradient for the story section heading. Maps to --lr-gradient-story."
        },
        "timeline": {
          "type": "string",
          "description": "CSS gradient for the timeline accent bar. Maps to --lr-gradient-timeline."
        },
        "qualities": {
          "type": "string",
          "description": "CSS gradient for the qualities carousel text. Maps to --lr-gradient-qualities."
        }
      }
    },
    "fonts": {
      "type": "object",
      "description": "Typography overrides. If omitted, the default font stack from PLAN-06b applies (Roboto for resume, DM Serif Display + Inter + Aubrey for Beyond Papers).",
      "properties": {
        "family_resume": {
          "type": "string",
          "description": "Font family for resume/formal views. Maps to --lr-font-family-resume. Must be a valid CSS font-family value. Include fallback stack."
        },
        "family_display": {
          "type": "string",
          "description": "Display/heading font for portfolio views. Maps to --lr-font-family-display."
        },
        "family_body": {
          "type": "string",
          "description": "Body text font for portfolio views. Maps to --lr-font-family-body."
        },
        "family_accent": {
          "type": "string",
          "description": "Decorative accent font. Maps to --lr-font-family-accent."
        },
        "google_fonts_url": {
          "type": "string",
          "format": "uri",
          "description": "Google Fonts URL to load custom fonts. Replaces the default font loading <link> tag. E.g., 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Lora:wght@400;700&display=swap'."
        },
        "size_scale_factor": {
          "type": "number",
          "minimum": 0.8,
          "maximum": 1.3,
          "default": 1.0,
          "description": "Multiplier applied to all --lr-font-size-* tokens. 1.0 = default sizes. 1.1 = 10% larger. Useful for brands with naturally larger or smaller typography."
        }
      }
    },
    "meta": {
      "type": "object",
      "description": "Metadata about the preset. Not used in rendering.",
      "properties": {
        "created_by": {
          "type": "string",
          "description": "Who created or last edited this preset."
        },
        "created_at": {
          "type": "string",
          "format": "date",
          "description": "ISO date when the preset was created."
        },
        "source_url": {
          "type": "string",
          "format": "uri",
          "description": "URL to the company's brand guidelines or logo page used as reference."
        },
        "notes": {
          "type": "string",
          "description": "Free-form notes about design decisions."
        }
      }
    }
  },
  "additionalProperties": false
}
```

### 1.3 Preset-to-CSS Custom Property Mapping

The following table defines how every preset field maps to a `--lr-*` CSS custom property. The "Derivation" column specifies how the value is computed when the field is omitted from the preset.

| Preset Field | CSS Custom Property | Derivation When Omitted |
|---|---|---|
| `brand_name` | `--lr-target-company-name` | Required field; no default. |
| `brand_name_short` | `--lr-target-company-short` | Copies `brand_name`. |
| `colors.primary` | `--lr-brand-primary` | Required field; no default. |
| `colors.secondary` | `--lr-brand-secondary` | `monochromatic`: same as primary. `dual-tone`: same as primary. `multi-chromatic`: required. |
| `colors.tertiary` | `--lr-brand-tertiary` | `monochromatic`: primary lightened 10%. `dual-tone`: computed neutral. `multi-chromatic`: required. |
| `colors.quaternary` | `--lr-brand-quaternary` | `monochromatic`: primary darkened 10%. `dual-tone`: same as secondary. `multi-chromatic`: required. |
| `colors.accent` | `--lr-brand-accent` | Copies `colors.primary`. |
| `colors.neutral` | `--lr-brand-neutral` | `#5F6368` (Google's default neutral). |
| `semantic_overrides.nav_active_bg` | `--lr-color-nav-active-bg` | `color-mix(in srgb, var(--lr-brand-primary) 15%, white)` |
| `semantic_overrides.nav_active_text` | `--lr-color-nav-active-text` | `color-mix(in srgb, var(--lr-brand-primary) 80%, black)` |
| `semantic_overrides.footer_bg` | `--lr-color-footer-bg` | Darker of primary or neutral. |
| `semantic_overrides.page_bg` | `--lr-color-page-bg` | `#FFFFFF` |
| `semantic_overrides.sidebar_bg` | `--lr-color-sidebar-bg` | `#F8F9FA` |
| `semantic_overrides.body_bg` | `--lr-color-body-bg` | `#1d1b1b` |
| `identity_horizon.mode` | Controls HTML structure | `segments` (4-block layout). |
| `identity_horizon.gradient_start` | `--lr-ih-start` | `colors.primary` |
| `identity_horizon.gradient_mid` | `--lr-ih-mid` | `colors.secondary` or midpoint between start and end. |
| `identity_horizon.gradient_end` | `--lr-ih-end` | `colors.quaternary` |
| `identity_horizon.gradient_angle` | `--lr-ih-angle` | `90` (degrees, left-to-right). |
| `gradients.name` | `--lr-gradient-name` | `linear-gradient(90deg, primary, quaternary)` |
| `gradients.story` | `--lr-gradient-story` | Same as `gradients.name`. |
| `gradients.timeline` | `--lr-gradient-timeline` | `linear-gradient(180deg, primary, secondary 51%, tertiary)` |
| `gradients.qualities` | `--lr-gradient-qualities` | `linear-gradient(90deg, neutral, primary)` |
| `fonts.family_resume` | `--lr-font-family-resume` | `'Roboto', sans-serif` |
| `fonts.family_display` | `--lr-font-family-display` | `'DM Serif Display', serif` |
| `fonts.family_body` | `--lr-font-family-body` | `'Inter', sans-serif` |
| `fonts.family_accent` | `--lr-font-family-accent` | `'Aubrey', sans-serif` |
| `fonts.google_fonts_url` | Replaces `<link>` href | Default 4-family URL from PLAN-06b Section 2.7. |
| `fonts.size_scale_factor` | Multiplied into all `--lr-font-size-*` | `1.0` (no change). |

### 1.4 Directory Structure

Presets live within the portfolio-deploy workflow's data directory in `_lr/`:

```
linkright/
  _lr/
    sync/
      workflows/
        portfolio-deploy/
          data/
            presets/                          <-- NEW DIRECTORY
              _default.preset.json           <-- Default preset (no company)
              google.preset.json             <-- Google preset
              amazon.preset.json             <-- Amazon preset
              microsoft.preset.json          <-- Microsoft preset
              spotify.preset.json            <-- Spotify preset
              sync.preset.json              <-- Sync (internal brand) preset
              _schema/
                brand-preset.v1.schema.json  <-- JSON Schema for validation
          templates/
            portfolio.template.md
          steps-c/
          steps-e/
          steps-v/
          checklist.md
          instructions.md
          workflow.md
          workflow.yaml
```

**Naming conventions:**

- Preset files: `{brand_id}.preset.json` -- the filename stem MUST match the `brand_id` field inside the file.
- Default preset: `_default.preset.json` -- underscore prefix signals "system file, not a company."
- Schema file: `brand-preset.v1.schema.json` -- versioned schema for validation.
- The `presets/` directory is a flat list. No subdirectories per company (preset files are small, typically <2KB).

### 1.5 Default Preset (No Company Specified)

When no company is specified in the deploy pipeline, the default preset provides a neutral, professional appearance that does not reference any specific company brand.

```json
{
  "preset_version": "1.0",
  "brand_id": "default",
  "brand_name": "Your Company",
  "brand_name_short": "Company",
  "brand_scenario": "monochromatic",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#3B82F6",
    "tertiary": "#60A5FA",
    "quaternary": "#2563EB",
    "accent": "#3B82F6",
    "neutral": "#64748B"
  },
  "semantic_overrides": {
    "nav_active_bg": "#DBEAFE",
    "nav_active_text": "#1E3A5F"
  },
  "identity_horizon": {
    "mode": "gradient",
    "gradient_start": "#3B82F6",
    "gradient_end": "#2563EB",
    "gradient_angle": 90
  },
  "fonts": {},
  "meta": {
    "created_by": "Linkright system",
    "created_at": "2026-03-07",
    "notes": "Neutral professional preset. Replace with a company-specific preset during deploy."
  }
}
```

### 1.6 Example Preset Files

#### Google (Multi-Chromatic)

```json
{
  "preset_version": "1.0",
  "brand_id": "google",
  "brand_name": "Google",
  "brand_name_short": "Google",
  "brand_scenario": "multi-chromatic",
  "logo": {
    "url": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    "usage_note": "Reference only. Not embedded in portfolio."
  },
  "colors": {
    "primary": "#4285F4",
    "secondary": "#EA4335",
    "tertiary": "#FBBC05",
    "quaternary": "#34A853",
    "accent": "#4285F4",
    "neutral": "#5F6368"
  },
  "semantic_overrides": {
    "nav_active_bg": "#D3E3FD",
    "nav_active_text": "#041E49",
    "footer_bg": "#4285F4"
  },
  "identity_horizon": {
    "mode": "segments"
  },
  "gradients": {
    "name": "linear-gradient(90deg, #4285F4, #34A853)",
    "story": "linear-gradient(90deg, #EA4335, #FBBC05 48%, #34A853)",
    "timeline": "linear-gradient(180deg, #4285F4, #EA4335 51%, #FBBC05)",
    "qualities": "linear-gradient(90deg, #5F6368, #4285F4)"
  },
  "fonts": {},
  "meta": {
    "created_by": "Linkright system",
    "created_at": "2026-03-07",
    "source_url": "https://about.google/brand-resource-center/",
    "notes": "Google's 4-color brand maps perfectly to the 4-slot Identity Horizon system. All 4 brand colors are distinct hues."
  }
}
```

#### Amazon (Dual-Tone)

```json
{
  "preset_version": "1.0",
  "brand_id": "amazon",
  "brand_name": "Amazon",
  "brand_name_short": "Amazon",
  "brand_scenario": "dual-tone",
  "logo": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "usage_note": "Reference only."
  },
  "colors": {
    "primary": "#FF9900",
    "secondary": "#FF9900",
    "tertiary": "#232F3E",
    "quaternary": "#FF9900",
    "accent": "#FF9900",
    "neutral": "#232F3E"
  },
  "semantic_overrides": {
    "nav_active_bg": "#FFF3E0",
    "nav_active_text": "#232F3E",
    "footer_bg": "#232F3E"
  },
  "identity_horizon": {
    "mode": "gradient",
    "gradient_start": "#FF9900",
    "gradient_mid": "#232F3E",
    "gradient_end": "#FF9900",
    "gradient_angle": 90
  },
  "gradients": {
    "name": "linear-gradient(90deg, #FF9900, #E88600)",
    "story": "linear-gradient(90deg, #FF9900, #232F3E 48%, #FF9900)",
    "timeline": "linear-gradient(180deg, #FF9900, #232F3E 51%, #FF9900)",
    "qualities": "linear-gradient(90deg, #232F3E, #FF9900)"
  },
  "fonts": {},
  "meta": {
    "created_by": "Linkright system",
    "created_at": "2026-03-07",
    "source_url": "https://brandguide.amazon.com/",
    "notes": "Amazon uses a dual-tone system: Amazon Orange (#FF9900) and Amazon Dark (#232F3E). The Identity Horizon uses gradient mode for visual continuity with only 2 hues."
  }
}
```

#### Stripe (Multi-Chromatic with Custom Fonts)

```json
{
  "preset_version": "1.0",
  "brand_id": "stripe",
  "brand_name": "Stripe",
  "brand_name_short": "Stripe",
  "brand_scenario": "multi-chromatic",
  "logo": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    "usage_note": "Reference only."
  },
  "colors": {
    "primary": "#635BFF",
    "secondary": "#00D4AA",
    "tertiary": "#FF7A00",
    "quaternary": "#0A2540",
    "accent": "#635BFF",
    "neutral": "#425466"
  },
  "semantic_overrides": {
    "nav_active_bg": "#E8E6FF",
    "nav_active_text": "#1A1640",
    "footer_bg": "#0A2540",
    "body_bg": "#0A2540"
  },
  "identity_horizon": {
    "mode": "gradient",
    "gradient_start": "#635BFF",
    "gradient_mid": "#00D4AA",
    "gradient_end": "#FF7A00",
    "gradient_angle": 90
  },
  "gradients": {
    "name": "linear-gradient(135deg, #635BFF, #00D4AA)",
    "story": "linear-gradient(90deg, #635BFF, #00D4AA 48%, #FF7A00)",
    "timeline": "linear-gradient(180deg, #635BFF, #00D4AA 51%, #FF7A00)",
    "qualities": "linear-gradient(90deg, #0A2540, #635BFF)"
  },
  "fonts": {
    "family_display": "'Sohne', 'Helvetica Neue', Helvetica, sans-serif",
    "family_body": "'Sohne', 'Helvetica Neue', Helvetica, sans-serif",
    "google_fonts_url": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    "size_scale_factor": 1.05
  },
  "meta": {
    "created_by": "Linkright system",
    "created_at": "2026-03-07",
    "source_url": "https://stripe.com/brand",
    "notes": "Stripe's brand uses a vibrant gradient palette. Their proprietary font (Sohne) is approximated with Helvetica Neue. Note: Sohne is not on Google Fonts, so Inter is loaded as the closest open-source alternative, with Sohne specified first in the stack as a progressive enhancement for users who have it installed."
  }
}
```

### 1.7 Build/Deploy Pipeline: How Presets Are Applied

The portfolio-deploy workflow (`_lr/sync/workflows/portfolio-deploy/`) applies presets through a three-stage process during deployment.

#### Stage 1: Preset Selection and Validation

```
Input:  Deploy command specifies a company target
        (e.g., from jd_profile.yaml or manual selection)

Action: Pipeline selects the matching preset file:
        1. Look for _lr/sync/workflows/portfolio-deploy/data/presets/{brand_id}.preset.json
        2. If not found, look for _default.preset.json
        3. Validate against brand-preset.v1.schema.json
        4. If validation fails, abort with error listing invalid fields

Output: Validated preset object in memory
```

#### Stage 2: CSS Generation

The preset object is transformed into a CSS block that is injected into the portfolio HTML. This is a string-template operation, not a runtime computation.

**Algorithm: `generateBrandCSS(preset)`**

```javascript
function generateBrandCSS(preset) {
  // 1. Apply defaults for omitted fields
  const colors = {
    primary:    preset.colors.primary,
    secondary:  preset.colors.secondary  || deriveSecondary(preset),
    tertiary:   preset.colors.tertiary   || deriveTertiary(preset),
    quaternary: preset.colors.quaternary || deriveQuaternary(preset),
    accent:     preset.colors.accent     || preset.colors.primary,
    neutral:    preset.colors.neutral    || '#5F6368',
  };

  const semantics = {
    nav_active_bg:   preset.semantic_overrides?.nav_active_bg   || autoNavBg(colors.primary),
    nav_active_text: preset.semantic_overrides?.nav_active_text || autoNavText(colors.primary),
    footer_bg:       preset.semantic_overrides?.footer_bg       || autoDarker(colors.primary, colors.neutral),
    page_bg:         preset.semantic_overrides?.page_bg         || '#FFFFFF',
    sidebar_bg:      preset.semantic_overrides?.sidebar_bg      || '#F8F9FA',
    body_bg:         preset.semantic_overrides?.body_bg         || '#1d1b1b',
  };

  const ih = preset.identity_horizon || {};
  const gradients = preset.gradients || {};
  const fonts = preset.fonts || {};
  const scale = fonts.size_scale_factor || 1.0;

  // 2. Generate CSS text
  return `
/* ============================================================
   LINKRIGHT BRAND PRESET: ${preset.brand_name}
   Generated from: ${preset.brand_id}.preset.json
   Brand scenario: ${preset.brand_scenario || 'unspecified'}
   ============================================================ */

html[data-brand="${preset.brand_id}"] {
  /* Personalization */
  --lr-target-company-name:     "${preset.brand_name}";
  --lr-target-company-short:    "${preset.brand_name_short || preset.brand_name}";

  /* Brand Colors */
  --lr-brand-primary:           ${colors.primary};
  --lr-brand-secondary:         ${colors.secondary};
  --lr-brand-tertiary:          ${colors.tertiary};
  --lr-brand-quaternary:        ${colors.quaternary};
  --lr-brand-accent:            ${colors.accent};
  --lr-brand-neutral:           ${colors.neutral};

  /* Semantic Color Overrides */
  --lr-color-nav-active-bg:     ${semantics.nav_active_bg};
  --lr-color-nav-active-text:   ${semantics.nav_active_text};
  --lr-color-footer-bg:         ${semantics.footer_bg};
  --lr-color-page-bg:           ${semantics.page_bg};
  --lr-color-sidebar-bg:        ${semantics.sidebar_bg};
  --lr-color-body-bg:           ${semantics.body_bg};

  /* Interactive Derived Colors */
  --lr-color-text-link:         var(--lr-brand-primary);
  --lr-color-btn-primary-bg:    var(--lr-brand-primary);
  --lr-color-btn-primary-hover: var(--lr-brand-accent);
  --lr-color-focus-ring:        var(--lr-brand-primary);
  --lr-color-border-brand:      var(--lr-brand-primary);

  /* Identity Horizon */
  ${ih.mode === 'gradient' ? `
  --lr-ih-mode:    gradient;
  --lr-ih-start:   ${ih.gradient_start || colors.primary};
  --lr-ih-mid:     ${ih.gradient_mid   || colors.secondary};
  --lr-ih-end:     ${ih.gradient_end   || colors.quaternary};
  --lr-ih-angle:   ${ih.gradient_angle || 90}deg;
  ` : `
  --lr-ih-mode:    segments;
  --lr-horizon-1:  ${colors.primary};
  --lr-horizon-2:  ${colors.secondary};
  --lr-horizon-3:  ${colors.tertiary};
  --lr-horizon-4:  ${colors.quaternary};
  `}

  /* Gradients */
  --lr-gradient-name:       ${gradients.name      || `linear-gradient(90deg, ${colors.primary}, ${colors.quaternary})`};
  --lr-gradient-story:      ${gradients.story     || `linear-gradient(90deg, ${colors.primary}, ${colors.secondary} 48%, ${colors.quaternary})`};
  --lr-gradient-timeline:   ${gradients.timeline  || `linear-gradient(180deg, ${colors.primary}, ${colors.secondary} 51%, ${colors.tertiary})`};
  --lr-gradient-qualities:  ${gradients.qualities || `linear-gradient(90deg, ${colors.neutral}, ${colors.primary})`};

  /* Font Overrides */
  ${fonts.family_resume  ? `--lr-font-family-resume:  ${fonts.family_resume};`  : ''}
  ${fonts.family_display ? `--lr-font-family-display: ${fonts.family_display};` : ''}
  ${fonts.family_body    ? `--lr-font-family-body:    ${fonts.family_body};`    : ''}
  ${fonts.family_accent  ? `--lr-font-family-accent:  ${fonts.family_accent};`  : ''}
  ${scale !== 1.0 ? `
  /* Font Size Scaling: ${scale}x */
  --lr-font-size-display-lg: ${(3 * scale).toFixed(3)}rem;
  --lr-font-size-display-sm: ${(2.5 * scale).toFixed(3)}rem;
  --lr-font-size-heading-lg: ${(1.75 * scale).toFixed(3)}rem;
  --lr-font-size-heading-sm: ${(1.25 * scale).toFixed(3)}rem;
  --lr-font-size-hero:       ${(1.667 * scale).toFixed(3)}rem;
  --lr-font-size-section:    ${(1.083 * scale).toFixed(3)}rem;
  --lr-font-size-body:       ${(0.875 * scale).toFixed(3)}rem;
  --lr-font-size-caption:    ${(0.75 * scale).toFixed(3)}rem;
  ` : ''}
}`;
}
```

**Derivation helper functions:**

```javascript
function deriveSecondary(preset) {
  if (preset.brand_scenario === 'monochromatic') return preset.colors.primary;
  if (preset.brand_scenario === 'dual-tone')     return preset.colors.primary;
  return preset.colors.primary; // fallback
}

function deriveTertiary(preset) {
  if (preset.brand_scenario === 'monochromatic') return lighten(preset.colors.primary, 10);
  if (preset.brand_scenario === 'dual-tone')     return preset.colors.neutral || '#5F6368';
  return preset.colors.primary; // fallback
}

function deriveQuaternary(preset) {
  if (preset.brand_scenario === 'monochromatic') return darken(preset.colors.primary, 10);
  if (preset.brand_scenario === 'dual-tone')     return preset.colors.secondary || preset.colors.primary;
  return preset.colors.primary; // fallback
}

function autoNavBg(primaryHex) {
  // Mix primary at 15% with white
  return mixColors(primaryHex, '#FFFFFF', 0.15);
}

function autoNavText(primaryHex) {
  // Darken primary by mixing with black at 80%
  return mixColors(primaryHex, '#000000', 0.80);
}

function autoDarker(a, b) {
  return luminance(a) < luminance(b) ? a : b;
}
```

#### Stage 3: HTML Injection

The generated CSS is injected into the portfolio HTML file during the deploy step.

```
1. Read portfolio HTML template
2. Find the insertion point:
   <!-- BRAND_PRESET_INJECTION_POINT -->
   (placed inside <style> block, after :root defaults)
3. Insert the generated CSS block
4. Set the data-brand attribute on <html>:
   <html lang="en" data-brand="{brand_id}">
5. If preset has fonts.google_fonts_url, replace the default
   Google Fonts <link> tag with the preset's URL
6. Write the final HTML to the output directory
```

**Template HTML injection point:**

```html
<html lang="en" data-brand="{{brand_id}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{candidate_name}} - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="{{google_fonts_url}}" rel="stylesheet">
  <style>
    /* ============================================================
       LINKRIGHT DESIGN TOKEN SYSTEM v1.0 -- :root defaults
       ============================================================ */
    :root {
      /* ... full :root block from PLAN-06a Section 1.3 ... */
    }

    <!-- BRAND_PRESET_INJECTION_POINT -->

    /* ... rest of template CSS ... */
  </style>
</head>
```

### 1.8 Preset Discovery and Listing

The pipeline can enumerate available presets for user selection:

```javascript
function listAvailablePresets(presetsDir) {
  // Read all *.preset.json files in the presets directory
  // Return array of { brand_id, brand_name, brand_scenario }
  // Exclude _default.preset.json from the list (it is the fallback)
  // Sort alphabetically by brand_name
}
```

This enables a future interactive flow where the deploy workflow presents a list of available presets and the user selects one.

---

<a id="plan-06d"></a>
## 2. PLAN-06d: Accessibility and Contrast System

### 2.1 Design Goals

PLAN-09b (Section 3, Accessibility Audit) identified critical accessibility gaps in both templates:

- **CV Template:** No ARIA landmarks on nav items, no `tabindex`/`role="button"` on `.nav-item` divs, no `alt` text on profile photo, no skip navigation link, no semantic headings, `--brand-blue` (#4285F4) on white fails WCAG AA for normal text (3.26:1 ratio).
- **Beyond the Papers:** Gradient text on white is unverifiable, missing `alt` text on images, no skip navigation link.

This specification defines a comprehensive accessibility system that:

- Enforces WCAG AA contrast ratios for all text/background combinations in the theming system
- Validates contrast automatically when company presets are applied
- Provides automatic contrast adjustment when preset colors fail
- Defines focus indicators, keyboard navigation, and screen reader compatibility
- Supports reduced motion preferences
- Provides a color-blind safe mode via CSS custom properties
- Defines build-pipeline contrast checks

### 2.2 WCAG AA Contrast Ratio Requirements

The following contrast ratios are required for all text/background combinations in the Linkright portfolio:

| Text Category | Minimum Contrast Ratio | WCAG Level | Applies To |
|---|---|---|---|
| Normal text (<18pt / <14pt bold) | 4.5:1 | AA | Body text, captions, labels, nav text, contact info |
| Large text (>=18pt / >=14pt bold) | 3.0:1 | AA | Headings, hero name, section titles, display text |
| UI components & graphical objects | 3.0:1 | AA | Focus indicators, borders, icons, buttons |
| Enhanced (optional target) | 7.0:1 | AAA | Long-form body text in cover letter, Beyond Papers paragraphs |

**Critical text/background pairs to validate:**

| Pair ID | Text Token | Background Token | Current Default | Current Ratio | Status |
|---|---|---|---|---|---|
| P1 | `--lr-brand-primary` (#4285F4) | `--lr-color-page-bg` (#FFFFFF) | Section titles on white | 3.26:1 | FAILS AA normal |
| P2 | `--lr-color-text-primary` (#1F1F1F) | `--lr-color-page-bg` (#FFFFFF) | Body text on white | 16.05:1 | PASSES |
| P3 | `--lr-color-text-secondary` (#5F6368) | `--lr-color-page-bg` (#FFFFFF) | Subheadings on white | 5.55:1 | PASSES |
| P4 | `--lr-color-text-muted` (#444746) | `--lr-color-page-bg` (#FFFFFF) | Captions on white | 8.07:1 | PASSES |
| P5 | `--lr-color-text-inverse` (#FFFFFF) | `--lr-brand-primary` (#4285F4) | Button text on primary | 3.26:1 | PASSES large only |
| P6 | `--lr-color-nav-active-text` (#041E49) | `--lr-color-nav-active-bg` (#D3E3FD) | Active nav pill | 11.52:1 | PASSES |
| P7 | `--lr-color-text-on-dark` (hsla 87%) | `--lr-color-body-bg` (#1d1b1b) | BTP text on dark bg | ~13.0:1 | PASSES |
| P8 | `--lr-color-text-paragraph` (rgba 66%) | `--lr-color-section-bg` (#FFFFFF) | BTP body text | ~4.3:1 | BORDERLINE |

### 2.3 Contrast Validation Algorithm

The following algorithm is executed during the build pipeline (Stage 2 of the preset application process, after CSS generation) and can also be run as a standalone validation check.

#### 2.3.1 Relative Luminance Calculation (WCAG 2.1 Definition)

```javascript
/**
 * Calculate relative luminance of a color per WCAG 2.1.
 * Input: hex color string "#RRGGBB"
 * Output: luminance value 0.0 (black) to 1.0 (white)
 */
function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const linearize = (c) => c <= 0.04045
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * linearize(r)
       + 0.7152 * linearize(g)
       + 0.0722 * linearize(b);
}

/**
 * Calculate contrast ratio between two colors.
 * Returns ratio as a number >= 1.0.
 */
function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

#### 2.3.2 Contrast Validation Matrix

The validator checks every text/background pair defined in the theming system:

```javascript
/**
 * Validate all contrast pairs for a brand preset.
 * Returns array of { pair, ratio, required, pass, suggestion }.
 */
function validatePresetContrast(resolvedTokens) {
  const pairs = [
    // Normal text pairs (require 4.5:1)
    {
      id: 'P1', text: '--lr-brand-primary', bg: '--lr-color-page-bg',
      required: 3.0, // Large text only (section titles are >=13pt)
      usage: 'Section titles on white page'
    },
    {
      id: 'P2', text: '--lr-color-text-primary', bg: '--lr-color-page-bg',
      required: 4.5,
      usage: 'Body text on white page'
    },
    {
      id: 'P3', text: '--lr-color-text-secondary', bg: '--lr-color-page-bg',
      required: 4.5,
      usage: 'Subheadings on white page'
    },
    {
      id: 'P4', text: '--lr-color-text-muted', bg: '--lr-color-page-bg',
      required: 4.5,
      usage: 'Captions and labels on white page'
    },
    {
      id: 'P5', text: '--lr-color-text-inverse', bg: '--lr-brand-primary',
      required: 4.5,
      usage: 'White text on primary buttons'
    },
    {
      id: 'P6', text: '--lr-color-nav-active-text', bg: '--lr-color-nav-active-bg',
      required: 4.5,
      usage: 'Active nav pill text on active background'
    },
    {
      id: 'P7', text: '--lr-brand-primary', bg: '--lr-color-sidebar-bg',
      required: 3.0,
      usage: 'Brand accent text on sidebar background'
    },
    {
      id: 'P8', text: '--lr-color-text-inverse', bg: '--lr-color-footer-bg',
      required: 4.5,
      usage: 'White text on dark footer background'
    },
    {
      id: 'P9', text: '--lr-color-text-primary', bg: '--lr-color-card-bg',
      required: 4.5,
      usage: 'Body text on card background'
    },
    {
      id: 'P10', text: '--lr-brand-primary', bg: '--lr-color-canvas-bg',
      required: 3.0,
      usage: 'Links/accents on canvas background'
    }
  ];

  return pairs.map(pair => {
    const textColor = resolvedTokens[pair.text];
    const bgColor   = resolvedTokens[pair.bg];
    const ratio     = contrastRatio(textColor, bgColor);
    const pass      = ratio >= pair.required;

    return {
      ...pair,
      ratio: Math.round(ratio * 100) / 100,
      pass,
      suggestion: pass ? null : suggestFix(textColor, bgColor, pair.required)
    };
  });
}
```

#### 2.3.3 Automatic Contrast Adjustment Algorithm

When a text/background pair fails its required contrast ratio, the system can automatically adjust the text color to meet the requirement. This preserves the hue of the brand color while adjusting lightness.

```javascript
/**
 * Adjust a foreground color to achieve target contrast ratio
 * against a background color. Preserves hue and saturation,
 * adjusts lightness only.
 *
 * Strategy:
 * 1. Convert foreground to HSL
 * 2. If background is light (luminance > 0.5), darken the foreground
 * 3. If background is dark (luminance <= 0.5), lighten the foreground
 * 4. Binary search on lightness until target contrast is achieved
 *
 * Returns: adjusted hex color string, or null if impossible.
 */
function adjustForContrast(fgHex, bgHex, targetRatio) {
  const bgLum = relativeLuminance(bgHex);
  const fgHSL = hexToHSL(fgHex);

  // Determine direction: darken if bg is light, lighten if bg is dark
  const shouldDarken = bgLum > 0.5;

  let low = shouldDarken ? 0 : fgHSL.l;
  let high = shouldDarken ? fgHSL.l : 100;
  let bestL = fgHSL.l;
  let bestRatio = contrastRatio(fgHex, bgHex);

  // Binary search for optimal lightness (max 20 iterations)
  for (let i = 0; i < 20; i++) {
    const midL = (low + high) / 2;
    const candidate = hslToHex(fgHSL.h, fgHSL.s, midL);
    const ratio = contrastRatio(candidate, bgHex);

    if (ratio >= targetRatio) {
      bestL = midL;
      bestRatio = ratio;
      // Try to stay closer to the original lightness
      if (shouldDarken) low = midL;
      else              high = midL;
    } else {
      if (shouldDarken) high = midL;
      else              low = midL;
    }
  }

  if (bestRatio < targetRatio) return null; // Impossible to achieve
  return hslToHex(fgHSL.h, fgHSL.s, bestL);
}

/**
 * Suggest a fix for a failing contrast pair.
 * Returns an object with adjusted colors and explanation.
 */
function suggestFix(fgHex, bgHex, targetRatio) {
  // Strategy 1: adjust foreground
  const adjustedFg = adjustForContrast(fgHex, bgHex, targetRatio);
  if (adjustedFg) {
    return {
      strategy: 'adjust-foreground',
      original_fg: fgHex,
      adjusted_fg: adjustedFg,
      new_ratio: contrastRatio(adjustedFg, bgHex),
      explanation: `Darkened/lightened text from ${fgHex} to ${adjustedFg} to achieve ${targetRatio}:1 contrast.`
    };
  }

  // Strategy 2: adjust background (if foreground cannot be adjusted enough)
  const adjustedBg = adjustForContrast(bgHex, fgHex, targetRatio);
  if (adjustedBg) {
    return {
      strategy: 'adjust-background',
      original_bg: bgHex,
      adjusted_bg: adjustedBg,
      new_ratio: contrastRatio(fgHex, adjustedBg),
      explanation: `Adjusted background from ${bgHex} to ${adjustedBg} to achieve ${targetRatio}:1 contrast.`
    };
  }

  return {
    strategy: 'manual-review',
    explanation: 'Cannot automatically achieve required contrast. Manual color selection needed.'
  };
}
```

#### 2.3.4 Auto-Correction Mode

The preset application pipeline supports two modes for handling contrast failures:

| Mode | Behavior | When to Use |
|---|---|---|
| `warn` | Log contrast failures to console/report. Do not modify colors. Deploy proceeds. | Development, testing. |
| `auto-fix` | Apply `adjustForContrast()` to failing pairs. Log adjustments. Deploy proceeds with fixed colors. | Production deployment. |

Configuration in `workflow.yaml`:

```yaml
portfolio-deploy:
  theming:
    contrast_mode: "auto-fix"    # "warn" | "auto-fix"
    contrast_level: "AA"          # "AA" | "AAA"
    report_output: "contrast-report.json"
```

### 2.4 Focus Indicators

PLAN-09b identified that CV template `.nav-item` divs have `onclick` but no `tabindex`, `role="button"`, or keyboard handlers. The following focus system addresses this.

#### 2.4.1 CSS Focus Ring System

```css
/* ============================================================
   ACCESSIBILITY: Focus Indicators
   Applied globally. Uses --lr-color-focus-ring from brand preset.
   ============================================================ */

/* Remove default browser focus outline and replace with brand-colored ring */
*:focus {
  outline: none;
}

/* Visible focus ring for keyboard navigation only */
*:focus-visible {
  outline: 2px solid var(--lr-color-focus-ring);
  outline-offset: 2px;
  border-radius: var(--lr-radius-sm);
}

/* Navigation items */
.nav-item:focus-visible {
  outline: 2px solid var(--lr-color-focus-ring);
  outline-offset: -2px;  /* Inset to stay within sidebar bounds */
  border-radius: var(--lr-radius-md);
  background: var(--lr-color-nav-hover-bg);
}

/* Buttons */
.btn-download:focus-visible {
  outline: 2px solid var(--lr-color-text-inverse);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--lr-brand-primary);
}

/* Links */
a:focus-visible {
  outline: 2px solid var(--lr-color-focus-ring);
  outline-offset: 2px;
  text-decoration: underline;
}

/* iframe (slides view) */
.slides-embed:focus-visible {
  outline: 3px solid var(--lr-color-focus-ring);
  outline-offset: 3px;
}

/* High contrast mode: thicker, more visible focus ring */
@media (forced-colors: active) {
  *:focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
}

/* Print: no focus rings */
@media print {
  *:focus-visible {
    outline: none;
  }
}
```

#### 2.4.2 Keyboard Navigation

The CV template's `.nav-item` divs require keyboard accessibility attributes:

```html
<!-- BEFORE: inaccessible nav items -->
<div class="nav-item" id="nav-resume" onclick="switchView('resume')">
  <div class="nav-label">Resume</div>
  <div class="nav-subtext">The Evidence</div>
</div>

<!-- AFTER: accessible nav items -->
<div class="nav-item"
     id="nav-resume"
     role="tab"
     tabindex="0"
     aria-selected="false"
     aria-controls="resume-view"
     onclick="switchView('resume')"
     onkeydown="handleNavKeydown(event, 'resume')">
  <div class="nav-label">Resume</div>
  <div class="nav-subtext">The Evidence</div>
</div>
```

**Updated navigation container:**

```html
<nav class="nav-list" role="tablist" aria-label="Portfolio sections">
  <!-- ... nav items with role="tab" ... -->
</nav>
```

**Keyboard handler:**

```javascript
function handleNavKeydown(event, viewId) {
  // Enter or Space: activate the tab
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    switchView(viewId);
    return;
  }

  // Arrow keys: move focus between tabs
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const currentIndex = navItems.indexOf(event.currentTarget);

  let nextIndex = -1;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % navItems.length;
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + navItems.length) % navItems.length;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = navItems.length - 1;
  }

  if (nextIndex >= 0) {
    event.preventDefault();
    navItems[nextIndex].focus();
  }
}

// Updated switchView to manage aria-selected
function switchView(viewId) {
  // Update navigation pills
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-selected', 'false');
  });
  const activeNav = document.getElementById('nav-' + viewId);
  activeNav.classList.add('active');
  activeNav.setAttribute('aria-selected', 'true');

  // Update content views
  document.querySelectorAll('.view-container').forEach(view => {
    view.classList.remove('active');
    view.setAttribute('aria-hidden', 'true');
  });
  const activeView = document.getElementById(viewId + '-view');
  activeView.classList.add('active');
  activeView.setAttribute('aria-hidden', 'false');

  // Lazy-load slides iframe on first activation
  if (viewId === 'slides') {
    const iframe = document.getElementById('slides-iframe');
    if (iframe && !iframe.src && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
  }
}
```

#### 2.4.3 Skip Navigation Link

```html
<!-- First element inside <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- ... sidebar ... -->

<main class="main-content" id="main-content" tabindex="-1">
  <!-- ... views ... -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--lr-space-4);
  z-index: 10000;
  padding: var(--lr-space-2) var(--lr-space-4);
  background: var(--lr-brand-primary);
  color: var(--lr-color-text-inverse);
  font-family: var(--lr-font-family-resume);
  font-size: var(--lr-font-size-body);
  text-decoration: none;
  border-radius: var(--lr-radius-sm);
  transition: top var(--lr-anim-duration-fast) var(--lr-anim-easing-standard);
}

.skip-link:focus {
  top: var(--lr-space-4);
}
```

### 2.5 Screen Reader Compatibility

#### 2.5.1 Semantic Heading Hierarchy

The CV template currently uses `<div>` elements with class names for all headings. For screen reader compatibility, semantic heading elements must be used:

```html
<!-- Resume View heading hierarchy -->
<h1 class="name">Satvik Jain</h1>                         <!-- Only h1 on the page -->
<p class="role">Senior Product Manager</p>                 <!-- Not a heading, descriptive text -->

<h2 class="section-title">Professional Experience</h2>     <!-- Each resume section -->
<h3 class="entry-header">Organization Name One</h3>        <!-- Company names -->
<h4 class="project-title">Top Project One</h4>             <!-- Project names -->

<!-- Beyond the Papers heading hierarchy -->
<h2 class="section-title">Beyond the Papers</h2>           <!-- View title -->
<h3 class="secondary-heading">My Story</h3>                <!-- Section headings -->
```

#### 2.5.2 ARIA Live Regions

When the user switches views, screen readers need to be notified of the content change:

```html
<div id="view-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
```

```javascript
function switchView(viewId) {
  // ... existing logic ...

  // Announce view change to screen readers
  const viewLabels = {
    resume: 'Resume: The Evidence',
    whyme: 'Value Proposition: The Why Me',
    slides: 'Slide Deck: Career Signals',
    whygoogle: 'Strategic Fit: Why ' + getComputedStyle(document.documentElement)
      .getPropertyValue('--lr-target-company-short').replace(/"/g, '').trim(),
    whoami: 'Beyond the Papers: Personal Narrative'
  };
  const announcer = document.getElementById('view-announcer');
  announcer.textContent = 'Now viewing: ' + (viewLabels[viewId] || viewId);
}
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### 2.5.3 Image Alt Text Requirements

| Image | Required Alt Text Pattern | Source |
|---|---|---|
| Profile photo | `"Portrait of {candidate_name}"` | `meta.candidate_name` from payload |
| Beyond Papers hero GIF | `"Animated illustration representing {candidate_name}'s professional journey"` | Static, customizable |
| Project screenshots | `"{project_name} screenshot showing {brief description}"` | From project data |
| Company logos | `"{company_name} logo"` | From preset `brand_name` |
| 1px placeholders | `""` (empty alt, decorative) with `role="presentation"` | N/A |

### 2.6 Reduced Motion Support

PLAN-09b (Section 3.3) identified the need for `prefers-reduced-motion` support. The Linkright animation system (PLAN-06a Category 15) defines 3 timing tokens and 3 easing curves.

```css
/* ============================================================
   REDUCED MOTION: Honor user's motion preferences
   Affects all animation and transition tokens.
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  :root {
    /* Disable all transition durations */
    --lr-anim-duration-fast:    0ms;
    --lr-anim-duration-normal:  0ms;
    --lr-anim-duration-slow:    0ms;

    /* Override easing to linear (no bounce/overshoot) */
    --lr-anim-easing-standard:   linear;
    --lr-anim-easing-decelerate: linear;
    --lr-anim-easing-overshoot:  linear;
  }

  /* Disable the fadeIn animation on view switching */
  .view-container.active {
    animation: none !important;
  }

  /* Disable the Beyond Papers qualities carousel infinite scroll */
  .lr-btp-scope .qualities-track {
    animation: none !important;
  }

  /* Disable 3D transforms on image grid */
  .lr-btp-scope .image-grid * {
    transform: none !important;
    transition: none !important;
  }

  /* Disable project card hover glow effect */
  .lr-btp-scope .project-card::before {
    display: none;
  }

  /* Disable Identity Horizon gradient animation (see PLAN-06e) */
  .identity-horizon {
    animation: none !important;
  }

  /* Disable scroll-triggered timeline color changes */
  .lr-btp-scope .timeline-item {
    transition: none !important;
  }

  /* Provide static alternative for carousel: show all items */
  .lr-btp-scope .qualities-track {
    display: flex;
    flex-wrap: wrap;
    gap: var(--lr-space-4);
    justify-content: center;
  }
}

/* For users who ALLOW motion, add a subtle crossfade on view switch */
@media (prefers-reduced-motion: no-preference) {
  .view-container.active {
    animation: fadeIn var(--lr-anim-duration-normal) var(--lr-anim-easing-decelerate);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

### 2.7 Color-Blind Safe Mode

The theming system provides a color-blind safe mode that adjusts the palette to remain distinguishable for users with deuteranopia (red-green), protanopia (red weakness), and tritanopia (blue-yellow) color vision deficiencies.

#### 2.7.1 CSS Custom Property Layer

Color-blind safe mode is implemented as a CSS class on the `<html>` element, similar to the brand preset system:

```css
/* ============================================================
   COLOR-BLIND SAFE MODE
   Applied via: <html class="lr-cb-safe">
   Adjusts brand colors and semantic tokens for maximum
   distinguishability across color vision deficiency types.
   ============================================================ */

html.lr-cb-safe {
  /* Replace red/green with blue/orange (safe for deuteranopia + protanopia) */
  --lr-color-success:    #0077B6;   /* Blue instead of green */
  --lr-color-warning:    #F4A261;   /* Orange (unchanged, already safe) */
  --lr-color-error:      #E76F51;   /* Orange-red (shifted from pure red) */
  --lr-color-info:       var(--lr-brand-primary);

  /* Add patterns/textures to differentiate Identity Horizon segments */
  /* (Color alone should not convey meaning - WCAG 1.4.1) */
}

html.lr-cb-safe .identity-horizon .color-1 {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.2) 2px,
    rgba(255, 255, 255, 0.2) 4px
  );
}

html.lr-cb-safe .identity-horizon .color-2 {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.2) 2px,
    rgba(255, 255, 255, 0.2) 4px
  );
}

html.lr-cb-safe .identity-horizon .color-3 {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.2) 2px,
    rgba(255, 255, 255, 0.2) 4px
  );
}

html.lr-cb-safe .identity-horizon .color-4 {
  /* Solid - no pattern (baseline differentiation) */
}

/* Section dividers: add dotted/dashed patterns */
html.lr-cb-safe .section-divider .color-1 { border-style: solid; }
html.lr-cb-safe .section-divider .color-2 { border-style: dashed; }
html.lr-cb-safe .section-divider .color-3 { border-style: dotted; }
html.lr-cb-safe .section-divider .color-4 { border-style: double; }
```

#### 2.7.2 Activation

Color-blind safe mode can be activated two ways:

```javascript
// Programmatic activation
function toggleColorBlindSafe(enable) {
  document.documentElement.classList.toggle('lr-cb-safe', enable);
}
```

```html
<!-- Optional toggle in sidebar (below download button) -->
<button class="btn-accessibility"
        onclick="toggleColorBlindSafe(!document.documentElement.classList.contains('lr-cb-safe'))"
        aria-label="Toggle color-blind safe mode"
        title="Color-blind safe mode">
  <span aria-hidden="true">A11y</span>
</button>
```

### 2.8 Build Pipeline Contrast Testing

#### 2.8.1 Automated Contrast Check Script

The following script runs as part of the portfolio-deploy pipeline and produces a contrast validation report:

```javascript
/**
 * contrast-check.js
 * Run during build: node contrast-check.js <preset-file>
 * Exit code 0: all checks pass
 * Exit code 1: one or more checks fail (in 'warn' mode, logs and exits 0)
 */

function runContrastCheck(presetPath, mode = 'auto-fix') {
  const preset = JSON.parse(fs.readFileSync(presetPath, 'utf8'));
  const resolvedTokens = resolveAllTokens(preset);  // Compute all CSS variable values
  const results = validatePresetContrast(resolvedTokens);

  const failures = results.filter(r => !r.pass);

  if (failures.length === 0) {
    console.log(`PASS: All ${results.length} contrast pairs meet WCAG AA requirements.`);
    return { pass: true, results };
  }

  console.log(`CONTRAST ISSUES: ${failures.length} of ${results.length} pairs fail WCAG AA.`);

  for (const f of failures) {
    console.log(`  FAIL [${f.id}] ${f.usage}`);
    console.log(`    Text: ${resolvedTokens[f.text]} | BG: ${resolvedTokens[f.bg]}`);
    console.log(`    Ratio: ${f.ratio}:1 (required: ${f.required}:1)`);

    if (mode === 'auto-fix' && f.suggestion) {
      console.log(`    FIX: ${f.suggestion.explanation}`);
      // Apply the fix to the resolved tokens
      if (f.suggestion.strategy === 'adjust-foreground') {
        resolvedTokens[f.text] = f.suggestion.adjusted_fg;
      } else if (f.suggestion.strategy === 'adjust-background') {
        resolvedTokens[f.bg] = f.suggestion.adjusted_bg;
      }
    }
  }

  // Write report
  const report = {
    preset: preset.brand_id,
    timestamp: new Date().toISOString(),
    mode,
    total_pairs: results.length,
    failures: failures.length,
    auto_fixed: mode === 'auto-fix' ? failures.filter(f => f.suggestion?.strategy !== 'manual-review').length : 0,
    details: results
  };
  fs.writeFileSync('contrast-report.json', JSON.stringify(report, null, 2));

  return { pass: mode === 'auto-fix', results, fixes: resolvedTokens };
}
```

#### 2.8.2 Integration with Portfolio-Deploy Workflow

The contrast check integrates into the existing portfolio-deploy workflow at the point between CSS generation (Stage 2) and HTML injection (Stage 3):

```
Stage 1: Select and validate preset file
    |
Stage 2: Generate brand CSS from preset
    |
Stage 2.5: Run contrast validation          <-- NEW
    |  - If mode = "warn": log issues, continue
    |  - If mode = "auto-fix": adjust colors, regenerate CSS
    |
Stage 3: Inject CSS into portfolio HTML
```

---

<a id="plan-06e"></a>
## 3. PLAN-06e: Identity Horizon Brand Bar Auto-Adaptation

### 3.1 Design Goals

The Identity Horizon is a 3pt-high colored bar at the top of each A4 page in the CV template (PLAN-01a: line 261, ".identity-horizon"). PLAN-01b documented that it currently uses 4 child divs (`.color-1` through `.color-4`) with `flex: 1`, each colored by one of the 4 brand variables (`--brand-blue`, `--brand-red`, `--brand-yellow`, `--brand-green`).

PLAN-06a (Section 1.3, Category 8) mapped these to `--lr-horizon-1` through `--lr-horizon-4` and defined them as references to `--lr-brand-primary` through `--lr-brand-quaternary`.

This specification extends the Identity Horizon to:

- Support two rendering modes: **segments** (4 flat color blocks) and **gradient** (continuous CSS gradient)
- Adapt automatically to company brand colors from presets
- Define new CSS custom properties for gradient control: `--lr-ih-start`, `--lr-ih-mid`, `--lr-ih-end`, `--lr-ih-angle`
- Provide fallback behavior when company colors produce poor gradients
- Define print behavior (solid color fallback vs. gradient)
- Add subtle animation on view transitions

### 3.2 CSS Custom Properties for Identity Horizon

```css
:root {
  /* ============================================================
     IDENTITY HORIZON BAR — CSS Custom Properties
     ============================================================ */

  /* Mode: "segments" (4 flat blocks) or "gradient" (continuous) */
  --lr-ih-mode:     segments;

  /* Segment mode colors (used when --lr-ih-mode is "segments") */
  --lr-horizon-1:   var(--lr-brand-primary);
  --lr-horizon-2:   var(--lr-brand-secondary);
  --lr-horizon-3:   var(--lr-brand-tertiary);
  --lr-horizon-4:   var(--lr-brand-quaternary);

  /* Gradient mode stops (used when --lr-ih-mode is "gradient") */
  --lr-ih-start:    var(--lr-brand-primary);
  --lr-ih-mid:      var(--lr-brand-secondary);
  --lr-ih-end:      var(--lr-brand-quaternary);
  --lr-ih-angle:    90deg;

  /* Dimensions */
  --lr-ih-height:           3pt;
  --lr-ih-height-print:     3pt;     /* Same for print (brand signature) */
  --lr-ih-height-hover:     4pt;     /* Subtle expand on page hover (screen only) */

  /* Animation (view transition) */
  --lr-ih-anim-duration:    600ms;
  --lr-ih-anim-delay:       100ms;   /* Slight delay after view switch fadeIn */
  --lr-ih-anim-easing:      var(--lr-anim-easing-decelerate);
}
```

### 3.3 HTML Structure (Updated)

The Identity Horizon HTML structure remains compatible with both rendering modes. The CSS determines which mode is visually active.

```html
<div class="identity-horizon" role="presentation" aria-hidden="true">
  <!-- Segment mode: 4 individual color blocks -->
  <div class="ih-segment ih-seg-1"></div>
  <div class="ih-segment ih-seg-2"></div>
  <div class="ih-segment ih-seg-3"></div>
  <div class="ih-segment ih-seg-4"></div>
  <!-- Gradient mode: single overlay element -->
  <div class="ih-gradient"></div>
</div>
```

**Migration note:** The existing `.color-1` through `.color-4` class names are renamed to `.ih-seg-1` through `.ih-seg-4` and namespaced. This follows the PLAN-09a CSS namespace recommendation. The old class names should be aliased during migration:

```css
/* Migration aliases (remove after full migration) */
.color-1 { /* alias for .ih-seg-1 */ }
.color-2 { /* alias for .ih-seg-2 */ }
.color-3 { /* alias for .ih-seg-3 */ }
.color-4 { /* alias for .ih-seg-4 */ }
```

### 3.4 CSS for Both Rendering Modes

```css
/* ============================================================
   IDENTITY HORIZON BAR — Rendering Modes
   The mode is controlled by the preset via CSS class or
   custom property. Both segment and gradient elements are
   always in the DOM; CSS shows/hides the appropriate ones.
   ============================================================ */

.identity-horizon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--lr-ih-height);
  display: flex;
  overflow: hidden;
  z-index: 1;
}

/* ------------------------------------------------------------------
   SEGMENT MODE (default)
   4 equal-width color blocks, as in the original CV template.
   ------------------------------------------------------------------ */

.ih-segment {
  flex: 1;
  height: 100%;
}

.ih-seg-1 { background: var(--lr-horizon-1); }
.ih-seg-2 { background: var(--lr-horizon-2); }
.ih-seg-3 { background: var(--lr-horizon-3); }
.ih-seg-4 { background: var(--lr-horizon-4); }

.ih-gradient {
  display: none;  /* Hidden in segment mode */
}

/* ------------------------------------------------------------------
   GRADIENT MODE
   Single continuous gradient across the full width.
   Activated by the preset applying the class or when
   --lr-ih-mode is set to "gradient".
   ------------------------------------------------------------------ */

.identity-horizon.ih-mode-gradient .ih-segment {
  display: none;  /* Hide segments in gradient mode */
}

.identity-horizon.ih-mode-gradient .ih-gradient {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    var(--lr-ih-angle),
    var(--lr-ih-start) 0%,
    var(--lr-ih-mid) 50%,
    var(--lr-ih-end) 100%
  );
}

/* 2-stop gradient (when --lr-ih-mid is not set or same as start) */
.identity-horizon.ih-mode-gradient.ih-2-stop .ih-gradient {
  background: linear-gradient(
    var(--lr-ih-angle),
    var(--lr-ih-start) 0%,
    var(--lr-ih-end) 100%
  );
}
```

### 3.5 How Company Presets Override the Gradient

When the build pipeline processes a preset with `identity_horizon.mode = "gradient"`, it:

1. Adds the class `ih-mode-gradient` to all `.identity-horizon` elements in the HTML.
2. If `gradient_mid` is omitted, also adds `ih-2-stop` class for a simpler 2-stop gradient.
3. Sets the `--lr-ih-start`, `--lr-ih-mid`, `--lr-ih-end`, and `--lr-ih-angle` custom properties in the brand preset CSS block.

**Segment mode (default for multi-chromatic brands like Google):**

```css
html[data-brand="google"] {
  --lr-ih-mode:    segments;
  --lr-horizon-1:  #4285F4;  /* Blue */
  --lr-horizon-2:  #EA4335;  /* Red */
  --lr-horizon-3:  #FBBC05;  /* Yellow */
  --lr-horizon-4:  #34A853;  /* Green */
}
```
No class change needed. The 4-segment HTML is shown by default.

**Gradient mode (for dual-tone or monochromatic brands like Amazon):**

```css
html[data-brand="amazon"] {
  --lr-ih-mode:    gradient;
  --lr-ih-start:   #FF9900;
  --lr-ih-mid:     #232F3E;
  --lr-ih-end:     #FF9900;
  --lr-ih-angle:   90deg;
}
```
Pipeline adds `class="identity-horizon ih-mode-gradient"` to all Identity Horizon elements.

### 3.6 Gradient Quality Validation and Fallback

Some company color combinations produce poor gradients (muddy midpoints, low-contrast transitions, or near-invisible color steps). The build pipeline validates gradient quality.

#### 3.6.1 Gradient Quality Checks

```javascript
/**
 * Validate that a gradient produces visually distinct color steps.
 * Returns { quality: 'good' | 'acceptable' | 'poor', issues: string[] }
 */
function validateGradientQuality(startHex, midHex, endHex) {
  const issues = [];

  // Check 1: Start-to-end contrast
  // The gradient endpoints should be visually distinguishable
  const startEndContrast = contrastRatio(startHex, endHex);
  if (startEndContrast < 1.5) {
    issues.push(`Start-end contrast too low (${startEndContrast.toFixed(2)}:1). Gradient will appear flat.`);
  }

  // Check 2: Midpoint muddy-ness
  // When two saturated complementary colors are blended, the midpoint
  // often produces a desaturated brown/gray. Check if the midpoint
  // (computed or explicit) has very low saturation.
  if (midHex) {
    const midHSL = hexToHSL(midHex);
    const startHSL = hexToHSL(startHex);
    const endHSL = hexToHSL(endHex);

    // If the explicit midpoint is very desaturated relative to endpoints
    const avgSat = (startHSL.s + endHSL.s) / 2;
    if (midHSL.s < avgSat * 0.3 && avgSat > 30) {
      issues.push(`Midpoint color is highly desaturated (S=${midHSL.s.toFixed(0)}%) while endpoints average ${avgSat.toFixed(0)}%. May appear muddy.`);
    }
  } else {
    // Compute the implicit midpoint and check for muddiness
    const implicitMid = blendColors(startHex, endHex, 0.5);
    const implicitHSL = hexToHSL(implicitMid);
    const startHSL = hexToHSL(startHex);
    const endHSL = hexToHSL(endHex);
    const avgSat = (startHSL.s + endHSL.s) / 2;

    if (implicitHSL.s < avgSat * 0.3 && avgSat > 30) {
      issues.push(`Implicit midpoint is muddy (S=${implicitHSL.s.toFixed(0)}%). Consider specifying an explicit --lr-ih-mid color.`);
    }
  }

  // Check 3: Luminance range
  // A good gradient has some luminance variation for visual interest
  const startLum = relativeLuminance(startHex);
  const endLum = relativeLuminance(endHex);
  const lumRange = Math.abs(startLum - endLum);
  if (lumRange < 0.05) {
    issues.push(`Luminance range is very narrow (${lumRange.toFixed(3)}). Gradient may lack visual depth.`);
  }

  // Determine quality
  let quality = 'good';
  if (issues.length >= 2) quality = 'poor';
  else if (issues.length === 1) quality = 'acceptable';

  return { quality, issues };
}
```

#### 3.6.2 Fallback Behavior

When gradient quality is `poor`, the pipeline applies one of two fallback strategies:

| Fallback | When | Behavior |
|---|---|---|
| **Fallback A: Switch to segment mode** | When all 3 gradient checks fail | Override `--lr-ih-mode` to `segments`. Use the 4 brand colors as flat blocks even if the preset specified gradient mode. |
| **Fallback B: Inject a curated midpoint** | When only the muddy midpoint check fails | Compute a midpoint that preserves saturation. Use the HSL midpoint of hue (shortest arc) with the maximum of both endpoints' saturations. |

```javascript
function computeSafeMidpoint(startHex, endHex) {
  const startHSL = hexToHSL(startHex);
  const endHSL = hexToHSL(endHex);

  // Shortest hue arc
  let hueDiff = endHSL.h - startHSL.h;
  if (hueDiff > 180) hueDiff -= 360;
  if (hueDiff < -180) hueDiff += 360;
  const midHue = (startHSL.h + hueDiff / 2 + 360) % 360;

  // Max saturation (prevents desaturation at midpoint)
  const midSat = Math.max(startHSL.s, endHSL.s);

  // Average lightness
  const midLight = (startHSL.l + endHSL.l) / 2;

  return hslToHex(midHue, midSat, midLight);
}
```

### 3.7 Print Behavior

The Identity Horizon must appear correctly in print output (PDF via `window.print()`). Different behavior is needed for the two modes.

```css
@media print {
  .identity-horizon {
    height: var(--lr-ih-height-print);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* Remove any animations */
    animation: none !important;
    transition: none !important;
  }

  /* Segment mode: prints normally (each segment has a background color) */
  .ih-segment {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Gradient mode: also prints normally in modern browsers.
     Chrome/Edge support printing CSS gradients with -webkit-print-color-adjust: exact.
     Firefox supports it with print-color-adjust: exact (since Firefox 97).
     Safari: gradients print as transparent. Needs solid fallback. */
  .identity-horizon.ih-mode-gradient .ih-gradient {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Safari print fallback: show segment mode as backup */
  @supports not (print-color-adjust: exact) {
    .identity-horizon.ih-mode-gradient .ih-gradient {
      /* If gradient printing is not supported, use a solid fallback */
      background: var(--lr-ih-start) !important;
    }
  }
}
```

**Print decision matrix:**

| Mode | Chrome/Edge | Firefox | Safari |
|---|---|---|---|
| Segments (4 blocks) | Correct colors | Correct colors | Correct colors |
| Gradient | Correct gradient | Correct gradient | Solid fallback (--lr-ih-start) |

**Recommendation:** For maximum print reliability, presets targeting companies where print fidelity is critical (e.g., a printed resume for a formal application) should use `segments` mode. Gradient mode is best for screen-first portfolios.

### 3.8 Animation on View Transitions

When the user switches between views, the Identity Horizon can perform a subtle animation to create visual continuity and brand emphasis. This animation respects `prefers-reduced-motion` (see PLAN-06d Section 2.6).

#### 3.8.1 Segment Mode Animation: Staggered Reveal

Each segment slides in from left to right with a stagger delay:

```css
@media (prefers-reduced-motion: no-preference) {
  /* Segment mode: staggered width reveal */
  .view-container.active .identity-horizon .ih-segment {
    animation: ih-segment-reveal var(--lr-ih-anim-duration) var(--lr-ih-anim-easing) both;
  }

  .view-container.active .ih-seg-1 { animation-delay: calc(var(--lr-ih-anim-delay) + 0ms); }
  .view-container.active .ih-seg-2 { animation-delay: calc(var(--lr-ih-anim-delay) + 80ms); }
  .view-container.active .ih-seg-3 { animation-delay: calc(var(--lr-ih-anim-delay) + 160ms); }
  .view-container.active .ih-seg-4 { animation-delay: calc(var(--lr-ih-anim-delay) + 240ms); }

  @keyframes ih-segment-reveal {
    from {
      transform: scaleX(0);
      transform-origin: left center;
      opacity: 0;
    }
    to {
      transform: scaleX(1);
      transform-origin: left center;
      opacity: 1;
    }
  }
}
```

#### 3.8.2 Gradient Mode Animation: Horizontal Sweep

The gradient bar performs a left-to-right reveal using a clip-path animation:

```css
@media (prefers-reduced-motion: no-preference) {
  /* Gradient mode: clip-path sweep reveal */
  .view-container.active .identity-horizon.ih-mode-gradient .ih-gradient {
    animation: ih-gradient-sweep var(--lr-ih-anim-duration) var(--lr-ih-anim-easing)
               var(--lr-ih-anim-delay) both;
  }

  @keyframes ih-gradient-sweep {
    from {
      clip-path: inset(0 100% 0 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
}
```

#### 3.8.3 Subtle Gradient Shift (Continuous, Optional)

For brands that want a more dynamic presence, an optional continuous subtle gradient shift can be enabled. This is NOT enabled by default -- it must be explicitly activated via a CSS class.

```css
@media (prefers-reduced-motion: no-preference) {
  /* Optional: continuous subtle gradient shift */
  .identity-horizon.ih-mode-gradient.ih-animate-shift .ih-gradient {
    background-size: 200% 100%;
    animation: ih-gradient-shift 8s ease-in-out infinite alternate;
  }

  @keyframes ih-gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
}
```

**Activation:** Add `ih-animate-shift` class to the `.identity-horizon` element. This is controlled by an optional `animation` field in the preset (not yet in schema -- deferred to future enhancement).

### 3.9 Section Divider Adaptation

The CV template's section dividers (`.section-divider`) use the same 4-color system as the Identity Horizon. When the Identity Horizon switches to gradient mode, the section dividers should also adapt.

```css
/* Section divider: mirrors Identity Horizon mode */

/* Segment mode */
.section-divider {
  display: flex;
  height: 1.5pt;
  width: 100%;
  margin-top: var(--lr-space-1);
}

.section-divider .sd-seg-1 { flex: 1; background: var(--lr-horizon-1); }
.section-divider .sd-seg-2 { flex: 1; background: var(--lr-horizon-2); }
.section-divider .sd-seg-3 { flex: 1; background: var(--lr-horizon-3); }
.section-divider .sd-seg-4 { flex: 1; background: var(--lr-horizon-4); }

/* Gradient mode: section divider becomes a single gradient line */
.identity-horizon.ih-mode-gradient ~ .section .section-divider,
html[data-brand].ih-mode-gradient .section-divider {
  background: linear-gradient(
    var(--lr-ih-angle),
    var(--lr-ih-start) 0%,
    var(--lr-ih-mid) 50%,
    var(--lr-ih-end) 100%
  );
  height: 1.5pt;
}

.identity-horizon.ih-mode-gradient ~ .section .section-divider > * {
  display: none;  /* Hide segment children */
}
```

### 3.10 Complete Identity Horizon CSS Module

The following is the complete CSS module for the Identity Horizon, combining all specifications from this section into a single, copy-paste-ready block.

```css
/* ============================================================
   IDENTITY HORIZON BAR — Complete CSS Module v1.0
   Linkright Portfolio Platform

   Dependencies:
   - PLAN-06a CSS Custom Property Taxonomy (--lr-* variables)
   - PLAN-06c Brand Preset System (--lr-ih-* variables)
   - PLAN-06d Accessibility (prefers-reduced-motion)
   ============================================================ */

/* ---- Custom Properties ---- */
:root {
  --lr-ih-mode:            segments;
  --lr-horizon-1:          var(--lr-brand-primary);
  --lr-horizon-2:          var(--lr-brand-secondary);
  --lr-horizon-3:          var(--lr-brand-tertiary);
  --lr-horizon-4:          var(--lr-brand-quaternary);
  --lr-ih-start:           var(--lr-brand-primary);
  --lr-ih-mid:             var(--lr-brand-secondary);
  --lr-ih-end:             var(--lr-brand-quaternary);
  --lr-ih-angle:           90deg;
  --lr-ih-height:          3pt;
  --lr-ih-height-print:    3pt;
  --lr-ih-height-hover:    4pt;
  --lr-ih-anim-duration:   600ms;
  --lr-ih-anim-delay:      100ms;
  --lr-ih-anim-easing:     var(--lr-anim-easing-decelerate);
}

/* ---- Base Layout ---- */
.identity-horizon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--lr-ih-height);
  display: flex;
  overflow: hidden;
  z-index: 1;
}

/* ---- Segment Mode (Default) ---- */
.ih-segment {
  flex: 1;
  height: 100%;
  will-change: transform, opacity;
}
.ih-seg-1 { background: var(--lr-horizon-1); }
.ih-seg-2 { background: var(--lr-horizon-2); }
.ih-seg-3 { background: var(--lr-horizon-3); }
.ih-seg-4 { background: var(--lr-horizon-4); }
.ih-gradient { display: none; }

/* ---- Gradient Mode ---- */
.identity-horizon.ih-mode-gradient .ih-segment { display: none; }
.identity-horizon.ih-mode-gradient .ih-gradient {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    var(--lr-ih-angle),
    var(--lr-ih-start) 0%,
    var(--lr-ih-mid) 50%,
    var(--lr-ih-end) 100%
  );
}
.identity-horizon.ih-mode-gradient.ih-2-stop .ih-gradient {
  background: linear-gradient(
    var(--lr-ih-angle),
    var(--lr-ih-start) 0%,
    var(--lr-ih-end) 100%
  );
}

/* ---- Animations (Motion OK) ---- */
@media (prefers-reduced-motion: no-preference) {
  .view-container.active .identity-horizon .ih-segment {
    animation: ih-segment-reveal var(--lr-ih-anim-duration) var(--lr-ih-anim-easing) both;
  }
  .view-container.active .ih-seg-1 { animation-delay: calc(var(--lr-ih-anim-delay)); }
  .view-container.active .ih-seg-2 { animation-delay: calc(var(--lr-ih-anim-delay) + 80ms); }
  .view-container.active .ih-seg-3 { animation-delay: calc(var(--lr-ih-anim-delay) + 160ms); }
  .view-container.active .ih-seg-4 { animation-delay: calc(var(--lr-ih-anim-delay) + 240ms); }
  @keyframes ih-segment-reveal {
    from { transform: scaleX(0); transform-origin: left center; opacity: 0; }
    to   { transform: scaleX(1); transform-origin: left center; opacity: 1; }
  }

  .view-container.active .identity-horizon.ih-mode-gradient .ih-gradient {
    animation: ih-gradient-sweep var(--lr-ih-anim-duration) var(--lr-ih-anim-easing)
               var(--lr-ih-anim-delay) both;
  }
  @keyframes ih-gradient-sweep {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0 0 0); }
  }
}

/* ---- Animations (Reduced Motion) ---- */
@media (prefers-reduced-motion: reduce) {
  .identity-horizon,
  .identity-horizon .ih-segment,
  .identity-horizon .ih-gradient {
    animation: none !important;
    transition: none !important;
  }
}

/* ---- Print ---- */
@media print {
  .identity-horizon {
    height: var(--lr-ih-height-print);
    animation: none !important;
    transition: none !important;
  }
  .ih-segment,
  .ih-gradient {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* ---- Legacy Class Aliases (Migration) ---- */
.color-1 { background: var(--lr-horizon-1); flex: 1; height: 100%; }
.color-2 { background: var(--lr-horizon-2); flex: 1; height: 100%; }
.color-3 { background: var(--lr-horizon-3); flex: 1; height: 100%; }
.color-4 { background: var(--lr-horizon-4); flex: 1; height: 100%; }
```

---

<a id="appendix-a"></a>
## Appendix A: Cross-Reference Matrix

| Audit/Spec Finding | This Spec Section | Action |
|---|---|---|
| PLAN-06a Section 1.6: Brand presets as CSS selectors | PLAN-06c Section 1.2 | Extended to file-based JSON format with full schema |
| PLAN-06a Section 1.7: Brand Preset JSON Schema | PLAN-06c Section 1.2 | Superseded with comprehensive schema including logo, fonts, gradients, IH control |
| PLAN-06a Category 8: Identity Horizon variables | PLAN-06e Section 3.2 | Extended with gradient mode variables (--lr-ih-start/mid/end/angle) |
| PLAN-01b: 4-color brand system (brand-blue/red/yellow/green) | PLAN-06c Section 1.3 | Mapped to preset colors.primary through colors.quaternary |
| PLAN-01b: Decision Tree (Scenarios A/B/C) | PLAN-06c Section 1.2 | Formalized as brand_scenario enum (multi-chromatic/dual-tone/monochromatic) |
| PLAN-01b: Identity Horizon 4-segment bar | PLAN-06e Section 3.3 | HTML updated with dual-mode structure (segments + gradient) |
| PLAN-01e: Company name via CSS content property | PLAN-06c Section 1.3 | Preset brand_name maps to --lr-target-company-name |
| PLAN-09b: --brand-blue (#4285F4) fails WCAG AA at 3.26:1 | PLAN-06d Section 2.2 | Documented as P1 contrast pair; auto-fix algorithm darkens to pass |
| PLAN-09b: No tabindex/role/keyboard on .nav-item | PLAN-06d Section 2.4 | Full keyboard navigation system with ARIA tablist pattern |
| PLAN-09b: No alt text on profile photo | PLAN-06d Section 2.5 | Alt text requirements table defined |
| PLAN-09b: No skip navigation link | PLAN-06d Section 2.4 | Skip link HTML and CSS defined |
| PLAN-09b: No semantic headings in CV template | PLAN-06d Section 2.5 | Heading hierarchy h1-h4 defined |
| PLAN-09b: prefers-reduced-motion needed | PLAN-06d Section 2.6 | Complete reduced motion system with all animation overrides |
| PLAN-09b: Gradient text contrast unverifiable | PLAN-06d Section 2.3 | Gradient text excluded from automated checks; manual review required |
| PLAN-06b Section 2.2: Font family variables | PLAN-06c Section 1.2 | Preset fonts object maps to --lr-font-family-* variables |
| PLAN-06b Section 2.7: Google Fonts loading | PLAN-06c Section 1.2 | Preset google_fonts_url overrides default font loading URL |
| PLAN-09a: CSS namespace recommendation (lr-cv-scope) | PLAN-06e Section 3.3 | Identity Horizon class names prefixed (ih-seg-*, ih-gradient) |
| PLAN-09d E4: Token taxonomy before implementation | PLAN-06c Section 1.3 | Complete preset-to-token mapping table |

---

<a id="appendix-b"></a>
## Appendix B: Implementation Order

### Phase 1: Foundation (PLAN-06c Core)

1. Create the `presets/` directory under `_lr/sync/workflows/portfolio-deploy/data/`
2. Write `brand-preset.v1.schema.json`
3. Write `_default.preset.json`
4. Implement `generateBrandCSS()` function in the deploy pipeline
5. Add `<!-- BRAND_PRESET_INJECTION_POINT -->` to the portfolio HTML template
6. Test with the default preset

### Phase 2: Contrast System (PLAN-06d Core)

1. Implement `relativeLuminance()`, `contrastRatio()`, `adjustForContrast()` utility functions
2. Implement `validatePresetContrast()` with all 10 contrast pairs
3. Integrate contrast check into the deploy pipeline (Stage 2.5)
4. Add contrast_mode configuration to workflow.yaml
5. Test with the default preset and verify the Google Blue (#4285F4) auto-fix

### Phase 3: Accessibility Markup (PLAN-06d HTML/CSS)

1. Add ARIA attributes to all `.nav-item` elements (role, tabindex, aria-selected, aria-controls)
2. Add `handleNavKeydown()` keyboard handler
3. Add skip navigation link
4. Add `.sr-only` screen reader utility class
5. Add view change announcer (aria-live region)
6. Update all images with appropriate alt text
7. Add semantic heading hierarchy (h1-h4)

### Phase 4: Reduced Motion and Color-Blind Mode (PLAN-06d CSS)

1. Implement `@media (prefers-reduced-motion: reduce)` overrides
2. Implement `.lr-cb-safe` color-blind safe mode CSS
3. Test with macOS Accessibility > Display > Reduce Motion enabled
4. Test with Chromium DevTools color vision deficiency simulation

### Phase 5: Identity Horizon (PLAN-06e)

1. Update HTML structure: rename `.color-*` to `.ih-seg-*`, add `.ih-gradient` element
2. Implement CSS dual-mode rendering (segments + gradient)
3. Implement view transition animations (staggered reveal + gradient sweep)
4. Implement gradient quality validation in the build pipeline
5. Test print behavior across Chrome, Firefox, Safari
6. Add legacy class aliases for migration period

### Phase 6: Company Presets (PLAN-06c Examples)

1. Write `google.preset.json`, `amazon.preset.json`, `stripe.preset.json`
2. Run contrast validation on all presets
3. Run gradient quality validation on all presets
4. Generate and visually inspect the CSS output for each preset
5. Test print output with each preset

### Dependency Graph

```
Phase 1 (Preset Format)
  |
  +---> Phase 2 (Contrast System)
  |       |
  |       +---> Phase 3 (A11y Markup)
  |       |
  |       +---> Phase 4 (Reduced Motion / CB Safe)
  |
  +---> Phase 5 (Identity Horizon)
          |
          +---> Phase 6 (Company Presets)
                  |
                  +--- [All Phases Complete: Integration Testing]
```

---

*End of PLAN-06cde Theming System Design Specifications.*
