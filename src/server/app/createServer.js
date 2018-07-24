const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const serverConfig = require('./serverConfig');

const app = express();
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3001;

module.exports = function createServer({
  extend,
}) {
  this.now = Date();
  console.log('[info] NOD_ENV at server: %s', env)
  console.log('[info] App is launching. Loading the server configuration at server time:', now);

  app.use(morgan('combined'));

  app.use('/assets', (req, res) => {
    const file = path.join(serverConfig.assetPath, req.url);
    res.sendFile(file);
  });

  extend.call(this, app);

  app.listen(port, () => {
    console.log(`[info] Server is listening on port: %s`, port);
  });

  return app;
};
