const LaunchStatus = require('@server/constants/LaunchStatus');

exports.calculateNextStateWhileSearchingForBundles = function (entrypoints) {
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

exports.getProperRequireCache = function () {
  return Object.keys(require.cache)
    .filter((key) => {
      return !key.includes('/node_modules/');
    });
};
