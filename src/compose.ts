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
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
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
  How are there more than one functions with the same name?
  "That's TS method overloading. One actual code function, many type signatures with different forms of the arguments."
   - Mark Erikson https://twitter.com/acemarke/status/1549622836926431232

  According to Wikipedia,
  Function overloading or method overloading is the ability to create multiple functions of the same name with different implementations

  Do's and Don'ts for overloads:
  https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#overloads-and-callbacks

  When this code is compiled to JavaScript, the concrete function alone will be visible.
  When TS compiles this file it turns it into this JavaSript:
  function compose(...funcs) {
    if (funcs.length === 0) { return (arg) => arg; }
    if (funcs.length === 1) { return funcs[0]; }
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
  }

  So compose() seems to be a utility function that allows you to do this compose(f, g, h)
  when you would otherwise have needed to this (...args) => f(g(h(...args)))

  From https://github.com/reduxjs/redux/blob/master/docs/api/compose.md:
  Composes functions from right to left.

  This is a functional programming utility, and is included in Redux as a convenience.
  You might want to use it to apply several store enhancers in a row.

  Arguments (arguments): The functions to compose. Each function is expected to accept a single parameter.
  Its return value will be provided as an argument to the function standing to the left, and so on.
  The exception is the right-most argument which can accept multiple parameters,
  as it will provide the signature for the resulting composed function.
  Returns (Function): The final function obtained by composing the given functions from right to left.

  All compose does is let you write deeply nested function transformations without the rightward drift of the code.

  I understand what the compose function does but I am still not sure how to use the overloading.
  - Seth Broweleit
*/
