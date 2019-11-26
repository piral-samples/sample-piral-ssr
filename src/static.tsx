import { renderToString } from 'react-dom/server';
import { PiletMetadata } from 'piral-core';
import { readRemotePilets } from './utils';
import { createApp } from './app';

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
