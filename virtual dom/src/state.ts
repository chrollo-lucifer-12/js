import { rerender } from ".";

const componentStates = new Map<string, any>();
let renderCounter = 0;
let currentComponentId = 0;
let currentHookIndex = 0;

export function reset() {
  renderCounter = 0;
  currentComponentId = 0;
  currentHookIndex = 0;
}

export function incrementRender() {
  renderCounter++;
  currentComponentId = renderCounter;
}

export function getHookKey() {
  return `${currentComponentId}:${currentHookIndex++}`;
}

export function state(initialValue: number = 0) {
  const key = getHookKey();
  if (!componentStates.has(key)) {
    componentStates.set(key, initialValue);
  }

  const setState = (value: number | ((prev: number) => number)) => {
    const next =
      typeof value === "function" ? value(componentStates.get(key)) : value;
    componentStates.set(key, next);
    rerender();
  };

  return [componentStates.get(key), setState];
}
