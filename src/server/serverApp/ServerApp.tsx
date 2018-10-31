import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import * as React from "react";
import { Provider as ReduxProvider } from 'react-redux';
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { Store } from 'redux';

import Log from '@server/modules/Log';
import RootContainerFallback from '@containers/app/RootContainer/RootContainer.web';

const ServerApp: React.SFC<ServerAppProps> = ({
  apolloClient,
  requestUrl,
  rootContainerPath,
  reduxStore,
}) => {
  Log.info('<App/> with rootContainerPath: %s', rootContainerPath);

  let RootContainerComponent;
  try {
    RootContainerComponent = rootContainerPath
      ? require(rootContainerPath).default
      : RootContainerFallback;
  } catch (err) {
    Log.error('<App/> cannot find rootContainer at: %s', rootContainerPath, err);
    return <div>RootContainer not found</div>;
  }

  return (
    <ReduxProvider store={reduxStore}>
      <ApolloProvider client={apolloClient}>
        <StaticRouter
          context={{}}
          location={requestUrl}
        >
          <RootContainerComponent/>
        </StaticRouter>
      </ApolloProvider>
    </ReduxProvider>
  );
};

interface ServerAppProps {
  apolloClient: ApolloClient<any>,
  requestUrl: string,
  rootContainerPath: string,
  reduxStore,
}

export default ServerApp;
