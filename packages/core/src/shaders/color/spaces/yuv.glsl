// https://thebookofshaders.com/08/

// YUV to RGB matrix
const mat3 yuv2rgb = mat3(
  1.,
  0.,
  1.13983,
  1.,
  -0.39465,
  -0.5806,
  1.,
  2.03211,
  0.
);

// RGB to YUV matrix
const mat3 rgb2yuv = mat3(
  0.2126,
  0.7152,
  0.0722,
  -0.09991,
  -0.33609,
  0.436,
  0.615,
  -0.5586,
  -0.05639
);
