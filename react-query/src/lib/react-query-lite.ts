export type QueryOptions = {
  queryKey: string;
  queryFn: () => any;
  refetchOnFocus: boolean;
};

export type MutationOptions = {
  mutationKey: string;
  mutationFn: (params: any) => any;
  onSuccess: (data: any) => void;
};

export type QueryState = {
  status: string;
  isFetching: boolean;
  data: any;
  error: any;
};

export type MutationState = {
  status: string;
  isMutating: boolean;
  data: any;
  error: any;
};

export class QueryClient {
  queries: Query[];
  mutations: Mutation[];
  constructor() {
    this.queries = [];
    this.mutations = [];
  }
  getQuery = (options: QueryOptions) => {
    const queryHash = JSON.stringify(options.queryKey);
    let query = this.queries.find((d) => d.queryHash === queryHash);

    if (!query) {
      query = new Query(options);
      this.queries.push(query);
    }
    return query;
  };
  refetchQueries() {
    this.queries.forEach((qeury) => {
      if (qeury.queryOptions.refetchOnFocus) qeury.fetch();
    });
  }
  invalidateQuery(queryKey: string) {
    const queryHash = JSON.stringify(queryKey);
    this.queries
      .filter((query) => query.queryHash === queryHash)
      .map((query) => {
        query.fetch();
      });
  }
  getMutation = (options: MutationOptions) => {
    const mutationHash = JSON.stringify(options.mutationKey);
    let mutation = this.mutations.find((d) => d.mutationHash === mutationHash);

    if (!mutation) {
      mutation = new Mutation(options);
      this.mutations.push(mutation);
    }

    return mutation;
  };
}

export class Query {
  // client: QueryClient;
  queryOptions: QueryOptions;
  promise: Promise<any> | null;
  queryHash: string;
  state: QueryState;
  subscribers: (() => void)[];

  constructor(options: QueryOptions) {
    //   this.client = client;
    this.queryOptions = options;
    this.queryHash = JSON.stringify(options.queryKey);
    this.promise = null;
    this.state = {
      status: "Loading",
      data: undefined,
      error: undefined,
      isFetching: true,
    };
    this.subscribers = [];
  }

  emit() {
    this.subscribers.forEach((subscriber) => {
      subscriber();
    });
  }

  subscribe(cb: () => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((d) => d !== cb);
    };
  }

  setState(updater: (value: QueryState) => QueryState) {
    this.state = updater(this.state);
    this.emit();
  }

  fetch() {
    if (!this.promise) {
      this.promise = (async () => {
        this.setState((old) => ({
          ...old,
          isFetching: true,
          error: undefined,
        }));
        try {
          const data = await this.queryOptions.queryFn();
          this.setState((old) => ({
            ...old,
            status: "success",
            data,
          }));
        } catch (err) {
          this.setState((old) => ({
            ...old,
            status: "error",
            error: err,
          }));
        } finally {
          this.promise = null;
          this.setState((old) => ({
            ...old,
            isFetching: false,
          }));
        }
      })();
    }
    return this.promise;
  }
}

export class Mutation {
  options: MutationOptions;
  mutationHash: string;
  state: MutationState;
  subscribers: (() => void)[];
  promise: Promise<any> | null = null;

  constructor(options: MutationOptions) {
    this.options = options;
    this.mutationHash = JSON.stringify(this.options.mutationKey);
    this.state = {
      data: undefined,
      error: undefined,
      isMutating: false,
      status: "pending",
    };
    this.subscribers = [];
    this.promise = null;
  }

  emit() {
    this.subscribers.forEach((subscriber) => {
      subscriber();
    });
  }

  subscribe(cb: () => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter((d) => d !== cb);
    };
  }

  setState(updater: (newState: MutationState) => MutationState) {
    this.state = updater(this.state);
    this.emit();
  }

  async mutate(...params: any[]) {
    this.setState((old) => ({
      ...old,
      isMutating: true,
      status: "pending",
    }));

    try {
      const data = await this.options.mutationFn(...params);

      this.setState((old) => ({
        ...old,
        status: "success",
        data,
      }));

      this.options.onSuccess?.(data);
    } catch (err) {
      this.setState((old) => ({
        ...old,
        status: "error",
        error: err,
      }));
    } finally {
      this.setState((old) => ({
        ...old,
        isMutating: false,
      }));
    }
  }
}
