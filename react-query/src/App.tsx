import "./App.css";
import { useQuery } from "./hooks/use-query";

function App() {
  const { data, isFetching } = useQuery({
    queryKey: "hi",
    queryFn: async () => {
      const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      return data.json();
    },
  });
  const { data: todo, isFetching: isTodoFetching } = useQuery({
    queryKey: "hi2",
    queryFn: async () => {
      const data = await fetch("https://jsonplaceholder.typicode.com/todos/2");
      return data.json();
    },
  });

  if (isFetching || isTodoFetching) return <p>loading....</p>;

  return (
    <div>
      {data.title}
      {todo.title}
    </div>
  );
}

export default App;
