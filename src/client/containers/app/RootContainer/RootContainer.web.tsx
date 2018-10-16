import { compose } from 'redux';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ConnectedReduxProps } from '@client/state/configureStore';
import { REDUX_THUNK__add } from '@actions/someAction';
import Root from '@components/app/Root/Root.web';

class RootContainer extends React.Component<RootContainerProps> {
  constructor(props) {
    super(props);
    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.handleClickNavigate = this.handleClickNavigate.bind(this);
  }

  componentDidCatch(err, info) {
    console.error(err, info);
  }

  componentDidMount() {
    console.log('Root did mount');
  }

  handleClickAdd(e, data) {
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch(REDUX_THUNK__add());
  }

  handleClickNavigate(e, path) {
    e.preventDefault();
    e.stopPropagation();
    this.props.history.push(path);
  }

  render() {
    return (
      <Root
        count={this.props.count}
        handleClickAdd={this.handleClickAdd}
        handleClickNavigate={this.handleClickNavigate}
        pathname={this.props.location.pathname}/>
    );
  }
}

const makeMapStateToProps = () => {
  return (state, props) => {
    return {
      count: state.some.count,
    };
  };
};

interface RootContainerProps extends ConnectedReduxProps, RouteComponentProps {
  count: number,
}

export default compose<any>(
  hot(module),
  withRouter,
  connect(makeMapStateToProps),
)(RootContainer);
