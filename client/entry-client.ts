import { hydrate } from 'preact';
import { createApp } from './base.js';

const state: {
  componentName: string;
  props: Record<string, any>;
} = (window as any).__INITIAL_STATE__;

const pages = (import.meta as any).glob('./pages/*.tsx');
const Page = pages[`./pages/${state.componentName}.tsx`];

hydrate(
  createApp({
    Component: Page.default,
    props: state.props,
  }),
  document.getElementById('root')!,
);
