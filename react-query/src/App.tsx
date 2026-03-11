import { useContext } from "react";
import "./App.css";
import { useMutation, useQuery } from "./hooks/use-query";
import { QueryClientContext } from "./provider";

const delay = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 2000);
  });

function App() {
  const client = useContext(QueryClientContext)!;
  const { data: todo2, isFetching: isTodoFetching2 } = useQuery({
    queryKey: "hi2",
    queryFn: async () => {
      await delay();
      const data = await fetch("https://jsonplaceholder.typicode.com/todos/2");
      return data.json();
    },
    refetchOnFocus: false,
  });

  const { isMutating, mutate } = useMutation({
    mutationKey: "sdg",
    mutationFn: async () => {
      await delay();
      return;
    },
    onSuccess: () => {
      console.log("mutation done");
      client.invalidateQuery("hi2");
    },
  });

  if (isTodoFetching2) return <p>todo 2 fetching</p>;

  return (
    <div>
      <p>todo2 : {todo2.title}</p>
      <button disabled={isMutating} onClick={() => mutate()}>
        mutate
      </button>
      <p>{isMutating && "updating..."}</p>
    </div>
  );
}

export default App;
