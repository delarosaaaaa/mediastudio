# MediaStudio Design System v1.0

> **Single source of truth.** Every colour, size, spacing and pattern lives here.
> Before writing any component, read this file. Before reviewing a PR, check against this file.

---

## 1. Colour

### Purple ramp — structural use only
| Token | Hex | Use for |
|-------|-----|---------|
| `p900` | `#1A0050` | Kans hero line, dark hero bg, data bar series 1 |
| `p800` | `#3B1591` | Hero text on p100/tinted bg |
| `p700` | `#5B21B6` | Active tab underline, motivation bullets, numbered labels, primary CTA, insight left-border |
| `p600` | `#7C3AED` | Data bar series 3 |
| `p400` | `#A855F7` | Data bar series 4 |
| `p300` | `#C4B5FD` | Connector arrows, decorative lines |
| `p100` | `#EDE9FE` | Insight strip background, strategic insight hero bg |

### Semantic colours
| Token | Hex | Use for |
|-------|-----|---------|
| `threat` | `#7F1D1D` | Dreiging hero top-line |
| `danger` | `#A32D2D` | Danger label/body text |
| `warning` | `#BA7517` | Warning label, risk bullet |
| `success` | `#1D9E75` | Positive outcome hero |

### Neutrals
| Token | Hex | Use for |
|-------|-----|---------|
| `white` | `#FFFFFF` | All standard card backgrounds |
| `zebraAlt` | `#F8F7F4` | Alternating table row |
| `pageBg` / `inset` | `#F5F4F0` | Page background, Why-now block, inner blocks |
| `border` | `#E8E6E0` | Dividers (0.5px), column separators |
| `muted` | `#888888` | All labels, secondary text, pain-point bullets |
| `faint` | `#BBBBBB` | Placeholders, disabled state |
| `ink` | `#0D0D0D` | Primary body and heading text |

### Colour decision tree

**Do I need to colour this element?**

```
Is it a hero card with semantic meaning (kans/dreiging/insight/outcome)?
  YES → Use HERO variant (tinted bg + coloured top-line + coloured text)
  NO  → Is it a data element (bar, donut slice, bubble, node)?
          YES → Use SERIES[0–3] = [p900, p700, p600, p300]
          NO  → Is it an active state (tab, selected row, CTA)?
                  YES → p700 (#5B21B6)
                  NO  → Leave it white/neutral. Do not add colour.
```

