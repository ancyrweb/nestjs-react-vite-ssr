import { FastifyReply, FastifyRequest } from 'fastify';

export type EntryConfig = {
  props: {
    // Page props are generated for the page
    pageProps: Record<string, any>;
    // App props are contextual (session, user, etc.)
    appProps: Record<string, any>;
  };
  url: string;
  req: FastifyRequest;
  res: FastifyReply;
};
