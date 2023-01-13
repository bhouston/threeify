import { Color3 } from '../math/Color3';
import { Color4 } from '../math/Color4';
import { createSolidColorImageData } from '../textures/loaders/ImageData';
import { Texture } from '../textures/Texture';
import { Material, MaterialUniforms } from './Material';

export interface IKhronosPhysicalMaterialProps {
  id?: string;
  name?: string;
  albedo?: Color3;
  albedoTexture?: Texture;
  roughness?: number;
  metallic?: number;
  emissive?: Color3;
}

export class KhronosPhysicalMaterial extends Material {
  private static AlbedoTextureDefault = new Texture(
    createSolidColorImageData(new Color4(1, 1, 1, 1))
  );

  public albedo = new Color3(1, 1, 1);
  public albedoTexture: Texture | undefined = undefined;
  public roughness = 0.5;
  public metallic = 0;
  public emissive = new Color3(0, 0, 0);

  constructor(props: IKhronosPhysicalMaterialProps) {
    super({
      id: props.id,
      name: props.name,
      shaderName: 'KhronosPhysicalMaterial'
    });

    if (props.albedo !== undefined) this.albedo.copy(props.albedo);
    this.albedoTexture = props.albedoTexture;
    if (props.roughness !== undefined) this.roughness = props.roughness;
    if (props.metallic !== undefined) this.metallic = props.metallic;
    if (props.emissive !== undefined) this.emissive.copy(props.emissive);
  }

  getUniforms(): MaterialUniforms {
    return {
      albedo: this.albedo,
      albedoTexture:
        this.albedoTexture || KhronosPhysicalMaterial.AlbedoTextureDefault, // TODO: this is where we would return a placeholder texture if required.
      roughness: this.roughness,
      metallic: this.metallic,
      emissive: this.emissive
    };
  }
}
