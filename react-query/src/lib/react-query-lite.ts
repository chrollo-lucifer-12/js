export type QueryOptions = {
  queryKey: string;
  queryFn: () => any;
};

export type QueryObserver = {
  notify: () => void;
  getResult: () => QueryState;
  subscribe: (cb: () => void) => () => void;
};

export type QueryState = {
  status: string;
  isFetching: boolean;
  data: any;
  error: any;
};

export class QueryClient {
  queries: Query[];
  constructor() {
    this.queries = [];
  }
  getQuery = (options: QueryOptions) => {
    const queryHash = JSON.stringify(options.queryKey);
    let query = this.queries.find((d) => d.queryHash === queryHash);

    if (!query) {
      query = new Query(this, options);
      this.queries.push(query);
    }
    return query;
  };
}

export class Query {
  client: QueryClient;
  queryOptions: QueryOptions;
  promise: Promise<any> | null;
  queryHash: string;
  state: QueryState;
  subscribers: (() => void)[];

  constructor(client: QueryClient, options: QueryOptions) {
    this.client = client;
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
