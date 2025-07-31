---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---

## 🐛 Bug Description

A clear and concise description of what the bug is.

## 🔄 Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior

A clear and concise description of what you expected to happen.

## ❌ Actual Behavior

A clear and concise description of what actually happened.

## 📸 Screenshots

If applicable, add screenshots to help explain your problem.

## 🖥️ Environment

**Browser:**

- Name: [e.g. Chrome, Safari]
- Version: [e.g. 22]

**Operating System:**

- OS: [e.g. macOS, Windows, Linux]
- Version: [e.g. 10.15.7]

**Package Versions:**

- use-redux-state: [e.g. 1.0.0]
- React: [e.g. 19.1.0]
- Redux Toolkit: [e.g. 2.8.2]

## 💻 Code Example

```tsx
import { useReduxState } from 'use-redux-state';

function MyComponent() {
  const [state, setState] = useReduxState('myState', { value: 0 });

  // Your code here
}
```

## 🔍 Additional Context

Add any other context about the problem here, such as:

- Error messages in console
- Network tab information
- Related issues or pull requests

## 📋 Checklist

- [ ] I have searched the existing issues for duplicates
- [ ] I have provided all the requested information
- [ ] I have included a minimal reproduction example
- [ ] I have checked the documentation for similar issues

---

**Note**: Please be as detailed as possible. The more information you provide, the easier it will be for us to help you!
