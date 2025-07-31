# Contributing to use-redux-state 🤝

Thank you for your interest in contributing to `use-redux-state`! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Questions or Problems?](#questions-or-problems)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to see if the problem has already been reported. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include details about your configuration and environment**

### Suggesting Enhancements

If you have a suggestion for a new feature or enhancement:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**

### Pull Requests

- Fork the repo and create your branch from `main`
- If you've added code that should be tested, add tests
- Ensure the test suite passes
- Make sure your code follows the existing code style
- Issue that pull request!

## 🛠️ Development Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm, yarn, or pnpm
- Git

### Installation

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/rajkumar4041/use-redux-state
   cd use-redux-state
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Start development mode**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run build` - Build the project for production
- `npm run dev` - Start development mode with watch
- `npm run clean` - Clean the dist directory
- `npm run test` - Run tests (when implemented)
- `npm run lint` - Run ESLint (when implemented)
- `npm run format` - Format code with Prettier (when implemented)

## 📁 Project Structure

```
use-redux-state/
├── src/
│   ├── hooks/                 # React hooks
│   │   ├── useReduxState.ts
│   │   └── useReduxStateSelector.ts
│   ├── impl/                  # Implementation details
│   │   └── reduxStateImpl.ts
│   ├── index.ts              # Main exports
│   ├── provider.tsx          # Redux provider component
│   ├── store.ts              # Store configuration
│   └── types.ts              # TypeScript type definitions
├── dist/                     # Built files (generated)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Use interfaces for object shapes
- Prefer `const` over `let` when possible
- Use arrow functions for consistency

### Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use early returns to reduce nesting

### Example

```typescript
/**
 * Custom hook for managing global state
 * @param key - Unique identifier for the state
 * @param initialValue - Initial value for the state
 * @returns Tuple containing value, setter, and utility functions
 */
export function useReduxState<T>(
  key: string,
  initialValue: T
): useReduxStateReturn<T> {
  // Implementation
}
```

### File Naming

- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for function and variable names
- Use UPPER_SNAKE_CASE for constants

## 🧪 Testing

### Writing Tests

When adding new features or fixing bugs, please include tests:

```typescript
// Example test structure
describe('useReduxState', () => {
  it('should create state with initial value', () => {
    // Test implementation
  });

  it('should update state correctly', () => {
    // Test implementation
  });

  it('should handle partial updates', () => {
    // Test implementation
  });
});
```

### Test Guidelines

- Test the public API, not implementation details
- Use descriptive test names
- Test both success and error cases
- Keep tests simple and focused
- Use setup and teardown when needed

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows the project's coding standards**
2. **Add tests for new functionality**
3. **Update documentation if needed**
4. **Make sure all tests pass**
5. **Update the CHANGELOG.md if applicable**

### Pull Request Template

When creating a pull request, please use the following template:

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Checklist

- [ ] I have read the [Contributing Guide](CONTRIBUTING.md)
- [ ] My code follows the coding standards
- [ ] I have updated the documentation accordingly
- [ ] I have added tests for my changes
- [ ] All tests pass
```

### Review Process

1. **Automated checks must pass** (CI/CD, linting, tests)
2. **Code review by maintainers**
3. **Address any feedback or requested changes**
4. **Maintainers will merge when ready**

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/) (SemVer):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Release Steps

1. **Update version in package.json**
2. **Update CHANGELOG.md**
3. **Create a release tag**
4. **Publish to npm**

### Pre-release Checklist

- [ ] All tests pass
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped
- [ ] Release notes are prepared

## ❓ Questions or Problems?

If you have questions or encounter problems:

1. **Check the existing issues** to see if your question has already been answered
2. **Search the documentation** for relevant information
3. **Create a new issue** with a clear description of your question or problem
4. **Join our community** discussions

## 🙏 Recognition

Contributors will be recognized in:

- The project's README.md
- Release notes
- GitHub contributors list

## 📞 Contact

- **Email**: rajkumarrathod414@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/rajkumar4041/use-redux-state/issues)
  @REM - **Discussions**: [GitHub Discussions](https://github.com/rajkumar4041/use-redux-state/discussions)

---

Thank you for contributing to `use-redux-state`! 🎉

Your contributions help make this library better for everyone in the React community.
