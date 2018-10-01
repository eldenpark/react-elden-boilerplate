const appConfig = {
  logNames: {
    action: true,
    axios: true,
    graph: false,
    navigation: false,
  },
  ports: {
    local: 5001,
    prod: 5001,
  },
  reduxStateKey: '__PRELOAED_STATE__',
};

export default appConfig;
