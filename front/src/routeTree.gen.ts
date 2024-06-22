/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as WatchIndexImport } from './routes/watch/index'
import { Route as PsIndexImport } from './routes/ps/index'

// Create/Update Routes

const WatchIndexRoute = WatchIndexImport.update({
  path: '/watch/',
  getParentRoute: () => rootRoute,
} as any)

const PsIndexRoute = PsIndexImport.update({
  path: '/ps/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/ps/': {
      id: '/ps/'
      path: '/ps'
      fullPath: '/ps'
      preLoaderRoute: typeof PsIndexImport
      parentRoute: typeof rootRoute
    }
    '/watch/': {
      id: '/watch/'
      path: '/watch'
      fullPath: '/watch'
      preLoaderRoute: typeof WatchIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  PsIndexRoute,
  WatchIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/ps/",
        "/watch/"
      ]
    },
    "/ps/": {
      "filePath": "ps/index.tsx"
    },
    "/watch/": {
      "filePath": "watch/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
