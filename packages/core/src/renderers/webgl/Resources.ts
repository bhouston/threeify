import { IResource } from './IResource';
import { RenderingContext } from './RenderingContext.js';

export class Resources {
  private readonly map: { [id: string]: IResource } = {};

  constructor(public readonly context: RenderingContext) {}

  register(resource: IResource): void {
    if (this.map[resource.id] !== undefined) {
      throw new Error(
        `Resource already registered: id=${resource.id}, type=${resource.constructor.name}`
      );
    }
    this.map[resource.id] = resource;
  }

  unregister(resource: IResource): void {
    if (this.map[resource.id] !== resource) {
      throw new Error(
        `Resource not registered: id=${resource.id}, type=${resource.constructor.name}`
      );
    }
    delete this.map[resource.id];
  }

  // return an iterator for all of the resources
  get iterator(): IterableIterator<IResource> {
    return Object.values(this.map)[Symbol.iterator]();
  }
}
