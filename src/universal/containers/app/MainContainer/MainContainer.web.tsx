import { compose } from 'redux';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ConnectedReduxProps } from '@universal/state/configureStore';
import { add, fetchFoo } from '@actions/someAction';
import Main from '@components/app/Main/Main.web';

class MainContainer extends React.Component<MainContainerProps> {
  constructor(props) {
    super(props);
    this.handleClickAdd = this.handleClickAdd.bind(this);
  }

  handleClickAdd(e, data) {
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch(add());
  }

  render() {
    return (
      <Main
        count={this.props.count}
        handleClickAdd={this.handleClickAdd}
        number={this.props.number}
      />
    );
  }
}

const makeMapStateToProps = () => {
  return (state, props) => {
    return {
      count: state.foo.count,
      number: state.foo.number,
    };
  };
};

interface MainContainerProps extends ConnectedReduxProps, RouteComponentProps {
  count: number,
  number: number,
}

export default compose(
  connect(makeMapStateToProps),
)(MainContainer);
