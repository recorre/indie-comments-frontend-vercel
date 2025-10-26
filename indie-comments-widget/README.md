# Indie Comments Widget

A lightweight, embeddable comment system that connects to the Indie Comments API.

## Features

- Easy embedding with a single script tag
- Nested comment replies
- Client-side validation
- Responsive design
- Moderation support
- **Built-in Theme System** with 4 pre-designed themes
- **Dynamic Theme Switching** with smooth transitions
- **Page-level Theme Integration** - themes affect the entire page
- **Accessibility Compliant** - proper contrast ratios in all themes

## Usage

### Basic Embedding

To embed the widget on your website, add this HTML to your page:

```html
<indie-comments-widget
    thread-id="unique-thread-identifier"
    api-base-url="https://your-api-domain.com">
</indie-comments-widget>

<script src="path/to/widget.js"></script>
```

### Manual Initialization

You can also initialize the widget manually with JavaScript:

```javascript
// The widget auto-initializes when the custom element is added to the page
// No manual initialization required for basic usage
```

## Configuration Options

- `thread-id`: Unique identifier for the comment thread (defaults to current page path)
- `api-base-url`: Base URL for the API (defaults to http://localhost:8000)

## Theme System

The widget includes a built-in theme system with 4 pre-designed themes that can be switched dynamically. Each theme affects both the widget appearance and the entire page background for a cohesive experience.

### Available Themes

1. **Default** - Clean, modern design with light backgrounds
2. **Dark** - Dark theme optimized for low-light environments with high contrast
3. **Matrix** - Retro terminal-style theme with green-on-black aesthetics
4. **NeoCities** - Colorful, retro web-inspired theme with gradients and patterns

### Theme Switching

The widget includes a dropdown selector in the header that allows users to switch between themes. When a theme is selected:

- The widget styling updates immediately with smooth CSS transitions (0.25s)
- A custom `themeChange` event is dispatched to the host page
- The page background and colors update to match the selected theme
- All elements maintain proper accessibility contrast ratios

### Page-Level Integration

To respond to theme changes on your page, listen for the `themeChange` event:

```javascript
document.querySelector('indie-comments-widget').addEventListener('themeChange', (event) => {
    const theme = event.detail.theme;
    // Update your page styling based on the selected theme
    document.body.className = `theme-${theme}`;
});
```

### Custom Theme Development

Themes are defined in the `widget.js` file as CSS strings within the `themes` object. Each theme includes styling for:

- Widget container backgrounds and borders
- Form elements (inputs, buttons, dropdowns)
- Comment styling and typography
- Responsive breakpoints
- Accessibility considerations

To add a custom theme, extend the `themes` object in `widget.js` with your CSS styles.

## Development

To run the demo:

1. Start your Indie Comments API server
2. Open `demo.html` in a browser

## Styling

### Built-in Themes

The widget includes 4 professionally designed themes that can be switched dynamically:

- **Default**: Clean, modern design with light backgrounds and subtle shadows
- **Dark**: High-contrast dark theme perfect for low-light environments
- **Matrix**: Retro terminal aesthetic with green-on-black styling
- **NeoCities**: Colorful, retro web theme with gradients and patterns

Each theme includes comprehensive styling for all widget elements and maintains accessibility standards.

### Custom Styling

For advanced customization, you can:

1. **Override theme CSS**: Modify the theme objects in `widget.js`
2. **Add custom themes**: Extend the `themes` object with your own designs
3. **Page-level styling**: Listen for `themeChange` events to coordinate with your site's design

See `widget.css` and the theme implementations in `widget.js` for all available CSS classes and styling approaches.
