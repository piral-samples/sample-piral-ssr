import * as request from 'request';

export function readRemoteText(link: string) {
  return new Promise<string>(resolve => {
    request(link, (_err, _res, body) => resolve(body));
  });
}

export async function readRemoteJson(link: string) {
  const content = await readRemoteText(link);
  return JSON.parse(content);
}
