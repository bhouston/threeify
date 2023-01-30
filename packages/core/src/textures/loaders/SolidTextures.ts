import { Color4 } from '@threeify/vector-math';

import { Texture } from '../Texture';
import { createSolidColorImageData } from './ImageData';

export class SolidTextures {
  // color

  public static White = new Texture(
    createSolidColorImageData(new Color4(1, 1, 1, 1), 1, 1, 'sRGB')
  );
  public static Black = new Texture(
    createSolidColorImageData(new Color4(0, 0, 0, 1), 1, 1, 'sRGB')
  );
  public static Transparent = new Texture(
    createSolidColorImageData(new Color4(0, 0, 0, 0), 1, 1, 'sRGB')
  );

  // linear

  public static One = new Texture(
    createSolidColorImageData(new Color4(0, 0, 0, 1), 1, 1, 'linear')
  );
  public static Zero = new Texture(
    createSolidColorImageData(new Color4(0, 0, 0, 1), 1, 1, 'linear')
  );

  // special purpose

  public static FlatNormal = new Texture(
    createSolidColorImageData(new Color4(0.5, 0.5, 1, 1), 1, 1, 'linear')
  );
  public static NeutralDirection = new Texture(
    createSolidColorImageData(new Color4(0.5, 0.5, 1, 1), 1, 1, 'linear')
  );
}
