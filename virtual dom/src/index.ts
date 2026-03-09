import { createElement, render, type VElement } from "./virtual";

export function mount(node: HTMLElement, target: HTMLElement) {
  target.replaceWith(node);
  return node;
}

function app() {
  return createElement(
    "div",
    {
      id: "app",
      style: "color: red",
    },
    [
      "Hello World!",
      createElement(
        "button",
        {
          id: "submit",
          onClick: () => {
            console.log("clicked");
          },
        },
        ["submit"],
      ),
    ],
  );
}

function build(entry: () => VElement) {
  const app = render(entry());
  const div = document.getElementById("app");
  if (!div) throw new Error("missing app");

  mount(app as HTMLElement, div);
}

build(app);
