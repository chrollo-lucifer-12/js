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

const findMatchHelper = (paths: string[], currTree: RouteTree[]) => {
  const entry = currTree.find(
    (tree) => tree.path.slice(1) === paths[0] || tree.path.startsWith("/:"),
  );

  if (!entry) return null;

  if (paths.length === 1) {
    return entry.render ?? null;
  }

  return findMatchHelper(paths.slice(1), entry.children);
};

export const findMatch = (path: string): ReactNode => {
  const paths = path.split("/").slice(1);
  return findMatchHelper(paths, routesTree);
};
