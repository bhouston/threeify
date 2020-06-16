class DictionaryEntry<K, V> {
  key: K;
  value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class Dictionary<K, V> {
  private entries: DictionaryEntry<K, V>[] = [];

  get length(): number {
    return this.entries.length;
  }

  contains(key: K): boolean {
    return this.entries.find((item) => item.key === key) !== undefined;
  }

  get(key: K): V | null {
    const entry = this.entries.find((item) => item.key === key);
    if (entry !== undefined) {
      return entry.value;
    }
    return null;
  }

  set(key: K, value: V): void {
    const entry = this.entries.find((item) => item.key === key);
    if (entry === undefined) {
      this.entries.push(new DictionaryEntry<K, V>(key, value));
    } else {
      entry.value = value;
    }
  }

  remove(key: K): boolean {
    const index = this.entries.findIndex((entry) => entry.key === key);
    if (index >= 0) {
      this.entries.splice(index, 1);
      return true;
    }
    return false;
  }

  forEach(callbackFn: (value: V, key: K, dictionary: Dictionary<K, V>) => void): void {
    this.entries.forEach((entry) => callbackFn(entry.value, entry.key, this));
  }
}
