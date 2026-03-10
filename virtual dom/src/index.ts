import { build } from "./render";
import { state } from "./state";
import { createElement } from "./virtual";

// Child component receives state and setter as props
function NumberDisplay(props: { num: number }) {
  return createElement("p", {}, [`Number from parent: ${props.num}`]);
}

// Parent component holds the state and input
function NumberParent() {
  const [num, setNum] = state(0);

  function handleChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (!isNaN(value)) {
      setNum(value);
    } else {
      setNum(0);
    }
  }

  return createElement("div", {}, [
    createElement("h2", {}, ["Parent → Child State Example"]),
    createElement("input", {
      type: "number",
      value: num.toString(),
      onInput: handleChange,
      style: "margin-bottom: 8px;",
    }),
    // Pass state as prop to child
    NumberDisplay({ num }),
  ]);
}

// Root app
export function app() {
  return createElement(
    "div",
    { id: "app", style: "font-family: sans-serif; padding: 10px" },
    [NumberParent()],
  );
}

build(app);
