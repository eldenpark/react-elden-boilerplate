import express from "express";
import fs from 'fs';
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";

import Layout from "../client/Layout.web";

const DIST_BUNDLE_PATH = path.resolve(__dirname, '../../dist/bundle');
const INDEX_PATH = path.resolve(__dirname, '../../dist/bundle/raw_index.html');

const PORT = 5001;

const SERVER_STATUS = {
  LAUNCH_ERROR: 'LAUNCH_ERROR',
  LAUNCH_SUCCESS: 'LAUNCH_SUCCESS',
  NOT_LAUNCHED: 'NOT_LAUNCHED',
};

const app = express();
const state = {
  index: undefined,
  status: SERVER_STATUS.NOT_LAUNCHED,
};

try {
  state.index = fs.readFileSync(INDEX_PATH).toString();
  state.status = SERVER_STATUS.LAUNCH_SUCCESS;

  const element = <Layout/>;
  const elementInString = renderToString(element);
  state.index = state.index.replace('{{element}}', elementInString);
} catch (err) {
  console.error('error in finding index.html %s', err);
  state.status = SERVER_STATUS.LAUNCH_ERROR;
}

app.use(htmlLogger);
app.use(express.static(DIST_BUNDLE_PATH));

app.get("/*", (req, res) => {
  if (state.status !== SERVER_STATUS.LAUNCH_SUCCESS) {
    res.writeHead(404);
    res.end('server is not launched: %s', state.status);
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(state.index);
  }
});

app.listen(PORT, () => {
  console.info('Server listening: %s', PORT);
});

function htmlLogger(req, res, next) {
  console.info('%s - url: %s, user agent: %s', new Date(), req.url, req.get('User-Agent'));
  next();
}
