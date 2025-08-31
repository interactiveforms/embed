# InteractiveForm Embedder

A library for embedding interactive forms and widgets on your website.

## Installation

### Via CDN (jsdelivr)

**IIFE/UMD:**

```html
<script src="https://cdn.jsdelivr.net/npm/interactiveform-embedder@latest/dist/index.iife.js"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/interactiveform-embedder@latest/dist/index.umd.js"></script>
```

**ESM:**

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/interactiveform-embedder@latest/dist/index.es.js"
></script>
```

### Via npm

```bash
npm install interactiveform-embedder
```

### Via pnpm (recommended)

```bash
pnpm install interactiveform-embedder
```

## Usage

### Automatic initialization via data attributes (CDN)

After loading the script, the library automatically initializes widgets from elements with data attributes. **Data attributes are automatically removed after initialization to prevent re-initialization.**

```html
<!-- Page body widget - the div itself becomes the container -->
<div data-if-id="my-form" data-if-type="page-body"></div>

<!-- Multiple page-body widgets with the same ID are supported -->
<div data-if-id="my-form" data-if-type="page-body"></div>

<!-- Float button widget -->
<div data-if-id="my-form" data-if-type="float-button"></div>

<!-- Pop-up widget with timeout -->
<div data-if-id="my-form" data-if-type="pop-up" data-if-timeout="10"></div>

<!-- Custom tags (Wix, etc.) are also supported -->
<form-container data-if-id="my-form" data-if-type="page-body"></form-container>
```

### Automatic initialization via ifLayer (CDN)

The library also automatically processes widgets from `window.ifLayer`:

```html
<script>
  window.ifLayer = window.ifLayer || [];
  window.ifLayer.push({
    id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    type: 'page-body',
    container: '#form-container',
  });
  window.ifLayer.push({
    id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    type: 'float-button',
  });
  window.ifLayer.push({
    id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    type: 'pop-up',
    timeout: 10,
  });
</script>
```

### Manual initialization (npm/ESM)

```ts
import { Embedder } from 'interactiveform-embedder';

// Create instance with configuration
const embedder = new Embedder({
  id: 'my-form',
  type: 'page-body',
  container: '#form-container',
});

// Or create empty instance
const embedder = new Embedder();

// Add widgets
embedder.addWidget({
  id: 'my-form',
  type: 'page-body',
  container: '#form-container',
});

embedder.addWidget({
  id: 'my-form',
  type: 'float-button',
});

embedder.addWidget({
  id: 'my-form',
  type: 'pop-up',
  timeout: 10,
});

// Remove widget
embedder.removeWidget('my-form', 'float-button');

// Reinitialize all widgets
embedder.reinitialize();

// Use singleton
const embedder = Embedder.getInstance();
```

### Inline widget without container

```html
<script>
  Embedder.createInlineWidget('my-form', '800px', '400px');
</script>
```

## Widget Types

- **`page-body`** — embeds in specified container (can have multiple instances with the same ID)
- **`float-button`** — floating button with dropdown iframe (unique per ID)
- **`pop-up`** — modal window with delay (unique per ID, optional `timeout` in seconds)

## Data Attributes

- **`data-if-id`** — unique widget identifier (required)
- **`data-if-type`** — widget type: `page-body`, `float-button`, `pop-up`
- **`data-if-timeout`** — delay for pop-up in seconds (optional)

**Note:** All data attributes are automatically removed after widget initialization to prevent re-initialization. This works with any HTML elements including custom tags like `<form-container>` (Wix compatibility).

**Multiple instances:** You can have multiple `page-body` widgets with the same ID on the same page. Other widget types (`float-button`, `pop-up`) remain unique per ID.

## Widget Configuration

```ts
interface WidgetConfig {
  id: string; // Unique identifier
  type: 'page-body' | 'float-button' | 'pop-up';
  timeout?: number; // Delay for pop-up (in seconds)
  container?: string; // CSS selector for page-body
}
```

## Build Formats

- **IIFE** — for direct inclusion via `<script>` (minified)
- **UMD** — universal module (minified)
- **ES** — for modern bundlers and `<script type="module">` (minified)

## Usage Examples

### Data attributes approach

```html
<!-- Multiple page-body widgets with the same ID are allowed -->
<div data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx" data-if-type="page-body"></div>
<div data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx" data-if-type="page-body"></div>

<!-- Other widget types remain unique per ID -->
<div data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx" data-if-type="float-button"></div>
<div data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx" data-if-type="pop-up" data-if-timeout="10"></div>
```

<script src="https://cdn.jsdelivr.net/npm/interactiveform-embedder@latest/dist/index.iife.js"></script>

````

### GTM-like approach with ifLayer

```html
<script>
  window.ifLayer = window.ifLayer || [];
  window.ifLayer.push({
    id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    type: 'page-body',
    container: '#form-container',
  });
</script>
<script src="https://cdn.jsdelivr.net/npm/interactiveform-embedder@latest/dist/index.iife.js"></script>
````

### Programmatic creation

```ts
import { Embedder } from 'interactiveform-embedder';

const embedder = new Embedder();
embedder.addWidget({
  id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
  type: 'page-body',
  container: '#form-container',
});
```

### Inline insertion

```html
<script>
  Embedder.createInlineWidget('xxxxxxxxxxxxxxxxxxxxxxxx', '800px', '400px');
</script>
```
