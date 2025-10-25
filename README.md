# Triggy

[![npm version](https://img.shields.io/npm/v/triggy.svg)](https://www.npmjs.com/package/triggy)
[![Build Status](https://github.com/stackblogger/triggy/actions/workflows/ci.yml/badge.svg)](https://github.com/stackblogger/triggy/actions)
[![Release](https://github.com/stackblogger/triggy/actions/workflows/release.yml/badge.svg)](https://github.com/stackblogger/triggy/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=flat&logo=webpack&logoColor=black)](https://webpack.js.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

Triggy is a webpack plugin that loads the javascript and css files when user interaction happens like mouse move, scroll etc. It improves web page performance and boosts core web vitals.

## Features

- **Automatic lazy load** - Converts `src` to `data-src` and `href` to `data-href`
- **Performance boost** - Load resources only on user interaction
- **Zero configuration** - Works out of the box
- **Webpack integration** - Seamless integration
- **Smart detection** - Automatically identifies webpack chunks and external resources

## Installation

```bash
npm install -D triggy
```

> **Note**: This plugin should be installed as a dev dependency since it's only used during the build process.

## Usage

### Basic Setup

Add the plugin to your webpack configuration:

```javascript
const TriggyPlugin = require('triggy');

module.exports = {
  // ... your webpack config
  plugins: [
    new TriggyPlugin()
  ]
};
```

### Advanced Configuration

```javascript
const TriggyPlugin = require('triggy');

module.exports = {
  plugins: [
    new TriggyPlugin({
      enabled: true,           // Enable/disable the plugin
      timeout: 15000,         // Timeout in ms before auto-loading (default: 10000)
      include: [/\.html$/],   // Files to process (default: HTML files)
      exclude: [/admin\.html/], // Files to exclude
      convertSrcToDataSrc: true // Convert src to data-src (default: true)
    })
  ]
};
```

## How It Works

1. **Build Time**: The plugin automatically:
   - Converts `<script src="...">` to `<script data-src="...">`
   - Converts `<link href="...">` to `<link data-href="...">`
   - Injects the lazy loading script at the end of your HTML

2. **Runtime**: The injected script:
   - Monitors user interactions (click, mousemove, keydown, etc.)
   - Loads resources when any interaction occurs
   - Falls back to auto-loading after 10 seconds (configurable)
   - Replays stored user interactions after scripts load

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable or disable the plugin |
| `timeout` | number | `10000` | Timeout in milliseconds before auto-loading resources |
| `include` | RegExp[] | `[/\.html$/]` | File patterns to process |
| `exclude` | RegExp[] | `[]` | File patterns to exclude |
| `convertSrcToDataSrc` | boolean | `true` | Convert src/href attributes to data-src/data-href |
| `lazyLoadFiles` | string[] | `[]` | Specific files to lazy load (if empty, all .js/.css files are lazy loaded) |

## Use Cases

### When to disable `convertSrcToDataSrc`

Set `convertSrcToDataSrc: false` when:

- You want to inject the lazy loading script but keep existing `src` attributes unchanged
- You're manually managing `data-src` attributes in your HTML
- You only want the lazy loading functionality without attribute conversion

```javascript
new TriggyPlugin({
  convertSrcToDataSrc: false // Only inject script, don't convert attributes
})
```

### Selective File Loading

Use `lazyLoadFiles` to specify exactly which files should be lazy loaded:

```javascript
new TriggyPlugin({
  lazyLoadFiles: ['app.js', 'utils.js', 'styles.css']
})
```

**Behavior:**
- **With `lazyLoadFiles`**: Only files matching the list will be converted to lazy loading
- **Without `lazyLoadFiles`**: All `.js` and `.css` files will be lazy loaded (default behavior)

**Example:**
```html
<!-- Only app.js and utils.js will be lazy loaded -->
<script src="app.js"></script>        <!-- ✅ Will be lazy loaded -->
<script src="utils.js"></script>      <!-- ✅ Will be lazy loaded -->
<script src="critical.js"></script>   <!-- ❌ Will load normally -->
<link href="styles.css">              <!-- ✅ Will be lazy loaded -->
<link href="bootstrap.css">           <!-- ❌ Will load normally -->
```

## Examples

### Before (Original HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <script src="app.js"></script>
  <script src="vendor.js"></script>
</body>
</html>
```

### After (Transformed HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" data-href="styles.css">
</head>
<body>
  <script data-src="app.js"></script>
  <script data-src="vendor.js"></script>
  <script>
    // Lazy loading script automatically injected here
  </script>
</body>
</html>
```

## Integration Examples

### React with Create React App

```javascript
// webpack.config.js (eject or use CRACO)
const TriggyPlugin = require('triggy');

module.exports = {
  plugins: [
    new TriggyPlugin({
      timeout: 5000 // Load after 5 seconds
    })
  ]
};
```

### Vue.js with Vue CLI

```javascript
// vue.config.js
const TriggyPlugin = require('triggy');

module.exports = {
  configureWebpack: {
    plugins: [
      new TriggyPlugin()
    ]
  }
};
```

### Next.js

```javascript
// next.config.js
const TriggyPlugin = require('triggy');

module.exports = {
  webpack: (config) => {
    config.plugins.push(new TriggyPlugin());
    return config;
  }
};
```

## Performance Benefits

- **Faster initial page load** - Resources don't block page render
- **Better Core Web Vitals** - Improved LCP and FCP scores
- **Reduced bandwidth usage** - Resources load only when needed
- **Better user experience** - Pages feel more responsive

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT

## Testing

The plugin includes comprehensive test coverage:

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run ci            # Run full CI pipeline locally
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

- **CI Pipeline** - Runs on every push and PR
  - Tests on Node.js 16.x, 18.x, and 20.x
  - Builds the project and examples
  - Runs security audits
  - Lints code with ESLint

- **Release Pipeline** - Runs on version tags (v*)
  - Creates GitHub releases with changelog
  - Publishes to NPM automatically
  - Generates release notes from git commits

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution manual.
