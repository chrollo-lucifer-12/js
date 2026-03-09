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

  function clickHandler() {
    setCount((c: number) => c + 1);
  }

  return createElement("div", {}, [
    createElement("h2", {}, ["Counter"]),
    createElement(
      "button",
      {
        onClick: clickHandler,
        id: "count",
      },
      [`Count: ${count}`],
    ),
  ]);
}

function List() {
  const items = ["Apple", "Banana", "Orange", "Mango"];

  return createElement(
    "ul",
    { class: "list" },
    items.map((item) => createElement("li", { class: "list-item" }, [item])),
  );
}

function Card(title: string, content: string) {
  return createElement(
    "div",
    { class: "card", style: "border:1px solid #ccc;padding:10px;margin:5px;" },
    [createElement("h3", {}, [title]), createElement("p", {}, [content])],
  );
}

function app() {
  return createElement(
    "div",
    {
      id: "app",
      style: "color: red; font-family: sans-serif",
    },
    [Counter()],
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
  const oldVNode = currentVNode;

  reset();
  currentVNode = app();

  diff(currentDom, oldVNode, currentVNode);
}

build(app);
