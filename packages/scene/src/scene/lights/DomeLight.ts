import { CubeMapTexture } from '@threeify/core';

import { ILight, Light } from './Light';

export interface IDomeLight extends ILight {
  cubeMap?: CubeMapTexture;
}

export class DomeLight extends Light {
  public cubeMap?: CubeMapTexture;

  constructor(props: IDomeLight) {
    super(props);
    props.cubeMap = this.cubeMap;
  }
}
