import { render as preactRender } from 'preact-render-to-string';
import { createApp } from './base.js';

export async function render() {
  const template = preactRender(createApp());
  return { template };
}
