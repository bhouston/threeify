//
// based on the .NET framework
//
// Authors:
// * @bhouston
//

import { IDisposable, IIdentifiable, IVersionable } from '../core/types';
import { RenderingContext } from './webgl/RenderingContext';

export interface IPoolUser extends IIdentifiable, IVersionable, IDisposable {}

export type UserResourceUpdater<U, R> = (
  context: RenderingContext,
  user: U,
  resource: R | undefined
) => R;

class UserResource<U extends IPoolUser, R extends IDisposable> {
  resourceVersion = -1;

  constructor(public user: U, public resource: R) {}

  update(
    context: RenderingContext,
    updater: UserResourceUpdater<U, R>
  ): boolean {
    let disposed = false;
    if (this.resourceVersion < this.user.version) {
      if (this.user.disposed) {
        this.resource.dispose();
        disposed = true;
      } else {
        this.resource = updater(context, this.user, this.resource);
      }
      this.resourceVersion = this.user.version;
    }

    return disposed;
  }
}

export class Pool<U extends IPoolUser, R extends IDisposable> {
  // TODO replace the following array with a map for faster access.
  userResources: Array<UserResource<U, R>> = [];

  constructor(
    public context: RenderingContext,
    public updater: UserResourceUpdater<U, R>
  ) {}

  request(user: U): R {
    let userResource = this.userResources.find(
      (userResource) => userResource.user.uuid === user.uuid
    );
    if (userResource === undefined) {
      userResource = new UserResource(
        user,
        this.updater(this.context, user, undefined)
      );
      this.userResources.push(userResource);
    }

    return userResource.resource;
  }

  update(): this {
    let disposeCount = 0;

    // update all
    this.userResources.forEach((userResource) => {
      if (userResource.update(this.context, this.updater)) {
        disposeCount++;
      }
    });

    // TODO: should this be this frequent?
    if (disposeCount > 0) {
      this.garbageCollect();
    }

    return this;
  }

  garbageCollect(): this {
    // removed disposed resources
    this.userResources = this.userResources.filter(
      (userResource) => !userResource.resource.disposed
    );

    return this;
  }
}
