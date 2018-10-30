import { compose } from 'redux';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ConnectedReduxProps } from '@universal/state/configureStore';

class GraphQLContainer extends React.Component<GraphQLContainerProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        123
      </div>
    );
  }
}

const makeMapStateToProps = () => {
  return (state, props) => {
  };
};

interface GraphQLContainerProps extends ConnectedReduxProps, RouteComponentProps {
}

export default compose(
  connect(makeMapStateToProps),
)(GraphQLContainer);
