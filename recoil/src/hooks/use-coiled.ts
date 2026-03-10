import { useCallback, useEffect, useState } from "react";
import type { Stateful } from "../lib/recoil/atom";

export function useCoiledValue<T>(value: Stateful<T>): T {
  const [, updateState] = useState({});

  useEffect(() => {
    const { disconnect } = value.subscribe(() => updateState({}));
    return () => disconnect();
  }, [value]);

  return value.snapshot();
}

export function useCoiledState<T>(state: Stateful<T>): [T, (value: T) => void] {
  const value = useCoiledValue(state);

  const setValue = useCallback(
    (newValue: T) => {
      state.update(newValue);
    },
    [state],
  );

  return [value, setValue];
}
