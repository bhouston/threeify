//
// basic PBR material
//
// Authors:
// * @bhouston
//

import { Color } from '../../math/Color.js';
import { TextureAccessor } from '../../textures/TextureAccessor.js';
import { ICloneable } from '../../interfaces/Standard.js';

export class PBRMaterial implements ICloneable<TextureAccessor> {
	albedo: Color = new Color(1, 1, 1);
	albedoTextureAccessor: TextureAccessor | null = null;

	roughness: number = 0.5;
	roughnessTextureAccessor: TextureAccessor | null = null;

	metalness: number = 0.0;
	metalnessTextureAccessor: TextureAccessor | null = null;

	emissive: Color = new Color(1, 1, 1);
	emissiveTextureAccessor: TextureAccessor | null = null;

	normalFactor: number = 1.0;
	normalTextureAccessor: TextureAccessor | null = null;
}
