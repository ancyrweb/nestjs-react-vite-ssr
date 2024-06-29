import { h } from 'preact';

import { render as preactRender } from 'preact-render-to-string';
import Home from './pages/Home.js';

export async function render() {
  const template = preactRender(<Home />);
  return { template };
}
