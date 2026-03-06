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
