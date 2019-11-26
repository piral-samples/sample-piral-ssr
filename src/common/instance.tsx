import * as React from 'react';
import { Link } from 'react-router-dom';
import { createInstance, PiletMetadata } from 'piral-core';

declare global {
  interface Window {
    __pilets__?: Array<PiletMetadata>;
  }
}

export function createAppInstance() {
  const instance = createInstance({
    state: {
      components: {
        LoadingIndicator: () => <b>Still loading ...</b>,
        Layout: ({ children }) => (
          <div>
            <h1>This is the layout</h1>
            <p>Just rendered like so ...</p>
            <ul>
              <li>
                <Link to="/">Homepage</Link>
              </li>
              <li>
                <Link to="/pilet2">Pilet 2</Link>
              </li>
              <li>
                <Link to="/any">Not Found</Link>
              </li>
            </ul>
            {children}
          </div>
        ),
      },
      routes: {
        '/': () => (
          <div>
            <p>Homepage</p>
          </div>
        ),
      },
    },
    requestPilets() {
      const pilets = window.__pilets__;
      return Promise.resolve(pilets || []);
    },
  });

  return instance;
}
