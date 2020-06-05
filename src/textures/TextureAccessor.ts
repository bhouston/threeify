import { ICloneable, ICopyable, IVersionable } from '../model/interfaces.js';
import { Matrix3 } from '../math/Matrix3.js';
import { Vector2 } from '../math/Vector2.js';
import { Texture } from './Texture.js';
import { Matrix4 } from '../math/Matrix4.js';

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

	private _uvTransform = new Matrix3();
	private _uvTransformVersion = -1;
	get uvTransform(): Matrix3 {
		if (this._uvTransformVersion < this.version) {
			this._uvTransform.makeTranslation2(this.uvTranslation);
			this._uvTransform.makeConcatenation(
				this._uvTransform,
				new Matrix3().makeRotation2FromAngle(this.uvRotation),
			);
			this._uvTransform.makeConcatenation(
				this._uvTransform,
				new Matrix3().makeScale2(this.uvScale),
			);
			this._uvTransformVersion = this.version;
		}
		return this._uvTransform;
	}

	dirty() {
		this.version++;
	}
}
