import { createContext, type ReactNode } from "react";
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
  return (
    <QueryClientContext.Provider value={client}>
      {children}
    </QueryClientContext.Provider>
  );
}
