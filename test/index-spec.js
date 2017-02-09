'use strict';

import { expect } from "chai";
import flatCombineReducers from "../src/index.js";

describe ('flatCombineReducers', () => {
  it('should produce a reducer which take any state and return the same state when no reducer is passed in', () => {
    const reducer = flatCombineReducers();

    expect(reducer({ A: 1, B: 2 })).to.deep.equal({ A: 1, B: 2 });
  });

  it('should produce a reducer which take no params and return a empty object when no reducer is passed in', () => {
    const reducer = flatCombineReducers();

    expect(reducer()).to.deep.equal({});
  });

  it('should combine multiple reducers into one', () => {
    const reducer = flatCombineReducers(
      (prevState, action) => ({A: prevState.A + action.value}),
      (prevState, action) => ({B: prevState.B * action.value}),
    );

    expect(reducer({ A: 1, B: 2 }, { value: 3 })).to.deep.equal({ A: 4, B: 6 });
  });

  it('should support separated initial state values as default parameters', () => {
    const reducer = flatCombineReducers(
      (prevState = { A: 1 }, action) => ({A: prevState.A + action.value}),
      (prevState = { B: 2 }, action) => ({B: prevState.B * action.value})
    );

    expect(reducer(undefined, { value: 3 })).to.deep.equal({ A: 4, B: 6 });
  });

  it('should assign the states from right to left', () => {
    const reducer = flatCombineReducers(
      (prevState = { A: 1 }, action) => ({A: prevState.A + action.value}),
      (prevState = { A: 2 }, action) => ({A: prevState.A * action.value}),
    );

    expect(reducer(undefined, { value: 3 })).to.deep.equal({ A: 6 });
  });

  it('should keep the prevState when setting the option `keepPrevState` to true(default)', () => {
    const reducer = flatCombineReducers(
      (prevState, action) => ({A: prevState.A + action.value})
    );

    expect(reducer({ A: 1, B: 2 }, { value: 3 })).to.deep.equal({ A: 4, B: 2 });
  });

  it('should not keep the prevState when setting the option `keepPrevState` to false', () => {
    const reducer = flatCombineReducers(
      (prevState, action) => ({A: prevState.A + action.value}),
      { keepPrevState: false }
    );

    expect(reducer({ A: 1, B: 2 }, { value: 3 })).to.deep.equal({ A: 4 });
  });
});
