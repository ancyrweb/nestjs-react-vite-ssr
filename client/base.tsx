import App from './pages/Home.js';
import { h } from 'preact';

export const createApp = ({
  Component,
  props,
}: {
  Component: any;
  props: any;
}) => {
  return <Component {...props} />;
};
