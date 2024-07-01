import { hydrate } from 'preact';
import { createApp } from './base.js';

const state: {
  componentName: string;
  props: Record<string, any>;
} = (window as any).__INITIAL_STATE__;

hydrate(
  createApp({
    url: window.location.pathname,
    props: state.props,
  }),
  document.getElementById('root')!,
);
