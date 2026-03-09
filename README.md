# Political Constellation

**A 3D interactive visualization that maps political beliefs as geometric shapes in space — because your politics aren't a point on a line.**

![No framework required](https://img.shields.io/badge/framework-none-blue) ![Three.js r128](https://img.shields.io/badge/three.js-r128-green) ![License: MIT](https://img.shields.io/badge/license-MIT-yellow)

---

## The Idea

The left/right political spectrum is a convenient lie. You might be strongly progressive on healthcare, undecided on immigration, and conservative on taxes — with wildly different levels of conviction on each. Averaging that into a single dot on a line erases everything interesting about what you actually believe.

Political Constellation gives each issue **four dimensions**:

| Dimension | What it encodes | Visual mapping |
|-----------|----------------|----------------|
| **Position** | Where you stand (left ↔ right) | Color (blue ↔ red) |
| **Authority** | Who should decide (individual ↔ state ↔ federal) | Geometry complexity |
| **Commitment** | How sure you are | Opacity |
| **Priority** | How much it matters to you | Size |

The result is a rotating 3D constellation of shapes that looks nothing like a bar chart and everything like the irreducible complexity of a real human's beliefs.

---

## Quick Start

No build step. No dependencies to install. Just a browser.

```
political-constellation/
├── index.html          ← open this
├── css/
│   └── styles.css
├── js/
│   ├── issues.js       ← define / customize issues here
│   ├── visualization.js
│   └── controls.js
├── LICENSE
└── README.md
```

**Option A — Local file:**
Open `index.html` in any modern browser. Done.

**Option B — Local server (if you want to avoid CORS noise):**
```bash
# Python
python3 -m http.server 8000

# Node
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`.

---

## Customization

### Adding or removing issues

Edit `js/issues.js`. The `ISSUE_DEFINITIONS` array drives everything — controls, shapes, and labels are all generated from it. Add an object, get a new shape:

```js
{
  key: 'education',
  name: 'Education',
  leftLabel: 'Public Investment',
  rightLabel: 'School Choice'
}
```

Remove one by deleting its entry. The visualization and control panel adapt automatically.

### Theming

All colors live as CSS custom properties at the top of `css/styles.css`:

```css
:root {
  --pc-bg-dark:   #0A1E41;   /* dark navy background    */
  --pc-accent:    #B22234;   /* red accent               */
  --pc-gold:      #b08d1e;   /* gold highlights           */
  --pc-blue:      #3D6EA5;   /* left-side slider color    */
  /* ... etc */
}
```

Swap them out. Make it neon. Make it pastel. Make it brutalist. It's yours.

### Changing the 3D behavior

`js/visualization.js` contains all the Three.js logic. Key constants to tweak:

- **`BG_COLOR`** — canvas background
- **`WIREFRAME_COLOR`** — the gold edge overlay on each shape
- **Camera Z position** — how zoomed in the default view is (line: `camera.position.z = 15`)
- **Authority geometry thresholds** — which shapes map to which authority levels (currently tetrahedron / octahedron / icosahedron at 33/67 breakpoints)

---

## Architecture

The codebase is intentionally simple — three JS files, one CSS file, one HTML file. No build tools, no bundler, no framework.

- **`js/issues.js`** — Pure data. Defines the issues and their labels. Exports `ISSUE_DEFINITIONS` and `createIssueState()`.
- **`js/visualization.js`** — Three.js scene setup, shape creation, input handling, render loop. Exposes `Constellation.init()` and `Constellation.updateShape()`.
- **`js/controls.js`** — Generates the accordion UI from the issue definitions, wires slider events. Exposes `Controls.build()` and `Controls.initLabels()`.
- **`css/styles.css`** — All visual styling with CSS custom properties for easy theming.
- **`index.html`** — Structural markup and a 6-line bootstrap script that wires the modules together.

The JS uses the revealing module pattern (IIFEs with `window` exports) rather than ES modules, so it works without a server if you just open the HTML file locally.

---

## External Dependencies

| Library | Version | Loaded via |
|---------|---------|------------|
| [Three.js](https://threejs.org/) | r128 | CDN (`cdnjs.cloudflare.com`) |
| [Montserrat](https://fonts.google.com/specimen/Montserrat) | — | Google Fonts |
| [Libre Baskerville](https://fonts.google.com/specimen/Libre+Baskerville) | — | Google Fonts |

That's it. No npm. No node_modules. No webpack config longer than the actual application.

---

## On Forks and Pull Requests

This is not a collaborative project. There is no issue tracker. There are no pull requests to review.

The MIT license means you can do anything with it as long as the copyright notice stays in the LICENSE file.

But this repo is a snapshot, not a living codebase. If you want to build on it, copy it into your own repo and go wild. I'd appreciate a credit — a line in your README, a comment in your code. 

— [Mattske](https://github.com/mattske)
