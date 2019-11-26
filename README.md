[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Sample Piral SSR](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![GitHub Tag](https://img.shields.io/github/tag/smapiot/piral.svg)](https://github.com/smapiot/piral/releases) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

A sample Node.js server for server-side rendering (SSR) a Piral instance.

## Getting Started

For running this sample locally all you need to do after cloning this repository is running:

```sh
npm i && npm run build && npm start
```

**Remark**: This sample requires Node.js and NPM. The used port is `3000`, which could be re-configured easily (e.g., via an environment variable `PORT`).

## Important Pieces

The application is essentially split in two parts:

- A client-side entry point via `src/dynamic.tsx`
- A server-side entry point via `src/index.tsx` using `src/static.tsx`

Both parts are using `src/app.tsx` for accessing the application. The only difference between `dynamic.tsx` and `static.tsx` is that the latter is just taking care about retrieving a `string`, while the former performs an hydration on the DOM.

The state is already predetermined (see `src/instance.tsx`) and will be evaluated equally on the server and the client. This results in the right rendering from the server and the client.

## How to Embed

There are two crucial parts. The first one is how to retrieve the pilets later on:

```ts
declare global {
  interface Window {
    __pilets__?: Array<PiletMetadata>;
  }
}

const instance = createInstance({
  requestPilets() {
    const pilets = window.__pilets__;
    return Promise.resolve(pilets || []);
  },
});
```

The pilets are picked up from the `window` if available, otherwise we just an empty array of pilets. In the latter case we assume we are in debug mode.

But how are the pilets entering the `window` global? For this we need to look what the SSR actually returns to the browser:

```ts
export async function renderContent(pilets: Array<PiletMetadata>) {
  const embeddedPilets = await readRemotePilets(pilets);
  const app = createApp();
  const body = renderToString(app);
  return `<!doctype html><head><meta charset="utf-8"><title>React SSR Sample</title></head><body><div id="app">${body}</div>
<script>
window.__pilets__ = ${JSON.stringify(embeddedPilets)};
</script>
<script src="dynamic.js"></script>
</body>`;
}
```

We set the `window.__pilets__` with another script, which is run just before including our application. The `readRemotePilets` helper is actually just transforming the feed response (including remote links) to a plain response including the content in form `content`.

**Important**: Right now this does not deal with remote resources or bundle splitting of pilets. :warning: This is still WIP and we'll update this sample soon.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
