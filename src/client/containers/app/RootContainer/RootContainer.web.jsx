import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as React from 'react';
import { withRouter } from "react-router-dom";

import { add_USING_REDUX_THUNK } from '@actions/someAction';
import Root from '@components/app/Root/Root.web';

class RootContainer extends React.Component {
  constructor() {
    super();
    this.handleClickAdd = this.handleClickAdd.bind(this);
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
    this.props.dispatch(add_USING_REDUX_THUNK());
  }

  render() {
    return (
      <Root 
        count={this.props.count}
        handleClickAdd={this.handleClickAdd}/>
    );
  }
}

RootContainer.propTypes = {
  
};

const makeMapStateToProps = () => {
  return (state, props) => {
    return {
      count: state.some.count,
    };
  };
};

export default compose(
  withRouter,
  connect(makeMapStateToProps),
)(RootContainer);
