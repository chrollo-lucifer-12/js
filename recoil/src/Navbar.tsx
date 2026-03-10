import { useCoiledState, useCoiledValue } from "./hooks/use-coiled";
import { countAtom, countSelector } from "./lib/store";

const Navbar = () => {
  const [count, setCount] = useCoiledState(countAtom);
  const val = useCoiledValue(countSelector);
  return (
    <div>
      {count} {val}
    </div>
  );
};

export default Navbar;
