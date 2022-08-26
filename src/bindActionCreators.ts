import { Dispatch } from './types/store'
import {
  AnyAction,
  ActionCreator,
  ActionCreatorsMapObject
} from './types/actions'
import { kindOf } from './utils/kindOf'

function bindActionCreator<A extends AnyAction = AnyAction>(
  actionCreator: ActionCreator<A>,
  dispatch: Dispatch
) {
  /**
   * #SCC
   *
   * Spread operator for function args to combine them in an array is nice and I'm
   * making a mental note to use this. It's easy to forget all the cool things modern
   * JS can do.
   *
   * - Marko Skugor
   */
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args))
  }
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */

/**
 * #SCC
 * These overload signatures threw me for a loop. I didn't realize that this was possible,
 * and had to stare at it for a while to understand what was going on. Almost universally
 * at PGR we have the eslint import/export rule turned on which prevents multiple default
 * exports in a file. I'm still not totally sure I understand all the typescript generics
 * wizardry that's happening here.
 *
 * The eslint import/export rule for reference:
 * https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/export.md
 *
 * - Marko Skugor
*/
export default function bindActionCreators<A, C extends ActionCreator<A>>(
  actionCreator: C,
  dispatch: Dispatch
): C

export default function bindActionCreators<
  A extends ActionCreator<any>,
  B extends ActionCreator<any>
>(actionCreator: A, dispatch: Dispatch): B

export default function bindActionCreators<
  A,
  M extends ActionCreatorsMapObject<A>
>(actionCreators: M, dispatch: Dispatch): M
export default function bindActionCreators<
  M extends ActionCreatorsMapObject,
  N extends ActionCreatorsMapObject
>(actionCreators: M, dispatch: Dispatch): N

export default function bindActionCreators(
  actionCreators: ActionCreator<any> | ActionCreatorsMapObject,
  dispatch: Dispatch
) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    /**
     * #SCC
     *
     * Another thing we avoid on my project via eslint is throw errors in our JS code regardless of if
     * they're handled upstream or not. We use the functional/no-throw-statement rule to enforce this.
     *
     * Check here for reasoning:
     * https://github.com/eslint-functional/eslint-plugin-functional/blob/main/docs/rules/no-throw-statement.md
     *
     * - Marko Skugor
    */

    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${kindOf(
        actionCreators
      )}'. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const boundActionCreators: ActionCreatorsMapObject = {}

  /**
     * #SCC
     *
     * I've always learned to avoid using for...in for iterating over object keys because
     * it also iterates over all properties in that object's prototype chain. In this case there
     * is an if statement that checks we are actually getting an action creator like we expect, but
     * the safer way that I've always done this is to use Object.keys to get an array of all
     * keys on the object and then just use a map or forEach or something. The for...in syntax
     * is nice which is my guess as to why they're using it here, but I think there is something
     * to be said about how nice it is to use array functions that enforce object immutability like
     * map and reduce. It's also kind of interesting to see object mutation in the source code of a library
     * that enforces state immutability. Maybe we don't need to be so dogmatic about it?
     *
     * - Marko Skugor
    */
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
