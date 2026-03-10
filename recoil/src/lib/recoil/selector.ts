import { Stateful } from "./atom";

type GeneratorContext = {
  get: <T>(dep: Stateful<T>) => T;
};

type GeneratorSetter = {
  set: <T>(dep: Stateful<T>, newVal: T) => void;
};

type SelectorGenerator<T> = (context: GeneratorContext) => T;

type SelectorSetter<T> = (setter: GeneratorSetter, newVal: T) => void;

export class Selector<T> extends Stateful<T> {
  deps = new Set<Stateful<T>>();
  generate: SelectorGenerator<T>;
  setter: SelectorSetter<T>;

  constructor(generate: SelectorGenerator<T>, setter: SelectorSetter<T>) {
    super(undefined as T);
    this.generate = generate;
    this.setter = setter;
    this.updateSelector();
  }

  getDep<V>(dep: Stateful<V>): V {
    if (!this.deps.has(dep)) {
      dep.subscribe(() => this.updateSelector());
      this.deps.add(dep);
    }
    return dep.snapshot();
  }

  updateSelector() {
    const value = this.generate({
      get: (dep) => this.getDep(dep),
    });
    super.update(value);
  }

  override update(value: T): void {
    this.setter({ set: (dep, val) => dep.update(val) }, value);
  }
}

export function selector<T>(value: {
  key: string;
  get: SelectorGenerator<T>;
  set: SelectorSetter<T>;
}) {
  return new Selector(value.get, value.set);
}
