import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import * as React from 'react';

import RootContainer from '@containers/app/RootContainer/RootContainer.web';

const ClientApp: React.SFC<ClientAppProps> = ({
  apolloClient,
  reduxStore,
}) => {
  return (
    <ReduxProvider store={reduxStore}>
      <BrowserRouter>
        <ApolloProvider client={apolloClient}>
          <RootContainer/>
        </ApolloProvider>
      </BrowserRouter>
    </ReduxProvider>
  );
};

interface ClientAppProps {
  apolloClient,
  reduxStore,
}

export default ClientApp;
