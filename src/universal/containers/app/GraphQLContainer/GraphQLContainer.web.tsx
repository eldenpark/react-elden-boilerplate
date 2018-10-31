import { compose } from 'redux';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ConnectedReduxProps } from '@universal/state/configureStore';

import { Query } from "react-apollo";
import gql from "graphql-tag";

const GQL1 = gql`
{
  rates(currency: "USD") {
    currency
    rate
  }
}
`;

class GraphQLContainer extends React.Component<GraphQLContainerProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        query
        <Query query={GQL1}>
          {({ loading, error, data}) => {
            console.log(12322, loading, error, data);
            return <div>1</div>
          }}
        </Query>
      </div>
    );
  }
}

const makeMapStateToProps = () => {
  return (state, props) => {
    return {
    }
  };
};

interface GraphQLContainerProps extends ConnectedReduxProps, RouteComponentProps {
}

export default compose(
  connect(makeMapStateToProps),
)(GraphQLContainer);
