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
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    ["@babel/preset-stage-2", { "decoratorsLegacy": true }]
  ],
  "plugins": [
    [ 
      "module-resolver", 
      {
        "alias": {
          "@client": "./dist/client",
          "@config": "./dist/client/config",
          "@constants": "./dist/client/constants",
          "@modules": "./dist/client/modules",
        },
      }
    ]
  ]
};
