//
// basic PBR material
//
// Authors:
// * @bhouston
//

import { Color } from '../../math/Color.js';
import { TextureAccessor } from '../../textures/TextureAccessor.js';
import { ICloneable, ICopyable, IVersionable } from '../../model/interfaces.js';
import { BlendMode } from '../BlendMode.js';

export class PhysicalMaterial
	implements
		ICloneable<PhysicalMaterial>,
		ICopyable<PhysicalMaterial>,
		IVersionable {
			
	version: number = 0;
	albedo: Color = new Color(1, 1, 1);
	albedoMap: TextureAccessor = new TextureAccessor();
	roughness: number = 0.5;
	roughnessMap: TextureAccessor = new TextureAccessor();
	metalness: number = 0.0;
	metalnessMap: TextureAccessor = new TextureAccessor();
	emissive: Color = new Color(1, 1, 1);
	emissiveMap: TextureAccessor = new TextureAccessor();
	normalFactor: number = 1.0;
	normalMap: TextureAccessor = new TextureAccessor();
	blendMode: BlendMode = BlendMode.Over;

	constructor() {}

	clone() {
		return new PhysicalMaterial().copy(this);
	}

	copy(m: PhysicalMaterial) {
		this.albedo.copy(m.albedo);
		this.albedoMap.copy(m.albedoMap);
		this.roughness = m.roughness;
		this.roughnessMap.copy(m.roughnessMap);
		this.metalness = m.metalness;
		this.metalnessMap.copy(m.metalnessMap);
		this.emissive.copy(m.emissive);
		this.emissiveMap.copy(m.emissiveMap);
		this.normalFactor = m.normalFactor;
		this.normalMap.copy(m.normalMap);
		this.blendMode = m.blendMode;
		return this;
	}

	dirty() {
		this.version++;
	}
}
