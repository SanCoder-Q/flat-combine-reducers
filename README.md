# flat-combine-reducers
---

[![build status](https://travis-ci.org/SanCoder-Q/flat-combine-reducers.svg?branch=master)](https://travis-ci.org/SanCoder-Q/flat-combine-reducers)

Turns multiple reducer functions, into a single reducer function, with support of declaring the initial states as default parameters.

It will call all the child reducers, and gather their results into a single state object by [`assign`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) the result objects together from left to right.
The reason of the name is it flaten the `state` of using the [`combineReducers`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) in *redux*.

```
npm install --save flat-combine-reducers
```

## Example

### Combines multiple reducers into one
```js
const reducer = flatCombineReducers(
  (prevState, action) => ({...prevState, A: prevState.A + action.value}),
  (prevState, action) => ({...prevState, B: prevState.B * action.value}),
);

expect(reducer({ A: 1, B: 2 }, { value: 3 })).to.deep.equal({ A: 4, B: 6 });
```

### Supports separated initial state values as default parameters
```js
const reducer = flatCombineReducers(
  (prevState = { A: 1 }, action) => ({...prevState, A: prevState.A + action.value}),
  (prevState = { B: 2 }, action) => ({...prevState, B: prevState.B * action.value}),
);

expect(reducer(undefined, { value: 3 })).to.deep.equal({ A: 4, B: 6 });
```

### Assign the states from right to left
```js
const reducer = flatCombineReducers(
  (prevState = { A: 1 }, action) => ({...prevState, A: prevState.A + action.value}),
  (prevState = { A: 2 }, action) => ({...prevState, A: prevState.A * action.value}),
);

expect(reducer(undefined, { value: 3 })).to.deep.equal({ A: 6 });
```
