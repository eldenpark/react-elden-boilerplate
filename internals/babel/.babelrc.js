module.exports = {
  "env": {
    "local": {
      "plugins": [
        "react-hot-loader/babel",
        [ "babel-plugin-styled-components", {
          "displayName": true
        }]
      ]
    }
  },
  "plugins": [
    [ 
      "module-resolver", 
      {
        "alias": {
          '@actions': "./dist/client/state/actions",
          "@client": "./dist/client",
          "@config": "./dist/client/config",
          "@constants": "./dist/client/constants",
          "@containers": "./dist/client/containers",
          "@components": "./dist/client/components",
          "@modules": "./dist/client/modules",
        },
      }
    ]
  ],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    ["@babel/preset-stage-2", { "decoratorsLegacy": true }]
  ],
};
