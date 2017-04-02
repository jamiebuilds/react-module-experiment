// @flow
import React from 'react';
import Component from './lib';

module Counter {
  type props = {
    step: number
  };

  type state = {
    count: number
  };

  let getInitialState = ({props}) => ({
    count: 0
  });

  let onIncrement = ({props, state}) => ({
    ...state,
    count: state.count + props.step
  });

  let onDecrement = ({props, state}) => ({
    ...state,
    count: state.count - props.step
  });

  let render = ({props, state, updater}) =>
    <div>
      <button onClick={updater(onDecrement)}>Decrement</button>
      <span>Count: {state.count}</span>
      <button onClick={updater(onIncrement)}>Increment</button>
    </div>;
}

export default Component(Counter);
