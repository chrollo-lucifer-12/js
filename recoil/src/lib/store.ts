import { atom } from "./recoil/atom";
import { selector } from "./recoil/selector";

export const countAtom = atom({ key: "count", default: 0 });

export const countSelector = selector({
  key: "count select",
  get: ({ get }) => {
    const count = get(countAtom);
    return count + 5;
  },
});
