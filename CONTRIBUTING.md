# Contributing to Triggy

Thank you for your interest for the contribution in the development of Triggy! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/triggy.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Available Scripts

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run build         # Build the project
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues automatically
npm run ci            # Run full CI pipeline locally
```

### Code Style

- Use TypeScript for all source code
- Follow the existing code style and patterns
- Run `npm run lint` before commit
- Ensure all tests pass with `npm test`

### Test

- Write tests for new features
- Maintain or improve test coverage
- Test on multiple Node.js versions (16.x, 18.x, 20.x)

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Add tests for the code you add
3. Update documentation if needed
4. Run the full CI pipeline: `npm run ci`
5. Submit a pull request with a clear description

### PR Requirements

- [ ] All tests pass
- [ ] Code is properly linted
- [ ] Test coverage is maintained or improved
- [ ] Documentation is updated if needed
- [ ] PR description clearly explains the changes

## Issue Report

When you report an issue, please include

- Triggy version
- Node.js version
- Webpack version
- Steps to reproduce
- Expected vs actual behavior

## Release Process

Releases are automated through GitHub Actions:

1. Update version in `package.json`
2. Create a git tag: `git tag v1.0.3`
3. Push the tag: `git push origin v1.0.3`
4. GitHub Actions will automatically create a release and publish to NPM

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to create a welcome environment for all contributors.

## Questions?

Feel free to open an issue for questions or discussions about the project.
