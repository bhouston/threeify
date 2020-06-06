// BEN: This never worked, was supposed to allow for import of .glsl files directly.
declare module '*.glsl' {
	const value: string;
	export default value;
}
