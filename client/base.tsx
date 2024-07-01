import { h } from 'preact';
import routes from './routes.js';
import Home from './pages/index.js';

type Config = {
  url: string;
  props: {
    pageProps: Record<string, any>;
    appProps: Record<string, any>;
  };
};

export const createApp = ({ url, props }: Config) => {
  const route = routes.find((route) => route.match(url));
  const Component = route ? route.component : Home;

  return {
    metadata: route.metadata(props),
    component: <Component {...props} />,
  };
};
