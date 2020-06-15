// mariusschulz.com/blog/keyof-and-lookup-types-in-typescript

// Javascript:
function prop(obj, key) {
  return obj[key];
}

// typescript equivalent
function prop(obj: {}, key: string) {
  return obj[key];
}

interface Todo {
  id: number;
  text: string;
  due: Date;
}

// keyof Todo creates a union type of all properties of Todo.
type TodoKeys = keyof Todo; // "id" | "text" | "due"

function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

interface ObjectConstructor {
  // ...
  entries<T extends { [key: string]: any }, K extends keyof T>(o: T): [keyof T, T[K]][];
  // ...
}
