import { useContext, useEffect, useState, type ReactNode } from "react";
import { RouterContext } from "./contexts";

export const Router = ({ children }: { children: ReactNode }) => {
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

  return (
    <RouterContext.Provider value={{ currentPath, navigate: handleRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Route = ({
  path,
  children,
  exact = false,
}: {
  path: string;
  children: ReactNode;
  exact: boolean;
}) => {
  const { currentPath } = useContext(RouterContext)!;

  const match = exact ? currentPath === path : currentPath.startsWith(path);

  return match ? children : null;
};
