import * as express from 'express';
import { resolve } from 'path';
import { port, feedUrl, serverUrl } from './constants';
import { renderContent } from './static';
import { readRemoteJson } from './utils';

const app = express();

async function sendIndex(_: express.Request, res: express.Response) {
  const metadata = await readRemoteJson(feedUrl);
  const content = await renderContent(metadata.items);
  res.send(content);
}

app.get('/', sendIndex);

// We use this endpoint to "mock" a feed service response.
app.get('/pilets', (_, res) => {
  res.json({
    items: [
      {
        name: 'Pilet1',
        version: '1.0.0',
        hash: 'abcd1',
        link: `${serverUrl}/pilets/1.js`,
      },
      {
        name: 'Pilet2',
        version: '1.0.0',
        hash: 'abcd2',
        link: `${serverUrl}/pilets/2.js`,
      },
    ],
  });
});

// We use this endpoint to "mock" the JS response for the first pilet.
app.get('/pilets/1.js', (_, res) => {
  res.send(`exports.setup = function() { console.log('Hello!'); }`);
});

// We use this endpoint to "mock" the JS response for the second pilet.
app.get('/pilets/2.js', (_, res) => {
  res.send(`exports.setup = function(app) { app.registerPage('/pilet2', () => 'Hello from Pilet 2!'); }`);
});

// resolve any static content, such as /dynamic.js
app.get(
  '*',
  express.static(resolve(__dirname, '../dist'), {
    fallthrough: true,
  }),
);

// fall back to the index (SPA mode) in any other case
app.get('*', sendIndex);

app.listen(port, () => {
  console.log(`Server running at port ${port}.`);
});
