import fs from 'fs';

import LaunchStatus from './constants/LaunchStatus';

export function calculateNextStateWhileSearchingForBundles(entrypoints) {
  try {
    const entrypointBundles = [];
    Object.keys(entrypoints)
      .map((entrypoint) => {
        entrypoints[entrypoint].assets.map((asset) => {
          asset.endsWith('js') && entrypointBundles.push(asset);
        });
      });

    return {
      entrypointBundles,
      launchStatus: LaunchStatus.LAUNCH_SUCCESS,
    };
  } catch (err) {
    console.error(err);
    return {
      launchStatus: LaunchStatus.ERROR_BUNDLE_NOT_FOUND,
    };
  }
};
