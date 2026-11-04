import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useReduxState } from '../hooks/useReduxState';
import {
  useMultipleGlobalStates,
  useReduxStateReset,
  useReduxStateSelector,
  useReduxStateValue,
} from '../hooks/useReduxStateSelector';
import { clearSlices } from '../store';

beforeEach(() => {
  clearSlices();
});

function Counter({ k = 'count' }: { k?: string }) {
  const [count, setCount, { update, reset }] = useReduxState<number>(k, 0);
  return (
    <div>
      <span data-testid="val">{count}</span>
      <button onClick={() => setCount(count + 1)}>inc</button>
      <button onClick={() => setCount((c) => c + 10)}>inc-fn</button>
      <button onClick={() => reset()}>reset</button>
      <button onClick={() => update({} as never)}>noop-update</button>
    </div>
  );
}

describe('useReduxState', () => {
  it('renders the initial value', () => {
    render(<Counter />);
    expect(screen.getByTestId('val').textContent).toBe('0');
  });

  it('updates via direct and functional setters', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('inc'));
    expect(screen.getByTestId('val').textContent).toBe('1');
    fireEvent.click(screen.getByText('inc-fn'));
    expect(screen.getByTestId('val').textContent).toBe('11');
  });

  it('resets back to the initial value', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('inc'));
    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByTestId('val').textContent).toBe('0');
  });

  it('shares state globally across components using the same key', () => {
    render(
      <>
        <Counter />
        <Counter />
      </>
    );
    const vals = screen.getAllByTestId('val');
    fireEvent.click(screen.getAllByText('inc')[0]);
    expect(vals[0].textContent).toBe('1');
    expect(vals[1].textContent).toBe('1');
  });
});

describe('object state with update', () => {
  function Profile() {
    const [user, , { update }] = useReduxState('user', { name: 'a', age: 1 });
    return (
      <div>
        <span data-testid="name">{user.name}</span>
        <span data-testid="age">{user.age}</span>
        <button onClick={() => update({ age: 2 })}>age++</button>
      </div>
    );
  }

  it('shallow-merges partial updates', () => {
    render(<Profile />);
    fireEvent.click(screen.getByText('age++'));
    expect(screen.getByTestId('name').textContent).toBe('a');
    expect(screen.getByTestId('age').textContent).toBe('2');
  });
});

describe('selector hooks', () => {
  function Seeder() {
    useReduxState('user', { name: 'bob', age: 30 });
    return null;
  }

  function Name() {
    const name = useReduxStateSelector<{ name: string }, string>(
      'user',
      (u) => u.name
    );
    return <span data-testid="sel">{name}</span>;
  }

  function Whole() {
    const user = useReduxStateValue<{ age: number }>('user');
    return <span data-testid="whole">{user.age}</span>;
  }

  it('reads selected and whole values', () => {
    render(
      <>
        <Seeder />
        <Name />
        <Whole />
      </>
    );
    expect(screen.getByTestId('sel').textContent).toBe('bob');
    expect(screen.getByTestId('whole').textContent).toBe('30');
  });

  it('useMultipleGlobalStates collects several keys', () => {
    function Multi() {
      const s = useMultipleGlobalStates<{ a: number; b: number }>(['a', 'b']);
      return <span data-testid="multi">{`${s.a}-${s.b}`}</span>;
    }
    function Seed() {
      useReduxState('a', 1);
      useReduxState('b', 2);
      return null;
    }
    render(
      <>
        <Seed />
        <Multi />
      </>
    );
    expect(screen.getByTestId('multi').textContent).toBe('1-2');
  });
});

describe('useReduxStateReset', () => {
  it('resets an existing key', () => {
    function Seed() {
      const [, setV] = useReduxState('n', 5);
      return <button onClick={() => setV(99)}>set</button>;
    }
    function Resetter() {
      const reset = useReduxStateReset('n');
      const v = useReduxStateValue<number>('n');
      return (
        <div>
          <span data-testid="r">{v}</span>
          <button onClick={() => reset()}>do-reset</button>
        </div>
      );
    }
    render(
      <>
        <Seed />
        <Resetter />
      </>
    );
    act(() => {
      fireEvent.click(screen.getByText('set'));
    });
    expect(screen.getByTestId('r').textContent).toBe('99');
    act(() => {
      fireEvent.click(screen.getByText('do-reset'));
    });
    expect(screen.getByTestId('r').textContent).toBe('5');
  });
});
