import "./App.css";
import { useCoiledState } from "./hooks/use-coiled";
import { countAtom, countSelector } from "./lib/store";

function App() {
  const [val, setVal] = useCoiledState(countAtom);
  const [count, setCount] = useCoiledState(countSelector);

  return (
    <div>
      value : {val} total : {count}
      <button
        onClick={() => {
          setVal(val + 1);
        }}
      >
        click
      </button>
      <button onClick={() => setCount(4)}>change increment</button>
    </div>
  );
}

export default App;
