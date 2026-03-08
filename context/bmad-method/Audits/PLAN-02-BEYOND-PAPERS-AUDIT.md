---

# COMPREHENSIVE TECHNICAL AUDIT: "Website Portfolio - Beyond the Papers Template"

**Source files audited:**
- `/Users/satvikjain/Downloads/sync/Website portfolio - Beyond the papers template_files/Website portfolio - Beyond the papers template.html`
- `/Users/satvikjain/Downloads/sync/Website portfolio - Beyond the papers template_files/srinivasb-portfolio.webflow.6879c2a1e.css`
- `/Users/satvikjain/Downloads/sync/Website portfolio - Beyond the papers template_files/css` (Google Fonts `@font-face` declarations)
- `/Users/satvikjain/Downloads/sync/Website portfolio - Beyond the papers template_files/js` (Google Tag Manager runtime)
- `/Users/satvikjain/Downloads/sync/Website portfolio - Beyond the papers template_files/webflow.4400babde.js`
- `/Users/satvikjain/Downloads/sync/Website portfolio - Beyond the papers template_files/api.js` (reCAPTCHA loader)

---

## PLAN-02a: Hero Section, Navbar, and Rotating Carousel

### Navbar Structure

The navbar uses Webflow's built-in nav component with the following structure:

```html
<div data-collapse="medium" data-animation="default" data-duration="400"
     data-easing="ease" data-easing2="ease" role="banner" class="navbar w-nav">
  <div class="container w-container">
    <a class="brand w-nav-brand w--current" aria-label="home">
      <img class="logo" width="255" src="...Portfolio.jpg">
    </a>
    <nav role="navigation" class="nav-menu w-nav-menu">
      <a class="nav-link w-nav-link" href="...#projects">Projects</a>
      <a class="nav-link w-nav-link" href="...resume" target="_blank">Resume</a>
      <a class="nav-link button w-nav-link" href="...contact">Contact me!</a>
    </nav>
    <div class="menu-button w-nav-button" aria-label="menu" role="button"
         tabindex="0" aria-controls="w-nav-overlay-0" aria-haspopup="menu"
         aria-expanded="false">
      <div class="w-icon-nav-menu"></div>
    </div>
  </div>
  <div class="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
</div>
```

**CSS treatment:**
- `.navbar` -- `background-color: #fff; box-shadow: 1px 1px 75px 0 rgba(0, 0, 0, 0.1);`
- `.brand` -- `padding-top: 16px; padding-bottom: 16px;`
- `.logo` -- `width: 80px;` (60px at 479px breakpoint)
- `.nav-link` -- `padding-right: 20px; padding-left: 20px; color: #000;`
- `.nav-link.button` -- `margin-top: 12px; margin-left: 20px; padding-top: 8px; padding-bottom: 8px; border-radius: 5px; background-color: #6057c3; color: #fff;`
- `.menu-button` -- shown at `max-width: 991px` via `data-collapse="medium"`, background `#fff`, changes to `#000` when `.w--open`

**Scroll behavior:** The navbar is a Webflow `w-nav` component. It does NOT use `position: sticky` or `position: fixed` in the custom CSS. The Webflow base CSS positions it with `position: relative; z-index: 1000;`. The collapse animation is `data-animation="default"` with 400ms duration, `ease` easing.

### Hero Section

The hero section uses class `.section.hero` and contains a CSS Grid layout:

```html
<div class="section hero">
  <div class="container w-container">
    <div class="w-layout-grid grid-2">
      <div id="w-node-_4f0b7e63-..." class="div-block-20">
        <div class="text-block">Welcome!</div>
        <h1 class="heading">I am</h1>
        <h1 class="heading name">Srinivas Boddepalli!</h1>
        <div data-w-id="571b35bb-..." class="wrapper">
          <!-- Rotating carousel here -->
        </div>
      </div>
      <div id="w-node-eae82541-..." class="div-block-21">
        <img class="image-6" data-w-id="3f06a857-..." src="...ezgif.com-gif-maker.gif">
      </div>
    </div>
  </div>
</div>
```

**Key CSS classes and values:**
- `.section.hero` -- `padding-bottom: 10px; background-color: #fff;`
- `.grid-2` -- `grid-column-gap: 0px; grid-template-columns: 4fr 1fr;` (responsive: `500px 1fr` at 991px, `350px 1fr` at 767px, `200px 1fr` at 479px)
- `.div-block-20` -- `max-width: 90%` (100% at 991px)
- `.heading` -- `max-width: 450px; font-family: 'DM Serif Display', sans-serif; font-weight: 400; letter-spacing: 1px;`
- `.heading.name` -- `background-image: linear-gradient(90deg, #ff512f, #dd2476); font-size: 48px; line-height: 1.2; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
  - Responsive: 40px at 991px, 36px at 767px, 20px at 479px
- `.text-block` -- `color: rgba(0, 0, 0, 0.7); font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;`
- `.image-6` -- `width: 100%; height: 80%; object-fit: fill;` (the hero avatar/GIF)

### Rotating Qualities Carousel

The carousel is a **Webflow IX2 (Interactions 2.0) infinite horizontal scroll** animation, NOT CSS keyframes.

```html
<div data-w-id="571b35bb-208f-14db-ab18-da09b9337f81" class="wrapper">
  <div style="transform: translate3d(-15.7196px, 0px, 0px) scale3d(1,1,1)
              rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
              transform-style: preserve-3d; will-change: transform;"
       class="loop-content">
    <div class="content-container">
      <div class="qualities">IITIAN</div>
      <div class="qualities">Consultant</div>
      <div class="qualities">Gamer </div>
    </div>
    <div class="content-container">
      <!-- Duplicate for seamless loop -->
      <div class="qualities">IITIAN</div>
      <div class="qualities">Consultant</div>
      <div class="qualities">Gamer </div>
    </div>
  </div>
