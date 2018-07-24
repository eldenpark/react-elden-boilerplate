import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as React from 'react';
import { withRouter } from "react-router-dom";

import Root from '@components/app/Root/Root.web';

class RootContainer extends React.Component {
  constructor() {
    super();
  }

  componentDidCatch(err, info) {
    Logger.error(err, info);
  }

  componentDidMount() {
    console.log('Root did mount');
  }

  render() {
    return (
      <Root/>
    );
  }
}

RootContainer.propTypes = {
};

const makeMapStateToProps = () => {
  return (state, props) => {
    return {
    };
  };
};

export default compose(
  withRouter,
  connect(makeMapStateToProps),
)(RootContainer);
