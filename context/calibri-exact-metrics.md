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
