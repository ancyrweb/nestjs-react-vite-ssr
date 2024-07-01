import { match } from 'path-to-regexp';

function removeTrailingSlash(path: string) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

function getPageRoutes(importMap) {
  return (
    Object.keys(importMap)
      // Ensure that static routes have
      // precedence over the dynamic ones
      .sort((a, b) => (a > b ? -1 : 1))
      .map((path) => {
        const normalizedPath = removeTrailingSlash(
          path
            // Remove /pages and .jsx extension
            .slice(6, -4)
            // Replace [id] with :id
            .replace(/\[(\w+)\]/, (_, m) => `:${m}`)
            // Replace '/index' with '/'
            .replace(/\/index$/, '/'),
        );

        return {
          path: normalizedPath,
          match: match(normalizedPath),
          component: importMap[path].default,
        };
      })
  );
}

export default getPageRoutes(
  (import.meta as any).glob('/pages/**/*.(t|j)sx', { eager: true }),
);
