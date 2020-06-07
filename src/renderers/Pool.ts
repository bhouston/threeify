//
// based on the .NET framework
//
// Authors:
// * @bhouston
//

import { IDisposable, IIdentifiable, IVersionable } from "../model/interfaces";
import { RenderingContext } from "./webgl2/RenderingContext";

export interface IPoolUser extends IIdentifiable, IVersionable, IDisposable {}

export type UserResourceUpdater<U, R> = (
  context: RenderingContext,
  user: U,
  resource: R | null,
) => R;

class UserResource<U extends IPoolUser, R extends IDisposable> {
  user: U;
  resource: R;
  resourceVersion = -1;

  constructor(user: U, resource: R) {
    this.user = user;
    this.resource = resource;
  }

  update(context: RenderingContext, updater: UserResourceUpdater<U, R>): boolean {
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
  context: RenderingContext;
  updater: UserResourceUpdater<U, R>;
  // TODO replace the following array with a map for faster access.
  userResources: Array<UserResource<U, R>> = [];

  constructor(context: RenderingContext, updater: UserResourceUpdater<U, R>) {
    this.context = context;
    this.updater = updater;
  }

  request(user: U): UserResource<U, R> {
    let userResource = this.userResources.find(
      (userResource) => userResource.user.uuid === user.uuid,
    );
    if (!userResource) {
      userResource = new UserResource(user, this.updater(this.context, user, null));
      this.userResources.push(userResource);
    }

    return userResource;
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
      (userResource) => !userResource.resource.disposed,
    );

    return this;
  }
}
