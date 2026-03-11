import { useContext, useEffect, useState } from "react";
import {
  type MutationOptions,
  type QueryOptions,
} from "../lib/react-query-lite";
import { QueryClientContext } from "../provider";

export function useQuery({
  queryKey,
  queryFn,
  refetchOnFocus = true,
}: QueryOptions) {
  const client = useContext(QueryClientContext)!;
  const query = client.getQuery({ queryKey, queryFn, refetchOnFocus });

  const [, setState] = useState({});

  useEffect(() => {
    const unsubscribe = query.subscribe(() => setState({}));

    query.fetch();

    return unsubscribe;
  }, [query]);

  return query.state;
}

export function useMutation({
  mutationFn,
  mutationKey,
  onSuccess,
}: MutationOptions) {
  const client = useContext(QueryClientContext)!;
  const mutation = client.getMutation({ mutationFn, mutationKey, onSuccess });
  const [, setState] = useState({});

  useEffect(() => {
    const unsubscribe = mutation.subscribe(() => setState({}));
    return unsubscribe;
  }, [mutation]);
  const mutate = mutation.mutate.bind(mutation);
  return { ...mutation.state, mutate };
}
