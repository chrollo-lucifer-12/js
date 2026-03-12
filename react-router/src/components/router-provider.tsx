import { useEffect, useState, type ReactNode } from "react";
import { RouterContext } from "./contexts";
import { buildTree, findMatch } from "../lib/utils";
import NotFound from "./not-found";

export type RouteProps = {
  path: string;
  render: ReactNode;
  children?: ReactNode;
};

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
      {element.element ?? <NotFound />}
    </RouterContext.Provider>
  );
};

export const Route = (_props: RouteProps) => {
  return null;
};
