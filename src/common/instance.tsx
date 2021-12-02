import * as React from 'react';
import { Link } from 'react-router-dom';
import { createInstance } from 'piral-core';
import { configForServerRendering } from 'piral-ssr-utils/runtime';

export function createAppInstance() {
  return createInstance(
    configForServerRendering({
      state: {
        components: {
          LoadingIndicator: () => <b>Still loading ...</b>,
          Layout: ({ children }) => (
            <div>
              <h1>This is the layout</h1>
              <img src={require('./assets/piral.png')} alt="Piral Logo" />
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
    }),
  );
}
