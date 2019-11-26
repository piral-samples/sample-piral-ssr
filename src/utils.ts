import * as request from 'request';
import { PiletMetadata } from 'piral-core';

export function readRemoteText(link: string) {
  return new Promise<string>(resolve => {
    request(link, (_err, _res, body) => resolve(body));
  });
}

export async function readRemoteJson(link: string) {
  const content = await readRemoteText(link);
  return JSON.parse(content);
}

export async function readRemotePilets(pilets: Array<PiletMetadata>) {
  return Promise.all(
    pilets.map(async pilet => ({
      custom: pilet.custom,
      hash: pilet.hash,
      name: pilet.name,
      version: pilet.version,
      content: await readRemoteText(pilet.link),
    })),
  );
}
