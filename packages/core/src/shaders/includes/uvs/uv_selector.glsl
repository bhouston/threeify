vec2 uvSelector(int uvIndex, vec2 uv0, vec2 uv1, vec2 uv2) {
  switch (uvIndex) {
    case 0:
      return uv0;
    case 1:
      return uv1;
    case 2:
      return uv2;
  }
  return vec2(0, 0);
}
