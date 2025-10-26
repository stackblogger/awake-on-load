# Triggy

[![npm version](https://img.shields.io/npm/v/triggy.svg)](https://www.npmjs.com/package/triggy)
[![Build Status](https://github.com/stackblogger/triggy/actions/workflows/ci.yml/badge.svg)](https://github.com/stackblogger/triggy/actions)
[![Release](https://github.com/stackblogger/triggy/actions/workflows/release.yml/badge.svg)](https://github.com/stackblogger/triggy/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=flat&logo=webpack&logoColor=black)](https://webpack.js.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

Triggy is a webpack plugin that loads the javascript and css files when user interaction happens like mouse move, scroll etc. It improves web page performance and boosts core web vitals.

## Features

- **Automatic lazy load** - it will automatically convert all the `src` attributes to `data-src` and `href` to `data-href`
- **Performance boost** - it loads static resources only on user interaction
- **Webpack integration** - very easy integration to webpack builder

## Installation

```bash
npm install -D triggy
```

> **Note**: The plugin needs to be installed as a dev dependency because it is only used at the time of build.

## Usage

### Basic Setup

Here is how to add the plguin to your webpack configuration-

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
      timeout: 15000,         // Timeout in ms before automatic load static files (default: 10000)
      include: [/\.html$/],   // Files to process (default: HTML files)
      exclude: [/admin\.html/], // Files to exclude
      convertSrcToDataSrc: true, // Convert all the src attributes to data-src (default: true)
      lazyLoadFiles: ['app.js', 'utils.js', 'styles.css']  // Only lazy load the mentioned files
    })
  ]
};
```

## How It Works

1. **Build Time**: Triggy automatically-
   - Converts `<script src="...">` to `<script data-src="...">`
   - Converts `<link href="...">` to `<link data-href="...">`
   - Injects the lazy loading script at the end of your HTML

2. **Runtime**: The injected script will-
   - monitor user interactions like mouse move, wheel, touch, click etc
   - load static resources when user interaction happens
   - fall back to automatic loading after 10 seconds (configurable)

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable or disable the plugin |
| `timeout` | number | `10000` | Timeout in milliseconds before automatic load static resources |
| `include` | RegExp[] | `[/\.html$/]` | File patterns to process |
| `exclude` | RegExp[] | `[]` | File patterns to exclude |
| `convertSrcToDataSrc` | boolean | `true` | Convert all the src/href attributes to data-src/data-href |
| `lazyLoadFiles` | string[] | `[]` | Specific files to lazy load (if empty, all .js/.css files are lazy loaded) |

## Use Cases

### When to disable `convertSrcToDataSrc`

Set `convertSrcToDataSrc: false` when:

- You want to inject the lazy loading script without changing the `src` attributes
- You're manually handling the `data-src` attributes in HTML
- You want the lazy load functionality without attribute conversion

```javascript
new TriggyPlugin({
  convertSrcToDataSrc: false // Only inject script, don't convert attributes
})
```

### Selective File Loading

Use `lazyLoadFiles` to specify which files should lazy load:

```javascript
new TriggyPlugin({
  lazyLoadFiles: ['app.js', 'utils.js', 'styles.css']
})
```

**Behavior:**
- **When you use `lazyLoadFiles`** - it will lazy load only those specified files
- **When you dont use `lazyLoadFiles`** - it will lazy load the `.js` and `.css` files

**Example:**
```html
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

- **Faster initial page load** - these resources don't block page render
- **Better Core Web Vitals** - it improves LCP and FCP scores
- **Reduced bandwidth usage** - the resources load only when needed
- **Better user experience** - the pages feel more responsive

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT

## Testing

The plugin includes wide test coverage:

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

See [CONTRIBUTION.md](./CONTRIBUTION.md) for detailed contribution manual.
