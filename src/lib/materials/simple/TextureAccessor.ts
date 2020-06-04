import { Texture } from '../../textures/Texture.js';
import { Matrix3 } from '../../math/Matrix3.js';

export class TextureAccessor {
	texture: Texture;
	uvIndex: number;
	uvTransform: Matrix3;

	constructor(texture: Texture, uvIndex: number, uvTransform: Matrix3) {
		this.texture = texture;
		this.uvIndex = uvIndex;
		this.uvTransform = uvTransform;
	}
}
