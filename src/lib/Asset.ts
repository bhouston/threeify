export function assetTrue(
	condition: boolean,
	message: string = 'assetTrue failure',
) {
	if (!condition) throw new Error(message);
}
