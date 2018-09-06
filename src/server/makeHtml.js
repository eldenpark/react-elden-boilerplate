export default function makeHtml({
  reactDom,
  reduxState,
  reduxStateKey = '',
  bundles,
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>React SSR</title>
    </head>
    <body>
      <div id="app-root">${reactDom}</div>
      <script>
        window.${reduxStateKey} = ${JSON.stringify(reduxState)};
      </script>
      ${createScripts(bundles)}
    </body>
    </html>
  `;
};

function createScripts(src = []) {
  return src.map((s) => `<script src="/${s}"></script>`)
    .join('');
}
