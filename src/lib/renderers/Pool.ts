//
// based on the .NET framework
//
// Authors:
// * @bhouston
//

import {
	IUpdateable,
	IVersionable,
	IDisposable,
	IIdentifiable,
} from '../interfaces/Standard';

export interface IPoolUser extends IIdentifiable, IVersionable, IDisposable {}

export interface IPoolResource<T> extends IDisposable, IUpdateable<T> {
	resourceUserVersion: number;
}

class UserResource<U extends IPoolUser, R extends IPoolResource<U>> {
	user: U;
	resource: R;
	resourceVersion: number = -1;

	constructor(user: U, resource: R) {
		this.user = user;
		this.resource = resource;
	}

	refresh() {
		if (this.user.disposed) {
			this.resource.dispose();
		} else if (this.resourceVersion < this.user.version) {
			this.resource.update(this.user);
			this.resourceVersion = this.user.version;
		}

		return this;
	}
}

export class Pool<U extends IPoolUser, R extends IPoolResource<U>> {
	userResources: Array<UserResource<U, R>> = [];
	createResource: (u: U) => R;

	constructor(createResource: (u: U) => R) {
		this.createResource = createResource;
	}

	request(user: U) {
		let userResource = this.userResources.find(
			(userResource) => userResource.user.uuid == user.uuid,
		);
		if (!userResource) {
			userResource = new UserResource(user, this.createResource(user));
			this.userResources.push(userResource);
		}

		return userResource;
	}

	refresh() {
		// update all
		this.userResources.forEach((userResource) => {
			userResource.refresh();
		});

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
