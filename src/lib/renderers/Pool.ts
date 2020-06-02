//
// based on the .NET framework
//
// Authors:
// * @bhouston
//

import {
	IVersionable,
	IDisposable,
	IIdentifiable,
} from '../interfaces/Standard';
import { Context } from './webgl2/Context';

export interface IPoolUser extends IIdentifiable, IVersionable, IDisposable { }

export type UserResourceUpdater<U, R> = (context: Context, user: U, resource: R | null) => R;

class UserResource<U extends IPoolUser, R extends IDisposable> {
	user: U;
	resource: R;
	resourceVersion: number = -1;
	
	constructor(user: U, resource: R) {
		this.user = user;
		this.resource = resource;
	}

	update( context: Context, updater: UserResourceUpdater<U, R>) {
		let disposed = false;
		if (this.resourceVersion < this.user.version) {
			if (this.user.disposed) {
				this.resource.dispose();
				disposed = true;
			}
			else {
				this.resource = updater(context, this.user, this.resource);
			}
			this.resourceVersion = this.user.version;
		}

		return disposed;
	}
}

export class Pool<U extends IPoolUser, R extends IDisposable> {
	context: Context;
	updater: UserResourceUpdater<U, R>;
	userResources: Array<UserResource<U, R>> = [];

	constructor(context: Context, updater: UserResourceUpdater<U, R>) {
		this.context = context;
		this.updater = updater;
	}

	request(user: U) {
		let userResource = this.userResources.find(
			(userResource) => userResource.user.uuid == user.uuid,
		);
		if (!userResource) {
			userResource = new UserResource(user, this.updater(this.context, user, null));
			this.userResources.push(userResource);
		}

		return userResource;
	}

	update() {

		let disposeCount = 0;

		// update all
		this.userResources.forEach((userResource) => {
			if (userResource.update( this.context, this.updater)) {
				disposeCount++;
			}
		});

		// TODO: should this be this frequent?
		if (disposeCount > 0) {
			this.garbageCollect();
		}

		return this;
	}

	garbageCollect() {
		// removed disposed resources
		this.userResources = this.userResources.filter(
			(userResource) => !userResource.resource.disposed,
		);

		return this;
	}
}
