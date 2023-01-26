import { RenderingContext } from '../RenderingContext.js';
import { TexImage2D } from '../textures/TexImage2D.js';

export class TextureUnits {
  public texImage2DToUnitMap = new Map<string, number>();
  public texImage2Ds: TexImage2D[] = [];

  add(...texImage2Ds: TexImage2D[]) {
    for (const texImage2D of texImage2Ds) {
      if (!this.texImage2DToUnitMap.has(texImage2D.id)) {
        const newIndex = this.texImage2DToUnitMap.size;
        this.texImage2DToUnitMap.set(texImage2D.id, newIndex);
        this.texImage2Ds.push(texImage2D);
      }
    }
  }

  bind(texImage2D: TexImage2D): number {
    this.add(texImage2D);
    const bindingIndex = this.texImage2DToUnitMap.get(texImage2D.id);
    if (bindingIndex === undefined) {
      throw new Error('TexImage2D not bound');
    }
    return bindingIndex;
  }

  bindAll(texImage2Ds: TexImage2D[]): number[] {
    this.add(...texImage2Ds);
    return texImage2Ds.map((texImage2D) => this.bind(texImage2D));
  }
}

export function bindTextures(
  context: RenderingContext,
  textureUnits: TextureUnits
) {
  const { gl } = context;
  for (const texImage2D of textureUnits.texImage2Ds) {
    const unitIndex = textureUnits.bind(texImage2D);
    gl.activeTexture(gl.TEXTURE0 + unitIndex);
    gl.bindTexture(texImage2D.target, texImage2D.glTexture);
  }
}
