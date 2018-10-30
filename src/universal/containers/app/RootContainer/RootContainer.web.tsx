import { compose } from 'redux';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ConnectedReduxProps } from '@universal/state/configureStore';
import { add, fetchFoo } from '@actions/someAction';
import Root from '@components/app/Root/Root.web';

class RootContainer extends React.Component<RootContainerProps> {
  static prefetch({
    url,
  }) {
    return fetchFoo(url);
  }

  constructor(props) {
    super(props);
    this.handleClickNavigate = this.handleClickNavigate.bind(this);
  }

  componentDidCatch(err, info) {
    console.error(err, info);
  }

  componentDidMount() {
    console.log('Root did mount');
  }

  handleClickNavigate(e, path) {
    e.preventDefault();
    e.stopPropagation();
    this.props.history.push(path);
  }

  render() {
    return (
      <Root
        handleClickNavigate={this.handleClickNavigate}
        pathname={this.props.location.pathname}
      />
    );
  }
}

interface RootContainerProps extends ConnectedReduxProps, RouteComponentProps {
}

export default compose<any>(
  hot(module),
  withRouter,
  connect(),
)(RootContainer);
