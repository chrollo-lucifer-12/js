import "./App.css";
import { AxiosInstance } from "./axios/axios";

function App() {
  return (
    <div>
      hi
      <button
        onClick={async () => {
          const axios = new AxiosInstance();
          const data = await axios.GET(
            "https://jsonplaceholder.typicode.com/photos",
            {
              onDownloadProgress: (e) => {
                console.log(e);
              },
            },
          );
          console.log(data);
        }}
      >
        click
      </button>
    </div>
  );
}

export default App;
