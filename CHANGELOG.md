# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Triggy webpack plugin
- Automatic lazy loading for JavaScript and CSS resources
- Configurable options for timeout, file inclusion/exclusion
- Comprehensive test suite with 86 tests
- GitHub Actions CI/CD pipeline
- ESLint configuration for code quality
- Example projects demonstrating usage

### Features
- Converts `src` to `data-src` and `href` to `data-href`
- Injects lazy loading script automatically
- Smart detection of webpack chunks and external resources
- Configurable `convertSrcToDataSrc` option
- Support for multiple file patterns and exclusions
- Minified lazy loader script (44.9% size reduction)

### Technical Details
- TypeScript implementation with full type safety
- 76% statement coverage, 90% branch coverage
- Support for Node.js 16.x, 18.x, and 20.x
- Webpack 4.x and 5.x compatibility
- MIT license
