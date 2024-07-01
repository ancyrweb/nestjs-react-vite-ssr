import { hydrate } from 'preact';
import { createApp } from './base.js';

const state: {
  url: string;
  props: {
    pageProps: Record<string, any>;
    appProps: Record<string, any>;
  };
} = (window as any).__INITIAL_STATE__;

hydrate(
  createApp({
    url: state.url,
    props: state.props,
  }).component,
  document.getElementById('root')!,
);
