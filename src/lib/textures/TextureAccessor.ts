import { Texture } from './Texture.js';
import { Matrix3 } from '../math/Matrix3.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Vector2 } from '../math/Vector2.js';
import { ICloneable, ICopyable, IVersionable } from '../interfaces/Standard.js';

export class TextureAccessor
	implements
		ICloneable<TextureAccessor>,
		ICopyable<TextureAccessor>,
		IVersionable {
	version: number = 0;
	texture: Texture | null;
	uvIndex: number;
	uvScale: Vector2;
	uvTranslation: Vector2;
	uvRotation: number;

	constructor(
		texture: Texture | null = null,
		uvIndex: number = 0,
		uvScale: Vector2 = new Vector2(1, 1),
		uvRotation: number = 0,
		uvTranslation: Vector2 = new Vector2(),
	) {
		this.texture = texture;
		this.uvIndex = uvIndex;
		this.uvScale = uvScale;
		this.uvTranslation = uvTranslation;
		this.uvRotation = uvRotation;
	}

	clone(): TextureAccessor {
		return new TextureAccessor(
			this.texture,
			this.uvIndex,
			this.uvScale,
			this.uvRotation,
			this.uvTranslation,
		);
	}

	copy(ta: TextureAccessor) {
		this.texture = ta.texture;
		this.uvIndex = ta.uvIndex;
		this.uvScale = ta.uvScale;
		this.uvTranslation = ta.uvTranslation;
		this.uvRotation = ta.uvRotation;
		return this;
	}

	// TODO: add node-like caching with a dirty() and version number if this ever becomes slow.
	toUvTransform(): Matrix3 {
		let m = new Matrix3();
		m.makeTranslation2(this.uvTranslation);
		m.makeConcatenation(
			m,
			new Matrix3().makeRotation2FromAngle(this.uvRotation),
		);
		m.makeConcatenation(m, new Matrix3().makeScale2(this.uvScale));
		return m;
	}

	dirty() {
		this.version++;
	}
}
