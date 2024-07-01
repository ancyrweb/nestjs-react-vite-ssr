import { render as preactRender } from 'preact-render-to-string';
import { createApp } from './base.js';

export async function renderApp({ props, url }: any) {
  const { component, metadata } = createApp({
    url,
    props,
  });

  const template = preactRender(component);

  return { template, metadata };
}

export default {
  renderApp,
};
