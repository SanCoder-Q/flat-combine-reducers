const defaultOptions = {
  keepPrevState: true
};

export default function reduceReducers() {
  let args = [...arguments],
      options = defaultOptions;

  if (typeof args[args.length - 1] !== 'function') {
    options = Object.assign({}, options, args.pop());
  }

  return (prevState, action) => {
    let newState = args
      .reduce((state, reducer) => Object.assign({}, state, reducer(prevState, action)), {});
    return options.keepPrevState ? Object.assign({}, prevState, newState) : newState;
  }
}
