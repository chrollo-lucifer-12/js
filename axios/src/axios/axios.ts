type Body = string | FormData | Blob | Record<string, any> | null;
type Progress = { timestamp: number; loaded: number };

type DownloadProgressHandler = (progress: Progress) => void;

type Options = {
  signal?: AbortSignal;
  withCredentials?: boolean;
  headers?: HeadersInit;
  timeout?: number;
  onDownloadProgress?: DownloadProgressHandler;
  body?: XMLHttpRequestBodyInit | Document | null | undefined;
  params?:
    | string
    | Record<string, string>
    | string[][]
    | URLSearchParams
    | undefined;
};

export class AxiosInstance {
  private buildURL(url: string, params?: Options["params"]) {
    if (!params) return url;

    const query = new URLSearchParams(params as any).toString();
    return url + (url.includes("?") ? "&" : "?") + query;
  }

  private setHeaders(xhr: XMLHttpRequest, headers?: HeadersInit) {
    if (!headers) return;

    const entries = Object.entries(headers);
    for (const [key, value] of entries) {
      xhr.setRequestHeader(key, value);
    }
  }

  private attachAbortSignal(
    xhr: XMLHttpRequest,
    signal?: AbortSignal,
    reject?: (reason?: any) => void,
  ) {
    if (!signal) return;

    signal.addEventListener("abort", () => {
      xhr.abort();
      reject?.("request aborted");
    });
  }

  private attachDownloadProgress(
    xhr: XMLHttpRequest,
    handler?: DownloadProgressHandler,
  ) {
    if (!handler) return;

    xhr.onprogress = (event) => {
      handler({
        loaded: event.loaded,
        timestamp: event.timeStamp,
      });
    };
  }

  private attachOnLoad(
    xhr: XMLHttpRequest,
    resolve: (value: unknown) => void,
    reject: (reason: any) => void,
  ) {
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(`Error ${xhr.status}: ${xhr.statusText}`);
      } else {
        resolve({
          data: xhr.response,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: xhr.getAllResponseHeaders(),
        });
      }
    };
  }

  private attachUploadHandler(
    xhr: XMLHttpRequest,
    resolve: (value: unknown) => void,
    reject: (reason: any) => void,
    uploadProgressHandler?: () => void,
  ) {}

  GET(url: string, options?: Options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      url = this.buildURL(url, options?.params);

      xhr.open("GET", url);
      xhr.responseType = "json";
      if (options) {
        this.setHeaders(xhr, options.headers);
        if (options.timeout) xhr.timeout = options.timeout;
        if (options.withCredentials) {
          xhr.withCredentials = true;
        }
        this.attachAbortSignal(xhr, options.signal, reject);
      }

      xhr.send();
      this.attachOnLoad(xhr, resolve, reject);
      this.attachDownloadProgress(xhr);

      xhr.ontimeout = () => {
        reject("timeout reached");
      };

      xhr.onerror = (e) => {
        console.log(e);
        reject("request failed");
      };
    });
  }

  POST(url: string, options?: Options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      url = this.buildURL(url, options?.params);

      xhr.open("POST", url);
      xhr.responseType = "json";
      if (options) {
        this.setHeaders(xhr, options.headers);
        if (options.timeout) xhr.timeout = options.timeout;
        if (options.withCredentials) {
          xhr.withCredentials = true;
        }
        this.attachAbortSignal(xhr, options.signal, reject);
      }

      xhr.send(options?.body);
      this.attachDownloadProgress(xhr, options?.onDownloadProgress);
      this.attachOnLoad(xhr, resolve, reject);

      xhr.upload.onprogress = function (event) {};

      xhr.upload.onerror = function () {
        reject(`Error during the upload: ${xhr.status}`);
      };

      xhr.ontimeout = () => {
        reject("timeout reached");
      };

      xhr.onerror = (e) => {
        console.log(e);
        reject("request failed");
      };
    });
  }
}

export function axios(): AxiosInstance {
  return new AxiosInstance();
}
