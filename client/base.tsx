import { h } from 'preact';
import routes from './routes.js';
import Home from './pages/index.js';

export const createApp = ({ url, props }: { url: string; props: any }) => {
  const route = routes.find((route) => route.match(url));
  const Component = route ? route.component : Home;

  return <Component {...props} />;
};
