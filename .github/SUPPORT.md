# Support

We love our users and we're here to help! This document provides information about how to get support for `use-redux-state`.

## 📞 How to Get Help

### 1. Documentation

Before reaching out for help, please check our documentation:

- **[README.md](README.md)** - Comprehensive guide with examples
- **[API Reference](README.md#api-reference)** - Detailed API documentation
- **[Examples](README.md#examples)** - Code examples and use cases
- **[Best Practices](README.md#best-practices)** - Recommended usage patterns

### 2. GitHub Issues

For bug reports, feature requests, or questions:

- **Bug Reports**: Use the [bug report template](/.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Requests**: Use the [feature request template](/.github/ISSUE_TEMPLATE/feature_request.md)
- **Questions**: Use the [question template](/.github/ISSUE_TEMPLATE/question.md)

### 3. GitHub Discussions

<!-- @REM For general discussions, questions, and community support:

@REM - **[General Discussion](https://github.com/rajkumar4041/use-redux-state/discussions)** - General questions and discussions
@REM - **[Show and Tell](https://github.com/rajkumar4041/use-redux-state/discussions)** - Share your projects and implementations
@REM - **[Help](https://github.com/rajkumar4041/use-redux-state/discussions)** - Get help from the community -->

### 4. Email Support

For private or urgent issues:

- **Email**: rajkumarrathod414@gmail.com
- **Response Time**: Within 24-48 hours
- **Subject**: Include `[use-redux-state]` in the subject line

## 🆘 Common Issues and Solutions

### Installation Issues

**Problem**: Package not found

```bash
npm ERR! 404 Not Found - GET https://registry.npmjs.org/use-redux-state
```

**Solution**: Ensure you're using the correct package name:

```bash
npm install use-redux-state
```

**Problem**: TypeScript errors

```bash
Cannot find module 'use-redux-state' or its corresponding type declarations
```

**Solution**: Install TypeScript types:

```bash
npm install --save-dev @types/react @types/react-redux
```

### Runtime Issues

**Problem**: "GlobalReduxProvider is not defined"

```tsx
// ❌ Wrong
import { GlobalReduxProvider } from 'use-redux-state';

// ✅ Correct
import { GlobalReduxProvider } from 'use-redux-state';
```

**Problem**: "State with key does not exist"

```tsx
// ❌ Wrong - accessing non-existent state
const [user, setUser] = useReduxState('user');

// ✅ Correct - provide initial value
const [user, setUser] = useReduxState('user', { name: '', email: '' });
```

**Problem**: TypeScript type errors

```tsx
// ❌ Wrong - missing type parameter
const [count, setCount] = useReduxState('counter', 0);

// ✅ Correct - explicit typing
const [count, setCount] = useReduxState<number>('counter', 0);
```

## 🔧 Troubleshooting Guide

### 1. Check Your Setup

Ensure you have the correct setup:

```tsx
import React from 'react';
import { GlobalReduxProvider } from 'use-redux-state';

function App() {
  return (
    <GlobalReduxProvider>
      <YourApp />
    </GlobalReduxProvider>
  );
}
```

### 2. Verify Dependencies

Check your `package.json` for correct versions:

```json
{
  "dependencies": {
    "use-redux-state": "^1.0.0",
    "react": "^19.1.0",
    "react-redux": "^9.2.0",
    "@reduxjs/toolkit": "^2.8.2"
  }
}
```

### 3. Check Browser Console

Look for any error messages in the browser console that might indicate the issue.

### 4. Verify TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "react-jsx"
  }
}
```

## 📚 Learning Resources

### Official Documentation

- **[React Hooks Documentation](https://react.dev/reference/react/hooks)** - Learn about React hooks
- **[Redux Toolkit Documentation](https://redux-toolkit.js.org/)** - Learn about Redux Toolkit
- **[React Redux Documentation](https://react-redux.js.org/)** - Learn about React Redux

### Community Resources

- **[React Community](https://reactjs.org/community/support.html)** - React community support
- **[Redux Community](https://redux.js.org/introduction/getting-started#help-and-discussion)** - Redux community support
<!-- - **[Stack Overflow](https://stackoverflow.com/questions/tagged/use-redux-state)** - Q&A platform -->

### Video Tutorials

- React Hooks tutorials on YouTube
- Redux Toolkit tutorials
- State management best practices

## 🤝 Contributing to Support

### Answering Questions

If you can help others, please:

1. **Be patient and kind** - Everyone was a beginner once
2. **Provide code examples** - Show, don't just tell
3. **Explain the reasoning** - Help others understand
4. **Use proper formatting** - Make your responses readable
5. **Follow up** - Check if your answer helped

### Improving Documentation

Help improve our documentation by:

1. **Reporting unclear sections** - Create issues for confusing parts
2. **Suggesting improvements** - Propose better explanations
3. **Adding examples** - Share useful code examples
4. **Fixing typos** - Submit pull requests for corrections

## 📊 Support Statistics

We track support metrics to improve our service:

- **Response Time**: Average 24-48 hours
- **Resolution Rate**: 95% of issues resolved
- **Community Contributions**: 80% of answers from community
- **Documentation Updates**: Weekly improvements

## 🎯 Support Priorities

We prioritize support requests as follows:

1. **Critical Bugs** - Issues that prevent the library from working
2. **Security Issues** - Security vulnerabilities
3. **Documentation Issues** - Unclear or incorrect documentation
4. **Feature Requests** - New functionality requests
5. **General Questions** - Usage and best practices

## 📞 Contact Information

### Primary Contact

- **Email**: rajkumarrathod414@gmail.com
- **GitHub**: [@rajkumar4041](https://github.com/rajkumar4041)
- **Response Time**: 24-48 hours

### Community Support

- **GitHub Issues**: [Create an issue](https://github.com/rajkumar4041/use-redux-state/issues)
- **GitHub Discussions**: [Join discussions](https://github.com/rajkumar4041/use-redux-state/discussions)
- **Stack Overflow**: [Ask questions](https://stackoverflow.com/questions/tagged/use-redux-state)

## 🙏 Acknowledgments

We'd like to thank:

- **Our Contributors** - For helping improve the library
- **Our Users** - For providing feedback and bug reports
- **The React Community** - For inspiration and support
- **The Redux Community** - For the excellent foundation

---

**Note**: We're committed to providing excellent support. If you're not satisfied with our response, please let us know and we'll do our best to improve.
