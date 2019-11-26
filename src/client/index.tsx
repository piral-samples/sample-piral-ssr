import { hydrate } from 'react-dom';
import { createApp } from '../common/app';

const app = createApp();
hydrate(app, document.querySelector('#app'));
