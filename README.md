# 🚀 use-redux-state

[![npm version](https://badge.fury.io/js/use-redux-state.svg)](https://badge.fury.io/js/use-redux-state)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

A powerful and lightweight React hook library that simplifies Redux state management with a familiar `useState`-like API. Built on top of Redux Toolkit for optimal performance and developer experience.

## ✨ Features

- 🎯 **Simple API**: Use redux State with a familiar `useState`-like interface
- 🔄 **Dynamic State Creation**: Automatically create and manage Redux slices on-demand
- 🎨 **TypeScript Support**: Full TypeScript support with excellent type inference
- ⚡ **Performance Optimized**: Built on Redux Toolkit for optimal performance
- 🔧 **Flexible Selectors**: Advanced state selection capabilities
- 🚀 **Zero Configuration**: Minimal setup required
- 📦 **Lightweight**: Small bundle size with no unnecessary dependencies

## 📦 Installation

```bash
npm install use-redux-state
```

or

```bash
yarn add use-redux-state
```

## 🚀 Quick Start

### 1. Wrap your app with the provider

```tsx
import { GlobalReduxProvider } from 'use-redux-state';

function App() {
  return (
    <GlobalReduxProvider>
      <YourApp />
    </GlobalReduxProvider>
  );
}
```

### 2. Use redux State anywhere in your app

```tsx
import { useReduxState } from 'use-redux-state';

function Counter() {
  const [count, setCount] = useReduxState('counter', 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## 📚 API Reference

### `useReduxState(key, initialValue?)`

The main hook for managing redux State. Works just like `useState` but with global scope.

```tsx
const [value, setValue, { update, reset }] = useReduxState(key, initialValue);
```

**Parameters:**

- `key` (string): Unique identifier for the redux State
- `initialValue` (optional): Initial value for the state

**Returns:**

- `value`: Current state value
- `setValue`: Function to update the entire state
- `update`: Function to merge partial updates
- `reset`: Function to reset state to initial value

### `useReduxStateSelector(key, selector)`

Select specific parts of redux State with a selector function.

```tsx
const selectedValue = useReduxStateSelector(key, (state) => state.someProperty);
```

### `useReduxStateValue(key)`

Get the entire value of a redux State without a selector.

```tsx
const stateValue = useReduxStateValue(key);
```

### `useMultipleGlobalStates(keys)`

Select multiple redux States at once.

```tsx
const states = useMultipleGlobalStates(['user', 'settings', 'theme']);
```

## 🎯 Examples

### Basic Usage

```tsx
import { useReduxState } from 'use-redux-state';

function UserProfile() {
  const [user, setUser] = useReduxState('user', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  });

  const updateName = (newName: string) => {
    setUser({ ...user, name: newName });
  };

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => updateName('Jane Doe')}>Update Name</button>
    </div>
  );
}
```

### Using Partial Updates

```tsx
function Settings() {
  const [settings, setSettings, { update }] = useReduxState('settings', {
    theme: 'light',
    language: 'en',
    notifications: true,
  });

  const toggleTheme = () => {
    update({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div>
      <p>Current theme: {settings.theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Advanced State Selection

```tsx
function UserList() {
  // Select only the users array from the State
  const users = useReduxStateSelector('users', (state) => state.list);

  // Select multiple states
  const { user, settings } = useMultipleGlobalStates(['user', 'settings']);

  return (
    <div>
      <h3>Welcome, {user.name}!</h3>
      <p>Theme: {settings.theme}</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Shopping Cart Example

```tsx
function ShoppingCart() {
  const [cart, setCart, { update, reset }] = useReduxState('cart', {
    items: [],
    total: 0,
  });

  const addItem = (item) => {
    const newItems = [...cart.items, item];
    const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
    update({ items: newItems, total: newTotal });
  };

  const clearCart = () => {
    reset(); // Reset to initial state
  };

  return (
    <div>
      <h3>Shopping Cart ({cart.items.length} items)</h3>
      <p>Total: ${cart.total}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

## 🔧 Advanced Usage

### Store Management

```tsx
import { clearSlices, getRegisteredKeys, getStore } from 'use-redux-state';

// Get the store instance
const store = getStore();

// Get all registered state keys
const keys = getRegisteredKeys();

// Clear all slices (useful for testing)
clearSlices();
```

### TypeScript with Custom Types

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  user: User;
  settings: {
    theme: 'light' | 'dark';
    language: string;
  };
}

function TypedComponent() {
  const [user, setUser] = useReduxState<User>('user', {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  });

  const settings = useReduxStateValue<AppState['settings']>('settings');
}
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Redux Toolkit](https://redux-toolkit.js.org/)
- Inspired by React's `useState` hook
- Made with ❤️ for the React community

---

<<<<<<< HEAD
**Made with ❤️ by [Rajkumar Rathod](https://github.com/your-username)**
=======
**Made with ❤️ by [Rajkumar Rathod](https://github.com/rajkumar4041)**

> > > > > > > 34f7c5062b0e8a312e03d102efac11f1ab4cbcc0

If you find this library helpful, please consider giving it a ⭐ on GitHub!
