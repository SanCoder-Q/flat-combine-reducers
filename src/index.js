export default function reduceReducers(...reducers) {
  return (prevState, action) => {
    let newState = reducers
      .reduce((state, reducer) => Object.assign({}, state, reducer(prevState, action)), {});
    return Object.assign({}, prevState, newState);
  }
}
