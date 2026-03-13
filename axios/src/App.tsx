import "./App.css";
import { AxiosInstance } from "./axios/axios";

function App() {
  return (
    <div>
      hi
      <button
        onClick={async () => {
          const axios = new AxiosInstance();
          try {
            const data = await axios.POST(
              "https://jsonplaceholder.typicode.com/photos",
              {
                body: JSON.stringify({
                  title: "foo",
                  body: "bar",
                  userId: 1,
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              },
            );
            console.log(data);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        click
      </button>
    </div>
  );
}

export default App;
