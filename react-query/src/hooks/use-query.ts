import { useContext, useEffect, useState } from "react";
import { type QueryOptions } from "../lib/react-query-lite";
import { QueryClientContext } from "../provider";

export function useQuery({ queryKey, queryFn }: QueryOptions) {
  const client = useContext(QueryClientContext)!;
  const query = client.getQuery({ queryKey, queryFn });

  const [, setState] = useState({});

  useEffect(() => {
    const unsubscribe = query.subscribe(() => setState({}));

    query.fetch();

    return unsubscribe;
  }, [query]);

  return query.state;
}
