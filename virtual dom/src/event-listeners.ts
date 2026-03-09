export type ClickHandler = (event: MouseEvent) => void;
export type PointerHandler = (event: PointerEvent) => void;
export type InputHandler = (event: InputEvent) => void;
export type DragHandler = (event: DragEvent) => void;
export type VEventHandler = {
  onClick?: ClickHandler;
  onPointer?: PointerHandler;
  onInput?: InputHandler;
  onDrag?: DragHandler;
};
export type EventAttrKey = (typeof EVENT_ATTR_KEYS)[number];

let EventNames = {
  onClick: "click",
  onPointer: "pointer",
  onInput: "input",
  onDrag: "drag",
};
const EVENT_ATTR_KEYS = ["onClick", "onPointer", "onDrag", "onInput"] as const;
export const LISTENERS = Symbol.for("vdom_listeners");

export function isEventAttr(attrKey: string): boolean {
  return EVENT_ATTR_KEYS.includes(attrKey as EventAttrKey);
}

export function toEventName(attrKey: EventAttrKey) {
  return EventNames[attrKey];
}

export function attachListener(
  $el: HTMLElement,
  attrKey: EventAttrKey,
  fn: EventListener,
) {
  const eventName = toEventName(attrKey);
  let map: Map<string, EventListener> = ($el as any)[LISTENERS];
  if (!map) {
    map = new Map();
    ($el as any)[LISTENERS] = map;
  }

  map.set(eventName, fn);
  $el.addEventListener(eventName, fn);
}
