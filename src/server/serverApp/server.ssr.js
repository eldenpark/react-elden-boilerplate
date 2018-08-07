import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";

import serverConfig from './serverConfig';

const PORT = 3101;

const app = express();

app.use(express.static(serverConfig.distPath));

app.get('/*', (req, res) => {
  const jsx = <RootContainer/>;
  const reactDom = renderToString(jsx);

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(htmlTemplate(reactDom));
});

app.listen(PORT, () => {
  console.log('Server is launching in port: %s', PORT);
});

function htmlTemplate(reactDom) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>React SSR</title>
    </head>
    <body>
      <div id="app">${reactDom}</div>
      <script src=""></script>
    </body>
    </html>
  `;
}

class RootContainer extends React.Component {
  render() {
    return (
      <div>
        root container
      </div>
    );
  }
}
