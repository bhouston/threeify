//
// basic PBR material
//
// Authors:
// * @bhouston
//

import { Color } from "../../math/Color.js";
import { Matrix3 } from "../../math/Matrix3.js";
import { Texture } from "../../textures/Texture.js";

export class TextureAccessor {
    texture: Texture;
    uvIndex: number;
    uvTransform: Matrix3;

    constructor( texture: Texture, uvIndex: number, uvTransform: Matrix3 ) {
        this.texture = texture;
        this.uvIndex = uvIndex;
        this.uvTransform = uvTransform;
    }

}

export class PBRMaterial {
    albedo: Color = new Color(1, 1, 1);
    albedoTexture: TextureAccessor | null = null;

    roughness: number = 0.5;
    roughnessTexture: TextureAccessor | null = null;

    metalness: number = 0.0;
    metalnessTexture: TextureAccessor | null = null;

    emissive: Color = new Color(1, 1, 1);
    emissiveTexture: TextureAccessor | null = null;

    normalFactor: number = 1.0;
    normalTexture: TextureAccessor | null = null;
}
