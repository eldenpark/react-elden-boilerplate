import * as React from "react";
import { Provider as ReduxProvider } from 'react-redux';
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { Store } from 'redux';

import Log from '@server/modules/Log';
import RootContainerFallback from '@containers/app/RootContainer/RootContainer.web';

const ServerApp: React.SFC<ServerAppProps> = ({
  requestUrl,
  rootContainerPath,
  store,
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
  requestUrl: string,
  rootContainerPath: string,
  store,
}

export default ServerApp;
