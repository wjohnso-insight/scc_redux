type Func<T extends any[], R> = (...a: T) => R

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for the
 * resulting composite function.
 *
 * @param funcs The functions to compose.
 * @returns A function obtained by composing the argument functions from right
 *   to left. For example, `compose(f, g, h)` is identical to doing
 *   `(...args) => f(g(h(...args)))`.
 */
export default function compose(): <R>(a: R) => R

export default function compose<F extends Function>(f: F): F

/* two functions */
export default function compose<A, T extends any[], R>(
  f1: (a: A) => R,
  f2: Func<T, A>
): Func<T, R>

/* three functions */
export default function compose<A, B, T extends any[], R>(
  f1: (b: B) => R,
  f2: (a: A) => B,
  f3: Func<T, A>
): Func<T, R>

/* four functions */
export default function compose<A, B, C, T extends any[], R>(
  f1: (c: C) => R,
  f2: (b: B) => C,
  f3: (a: A) => B,
  f4: Func<T, A>
): Func<T, R>

/* rest */
export default function compose<R>(
  f1: (a: any) => R,
  ...funcs: Function[]
): (...args: any[]) => R

export default function compose<R>(...funcs: Function[]): (...args: any[]) => R

export default function compose(...funcs: Function[]) {
  // infer the argument type so it is usable in inference down the line
  if (funcs.length === 0) {
    return <T>(arg: T) => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args))
  )
}

/*
  #SCC
  How are there more than one functions with the same name? - Seth Broweleit https://twitter.com/getsetbro/status/1549592532727828480
  "That's TS method overloading. One actual code function, many type signatures with different forms of the arguments." - Mark Erikson https://twitter.com/acemarke/status/1549622836926431232

  So compose() seems to be a utility function that allows you to do this compose(f, g, h) when you would otherwise have needed to this (...args) => f(g(h(...args)))

  In the test file you can see this example:

  const a = (next) => (x) => next(x + 'a');
  const b = (next) => (x) => next(x + 'b');
  const c = (next) => (x) => next(x + 'c');
  const final = (x) => x;
  compose(a, b, c)(final)(''); //'abc'

  When TS compiles this file it turns it into this JavaSript:
  function compose(...funcs) {
    if (funcs.length === 0) { return (arg) => arg; }
    if (funcs.length === 1) { return funcs[0]; }
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
  }

  Which is just the last function in the file. So I still am not sure what the other 7 are for. Just documentation?
   - Seth Broweleit
*/
