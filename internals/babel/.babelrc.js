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
          "@actions": "./src/universal/state/actions",
          "@apis": "./src/universal/apis",
          "@app-assets": "./src/universal/app-assets",
          "@client": "./src/client",
          "@components": "./src/universal/components",
          "@config": "./src/universal/config",
          "@constants": "./src/universal/constants",
          "@containers": "./src/universal/containers",
          "@hocs": "./src/universal/hocs",
          "@models": "./src/universal/models",
          "@modules": "./src/universal/modules",
          "@selectors": "./src/universal/state/selectors",
          "@server": "./src/server",
          "@universal": "./src/universal",
          "@utils": "./src/universal/utils",
        },
      }
    ],
    // Stage 2
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",

    // Stage 3
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { "loose": false }],
    "@babel/plugin-proposal-json-strings"
  ],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
};
