import type { ReactNode } from "react";
import React from "react";
import type { RouteProps } from "../components/router-provider";

type RouteTree = {
  path: string;
  render: ReactNode;
  layout?: ({ children }: { children: ReactNode }) => ReactNode;
  children: RouteTree[];
};

let routesTree: RouteTree[] = [];

const buildTreeHelper = (children: ReactNode) => {
  const routes: RouteTree[] = [];

  React.Children.forEach(children, (route) => {
    if (React.isValidElement(route)) {
      const { props } = route;
      const routeProps = props as RouteProps;
      routes.push({
        path: routeProps.path,
        render: routeProps.render,
        layout: routeProps.layout,
        children: buildTreeHelper(routeProps.children),
      });
    }
  });

  return routes;
};

export const buildTree = (children: ReactNode) => {
  if (routesTree.length !== 0) return;
  const start = performance.now();
  routesTree = buildTreeHelper(children);
  const end = performance.now();
  console.log("Time taken for building tree:", end - start, "ms");
};

const findMatchHelper = (
  paths: string[],
  currTree: RouteTree[],
  params: Record<string, string> = {},
  layout: any = null,
): {
  element: ReactNode;
  layout: ({ children }: { children: ReactNode }) => ReactNode;
  params: { [x: string]: string };
} => {
  for (const tree of currTree) {
    const segment = tree.path.slice(1);

    if (segment.startsWith(":")) {
      const key = segment.slice(1);
      const newParams = { ...params, [key]: paths[0] };
      if (paths.length === 1) {
        return {
          element: tree.render,
          params: newParams,
          layout: tree.layout ?? layout,
        };
      }
      return findMatchHelper(
        paths.slice(1),
        tree.children,
        newParams,
        tree.layout ?? layout,
      );
    }

    if (segment === paths[0]) {
      if (paths.length === 1) {
        return { element: tree.render, params, layout: tree.layout ?? layout };
      }
      return findMatchHelper(
        paths.slice(1),
        tree.children,
        params,
        tree.layout ?? layout,
      );
    }
  }

  return { element: null, params, layout };
};

export const findMatch = (
  path: string,
): {
  element: ReactNode;
  layout: ({ children }: { children: ReactNode }) => ReactNode;
  params: { [x: string]: string };
} => {
  const paths = path.split("/").slice(1);
  const start = performance.now();
  let res = findMatchHelper(paths, routesTree);
  const end = performance.now();
  console.log("Time taken for matching:", end - start, "ms");
  return res;
};
