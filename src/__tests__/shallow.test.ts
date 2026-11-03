import { describe, expect, it } from 'vitest';
import { shallow } from '../shallow';

describe('shallow', () => {
  it('treats identical references/primitives as equal', () => {
    expect(shallow(1, 1)).toBe(true);
    const obj = { a: 1 };
    expect(shallow(obj, obj)).toBe(true);
  });

  it('compares objects one level deep', () => {
    expect(shallow({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(shallow({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });

  it('is only shallow (nested objects compared by reference)', () => {
    expect(shallow({ a: { x: 1 } }, { a: { x: 1 } })).toBe(false);
  });

  it('detects differing key counts', () => {
    expect(shallow({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('handles arrays', () => {
    expect(shallow([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(shallow([1, 2], [1, 2, 3])).toBe(false);
  });

  it('returns false when one side is not an object', () => {
    expect(shallow({ a: 1 } as never, null as never)).toBe(false);
  });
});
