module.exports = {
  "env": {
    "development": {
      "plugins": [
        "react-hot-loader/babel",
        [ 
          "babel-plugin-styled-components", 
          {
            "displayName": true,
            "ssr": true,
          }
        ]
      ]
    }
  },
  "plugins": [
    [
      "module-resolver", {
        "alias": {
          "@actions": "./src/client/state/actions",
          "@apis": "./src/client/apis",
          "@app-assets": "./src/client/app-assets",
          "@client": "./src/client",
          "@components": "./src/client/components",
          "@config": "./src/client/config",
          "@constants": "./src/client/constants",
          "@containers": "./src/client/containers",
          "@hocs": "./src/client/hocs",
          "@models": "./src/client/models",
          "@modules": "./src/client/modules",
          "@selectors": "./src/client/state/selectors",
          "@server": "./src/server",
          "@utils": "./src/client/utils",
        },
      }
    ]
  ],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    [ 
      "@babel/preset-stage-2", { 
        "decoratorsLegacy": true 
      }
    ],
  ],
};
