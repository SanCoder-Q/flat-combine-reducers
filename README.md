# flat-combine-reducers

[![build status](https://travis-ci.org/SanCoder-Q/flat-combine-reducers.svg?branch=master)](https://travis-ci.org/SanCoder-Q/flat-combine-reducers)
[![npm](https://img.shields.io/npm/v/flat-combine-reducers.svg)](https://www.npmjs.com/package/flat-combine-reducers)
[![npm](https://img.shields.io/npm/dt/flat-combine-reducers.svg)](https://www.npmjs.com/package/flat-combine-reducers)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/336c101353bf45b5b32f5672fdf88553)](https://www.codacy.com/app/sancoder-q/flat-combine-reducers?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SanCoder-Q/flat-combine-reducers&amp;utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/SanCoder-Q/flat-combine-reducers/branch/master/graph/badge.svg)](https://codecov.io/gh/SanCoder-Q/flat-combine-reducers)

[![Dependency Status](https://david-dm.org/sancoder-q/flat-combine-reducers.svg)](https://david-dm.org/sancoder-q/flat-combine-reducers)
[![devDependency Status](https://david-dm.org/sancoder-q/flat-combine-reducers/dev-status.svg)](https://david-dm.org/sancoder-q/flat-combine-reducers#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/SanCoder-Q/flat-combine-reducers.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Turns multiple reducer functions, into a single reducer function, with the support of declaring the initial states as default parameters.

It will call all the child reducers, and gather their results into a single state object by [`assign`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) the result objects together from left to right.
The reason for the name is it flatten the `state` of using the [`combineReducers`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) in *redux*.

```
npm install --save flat-combine-reducers
```
## Why
To prevent the reducer growing too large, [Redux](http://redux.js.org/) provides a function called [`combineReducers`](http://redux.js.org/docs/recipes/reducers/UsingCombineReducers.html) to let us structure the reducer. However, it will structure not only the reducer itself but also your state. Each state that managed by distinct reducer will be separated into a deep object with a specified key.
Moreover, the combining logic should ideally focus on the combining only when creating the store. And each reducer should manage their own states as the default values of the first parameter. `flatCombineReducers` allow us to give the initial state as default parameters. Thus, it could put the responsibility of each reducer in order.

## Options (Optional)
You can pass an object to its last parameter to control the flatCombineReducers' behavior.

```js
const options = { mergePrevState: false }
flatCombineReducers(reducerA, reducerB, options)
```

| OptionName  | DefaultValue | Description |
| ---  | --- | --- |
| [`mergePrevState`](#mergeprevstate)  | `true` | If true, the combined reducer will [`assign`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) the returned state with the previous state. |

### mergePrevState
With its help, you can simplify your reducer logic and avoid the boilerplate likes [`Object.assign({}, state, PROCESSED_STATE)`](http://redux.js.org/docs/basics/Reducers.html)

From:

```js
function reducerA(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPE_A:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      });
    default:
      return state;
  }
}
```

To:

```js
function reducerA(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPE_A:
      return {
        visibilityFilter: action.filter
      };
  }
}
```


## Examples

### Return identity reducer if parameter is empty
```js
const reducer = flatCombineReducers();

expect(reducer({ A: 1, B: 2 }, "indifferentAction")).to.deep.equal({ A: 1, B: 2 });
expect(reducer({ A: 1, B: 2 })).to.deep.equal({ A: 1, B: 2 });
expect(reducer()).to.deep.equal({});
```

Note. You can change it by specifying the option `mergePrevState`.

### Combines multiple reducers into one
```js
const reducer = flatCombineReducers(
  (prevState, action) => ({A: prevState.A + action.value}),
  (prevState, action) => ({B: prevState.B * action.value})
);

expect(reducer({ A: 1, B: 2 }, { value: 3 })).to.deep.equal({ A: 4, B: 6 });
```

### Supports separated initial state values as default parameters
```js
const reducer = flatCombineReducers(
  (prevState = { A: 1 }, action) => ({A: prevState.A + action.value}),
  (prevState = { B: 2 }, action) => ({B: prevState.B * action.value})
);

expect(reducer(undefined, { value: 3 })).to.deep.equal({ A: 4, B: 6 });
```

### Assigns the states from right to left
```js
const reducer = flatCombineReducers(
  (prevState = { A: 1 }, action) => ({...prevState, A: prevState.A + action.value}),
  (prevState = { A: 2 }, action) => ({...prevState, A: prevState.A * action.value})
);

expect(reducer(undefined, { value: 3 })).to.deep.equal({ A: 6 });
```

### Specify the option `mergePrevState` to control the behavior
```js
const reducer = flatCombineReducers(
  (prevState, action) => ({A: prevState.A + action.value}),
  { mergePrevState: false }
);

expect(reducer({ A: 1, B: 2 }, { value: 3 })).to.deep.equal({ A: 4 });
```
