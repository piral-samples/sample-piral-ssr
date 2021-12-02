import * as request from 'request';

export function readRemoteText(link: string) {
  return new Promise<string>((resolve) => {
    request(link, (_err, _res, body) => resolve(body));
  });
}

export async function readRemoteJson(link: string) {
  const content = await readRemoteText(link);
  return JSON.parse(content);
}

export function registerAssetResolver(manifestContent: string) {
  const assets = JSON.parse(manifestContent);

  // This enables finding the (right) image on runtime.
  require.extensions['.png'] = (module, fn) => {
    for (const key of Object.keys(assets)) {
      if (fn.endsWith(key)) {
        module.exports = manifestContent[key];
      }
    }
  };
}
