import { Stateful } from "./atom";

type GeneratorContext = {
  get: <T>(dep: Stateful<T>) => T;
};

type SelectorGenerator<T> = (context: GeneratorContext) => T;

export class Selector<T> extends Stateful<T> {
  deps = new Set<Stateful<T>>();
  generate: SelectorGenerator<T>;

  constructor(generate: SelectorGenerator<T>) {
    super(undefined as T);
    this.generate = generate;
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
    this.update(value);
  }
}
