type Disconnector = { disconnect: () => void };

export class Stateful<T> {
  value: T;
  listeners = new Set<(value: T) => void>();

  constructor(value: T) {
    this.value = value;
  }

  update(value: T) {
    this.value = value;
    this.emit();
  }

  emit() {
    for (const listener of this.listeners) {
      listener(this.snapshot());
    }
  }

  snapshot(): T {
    return this.value;
  }

  subscribe(callback: (value: T) => void): Disconnector {
    this.listeners.add(callback);
    return {
      disconnect: () => {
        this.listeners.delete(callback);
      },
    };
  }
}

export class Atom<T> extends Stateful<T> {
  update(value: T): void {
    super.update(value);
  }
}

export function atom<V>(value: { key: string; default: V }): Atom<V> {
  return new Atom(value.default);
}
