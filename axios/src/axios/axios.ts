type Body = string | FormData | Blob | Record<string, any> | null;
type Progress = { timestamp: number; loaded: number };

type DownloadProgressHandler = (progress: Progress) => void;

type Options = {
  signal?: AbortSignal;
  withCredentials?: boolean;
  headers?: HeadersInit;
  timeout?: number;
  onDownloadProgress?: DownloadProgressHandler;
  params?:
    | string
    | Record<string, string>
    | string[][]
    | URLSearchParams
    | undefined;
};

export class AxiosInstance {
  GET(url: string, options?: Options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "json";
      if (options) {
        if (options.params) {
          const query = new URLSearchParams(options.params).toString();
          url += (url.includes("?") ? "&" : "?") + query;
        }
        if (options.headers) {
          const headersArr = Object.entries(options.headers);
          for (const headerEl of headersArr) {
            xhr.setRequestHeader(headerEl[0], headerEl[1]);
          }
        }
        if (options.timeout) xhr.timeout = options.timeout;
        if (options.withCredentials) {
          xhr.withCredentials = true;
        }
        if (options.signal) {
          options.signal.addEventListener("abort", () => {
            xhr.abort();
            reject("request aborted");
          });
        }
      }

      xhr.send();

      xhr.onload = () => {
        if (xhr.status !== 200) {
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

      xhr.onprogress = (event) => {
        const progress: Progress = {
          loaded: event.loaded,
          timestamp: event.timeStamp,
        };
        if (options?.onDownloadProgress) {
          options.onDownloadProgress(progress);
        }
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
