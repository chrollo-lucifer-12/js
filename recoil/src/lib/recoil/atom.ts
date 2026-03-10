type Disconnector = { disconnect: () => void };

export class Atom<T> {
  listeners = new Set<(value: T) => void>();
  value: T;

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
