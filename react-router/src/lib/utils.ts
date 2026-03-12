import type { ReactNode } from "react";
import React from "react";
import type { RouteProps } from "../components/router-provider";

type RouteTree = {
  path: string;
  render: ReactNode;
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
        children: buildTreeHelper(routeProps.children),
      });
    }
  });

  return routes;
};

export const buildTree = (children: ReactNode) => {
  if (routesTree.length !== 0) return;
  routesTree = buildTreeHelper(children);
};

const findMatchHelper = (
  paths: string[],
  currTree: RouteTree[],
  params: Record<string, string> = {},
): { element: ReactNode; params: { [x: string]: string } } => {
  for (const tree of currTree) {
    const segment = tree.path.slice(1);

    if (segment.startsWith(":")) {
      const key = segment.slice(1);
      const newParams = { ...params, [key]: paths[0] };
      if (paths.length === 1) {
        return { element: tree.render, params: newParams };
      }
      return findMatchHelper(paths.slice(1), tree.children, newParams);
    }

    if (segment === paths[0]) {
      if (paths.length === 1) {
        return { element: tree.render, params };
      }
      return findMatchHelper(paths.slice(1), tree.children, params);
    }
  }

  return { element: null, params };
};

export const findMatch = (
  path: string,
): { element: ReactNode; params: { [x: string]: string } } => {
  const paths = path.split("/").slice(1);
  return findMatchHelper(paths, routesTree);
};
