import { mount } from ".";
import {
  attachListener,
  isEventAttr,
  type EventAttrKey,
} from "./event-listeners";
import { render, type VAttrs, type VNode } from "./virtual";

function isText(v: VNode): v is string {
  return typeof v === "string";
}

function updateAttrs($node: HTMLElement, oldAttrs: VAttrs, newAttrs: VAttrs) {
  for (const [k, v] of Object.entries(newAttrs)) {
    if (typeof v === "function" && isEventAttr(k)) {
      attachListener($node, k as EventAttrKey, v as EventListener);
    } else if (typeof v === "boolean") {
      if (v) $node.setAttribute(k, "");
      else $node.removeAttribute(k);
    } else {
      if ($node.getAttribute(k) !== String(v)) {
        $node.setAttribute(k, String(v));
      }
    }
  }
  for (const attr of Array.from($node.attributes)) {
    if (!(attr.name in newAttrs)) {
      $node.removeAttribute(attr.name);
    }
  }
}

function updateChildren(
  $parent: HTMLElement,
  oldChildren: VNode[],
  newChildren: VNode[],
) {
  const childNodes = Array.from($parent.childNodes);
  const length = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < length; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    const childNode = childNodes[i];

    if (oldChild && newChild) {
      const node =
        typeof newChild === "string"
          ? document.createTextNode(newChild)
          : render(newChild);

      $parent.replaceChild(node, childNode!);
    } else if (!newChild && childNode) {
      childNode.remove();
    } else if (oldChild && newChild && childNode instanceof HTMLElement) {
      diff(childNode, oldChild, newChild);
    }
  }
}

export function diff($node: HTMLElement, oldVNode: VNode, newVNode: VNode) {
  if (!newVNode) {
    console.log("early return");
    $node.remove();
    return;
  }

  if (isText(oldVNode) || isText(newVNode)) {
    if (oldVNode != newVNode) {
      const newNode = document.createTextNode(newVNode.toString());
      console.log("string", newNode);
      $node.replaceWith(newNode);
    }
    return;
  }

  if (oldVNode.tagName != newVNode.tagName) {
    const newNode = render(newVNode);
    console.log("change in tagname", newNode);
    mount(newNode, $node);
    return;
  }

  updateAttrs($node, oldVNode.attrs ?? {}, newVNode.attrs ?? {});
  updateChildren($node, oldVNode.children ?? [], newVNode.children ?? []);
}
