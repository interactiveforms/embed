# InteractiveForm Embedder

A library for embedding interactive forms and widgets on your website.

## Installation

**Recommendation:** For better performance, include the script in `<head>` with the `async` attribute and place it before elements with data attributes.

### Via CDN (unpkg)

**UMD (recommended for CDN):**

```html
<script async src="https://unpkg.com/interactiveform-embedder@latest/dist/index.js"></script>
```

**ESM:**

```html
<script
  type="module"
  src="https://unpkg.com/interactiveform-embedder@latest/dist/index.es.js"
></script>
```

**Dynamic loading via JavaScript:**

```html
<script>
  // Load script in head with async
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/interactiveform-embedder@latest/dist/index.js';
  script.async = true;
  document.head.appendChild(script);
</script>
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

<!-- Widget with custom iframe source -->
<div
  data-if-id="my-form"
  data-if-type="page-body"
  data-if-iframe-src="https://custom-domain.com"
></div>

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
  window.ifLayer.push({
    id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    type: 'page-body',
    container: '#form-container',
    iframeSrc: 'https://custom-domain.com',
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

embedder.addWidget({
  id: 'my-form',
  type: 'page-body',
  container: '#form-container',
  iframeSrc: 'https://custom-domain.com',
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
  // With custom iframe source
  Embedder.createInlineWidget('my-form', '800px', '400px', 'https://custom-domain.com');
</script>
```

## Widget Types

- **`page-body`** — embeds in specified container (can have multiple instances with the same ID)
- **`float-button`** — floating button with dropdown iframe (unique per ID)
- **`pop-up`** — modal window with delay (unique per ID, optional `timeout` in seconds, shown only once per day)

## Data Attributes

- **`data-if-id`** — unique widget identifier (required)
- **`data-if-type`** — widget type: `page-body`, `float-button`, `pop-up`
- **`data-if-timeout`** — delay for pop-up in seconds (optional)
- **`data-if-iframe-src`** — custom iframe source URL (optional, defaults to `https://if-form-staging.up.railway.app`)

**Note:** All data attributes are automatically removed after widget initialization to prevent re-initialization. This works with any HTML elements including custom tags like `<form-container>` (Wix compatibility).

**Multiple instances:** You can have multiple `page-body` widgets with the same ID on the same page. Other widget types (`float-button`, `pop-up`) remain unique per ID.

**Popup behavior:** Pop-up widgets are shown only once per day per unique ID. After showing, a cookie `if-popup-{id}` is set for 1 day to prevent repeated displays.

## Widget Configuration

```ts
interface WidgetConfig {
  id: string; // Unique identifier
  type: 'page-body' | 'float-button' | 'pop-up';
  timeout?: number; // Delay for pop-up (in seconds)
  container?: string; // CSS selector for page-body
  iframeSrc?: string; // Custom iframe source URL (defaults to https://if-form-staging.up.railway.app)
}
```

## Build Formats

- **UMD** — universal module for CDN and direct inclusion via `<script>` (minified, main file `index.js`)
- **ES** — for modern bundlers and `<script type="module">` (minified, file `index.es.js`)

## Usage Examples

### Data attributes approach

```html
<!-- Include script in head with async -->
<script async src="https://unpkg.com/interactiveform-embedder@latest/dist/index.js"></script>

<!-- Multiple page-body widgets with the same ID are allowed -->
<div data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx" data-if-type="page-body"></div>
<div data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx" data-if-type="page-body"></div>

<!-- Other widget types remain unique per ID -->
<div data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx" data-if-type="float-button"></div>
<div data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx" data-if-type="pop-up" data-if-timeout="10"></div>

<!-- With custom iframe source -->
<div
  data-if-id="xxxxxxxxxxxxxxxxxxxxxxxx"
  data-if-type="page-body"
  data-if-iframe-src="https://custom-domain.com"
></div>
```

````

### GTM-like approach with ifLayer

```html
<!-- Include script in head with async -->
<script async src="https://unpkg.com/interactiveform-embedder@latest/dist/index.js"></script>

<script>
  window.ifLayer = window.ifLayer || [];
  window.ifLayer.push({
    id: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    type: 'page-body',
    container: '#form-container',
  });
</script>
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
  // With custom iframe source
  Embedder.createInlineWidget(
    'xxxxxxxxxxxxxxxxxxxxxxxx',
    '800px',
    '400px',
    'https://custom-domain.com',
  );
</script>
```
