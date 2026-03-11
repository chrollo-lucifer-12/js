import { createContext, useEffect, type ReactNode } from "react";
import { type QueryClient } from "./lib/react-query-lite";

export const QueryClientContext = createContext<QueryClient | undefined>(
  undefined,
);

export function QueryClientProvider({
  children,
  client,
}: {
  children: ReactNode;
  client: QueryClient;
}) {
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      //console.log(e);
      client.refetchQueries();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
}
