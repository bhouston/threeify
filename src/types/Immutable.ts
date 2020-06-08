//
// Based on github.com/BabylonJS/Babylon.js/blob/master/src/types.ts
//

/**
 * Alias type for primitive types
 * @ignorenaming
 */
type Primitive = undefined | null | boolean | string | number | Function;

/**
 * Type modifier to make all the properties of an object Readonly
 */
export type Immutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<U> /* T extends Map<infer K, infer V> ? ReadonlyMap<K, V> : // es2015+ only */
  : DeepImmutable<T>;

/**
 * Type modifier to make all the properties of an object Readonly recursively
 */
export type DeepImmutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepImmutableArray<U> /* T extends Map<infer K, infer V> ? DeepImmutableMap<K, V> : // es2015+ only */
  : DeepImmutableObject<T>;

/**
 * Type modifier to make object properties readonly.
 */
export type DeepImmutableObject<T> = { readonly [K in keyof T]: DeepImmutable<T[K]> };

/** @hidden */
type DeepImmutableArray<T> = ReadonlyArray<DeepImmutable<T>>;

/** @hidden */
/* interface DeepImmutableMap<K, V> extends ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> {} // es2015+ only */
