import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

// Reference:
// https://learnopengl.com/Getting-started/Coordinate-Systems

// right hand coordinate system
// same as view space and local space
export class WorldSpace {
  static readonly Right = new Vector3(1, 0, 0);
  static readonly Up = new Vector3(0, 1, 0);
  static readonly Forward = new Vector3(0, 0, -1);
}

// after projection matrix
export class ClipSpace {
  static readonly TopLeftFront = new Vector3(-1, -1, -1);
  static readonly BottomRightBack = new Vector3(1, 1, 1);

  static readonly Top = 1;
  static readonly Bottom = -1;
  static readonly Left = -1;
  static readonly Right = 1;

  static readonly Near = -1;
  static readonly Far = 1;
}

// after viewport transform
export class ScreenSpace {
  static readonly TopLeft = new Vector2(0, 1);
  static readonly TopRight = new Vector2(1, 1);
  static readonly BottomLeft = new Vector2(0, 0);
  static readonly BottomRight = new Vector2(1, 0);

  static readonly Top = 1;
  static readonly Bottom = 0;
  static readonly Left = 0;
  static readonly Right = 1;

  static readonly Near = 0;
  static readonly Far = 1;
}

// this is based on how images show up in gimp and other image tools
export class TextureSpace {
  static readonly TopLeft = new Vector2(0, 0);
  static readonly TopRight = new Vector2(1, 0);
  static readonly BottomLeft = new Vector2(1, 0);
  static readonly BottomRight = new Vector2(1, 1);

  static readonly Top = 0;
  static readonly Bottom = 1;
  static readonly Left = 0;
  static readonly Right = 1;
}
