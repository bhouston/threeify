export class VersionedValue<T> {
	value: T;
	version: number;

	constructor(value: T) {
		this.value = value;
		this.version = -1;
	}
}
