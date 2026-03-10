let currentVNode: VElement;
import { app } from ".";
import { diff } from "./diff";
import { reset } from "./state";
import { render, type VElement } from "./virtual";

let currentDom: HTMLElement;

export function mount(node: HTMLElement, target: HTMLElement) {
  target.replaceWith(node);
  return node;
}

export function build(entry: () => VElement) {
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