</div>
```

**Mechanism:** The `loop-content` div is animated via Webflow IX2 runtime (`data-w-id="571b35bb-..."`). The runtime continuously translates the element along the X axis (`translate3d(-Npx, 0, 0)`). The content is duplicated inside two `.content-container` divs to create a seamless infinite scroll effect. When the first set scrolls completely out, it wraps back.

**CSS:**
- `.wrapper` -- `overflow: hidden; width: 48%; margin-top: 30px; margin-bottom: 30px;`
- `.loop-content` -- `display: flex; align-items: center;`
- `.content-container` -- `display: flex; align-items: center;`
- `.qualities` -- `margin-right: 30px; background-image: linear-gradient(90deg, #16222a, #3a6073); font-family: Audrey, sans-serif; font-size: 19px; line-height: 1.2; font-style: italic; font-weight: 500; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
  - Responsive: 14px at 991px, 8px at 479px

**Hero images:** The GIF image (`image-6` class) in `div-block-21` also has a `data-w-id="3f06a857-..."` indicating it has a Webflow interaction applied (likely a scroll-triggered or load-triggered transform animation).

---

## PLAN-02b: 3D Transform Image Grid and Visual Effects

### 3D Transform Image Grid (Hero Camera)

This is the most visually complex section. It creates a perspective-transformed image grid below the hero text:

```html
<div class="section main">
  <div class="hero-camera">
    <div data-w-id="442c8ac0-1e31-6bba-0b9a-eabffc6ca6e0"
         style="opacity: 1;
                transform: translate3d(0px, 0px, 0px) scale3d(1,1,1)
                           rotateX(26deg) rotateY(0deg) rotateZ(9.5deg)
                           skew(0deg, 0deg);
                transform-style: preserve-3d;"
         class="w-layout-grid hero-image-grid">
      <img class="hero-image" ...>         <!-- top-left -->
      <img class="hero-image main" ...>    <!-- center (larger) -->
      <img class="hero-image" ...>         <!-- top-right -->
      <img class="hero-image bottom" ...>  <!-- bottom row -->
      <img class="hero-image bottom" ...>
      <img class="hero-image bottom" ...>
    </div>
  </div>
</div>
```

**3D Transform Properties:**
- `.hero-camera` -- `overflow: hidden; height: 35vw; perspective: 1000px;`
- `.hero-image-grid` -- A CSS grid with `grid-template-columns: 1fr 1fr 1fr; grid-column-gap: 3vw; grid-row-gap: 3vw;`
  - Inline transform applied by Webflow IX2: `rotateX(26deg) rotateY(0deg) rotateZ(9.5deg)`
  - `transform-style: preserve-3d;`
- Each `.hero-image` child has: `will-change: transform; transform-style: preserve-3d;` and its own `translate3d` applied inline (IX2 scroll-driven animation).
- `.hero-image` -- `box-shadow: 1px 1px 44px 0 rgba(0, 0, 0, 0.1);`
- `.hero-image.main` -- `width: 100%; height: 84%;`

**Scroll-Driven Animation:** The `data-w-id="442c8ac0-..."` on `.hero-image-grid` triggers a Webflow IX2 scroll-driven interaction. As the user scrolls, the individual images translate along different axes (parallax-like depth effect), while the grid container maintains its rotated perspective. Each image has `will-change: transform` set inline.

### Selected Projects Glow Effect

```css
.selected-projects-effect {
  position: absolute;
  left: 0%; top: 0%; right: 0%; bottom: 0%;
  z-index: -1;
  width: 100%; height: 100%;
  opacity: 0;
  filter: saturate(200%) blur(40px);
  transform: translate(0px, 24px);
}
```

This creates a blurred, saturated duplicate of the project thumbnail behind it. On hover (managed by Webflow IX2 via `data-w-id="afd6dd83-..."`), `opacity` animates from `0` to a visible value, creating a colorful glow/shadow effect under the card.

### Other 3D/Transform Effects

**Password Page (utility pages):**
- `.utility-page-wrap` -- `perspective: 1000px;`
- `.password-cell` -- `transform: scale3d(1, 1, 6); transform-style: preserve-3d;`
- `.password-cell-color` -- `transform: translate3d(0px, 0px, -10px); transform-style: preserve-3d;`
- Color variants translate deeper: `.orange` at `-20px`, `.yellow` at `-30px`, `.green` at `-40px`, `.blue` at `-50px`, `.indigo` at `-60px`, `.violet` at `-70px`

**Circle Image Glow:**
- `.circle-image.glow` -- `filter: saturate(200%) blur(75px);`

---

## PLAN-02c: Animated Timeline Architecture

There are THREE separate timeline implementations in this template. Two are hidden (`display: none`) and one is the active animated timeline.

### Active Timeline: `.animated_timeline` (THE ONE VISIBLE)

```html
<div class="animated_timeline">
  <div class="ani_container">
    <div class="ani_container1 w-container">
      <div class="anitimelinewrapper">
        <div class="progress_animated">
          <div class="div-block-18"></div>  <!-- Fixed gradient progress bar -->
        </div>
        <!-- Repeated timeline items (9 total) -->
        <div data-w-id="0f373d34-..." class="w-layout-grid items">
          <div class="ani_leftdate">
            <div class="datetext">January 2012</div>
          </div>
          <div class="ani_middlecircle">
            <div class="circle-timeline"></div>
          </div>
          <div class="ani_rightdesc">
            <div class="description_date">...</div>
          </div>
        </div>
        <!-- more items... -->
      </div>
    </div>
  </div>
</div>
```

**Layout Structure:**
- Each `.items` is a 3-column CSS grid: `grid-template-columns: 1fr 160px 1fr;`
  - Responsive: `1fr 90px 1fr` at 767px, `1fr 50px 1fr` at 479px
- `.items` -- `width: 100%; margin-top: 70px; margin-bottom: 70px; grid-column-gap: 0px; grid-row-gap: 0px;`
- Left column (`.ani_leftdate`) -- date text, right-aligned
- Center column (`.ani_middlecircle`) -- circle indicator
- Right column (`.ani_rightdesc`) -- description text + optional images

**Circular Progress Indicators:**
- `.circle-timeline` -- `position: sticky; top: 50vh; width: 15px; height: 15px; border-radius: 100%; background-color: #000;`
  - 12px x 12px at 479px breakpoint
- These circles are sticky at `top: 50vh`, so they stay centered vertically as you scroll past

**Connecting Line (Progress Bar):**
- `.progress_animated` -- `position: absolute; z-index: -2; width: 3px; height: 100%; background-color: #a1a1a1;`
- `.div-block-18` (the animated fill) -- `position: fixed; bottom: 50vh; z-index: -1; width: 3px; height: 50vh;`
  - `background-image: linear-gradient(180deg, #833ab4, #fd1d1d 51%, #fcb045);`
  - This creates a gradient progress bar that fills from purple through red to orange as you scroll

**Date Text:**
- `.datetext` -- `position: sticky; top: 50vh; font-family: Inter, sans-serif; font-size: 40px; line-height: 1.4; font-weight: 400; text-align: right;`
  - Responsive: 30px at 991px, 24px at 767px, 18px at 479px

**Scroll-Triggered Animations (Webflow IX2):**
Each `.items` grid has a `data-w-id` attribute. The inline styles show:
- `.circle-timeline` -- `will-change: background; background-color: rgb(161, 161, 161);` (animates from gray to active color)
- `.datetext` -- `color: rgb(160, 160, 160);` (text color transitions)
- `.description_date` -- `color: rgb(160, 160, 160);` (fades in on scroll)

The Webflow IX2 runtime changes these properties (background-color of circles, text color of dates/descriptions) from gray to active as each item scrolls into the viewport center.

### Hidden Timeline 1: `.page-wrapper` (display: none)

Static timeline with `.timeline-circle` (15px, `background-color: #000`, `border-radius: 100%`) and `.div-block-11` (sticky dots), `.div-block-13`/`.div-block-15` for the vertical progress line. Has a gradient progress bar: `linear-gradient(180deg, #fc5c7d, #6a82fb)`.

### Hidden Timeline 2: `.timelinesection` (display: none)

Another variant with classes `.timeline_items`, `.timeline_circle`, `.timeline_progress`, `.timeline_progress_bar`. Progress bar gradient: `linear-gradient(180deg, #fc466b, #3f5efb)`.

---

## PLAN-02d: Project Cards Grid, Experience Section, and Contact Form

### Project Cards Grid

```html
<div class="collection-list-wrapper w-dyn-list">
  <div role="list" class="selected-projects-list w-dyn-items">
    <div data-w-id="35bc6dcb-..." role="listitem" class="collection-item w-dyn-item">
      <img class="image-17 astar" src="...Main Image.jpg">
      <a style="background-color:hsla(349.87, 73.45%, 44.31%, 1.00)"
         class="project-details w-inline-block" href="...">
        <div class="project-client-preview">
          <div class="button-text">View</div>
          <div class="button-text">Nextleap</div>
          <div class="button-text">project</div>
        </div>
        <div class="project-type-preview">Prototyping and UX Design</div>
        <h3 class="project-name-preview">YouTube User Experience</h3>
        <p class="project-paragraph-preview">...</p>
      </a>
      <img data-w-id="afd6dd83-..." class="selected-projects-effect" style="opacity: 0;">
    </div>
    <!-- 3 more project items -->
  </div>
</div>
```

**Layout:**
- `.selected-projects-list` -- `display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 16px; grid-row-gap: 16px; color: #fff;`
  - At 479px: `display: block;` (stacked)

**Card Structure:**
- `.collection-item` -- `position: relative; display: block; margin-bottom: 30px;` (10px at 479px)
- `.image-17.astar` -- `width: 600px; height: 400px;` (responsive: 400x250 at 991px, 500x250 at 479px, 1000x500 at 1920px+)
- `.project-details` -- `display: flex; min-height: 300px; padding: 40px; flex-direction: column;` (250px/30px at 991px, 300px/15px at 767px, auto at 479px)
  - Each card has a unique inline `background-color` in HSLA:
    - YouTube: `hsla(349.87, 73.45%, 44.31%, 1.00)` (deep red)
    - Tinder: `hsla(339, 73.46%, 56.94%, 1.00)` (pink)
    - Space Invader: `hsla(240, 100%, 65.10%, 1.00)` (blue/violet)
    - Pathfinding: `hsla(261, 59.47%, 55.49%, 1.00)` (purple)
- `.project-name-preview` -- `font-family: 'DM Serif Display'; font-size: 20px; font-weight: 400;`
- `.project-type-preview` -- `color: hsla(0, 0%, 100%, 0.87);`
- `.project-paragraph-preview` -- `color: hsla(0, 0%, 100%, 0.87);`
- `.project-client-preview` -- `margin-top: auto; order: 1;` (pushes "View/Client/project" to bottom)
- `.button-text` -- `display: inline-block; margin-top: auto; margin-right: 4px;`

**Hover Effect:**
- `.selected-projects-effect` -- The duplicate image positioned absolutely behind the card with `opacity: 0; filter: saturate(200%) blur(40px); transform: translate(0px, 24px);`
- The `data-w-id="afd6dd83-..."` triggers a Webflow IX2 interaction. The initial state hides it: `@media (min-width:992px) { html.w-mod-js:not(.w-mod-ix) [data-w-id="afd6dd83-43dc-7a51-2882-3e029b2ce77f"] { opacity:0; } }`
- On hover, IX2 animates `opacity` from 0 to ~1, creating a saturated blurred glow behind the card

### Experience Section

```html
<div class="section">
  <div class="container w-container">
    <div class="experience-block">
      <h1 class="secondary-heading">Experience</h1>
    </div>
  </div>
  <div class="container w-container">
    <div class="w-layout-grid grid-8">
      <div class="div-block-7">
        <img class="image-18" src="...Vedanta.png">
        <h3 class="preview">Vedanta Resources</h3>
        <div class="text-block-2">Production Engineer</div>
        <div class="text-block-6">...</div>
      </div>
      <div class="div-block-9">
        <img class="image-19" src="...toppr.png">
        <h3 class="preview">Toppr</h3>
        <div class="text-block-2">Product Analyst</div>
        <div class="text-block-5">...</div>
      </div>
    </div>
  </div>
</div>
```

**Layout:**
- `.grid-8` -- Default 2-column grid (`grid-template-columns: 1fr 1fr`), `grid-column-gap: 0px;`
  - At 767px: `grid-template-columns: 1fr 1fr; grid-column-gap: 30px; grid-row-gap: 30px;`
  - At 479px: converts to flexbox column
- `.div-block-7` -- `display: flex; flex-direction: column; align-items: center;`
- `.preview` (h3) -- `display: flex; flex-direction: row; justify-content: center; font-family: 'DM Serif Display'; font-weight: 400; text-align: center;`
- `.text-block-2` -- `margin-bottom: 10px; font-weight: 400; text-align: center;`
- Company logos: `.image-18` (Vedanta, padded-top 40px), `.image-19` (Toppr, 140px wide, margin-left: 210px on desktop)

### Contact Form

```html
<div class="section">
  <div class="container w-container">
    <div class="form-block w-form">
      <h2 class="secondary-heading">Let's work together!</h2>
      <p class="dark-paragraph">...</p>
      <form id="email-form" name="email-form" data-name="Email Form"
            method="get" class="form"
            data-wf-page-id="6245a545497b5760eeace609"
            data-wf-element-id="ec53d87a-23fa-48dd-d703-cb72cdf9acef">
        <div class="w-layout-grid grid">
          <div>
            <label for="Name-3" class="field-label">Name</label>
            <input class="w-input" name="Name" type="text" id="Name-3" required="">
          </div>
          <div>
            <label for="Email-address" class="field-label">Email Address</label>
            <input class="w-input" name="Email-address" type="email" id="Email-address" required="">
          </div>
        </div>
        <label for="Message-to-Megan" class="field-label">Message</label>
        <textarea class="message-area w-input" id="Message-to-Megan"
                  name="Message-to-Megan" maxlength="5000"></textarea>
        <input type="submit" class="submit-button w-button" value="Submit">
      </form>
      <div class="success-message w-form-done">
        <div class="lottie-animation" data-w-id="b1e4f988-..."
             data-animation-type="lottie"
             data-src="...5449-success-tick%20(1).json"
             data-loop="0" data-direction="1" data-autoplay="1"
             data-is-ix2-target="0" data-renderer="svg"
             data-default-duration="3" data-duration="0">
          <svg><!-- Inline success checkmark SVG (Lottie rendered) --></svg>
        </div>
        <div>Thank you! Your submission has been received!</div>
      </div>
      <div class="w-form-fail">
        <div>Oops! Something went wrong while submitting the form.</div>
      </div>
    </div>
  </div>
</div>
```

**CSS:**
- `.form-block` -- `padding: 60px; background-color: #fff; box-shadow: 28px 28px 150px 0 rgba(0, 0, 0, 0.15); color: #000;`
  - Responsive: 30px at 991px, 15px at 767px, 10px at 479px
- `.form` -- `display: flex; flex-direction: column;`
- `.grid` (form grid) -- `grid-template-rows: auto; grid-template-columns: 1fr 1fr;` (1fr at 479px)
- `.field-label` -- `font-size: 11px; letter-spacing: 2px; text-transform: uppercase;`
- `.submit-button` -- `margin-top: 15px; align-self: flex-end; border-radius: 5px; background-color: #6057c3; color: #fff;` (stretch at 479px)
- `.success-message` -- `background-color: transparent;`
- `.dark-paragraph` -- `margin-bottom: 20px; color: rgba(0, 0, 0, 0.68);`

**Lottie Animation Reference:**
- The success animation is a Lottie file loaded from `https://cdn.prod.website-files.com/6245a545497b573510ace605/6245a545497b5766d5ace64e_5449-success-tick%20(1).json`
- Rendered as inline SVG with `data-renderer="svg"`, non-looping (`data-loop="0"`), autoplay on show (`data-autoplay="1"`)
- `.lottie-animation` -- `max-width: 100px; margin-right: auto; margin-bottom: 20px; margin-left: auto;`

---

## PLAN-02e: Webflow Dependencies to Strip

### Webflow-Specific HTML Attributes

**Root HTML element:**
```
data-wf-domain="srinivasb-portfolio.webflow.io"
data-wf-page="6245a545497b5760eeace609"
data-wf-site="6245a545497b573510ace605"
class="w-mod-js wf-aubrey-n4-active wf-dmserifdisplay-n4-active
       wf-inter-n4-active wf-inter-n6-active wf-active w-mod-ix"
```

**Webflow data attributes found in HTML:**
| Attribute | Where Used | Count/Purpose |
|-----------|-----------|---------------|
| `data-wf-domain` | `<html>` | Webflow site domain identifier |
| `data-wf-page` | `<html>` | Webflow page ID |
| `data-wf-site` | `<html>` | Webflow site ID |
| `data-w-id` | Multiple elements | IX2 interaction targets (at least 15 unique IDs) |
| `data-wf-page-id` | `<form>` | Form page ID for Webflow form handling |
| `data-wf-element-id` | `<form>` | Form element ID for Webflow form handling |
| `data-wf-ignore` | `.w-nav-overlay` | Tells Webflow to skip processing |
| `data-collapse` | `.w-nav` | Nav collapse breakpoint ("medium") |
| `data-animation` | `.w-nav` | Nav animation type ("default") |
| `data-duration` | `.w-nav` | Animation duration (400ms) |
| `data-easing` / `data-easing2` | `.w-nav` | Easing functions ("ease") |
| `data-name` | Form inputs | Form field names |
| `data-wait` | Submit button | Loading text ("Please wait...") |
| `data-animation-type` | Lottie div | "lottie" |
| `data-src` | Lottie div | Lottie JSON URL |
| `data-loop`, `data-direction`, `data-autoplay` | Lottie div | Lottie playback config |
| `data-is-ix2-target` | Lottie div | IX2 targeting flag |
| `data-renderer` | Lottie div | "svg" |
| `data-default-duration`, `data-duration` | Lottie div | Lottie timing |
| `data-nav-menu-open` | (Webflow base CSS) | Mobile nav open state |

**Specific `data-w-id` values found:**
1. `571b35bb-208f-14db-ab18-da09b9337f81` -- Rotating qualities carousel wrapper
2. `3f06a857-de27-bd8c-4f7c-2ad3111d9201` -- Hero GIF image
3. `442c8ac0-1e31-6bba-0b9a-eabffc6ca6e0` -- 3D image grid
4. `0f373d34-4897-5c77-c073-bb1dbb47c5e2` -- Timeline item 1 (and subsequent items)
5. `caf72c95-eca3-83aa-b6e8-e9c7acf58772` -- Timeline item 2
6. `9d4eacdb-0f0b-7521-c1fa-227b3403f6dd` -- Timeline item 3
7. `665c1937-5849-2d3f-d99a-22624dea4a4e` -- Timeline item 4
8. `9b16b836-0e36-efe0-8ee6-af02f447dd1a` -- Timeline item 5
9. `3bb780b1-b6ad-87f8-1232-67a14301a28b` -- Timeline item 6
10. `9cfcc825-650f-898f-5b38-3d750d9397cf` -- Timeline item 7
11. `e4af93ba-c5e2-1bb8-9d61-b3163c567939` -- Timeline item 8
12. `76e476b6-c344-fb42-e06a-34eb92e61fbe` -- Timeline item 9 (Present)
13. `35bc6dcb-8ae6-9b38-9467-3a488f3e88de` -- Project card hover
14. `afd6dd83-43dc-7a51-2882-3e029b2ce77f` -- Project glow effect image
15. `b1e4f988-33c5-ef6f-6cf7-0b9ce0500ac1` -- Lottie success animation
16. `dc9ff508-fbf4-cd70-e133-e6da3e3d3a96` -- Hidden timeline items

### Webflow-Specific CSS Classes

**Structural/Framework classes (from Webflow base CSS):**
- `w-nav`, `w-nav-brand`, `w-nav-menu`, `w-nav-link`, `w-nav-button`, `w-nav-overlay`, `w-icon-nav-menu`
- `w-container`
- `w-layout-grid`
- `w-form`, `w-form-done`, `w-form-fail`
- `w-input`, `w-button`
- `w-inline-block`
- `w-dyn-list`, `w-dyn-items`, `w-dyn-item`
- `w-mod-js`, `w-mod-ix`, `w-mod-touch`
- `w--current`, `w--open`, `w--nav-link-open`
- `wf-*-active` (font loading state classes)
- `w-hidden-main`, `w-hidden-medium`, `w-hidden-small`, `w-hidden-tiny`
- `w-col`, `w-col-*`, `w-row`

**CSS ID selectors (Webflow grid positioning):**
All `#w-node-*-eeace609` selectors (approximately 40+) are auto-generated by Webflow for grid item placement. They all follow the pattern of setting `grid-column-start/end` and `grid-row-start/end`.

### Scripts to Strip/Replace

| Script | Purpose | Action |
|--------|---------|--------|
| `jquery-3.5.1.min.dc5e7f18c8.js` | jQuery 3.5.1 (Webflow dependency) | **REPLACE** -- evaluate if needed; modern JS can replace most uses |
| `webflow.4400babde.js` | Webflow runtime (~358 IX2 references, ~139 form/nav references) | **REPLACE** -- this is the core Webflow runtime; handles: nav toggling, form submission, IX2 interaction engine, Lottie playback |
| `webfont.js` | WebFont Loader (Google) | **KEEP** or replace with `@font-face` / Google Fonts `<link>` |
| `api.js` | reCAPTCHA loader script | **STRIP** -- only needed if keeping Webflow form submission |
| `recaptcha__en.js` | Google reCAPTCHA runtime | **STRIP** -- loaded by api.js |
| `js` (file) | Google Tag Manager runtime | **EVALUATE** -- keep if analytics needed, replace tracking ID |
| `css` (file) | Google Fonts `@font-face` declarations | **KEEP** -- required for Aubrey, DM Serif Display, Inter |

### Extraction Plan

**KEEP (structure and custom CSS):**
- All custom CSS classes from line 15 onward in `srinivasb-portfolio.webflow.6879c2a1e.css`
- The HTML semantic structure (sections, grids, forms)
- Font loading (`@font-face` from Google Fonts)
- The carousel HTML structure (duplicate content-containers for infinite loop)
- The timeline 3-column grid layout
- All image assets
- The Lottie JSON URL for success animation

**REPLACE with custom implementations:**
1. **Webflow IX2 interactions** -- Replace with:
   - CSS `@keyframes` for the rotating carousel (infinite translateX)
   - Intersection Observer API for scroll-triggered timeline color changes
   - CSS `:hover` transitions for project card glow effects
   - GSAP or CSS for the 3D image grid parallax scroll
2. **Webflow nav component** -- Replace with custom hamburger menu JS (toggle classes, animate overlay)
3. **Webflow form handling** -- Replace with custom form submission (fetch API to your backend, or Formspree/Netlify Forms)
4. **Lottie playback** -- Include `lottie-web` library directly or use the embedded SVG

**STRIP entirely:**
- All `data-wf-*` attributes on `<html>`, `<form>`
- All `data-w-id` attributes (after re-implementing animations)
- `w-mod-js`, `w-mod-ix` classes from `<html>`
- `wf-*-active` font loading state classes
- `data-wf-ignore` attribute
- Webflow base CSS boilerplate (lines 1-14, normalize + Webflow widget CSS) -- replace with your own reset/normalize
- All `#w-node-*` CSS rules -- replace with explicit `grid-column`/`grid-row` in your own CSS
- jQuery (if not needed after custom implementation)
- reCAPTCHA scripts

---

## PLAN-02f: Color System, Typography, and Responsive Breakpoints

### Complete Color Palette

**Primary Brand Colors:**
| Color | Hex | Usage |
|-------|-----|-------|
| Purple (primary accent) | `#6057c3` | Navbar CTA button, footer background, submit button, project links |
| Dark background | `#1d1b1b` | Body background (from CSS body rule) |
| Near-white body | `hsla(0, 0%, 100%, 0.87)` / ~`#dedede` | `.body` class background |
| White | `#ffffff` / `#fff` | Section backgrounds, navbar, form blocks |
| Black text | `#000` | Body color, nav links |
| Dark text | `#333` | `.body` color, base body text |

**Gradient Systems:**
| Gradient | Colors | Usage |
|----------|--------|-------|
| Name heading | `linear-gradient(90deg, #ff512f, #dd2476)` | `.heading.name` text gradient (orange-to-magenta) |
| Story heading | `linear-gradient(90deg, #833ab4, #fd1d1d 48%, #fcb045)` | `.heading-5` text gradient (purple-red-orange / Instagram-like) |
| Timeline progress | `linear-gradient(180deg, #833ab4, #fd1d1d 51%, #fcb045)` | `.div-block-18` animated progress bar |
| Qualities text | `linear-gradient(90deg, #16222a, #3a6073)` | `.qualities` text gradient (dark teal) |
| Timeline connecting line | `linear-gradient(180deg, #fc5c7d, #6a82fb)` | `.div-block-15` (hidden timeline) |
| Timeline 2 progress | `linear-gradient(180deg, #fc466b, #3f5efb)` | `.timeline_progress_bar` (hidden timeline) |
| Image container bg | `linear-gradient(98deg, #de6262, rgba(255, 184, 140, 0.5))` | `.div-block-19` image card backgrounds |

**Project Card Background Colors (inline HSLA):**
| Project | HSLA | Approximate Hex |
|---------|------|-----------------|
| YouTube UX | `hsla(349.87, 73.45%, 44.31%, 1)` | `#c41c3f` (deep red) |
| Tinder Date | `hsla(339, 73.46%, 56.94%, 1)` | `#e0447a` (pink) |
| Space Invader | `hsla(240, 100%, 65.10%, 1)` | `#4d4dff` (blue-violet) |
| Pathfinding | `hsla(261, 59.47%, 55.49%, 1)` | `#7b4dc7` (purple) |

**UI Element Colors:**
| Usage | Color |
|-------|-------|
| Timeline gray circle | `rgb(161, 161, 161)` / `#a1a1a1` |
| Timeline gray text | `rgb(160, 160, 160)` / `#a0a0a0` |
| Timeline background line | `#a1a1a1` |
| Paragraph text | `rgba(0, 0, 0, 0.66)` |
| Welcome subtext | `rgba(0, 0, 0, 0.7)` |
| Dark paragraph | `rgba(0, 0, 0, 0.68)` |
| White text on dark | `hsla(0, 0%, 100%, 0.87)` |
| Footer paragraph | `#fff` |
| Navbar shadow | `rgba(0, 0, 0, 0.1)` |
| Form block shadow | `rgba(0, 0, 0, 0.15)` |
| Hero image shadow | `rgba(0, 0, 0, 0.1)` |
| Horizontal divider | `rgba(0, 0, 0, 0.8)` |
| Divider line (light) | `hsla(0, 0%, 100%, 0.44)` |
| Menu button open | `#000` |
| Frosted glass overlay | `rgba(0, 0, 0, 0.55)` |
| 404 page background | `#171718` |
| Password cell pink | `#f01f4c` |
| Password cell orange | `#f0841f` |
| Password cell yellow | `#f0d01f` |
| Password cell green | `#6cf01f` |
| Password cell blue | `#31b3ff` |
| Password cell indigo | `#4231ff` |
| Password cell violet | `#f344ff` |
| Timeline fixed bar bg | `#ff6262` |
| Div-block-14 | `#ffbdbd` |
| Progress-bar background | `#313131` |
| Div-block-12 | `#5f5f5f` |
| Div-block-13 | `#414141` |
| Timeline dots bg | `#030303` |
| Timeline muted bg | `#4d4d4d` |

### Typography

**Font Families:**
1. **DM Serif Display** (Google Fonts, weight 400)
   - Usage: `h2`, `.heading`, `.heading.name`, `.secondary-heading`, `.project-name-preview`, `.project-heading`, `.larger-heading`, `._404`, `.password-heading`, `.quote`, `.preview`, `.heading-7`
   - Character: Serif display font for headings

2. **Inter** (Google Fonts, weights 400, 600)
   - Usage: Body font (`body { font-family: Inter, sans-serif; }`), `.datetext`, `.certi-name`
   - Character: Clean sans-serif for body text

3. **Aubrey** (Google Fonts, weight 400)
   - Usage: `.qualities` (rotating carousel text), `.certification-heading`, `.text-block-8`
   - Character: Decorative/script font for accent text

4. **webflow-icons** (embedded base64 icon font)
   - Usage: `.w-icon-nav-menu`, `.w-icon-slider-right/left`, `.w-icon-arrow-down`, `.w-icon-dropdown-toggle`
   - Character: System icons for Webflow UI components

**Font Loading:**
```javascript
WebFont.load({
  google: {
    families: ["Inter:regular,600", "DM Serif Display:regular", "Aubrey:regular"]
  }
});
```

**Font Sizes by Element:**

| Element | Default | 1920px+ | 991px | 767px | 479px |
|---------|---------|---------|-------|-------|-------|
| Body | 14px / 20px lh | -- | -- | -- | -- |
| `.heading` | 38px / 44px lh | 56px / 1.1 | -- | 23px / 1.1 | -- |
| `.heading.name` | 48px / 1.2 | 60px | 40px | 36px | 20px |
| `.text-block` | 12px | -- | -- | -- | -- |
| `.secondary-heading` | 28px | 40px / 1.1 | -- | 20px | -- |
| `.project-name-preview` | 20px | 28px | -- | 18px | 16px |
| `.project-type-preview` | (inherit) | 16px | 13px | -- | 12px |
| `.project-paragraph-preview` | (inherit) | 18px | 12px | 13px | 12px |
| `.paragraph` | (inherit) | -- | -- | 13px | -- |
| `.heading-5` (story) | 40px / 1.4 | -- | 34px | 26px | -- |
| `.datetext` | 40px / 1.4 | -- | 30px | 24px | 18px |
| `.qualities` | 19px / 1.2 | -- | 14px | -- | 8px |
| `.description_date` | (inherit 14px) | -- | 13px | 10px | 9px |
| `.field-label` | 11px | -- | -- | -- | -- |
| `.timeline_date_text` | 40px / 1.2 | -- | -- | -- | -- |
| `.text-block-9` | 20px / 1.3 | -- | -- | -- | -- |
| `._404` | 172px / 1 | -- | -- | 100px | -- |
| `.larger-heading` | 48px / 1 | 55px / 1.1 | -- | 36px / 1.1 | -- |
| `.quote` | 24px / 1.2 | -- | -- | -- | 20px |
| `.preview` (experience h3) | (inherit) | 30px | -- | -- | -- |

### Responsive Breakpoints

There are **4 breakpoints** following Webflow's default system:

| Breakpoint | CSS Media Query | Webflow Name | Container max-width |
|------------|----------------|--------------|---------------------|
| Desktop (base) | No media query | Default | `1200px` (custom), `940px` (Webflow default) |
| Large Desktop | `@media screen and (min-width: 1920px)` | HiDPI/Large | `1600px` |
| Tablet | `@media screen and (max-width: 991px)` | Medium | `728px` |
| Mobile Landscape | `@media screen and (max-width: 767px)` | Small | (none set) |
| Mobile Portrait | `@media screen and (max-width: 479px)` | Tiny | `none` (full width) |

**Breakpoint-specific layout changes:**
- **1920px+**: Larger font sizes, more padding (section padding 100px), container 1600px
- **991px**: Nav collapses to hamburger (`data-collapse="medium"`), hero grid shifts to `500px 1fr`, timeline grid center column stays 160px
- **767px**: Sections reduce to 30px padding, timeline items center column to 90px, hero grid `350px 1fr`, project grid stays 2-col
- **479px**: Single-column layouts, `.selected-projects-list` becomes `display: block`, hero grid `200px 1fr`, timeline center column to 50px, form grid single-column

### Dark Theme Implementation

This template does NOT implement a togglable dark/light theme. The design is a **light theme** with some dark accents:
- Body CSS sets `background-color: #1d1b1b` but the `.body` class overrides it to `hsla(0, 0%, 100%, 0.87)` (near-white)
- All sections use `background-color: #fff`
- Footer uses a purple background (`#6057c3`)
- The only "dark" elements are the hidden timeline sections (`.div-block-16`, `.div-block-17` both white)
- The 404/password utility pages use dark backgrounds (`#171718`)

### Spacing System

There is no formal spacing scale or CSS custom properties. Spacing is ad-hoc:
- Section padding: 60px top/bottom (100px at 1920px+, 30px at 767px)
- Container padding: 30px left/right (10px at 479px)
- Form block: 60px padding (scales down per breakpoint)
- Grid gaps: typically 16px (project grids), 3vw (hero image grid), 30px (image grid, other projects)
- Timeline item margins: 70px top/bottom
- Social icon spacing: 10px left/right margins
- Footer holder: 30px margins between elements
- No CSS custom properties (`--var`) are used anywhere in the template