**Never:**
- Coloured background on regular info cards
- p700 text on p100 background (fails contrast)
- Black (#0D0D0D) text on any tinted hero background
- Border + shadow on the same element
- Coloured top-line on KPI cards or plain list cards
- More than 2 purple UI elements visible at the same time

---

## 2. Typography — 4 sizes only

| Name | Size | Weight | Colour | Use for |
|------|------|--------|--------|---------|
| Label | 10px | 700 | `#888` | Card section titles, KPI labels, column headers, tab names — always uppercase, letter-spacing 0.08em |
| Body | 13px | 400/500 | `#0D0D0D` primary, `#888` secondary | All list items, card body text, table rows, descriptions |
| BodySm | 11px | 400 | `#888` | Supporting/secondary only — never primary content |
| Title | 16px | 500 | `#0D0D0D` | Persona names, card primary values, KPI numbers |
| Hero | 22px | 500 | see hero tint | Company name on hero cards, executive summary numbers |

**Never use any other font size.**

---

## 3. Spacing

| Token | Value | Use for |
|-------|-------|---------|
| `pagePad` | 16px | Left/right page padding |
| `cardPad` | 18px | Internal card padding |
| `gap` | 10px | Gap between sibling cards |
| `gapLg` | 14px | Gap for persona cards (taller) |
| `radius` | 14px | All standard cards |
| `radiusSm` | 12px | KPI cards, small elements |
| `radiusXs` | 8px | Inner blocks (test-agenda, trigger block) |

---

## 4. Card system — 3 variants only

### Variant A — Standard card (default)
```
background: white
border-radius: 14px
box-shadow: 0 2px 8px rgba(0,0,0,.06)
overflow: hidden
NO border. NO coloured top-line. NO coloured background.
```
Used for: ALL regular information cards (lists, tables, SOV, channel details, test-agenda, KPI lists)

### Variant B — Hero card (semantic meaning only)
```
background: HERO[variant].bg  (lightly tinted)
border-radius: 14px
box-shadow: 0 2px 8px rgba(0,0,0,.06)
overflow: hidden
First child: <div height:4px background:HERO[variant].line border-radius:"14px 14px 0 0">
```
Used for: Kans, Dreiging, Strategisch inzicht, White-space gap cards, Outcome cards
The 4px line MUST be the first child inside overflow:hidden so it follows border-radius.
Text colours: HERO[variant].label for small labels, HERO[variant].heroText for 22px, HERO[variant].bodyText for 13px.

### Variant C — Dark hero (max 1 per tab)
```
background: p900 (#1A0050)
border-radius: 14px
Text: white / rgba(255,255,255,.6)
```
Used for: strategic idea, executive summary typewriter, north-star KPI

### KPI card
```
background: white
border-radius: 12px  (radiusSm)
box-shadow: 0 2px 8px rgba(0,0,0,.06)
overflow: hidden
NO top-line. NO border. NO coloured background.
Label: 10px #888 uppercase. Value: 16px 500 #0D0D0D.
```

---

## 5. List items

### Bullet list (same everywhere)
```
Bullet colour:
  Pain points    → #888    (neutral — user suffers this)
  Motivations    → p700    (active — Vault addresses this)
  Implications   → p700
  Risks          → warning (#BA7517) or ⚠ text prefix
  Why-now items  → p700

Bullet size: 5×5px, border-radius 2.5px
Text: 13px #0D0D0D primary, #888 secondary
Row padding: 10px top/bottom, 18px left/right
Dividers: 0.5px #E8E6E0 between rows
```

### Numbered list (goals, strategic core, recommendations)
```
Number badge: 22×22px, border-radius 6px, #EDE9FE bg, p700 text
Primary: 13px 500 #0D0D0D
Sub: 11px #888
```

---

## 6. Zebra rows

```
Header row:    #F5F4F0 background
Even rows:     #FFFFFF
Odd rows:      #F8F7F4
Dividers:      0.5px #E8E6E0
Selected row:  #F5F4F0 bg + 3px left border p700

Never use #EFEDE8 as a zebra colour.
```

---

## 7. Specific component patterns

### Persona card (NO flip — all info visible)
1. Variant B top-line: persona 1=p900, persona 2=p700, persona 3=p600
2. Avatar: 40px circle, tint bg, initials in persona colour
3. Name 16px 500, age+job 11px #888
4. Radar: 5 labelled axes — Fee-pijn, Switch-intent, Digital-first, Prijs-sensitief, App-kwaliteit
5. Divider → Pain points section (label 10px #888, bullet #888, text 13px #0D0D0D)
6. Divider → Motivaties section (label 10px #888, bullet p700, text 13px #0D0D0D)
7. Platforms: pill tags #F5F4F0 bg, 9px #888
8. Trigger moment: #F5F4F0 inset block (radiusXs), at bottom

### Barrier card (always visible, never flip)
```
Top half:    white bg | Label: 10px #888 "BARRIER" | Text: 13px 500 #0D0D0D
Bottom half: p100 (#EDE9FE) bg | Label: 9px p700 "VAULT'S ANTWOORD" | Text: 11px #3C3489
Grid: always 3 per row (repeat(3,1fr))
No animation. No flip. Always visible.
```

### Trend → Kans → Why now
```
[Trend — Variant A card, full info + sparkline]
[→ arrow #C4B5FD]
[Kans — Variant B kansCard: #EEF0FA bg + p900 4px top-line + p700 "KANS 0X" label]
[→ arrow #C4B5FD]
[Why now — #F5F4F0 bg block, no shadow, no border]
All 3 same height. Column headers above.
```

### Test agenda blocks
```
All 4 blocks: identical styling
Background: #F5F4F0
Border-radius: 8px (radiusXs)
Padding: 10px 12px
Label: 9px p700 "A/B TEST"
Title: 13px 500 #0D0D0D
Sub: 11px #888
```

---

## 8. Motion

### Always animate
| Element | Animation |
|---------|-----------|
| Bar charts / funnel bars | width 0% → target, 1s cubic-bezier(.4,0,.2,1), stagger 100ms |
| Number counters (KPIs) | 0 → target, 1.2s ease-out, on mount |
| Card entrance | translateY(12px) + opacity 0 → 0, .4s ease, stagger 70ms |
| SVG sparklines / radar axes | stroke-dashoffset draw-on, 1s, delay 200ms |
| Bubble/node charts | scale(0) → scale(1), cubic-bezier(.34,1.56,.64,1), stagger 100ms |
| Donut / pie | stroke-dasharray animate, 1s |

### Conditional (only if it adds meaning)
| Element | Condition |
|---------|-----------|
| Hover scale/shadow | Only on clickable items (matrix rows, checklist) |
| Typewriter text | Only executive summary hero. Nowhere else. |

### Never animate
- Plain text, labels, headings
- Tab nav, page chrome
- Static info cards
- Barrier cards, KPI cards

---

## 9. Grid rules

| Content | Grid |
|---------|------|
| KPI strip (4) | `repeat(4,1fr)` gap 10px |
| KPI strip (5) | `repeat(5,1fr)` gap 10px |
| Two-col info | `1fr 1fr` gap 10px |
| Personas | `repeat(3,1fr)` gap 14px |
| Barriers | `repeat(3,1fr)` gap 12px |
| Trend→Kans→Now | 3 fixed-width cols with arrows between |
| Test agenda | `1fr 1fr` grid inside card, gap 8px |
| Outcome cards | `repeat(auto-fill,minmax(108px,1fr))` gap 10px |

---

## 10. Section map

| Section | Tab | Components in order |
|---------|-----|---------------------|
| 01 Briefing | — | C-dark hero → 4-col KPI → 2-col [goals numbered] [KPIs row-list] |
| 02 Audience | ① Totaalbeeld | A-hero (size/income 3-col) → persona preview row → 2-col [motivations A, p700 bullets] [pain points A, #888 bullets] |
| | ② Personas | 3-col persona cards (no flip, full info) |
| | ③ Barriers | 3-col barrier cards (always visible) |
| 03 Market | ① Marktlandschap | 4-col KPI → 2-col [donut+segment-persona mapping] [consumer behaviour quote] → extra market data |
| | ② Trends & kansen | Column headers → N rows of Trend→Kans→WhyNow |
| | ③ Strategische positie | p100 highlight block → 2-col [implications p700 bullets] [risks ⚠] |
| 04 Competitive | ① Marktpositie | 2-col B-heroes (kans/dreiging) → SOV A-card zebra + animated bars → insight strip |
| | ② Positioning & gaps | Positioning map A-card → white space label → 2×2 B-cards (kansCard) |
| | ③ Diepteanalyse | Score matrix A-card (zebra, selected=p700 border) → detail panel A-card |
| 05 Strategy | ① Funnel & audience | C-dark → 2-col [audience priority] [messaging pillars: row1 p100, rest inset] → funnel bars |
| | ② Channels & synergy | 2-col [channel net SVG] [funnel overlap 2×2] → channel detail rows |
| | ③ Retargeting & metrics | Retargeting rules → C-dark north-star → metrics grid |
| 06 Budget | ① Allocatie & pacing | 4-col KPI → treemap → 2-col bars → wave chart |
| | ② Optimisation | 2-col [opt rules A-card] [test agenda A-card: 4×#F5F4F0 blocks] |
| 07 Media Plan | ① Kanaalplan | 5-col KPI → filter chips → channel rows (coloured left col + formats + KPIs, zebra) |
| | ② Inzichten | 2-col [insights A-card icon rows] [optimisation A-card p700 bullets] |
| 08 Final Report | ① Executive summary | C-dark typewriter → strategic core A (numbered) → recommendations A (priority badges) |
| | ② Outcomes & risks | 6-col outcome B-cards (semantic top-line, counters) → 2-col [risk radar] [recommendations] |
| | ③ Next steps | Checklist A-card (owner+timing columns, zebra, click-to-check) |

---

## 11. Anti-patterns (banned)

```
✗  Coloured background on Variant A card
✗  Border + shadow on same element
✗  Font size not in [10, 11, 13, 16, 22]px
✗  p100 on test-agenda or arbitrary blocks
✗  Flip card (personas and barriers are NOT flip cards)
✗  Typewriter on anything except executive summary hero
✗  Different bullet colour in same content type
✗  border-radius not 14px / 12px / 8px
✗  #EFEDE8 as zebra row (use #F8F7F4)
✗  Coloured top-line on KPI/plain card
✗  p700 text on p100 background (WCAG fail)
✗  #0D0D0D text on tinted hero background
✗  hooks (useState/useEffect) inside .map() callbacks
✗  Python f-strings to manipulate JSX
✗  Python depth-counter to parse JSX braces
✗  More than 1 FeedbackBar per export function
✗  Tab count ≠ conditional count
```
