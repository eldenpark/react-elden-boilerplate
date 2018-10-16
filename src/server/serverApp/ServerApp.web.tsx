import * as React from "react";
import { Provider as ReduxProvider } from 'react-redux';
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { Store } from 'redux';

import Log from '@server/modules/Log';

const ServerApp: React.SFC<ServerAppProps> = ({
  localServer,
  requestUrl,
  rootContainerPath = '',
  store,
}) => {
  Log.info('<App/> with rootContainerPath: %s', rootContainerPath);

  let RootContainerComponent;
  try {
    RootContainerComponent = localServer
      ? require(rootContainerPath).default
      : require('@containers/app/RootContainer/RootContainer.web').default;
  } catch (err) {
    Log.error('<App/> cannot find rootContainer at: %s', rootContainerPath, err);
    return <div>RootContainer not found</div>;
  }

  return (
    <ReduxProvider store={store}>
      <StaticRouter
        context={{}}
        location={requestUrl}
      >
        <RootContainerComponent/>
      </StaticRouter>
    </ReduxProvider>
  );
};

interface ServerAppProps {
  localServer: boolean,
  requestUrl: string,
  rootContainerPath: string,
  store,
}

export default ServerApp;
