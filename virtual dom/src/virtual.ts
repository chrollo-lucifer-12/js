import {
  attachListener,
  isEventAttr,
  type EventAttrKey,
} from "./event-listeners";
import { incrementRender } from "./state";

export type VAttrValue = string | number | boolean | ((ev: Event) => void);
export type VAttrs = Record<string, VAttrValue>;
export type VNode = VElement | string;
export type VElement = {
  tagName: string; // name eg - div
  attrs: VAttrs; // attributes - id, class, value
  children?: VNode[]; // nested
};

export function createElement(
  tagName: string,
  attrs?: VAttrs,
  children?: VNode[],
): VElement {
  return {
    tagName,
    attrs: attrs ?? {},
    children: children ?? [],
  };
}

export function render(node: VElement) {
  incrementRender();
  const { attrs, tagName, children } = node;

  const $el = document.createElement(tagName);

  if (attrs) {
    for (let [k, v] of Object.entries(attrs)) {
      if (typeof v === "function" && isEventAttr(k))
        attachListener($el, k as EventAttrKey, v as EventListener);
      else if (v === true) $el.setAttribute(k, "");
      else if (v === false || v == null) {
      } else $el.setAttribute(k, String(v));
    }
  }

  if (children) {
    for (const child of children) {
      if (typeof child === "string")
        $el.appendChild(document.createTextNode(child));
      else $el.appendChild(render(child));
    }
  }

  return $el;
}
