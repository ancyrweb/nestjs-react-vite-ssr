# NestJS / pReact / Vite / Fastify

Proof of concept in an attempt to integrate [NestJS](https://nestjs.com), [pReact](https://preactjs.com), [Vite](https://vitejs.dev), and [Fastify](https://fastify.dev).

Ideas :
- Serving React apps from NestjS
- Benefits from SSR for the initial page load and have SEO capabilities
- Hydrate the app in the front-end
- Hot-reload of the UI/JSX in the front-end for improved DX
- Vite for front-end build
- Keeping NestJS infrastructure for serving pages & proposing an API
- Session-based Auth instead of JWTs
- Multiple-Page Apps, no need for a client-side Router
- Works with preact but can actually work with any front-end mechanism (Vue, Svelte, Qwik...)

## How it works

- The `client` folder contains the front-end code
- It is built with Vite
- It's not invoked by any of the `src` code
- The `client` and `src` folder are built using different build tools
- `@fastify/vite` relies on convention, but I believe it can be tweaked

## Getting Started

Simply run `pnpm dev` to start developing.
You can integrate any vite-compliant component in the front-end.
Sass, Stylus, PostCSS, etc.

To render a page, return a `Page` object from the controller.
This will trigger the rendering of the page in the front-end.
This page object can pass props to the front-end.

Run `pnpm build` to build the app and `pnpm start` to start the production server.

## TODO

- Mechanism to provide contextual props to every page (auth, session...)
- Richer metadata system
- Testability