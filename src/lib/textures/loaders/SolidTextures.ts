import { Color4 } from '../../math/Color4';
import { Texture } from '../Texture';
import { createSolidColorImageData } from './ImageData';

export class SolidTextures {
  public static White = new Texture(
    createSolidColorImageData(new Color4(1, 1, 1, 1))
  );

  public static Black = new Texture(
    createSolidColorImageData(new Color4(0, 0, 0, 1))
  );

  public static Transparent = new Texture(
    createSolidColorImageData(new Color4(0, 0, 0, 0))
  );

  public static FlatNormal = new Texture(
    createSolidColorImageData(new Color4(0.5, 0.5, 1, 1))
  );

  public static NeutralDirection = new Texture(
    createSolidColorImageData(new Color4(0.5, 0.5, 1, 1))
  );
}
