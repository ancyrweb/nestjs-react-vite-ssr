import { render as preactRender } from 'preact-render-to-string';
import { createApp } from './base.js';

export async function renderApp({ props, url }: any) {
  const template = preactRender(
    createApp({
      url,
      props,
    }),
  );

  return { template };
}

export default {
  renderApp,
};
