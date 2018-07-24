const express = require('express');
const fs = require('fs');

const createServer = require('./createServer');
const pJson = require('../../../package.json');
const serverConfig = require('./serverConfig');

const files = {
  gitFetchHead: undefined,
  index: undefined,
};

(function checkIfFilesExist() {
  try {
    files.gitFetchHead = fs.readFileSync(serverConfig.gitFetchHeadPath).toString(),
    files.index = fs.readFileSync(serverConfig.indexPath);
  } catch (err) {
    console.error('Some files do not exist');
  }
})();

function extend(app) {
  app.get('/debug', (req, res, next) => {
    res.send({
      app_start_time: this.now,
      app_version: pJson.version,
      git_fetch_head: files.gitFetchHead,
      node_env: process.env.NODE_ENV,
    });
  });

  app.use(express.static(serverConfig.distPath));

  app.use('*', (req, res, next) => {
    if (files.index) {
      res.set('content-type','text/html')
      .send(files.index);
    } else {
      res.send('App is not succesfully deployed. Check out the log');
    }
  });
}

module.exports = () => createServer({
  extend,
});
