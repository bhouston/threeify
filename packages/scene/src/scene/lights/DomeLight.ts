import { CubeMapTexture, TexImage2D } from '@threeify/core';

import { ILight, Light } from './Light';

export interface IDomeLight extends ILight {
  cubeMap?: CubeMapTexture | TexImage2D;
}

export class DomeLight extends Light {
  public cubeMap?: CubeMapTexture | TexImage2D;

  constructor(props: IDomeLight) {
    super(props);
    this.cubeMap = props.cubeMap;
  }
}
