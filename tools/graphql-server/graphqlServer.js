const express = require('express');
const cors = require('cors');

const PORT = 5010;

const app = express();
app.use(cors());
app.post('/graphql', (req, res, next) => {
  (function serveGraphQLResponseStaticDummy() {
    res.send({
      data:{
        deal:{
          id: 1,
          title: 'someTitle',
          '__typename': 'Deal',
        },
      },
      errors: null,
    });
  })();
});

app.use((req, res, next) => {
  res.end('URL does not match our API. Please check.');
});

app.listen(PORT, (err) => {
  console.info(`graphql server listening on ${PORT}`);
});
