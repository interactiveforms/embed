# Interactive Form Embedder

A library for embedding interactive forms on websites. Supports three types of widgets: container embedding, floating button, and pop-up modal.

## Installation

### 1. Script Integration

Add the following script to the `<head>` of your HTML page:

```html
<script src="https://widgets.interactiveform.com/embed.js"></script>
```

### 2. Automatic Initialization

After adding the script, the library automatically initializes and processes all widgets defined through data attributes or the global `window.ifLayer` array.

## Usage Methods

### Method 1: Data Attributes (Recommended)

The simplest way is to use data attributes in HTML:

#### Container Embedding (page-body)

```html
<div data-if-id="your-form-id" data-if-type="page-body"></div>
```

#### Floating Button (float-button)

```html
<div data-if-id="your-form-id" data-if-type="float-button"></div>
```

#### Pop-up Modal (pop-up)

```html
<div data-if-id="your-form-id" data-if-type="pop-up" data-if-timeout="5"></div>
```

### Method 2: Global ifLayer Array

```html
<script>
  window.ifLayer = window.ifLayer || [];
  window.ifLayer.push({
    id: 'your-form-id',
    type: 'page-body',
    container: '.my-container',
  });
</script>
```

### Method 3: Programmatic Creation

```javascript
// Get embedder instance
const embedder = window.InteractiveFormEmbed.getInstance();

// Add widget
embedder.addWidget({
  id: 'your-form-id',
  type: 'float-button',
});
```

## Widget Configuration

### Configuration Parameters

| Parameter   | Type   | Required      | Description                                              |
| ----------- | ------ | ------------- | -------------------------------------------------------- |
| `id`        | string | ✅            | Unique form identifier                                   |
| `type`      | string | ✅            | Widget type: `'page-body'`, `'float-button'`, `'pop-up'` |
| `container` | string | For page-body | CSS selector for the container to embed into             |
| `timeout`   | number | No            | Pop-up display delay in seconds (default: 3)             |

### Widget Types

#### 1. Page Body - Container Embedding

Embeds the form iframe into the specified container on the page.

```html
<!-- HTML -->
<div class="form-container" data-if-id="contact-form" data-if-type="page-body"></div>
```

```javascript
// JavaScript
embedder.addWidget({
  id: 'contact-form',
  type: 'page-body',
  container: '.form-container',
});
```

#### 2. Float Button - Floating Button

Creates a fixed-position button in the bottom-right corner with a dropdown iframe.

```html
<!-- HTML -->
<div data-if-id="support-form" data-if-type="float-button"></div>
```

```javascript
// JavaScript
embedder.addWidget({
  id: 'support-form',
  type: 'float-button',
});
```

**Features:**

- Button has attention-grabbing animation
- Animation stops on hover
- iframe appears on button click
- Has close button

#### 3. Pop-up - Modal Window

Shows a modal window with the form after a specified time.

```html
<!-- HTML -->
<div data-if-id="newsletter-form" data-if-type="pop-up" data-if-timeout="5"></div>
```

```javascript
// JavaScript
embedder.addWidget({
  id: 'newsletter-form',
  type: 'pop-up',
  timeout: 5, // seconds
});
```

**Features:**

- Shows only once (uses cookies)
- Can be closed by clicking background or close button
- Has smooth appearance animations

## Usage Examples

### Simple Contact Form

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://widgets.interactiveform.com/embed.js"></script>
  </head>
  <body>
    <h1>Our Company</h1>

    <!-- Contact form embeds here -->
    <div class="contact-section">
      <h2>Contact Us</h2>
      <div data-if-id="contact-form-123" data-if-type="page-body"></div>
    </div>

    <!-- Floating support button -->
    <div data-if-id="support-form-456" data-if-type="float-button"></div>
  </body>
</html>
```

### Multiple Forms

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://widgets.interactiveform.com/embed.js"></script>
  </head>
  <body>
    <!-- Multiple forms on one page -->
    <div class="hero-section">
      <div data-if-id="hero-form-1" data-if-type="page-body"></div>
    </div>

    <div class="features-section">
      <div data-if-id="demo-form-2" data-if-type="page-body"></div>
    </div>

    <!-- Floating button -->
    <div data-if-id="support-form-3" data-if-type="float-button"></div>

    <!-- Pop-up for new visitors -->
    <div data-if-id="welcome-form-4" data-if-type="pop-up" data-if-timeout="5"></div>
  </body>
</html>
```

## Technical Details

### Automatic Initialization

The library automatically initializes on DOM load and processes:

- Elements with data attributes `data-if-*`
- Elements in the global `window.ifLayer` array
- Dynamically added elements

### State Management

- **Pop-up widgets** use cookies to track display status
- **Page-body widgets** can be created multiple times with unique keys
- **Float-button widgets** are created only once per page

### Styling

The library adds its own styles for widgets. For customization, use CSS:

```css
/* Customize floating button */
[data-widget-id='your-form-id'] {
  /* your styles */
}

/* Customize iframe */
[data-widget-id='your-form-id'] iframe {
  /* your styles */
}
```

## Browser Support

The library supports all modern browsers with support for:

- ES6+ (Proxy, Map, Set)
- CSS Grid and Flexbox
- HTML5 data attributes

## Development

For local development and testing:

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```
