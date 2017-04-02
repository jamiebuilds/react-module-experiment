// @flow

import React from 'react';

type GetInitialState<Props, State> = ({ props: Props }) => $Supertype<State>;

type WillMount<Props, State> = ({ props: Props, state: State }) => mixed;
type DidMount<Props, State> = ({ props: Props, state: State }) => mixed;

type WillReceiveProps<Props, State> = ({ nextProps: Props, props: Props, state: State }) => mixed;
type ShouldUpdate<Props, State> = ({ props: Props, state: State }) => boolean;
type WillUpdate<Props, State> = ({ props: Props, state: State }) => mixed;
type DidUpdate<Props, State> = ({ props: Props, state: State }) => mixed;

type WillUnmount<Props, State> = ({ props: Props, state: State }) => mixed;

type Updater<Props, State> = (method: ({ props: Props, state: State }) => State) => (...args: any) => void;

type Render<Props, State> = ({ props: Props, state: State, updater: Updater<Props, State> }) => React.Element<*>;

type Options<Props, State> = {
  getInitialState?: GetInitialState<Props, State>,

  willMount?: WillMount<Props, State>,
  didMount?: DidMount<Props, State>,

  willReceiveProps?: WillReceiveProps<Props, State>,
  shouldUpdate?: ShouldUpdate<Props, State>,
  willUpdate?: WillUpdate<Props, State>,
  didUpdate?: DidUpdate<Props, State>,

  willUnmount?: WillUnmount<Props, State>,

  render: Render<Props, State>,

  props: Props,
  state: State,
};

function Component<Props, State>(opts: Options<Props, State>) {
  let {
    getInitialState,
    willMount,
    didMount,
    willReceiveProps,
    shouldUpdate,
    willUpdate,
    didUpdate,
    willUnmount,
    render,
  } = opts;

  return class WrappedComponent extends React.Component {
    props: Props;
    state: State;

    constructor(props: Props) {
      super(props);

      if (getInitialState) {
        this.state = getInitialState.call(null, {
          props: this.props
        });
      }
    }

    componentWillMount() {
      willMount && willMount.call(null, {
        props: this.props,
        state: this.state,
      });
    }

    componentDidMount() {
      didMount && didMount.call(null, {
        props: this.props,
        state: this.state,
      });
    }

    componentWillReceiveProps(nextProps: Props) {
      willReceiveProps && willReceiveProps.call(null, {
        nextProps,
        props: this.props,
        state: this.state,
      });
    }

    shouldComponentUpdate() {
      return shouldUpdate ? shouldUpdate.call(null, {
        props: this.props,
        state: this.state,
      }) : true;
    }

    componentWillUpdate() {
      willUpdate && willUpdate.call(null, {
        props: this.props,
        state: this.state,
      });
    }

    componentDidUpdate() {
      didUpdate && didUpdate.call(null, {
        props: this.props,
        state: this.state,
      });
    }

    componentWillUnmount() {
      willUnmount && willUnmount.call(null, {
        props: this.props,
        state: this.state,
      });
    }

    _updater: Updater<Props, State> = method => (...args) => {
      this.setState((prevState: State) => method({
        props: this.props,
        state: prevState
      }, ...args));
    };

    render() {
      return render.call(null, {
        props: this.props,
        state: this.state,
        updater: this._updater
      });
    }
  }
};

export default Component;
