import * as React from 'react';
import { Piral } from 'piral-core';
import { createAppInstance } from './instance';

export function createApp() {
  const instance = createAppInstance();
  return <Piral instance={instance} />;
}
