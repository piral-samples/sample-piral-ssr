import { hydrate } from 'react-dom';
import { createApp } from './app';

const app = createApp();
hydrate(app, document.querySelector('#app'));
