import { useCallback, useEffect, useState } from "react";
import type { Atom, Stateful } from "../lib/recoil/atom";

export function useCoiledValue<T>(value: Stateful<T>): T {
  const [, updateState] = useState({});

  useEffect(() => {
    const { disconnect } = value.subscribe(() => updateState({}));
    return () => disconnect();
  }, [value]);

  return value.snapshot();
}

export function useCoiledState<T>(atom: Atom<T>): [T, (value: T) => void] {
  const value = useCoiledValue(atom);
  return [value, useCallback((value) => atom.update(value), [atom])];
}
