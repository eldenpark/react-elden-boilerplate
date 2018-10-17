import * as fs from 'fs';

import { calculateNextStateWhileSearchingForBundles } from '@server/utils/serverUtils';
import createExpress from '@server/serverApp/createExpress';
import * as LaunchStatus from '@server/constants/LaunchStatus';
import * as paths from '@server/paths';
import { webpackLog } from '@server/modules/Log';

export default createExpress({
  enhance: (app, state) => {
    const bundleBuildJson = fs.readFileSync(`${paths.distPublicBundle}/build.json`, 'utf-8');
    const bundleBuild = JSON.parse(bundleBuildJson);
    webpackLog.info('enhance(), build at distBudle %j', bundleBuild);

    state.update(calculateNextStateWhileSearchingForBundles(bundleBuild.entrypoints));
  },
});
