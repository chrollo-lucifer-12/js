let currentVNode: VElement;
import { diff } from "./diff";
import { reset, state } from "./state";
import { createElement, render, type VElement } from "./virtual";

let currentDom: HTMLElement;

export function mount(node: HTMLElement, target: HTMLElement) {
  target.replaceWith(node);
  return node;
}

function Counter() {
  const [count, setCount] = state(0);
  //console.log(count);

  function clickHandler() {
    setCount((c: number) => c + 1);
  }

  return createElement(
    "button",
    {
      onClick: clickHandler,
      id: "count",
    },
    [`Count: ${count}`],
  );
}

function app() {
  return createElement(
    "div",
    {
      id: "app",
      style: "color: red",
    },
    ["Hello World!", Counter()],
  );
}

function build(entry: () => VElement) {
  reset();
  currentVNode = entry();
  const app = render(currentVNode);
  const div = document.getElementById("app");
  if (!div) throw new Error("missing app");

  currentDom = mount(app as HTMLElement, div);
}

export function rerender() {
  reset();
  currentVNode = app();

  const newDom = render(currentVNode) as HTMLElement;

  currentDom = mount(newDom, currentDom);
}

build(app);
