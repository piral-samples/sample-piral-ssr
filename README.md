[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Sample Piral SSR](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![GitHub Tag](https://img.shields.io/github/tag/smapiot/piral.svg)](https://github.com/smapiot/piral/releases) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

A sample Node.js server for server-side rendering (SSR) a Piral instance.

## Getting Started

For running this sample locally all you need to do after cloning this repository is running:

```sh
npm i && npm run build && npm start
```

**Remark**: This sample requires Node.js and NPM. The used port is `3000`, which could be re-configured easily (e.g., via an environment variable `PORT`).

## Status / Covered

There are multiple levels of SSR. Every level adds another piece of complexity. The jumps are getting higher per level.

1. CSR, leave everything as-is
2. "shallow" ("level-0") SSR that places the feed service response in the delivered code
3. **"level-1" SSR that places the (JS-bundles from the) pilets from the feed service response in the delivered code**
4. "level-2" SSR that pre-evaluates the setup methods of the pilets; the initial state is already delivered and the pilets are all bundled together with the main code (setup will not be run again)
5. "level-3" SSR that does not stop at the setup method - actually the whole thing is rendered and hydrated from there again

More details on these levels are in the original [issue at GitHub](https://github.com/smapiot/piral/issues/35).

Right now we are at level-1 SSR, i.e., we still require the client to do the heavy lifting, but we can boost the startup time drastically by embedding all necessary (dynamic) resources (i.e., the pilets) in a single response.

**Remark**: Most likely we will never reach level-3 as this is way too complex; not only for Piral itself, but also for developers using Piral. In this case pilets would need to be developed super careful such that they just work without a real DOM underneath. This kind of development is unlikely.

## Important Pieces

The application is essentially split in two parts:

- A client-side entry point via `src/client/index.tsx` (effectively used by `src/client/index.html`)
- A server-side entry point via `src/server/index.tsx` using `piral-ssr-utils`

Both parts are using `src/common/app.tsx` for accessing the application. The only difference between the client and server is that the latter is just taking care about retrieving a `string`, while the former performs an hydration on the DOM.

The state is already predetermined (see `src/common/instance.tsx`) and will be evaluated equally on the server and the client. This results in the right rendering from the server and the client.

## How to Embed

There are two crucial parts. The first one is how to retrieve the pilets later on:

```ts
import * as React from 'react';
import { createInstance } from 'piral-core';
import { configForServerRendering } from 'piral-ssr-utils/runtime';

export function createAppInstance() {
  return createInstance(
    configForServerRendering({
      // ... standard configuration
    }),
  );
}
```

By using `configForServerRendering` the pilets are picked up from the `window` if available, otherwise we just an empty array of pilets. In the latter case we assume we are in debug mode.

But how are the pilets entering the `window` global? For this we need to look what the SSR actually returns to the browser:

```ts
import { renderFromServer } from 'piral-ssr-utils';

async function sendIndex(_: express.Request, res: express.Response) {
  const app = createApp();
  const content = await renderFromServer(app, {
    getPilet(url) {
      return readRemoteText(url);
    },
    async getPiletsMetadata() {
      const res = await readRemoteJson(feedUrl);
      return res.items;
    },
    fillTemplate(body, script) {
      return indexHtml
        .replace('<div id="app"></div>', `<div id="app">${body}</div>`)
        .replace('<noscript id="data"></noscript>', script);
    },
  });
  res.send(content);
}
```

We set the `window.__pilets__` with another script (called `script`), which is run just before including our application. The `renderFromServer` helper is actually just transforming the feed response (including remote links) to a plain response including the content in form `content`.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
