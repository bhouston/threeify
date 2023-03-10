import { assert } from '../../core/assert';
import { IDisposable } from '../../core/types';
import { warnOnce } from '../../warnOnce';

export class ResourceCacheEntry<T extends IDisposable> {
  constructor(public readonly promise: Promise<T>, public referenceCount = 0) {}
}

export class ResourceRef<T extends IDisposable> {
  private disposed = false;

  constructor(
    public resourceCache: ResourceCache<T>,
    public readonly id: string,
    public readonly promise: Promise<T>
  ) {}

  dispose() {
    if (!this.disposed) {
      this.resourceCache.releaseRef(this);
      this.disposed = true;
    }
  }
}

export class ResourceCache<T extends IDisposable> implements IDisposable {
  private idToCacheEntryMap = new Map<string, ResourceCacheEntry<T>>();

  constructor(public name: string) {}

  acquire(id: string, resourceCreator: (id: string) => Promise<T>): Promise<T> {
    if (this.idToCacheEntryMap.has(id)) {
      const cacheEntry = this.idToCacheEntryMap.get(id);
      if (cacheEntry === undefined) throw new Error('cacheEntry is undefined ');
      cacheEntry.referenceCount++;
      //console.log(`[${id}].referenceCount = ${cacheEntry.referenceCount}`);
      return cacheEntry.promise;
    }

    const cacheEntry = new ResourceCacheEntry<T>(resourceCreator(id));
    this.idToCacheEntryMap.set(id, cacheEntry);
    cacheEntry.referenceCount++;
    return cacheEntry.promise;
  }

  insert(id: string, resource: T): Promise<T> {
    return this.acquire(id, () => {
      return new Promise((resolve) => {
        return resolve(resource);
      });
    });
  }

  has(id: string): boolean {
    return this.idToCacheEntryMap.has(id);
  }

  release(id: string): boolean {
    assert(
      this.idToCacheEntryMap.has(id),
      `ResourceCache[name=${this.name}].releaseRef( ${id} ) has no entry in the cache`
    );

    const cacheEntry = this.idToCacheEntryMap.get(id);
    if (cacheEntry === undefined) throw new Error('cacheEntry is undefined ');
    cacheEntry.referenceCount--;

    if (cacheEntry.referenceCount > 0) {
      return false;
    }

    // when reference count reaches zero, delete entry and also dispose of resource.
    this.idToCacheEntryMap.delete(id);
    cacheEntry.promise.then((resource) => {
      return resource.dispose();
    });
    return true;
  }

  acquireRef(
    id: string,
    resourceCreator: (id: string) => Promise<T>
  ): ResourceRef<T> {
    const promise = this.acquire(id, resourceCreator);
    return new ResourceRef(this, id, promise);
  }

  releaseRef(ref: ResourceRef<T>): boolean {
    return this.release(ref.id);
  }

  dispose() {
    for (const id in this.idToCacheEntryMap) {
      const cacheEntry = this.idToCacheEntryMap.get(id);
      if (cacheEntry === undefined) throw new Error('cacheEntry is undefined ');
      warnOnce(
        `ResourceCache[name=${this.name}].dispose() - ${id} still has a count of ${cacheEntry.referenceCount}`
      );

      cacheEntry.promise.then((resource) => {
        return resource.dispose();
      });
    }

    this.idToCacheEntryMap.clear();
  }
}
