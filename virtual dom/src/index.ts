import { createElement, render, type VElement } from "./virtual";

function mount(node: HTMLElement, target: HTMLElement) {
  target.replaceWith(node);
  return node;
}

function app() {
  return createElement(
    "div",
    {
      id: "app",
      style: "font-family: sans-serif",
    },
    [
      "Hello World!",
      createElement("button", {
        id: "submit",
        value: "submit",
        onClick: () => {
          console.log("clicked");
        },
      }),
    ],
  );
}

function build(entry: () => VElement) {
  console.log("build running");
  const app = render(entry());
  console.log(app);
  const div = document.getElementById("app");
  if (!div) throw new Error("missing app");
  mount(app, div);
}

build(app);
