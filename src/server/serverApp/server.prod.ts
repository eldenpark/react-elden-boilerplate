import express from "express";
import * as fs from 'fs';
import * as path from "path";
import { Provider as ReduxProvider } from 'react-redux';
import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';

import { calculateNextStateWhileSearchingForBundles } from '@server/serverApp/serverUtils';
import createExpress from '@server/serverApp/createExpress';
import * as LaunchStatus from '@server/constants/LaunchStatus';
import * as paths from '@server/paths';
import { webpackLog } from '@server/modules/Log';

export default createExpress({
  enhance: (app, state) => {
    const buildJson = fs.readFileSync(`${paths.distBundle}/build.json`, 'utf-8');
    const build = JSON.parse(buildJson);
    webpackLog.info('enhance(), build at distBudle %j', build);

    state.update(calculateNextStateWhileSearchingForBundles(build.entrypoints));
  
    app.use(express.static(paths.distBundle));
  },
});
