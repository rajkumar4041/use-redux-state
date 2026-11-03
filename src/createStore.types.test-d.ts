/**
 * Compile-time type-inference checks for createStore. Not executed — validated
 * by `npm run typecheck` (tsc --noEmit). The @ts-expect-error lines fail the
 * build if the following line does NOT error, pinning inference.
 */
import { createStore } from './createStore';

const s = createStore('t', { count: 0, name: 'x' });

// whole-state type is inferred from initialState
const v: { count: number; name: string } = s.get();

// selector input and result are inferred
const n: string = s.useSelector((st) => st.name);

// @ts-expect-error selector field does not exist
s.useSelector((st) => st.missing);

// @ts-expect-error wrong value type passed to set
s.set(123);

// primitive store infers S = number
const p = createStore('p', 0);
const pv: number = p.get();

void v;
void n;
void pv;
