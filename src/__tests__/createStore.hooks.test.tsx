import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, expect, it } from 'vitest';
import { createStore } from '../createStore';
import { shallow } from '../shallow';
import { clearSlices } from '../store';

beforeEach(() => {
  clearSlices();
});

const store = () => createStore('counter', { count: 0, name: 'x' });

it('use() renders value and updates via set and functional set', () => {
  const s = store();
  function C() {
    const [v, set] = s.use();
    return (
      <button onClick={() => set((p) => ({ ...p, count: p.count + 1 }))}>
        {v.count}
      </button>
    );
  }
  render(<C />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button').textContent).toBe('1');
});

it('useValue reflects imperative set', () => {
  const s = store();
  function C() {
    const v = s.useValue();
    return <span>{v.name}</span>;
  }
  render(<C />);
  act(() => s.set((p) => ({ ...p, name: 'y' })));
  expect(screen.getByText('y')).toBeTruthy();
});

it('useSelector returns a derived slice', () => {
  const s = store();
  function C() {
    const n = s.useSelector((st) => st.name);
    return <span>{n}</span>;
  }
  render(<C />);
  expect(screen.getByText('x')).toBeTruthy();
});

it('object selector with shallow re-renders only when the slice changes', () => {
  const s = createStore('multi', { a: 1, b: 2 });
  let renders = 0;
  function C() {
    renders++;
    const slice = s.useSelector((st) => ({ a: st.a }), shallow);
    return <span>{slice.a}</span>;
  }
  render(<C />);
  act(() => s.set((p) => ({ ...p, b: 9 }))); // b changes, a does not
  expect(screen.getByText('1')).toBeTruthy();
  expect(renders).toBe(1); // shallow kept the {a} slice stable → no re-render
});

it('useSet update() shallow-merges and does not clobber other fields', () => {
  const s = store(); // { count: 0, name: 'x' }
  function Writer() {
    const [, upd] = s.useSet();
    return <button onClick={() => upd({ count: 7 })}>w</button>;
  }
  function Reader() {
    const v = s.useValue();
    return (
      <span data-testid="r">
        {v.count}:{v.name}
      </span>
    );
  }
  render(
    <>
      <Writer />
      <Reader />
    </>
  );
  fireEvent.click(screen.getByText('w'));
  expect(screen.getByTestId('r').textContent).toBe('7:x'); // name preserved
});

it('useReset() resets the store from a component', () => {
  const s = store();
  function C() {
    const v = s.useValue();
    const reset = s.useReset();
    return (
      <button onClick={reset} data-testid="b">
        {v.count}
      </button>
    );
  }
  render(<C />);
  act(() => s.set((p) => ({ ...p, count: 5 })));
  expect(screen.getByTestId('b').textContent).toBe('5');
  fireEvent.click(screen.getByTestId('b'));
  expect(screen.getByTestId('b').textContent).toBe('0');
});
