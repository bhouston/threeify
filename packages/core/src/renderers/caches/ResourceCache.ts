import { IDisposable } from '../../core/types';
import { warnOnce } from '../../warnOnce';

export class ResourceCacheEntry<T extends IDisposable> {
  constructor(public readonly promise: Promise<T>, public referenceCount = 0) {}
}
export class ResourceCache<T extends IDisposable> implements IDisposable {
  private idToCacheEntryMap = new Map<string, ResourceCacheEntry<T>>();

  constructor(public name: string) {}

  acquireRef(id: string, resourceCreator: (id: string) => Promise<T>): Promise<T> {
    if (this.idToCacheEntryMap.has(id)) {
      const cacheEntry = this.idToCacheEntryMap.get(id);
      if (cacheEntry === undefined) throw new Error('cacheEntry is undefined ');
      cacheEntry.referenceCount++;
      //console.log(`[${id}].referenceCount = ${cacheEntry.referenceCount}`);
      return cacheEntry.promise;
    }
    const cacheEntry = new ResourceCacheEntry<T>(resourceCreator( id ));
    this.idToCacheEntryMap.set(id, cacheEntry);
    cacheEntry.referenceCount++;
    //console.log(`[${id}].referenceCount = ${cacheEntry.referenceCount}`);
    return cacheEntry.promise;
  }

  has(id: string) {
    return this.idToCacheEntryMap.has(id);
  }

  insertRef(id: string, resource: T) {
    this.acquireRef(id, () => {
      return new Promise((resolve) => {
        return resolve(resource);
      });
    });
  }

  releaseRef(id: string) {
    if (!this.idToCacheEntryMap.has(id)) {
      warnOnce(
        `ResourceCache[name=${this.name}].releaseRef( ${id} ) has no entry in the cache, ignoring`
      );
      return;
    }
    const cacheEntry = this.idToCacheEntryMap.get(id);
    if (cacheEntry === undefined) throw new Error('cacheEntry is undefined ');
    cacheEntry.referenceCount--;

    //console.log(`[${id}].referenceCount = ${cacheEntry.referenceCount}`);
    // when reference count reaches zero, delete entry and also dispose of resource.
    if (cacheEntry.referenceCount === 0) {
      this.idToCacheEntryMap.delete(id);
      cacheEntry.promise.then((resource) => {
        resource.dispose();
      });
    }
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
