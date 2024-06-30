import { render as preactRender } from 'preact-render-to-string';
import { createApp } from './base.js';

export async function renderApp({
  Component,
  props,
}: {
  Component: any;
  props: any;
}) {
  const template = preactRender(
    createApp({
      Component,
      props,
    }),
  );
  return { template };
}
