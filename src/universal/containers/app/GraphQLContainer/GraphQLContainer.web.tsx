import { compose } from 'redux';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ConnectedReduxProps } from '@universal/state/configureStore';

import { Query } from "react-apollo";
import gql from "graphql-tag";

const sampleGQLWhichShouldNotChange = gql`
query getDeal ($id: Long!) {
  deal(id: $id) {
    id
    title
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
        <Query 
          variables={{
            id: 557802,
          }}
          query={sampleGQLWhichShouldNotChange}
        >
          {({ loading, error, data}) => {
            return (
              <div>
                <div>
                  <span>id: </span>
                  <span>{data.deal && data.deal.id}</span>
                </div>
                <div>
                  <span>title: </span>
                  <span>{data.deal && data.deal.title}</span>
                </div>
              </div>
            );
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
