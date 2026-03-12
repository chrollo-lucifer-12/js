import { useEffect, useState, type ReactNode } from "react";
import { RouterContext } from "./contexts";
import { buildTree, findMatch } from "../lib/utils";
import NotFound from "./not-found";

export type RouteProps = {
  path: string;
  render: ReactNode;
  children?: ReactNode;
  layout?: ({ children }: { children: ReactNode }) => ReactNode;
};

function navigationStress() {
  console.time("navigation");

  for (let i = 0; i < 20000; i++) {
    const path = `/route-${Math.floor(Math.random() * 50000)}`;
    findMatch(path);
  }

  console.timeEnd("navigation");
}

export const Router = ({ children }: { children: ReactNode }) => {
  buildTree(children);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleRoute = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const element = findMatch(currentPath);

  return (
    <RouterContext.Provider
      value={{ currentPath, navigate: handleRoute, params: element.params }}
    >
      {element.element ? (
        element.layout ? (
          <element.layout>{element.element}</element.layout>
        ) : (
          element.element
        )
      ) : (
        <NotFound />
      )}
    </RouterContext.Provider>
  );
};

export const Route = (_props: RouteProps) => {
  return null;
};
