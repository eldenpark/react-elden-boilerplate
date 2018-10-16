import * as NodeLogger from '@server/externalModules/NodeLogger';

import * as paths from '@server/paths';

const nodeLogger = NodeLogger.createLogger({
  logPath: paths.logs,
});

export default nodeLogger;

export const gulpLog = nodeLogger.with({
  color: 'gray',
  tag: 'gulp',
});

export const httpLog = nodeLogger.with({
  color: 'black',
  tag: 'http',
});

export const launchLog = nodeLogger.with({
  color: 'gray',
  tag: 'launch',
});

export const webpackLog = nodeLogger.with({
  color: 'magentaBright',
  tag: 'webpack'
});

export const stateLog = nodeLogger.with({
  color: 'yellowBright',
  tag: 'server-state',
});

export const expressLog = nodeLogger.with({
  color: 'blue',
  tag: 'express',
});
