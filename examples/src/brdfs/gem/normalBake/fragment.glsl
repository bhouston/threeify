precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;

// transforms
uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToClip;
uniform vec3 debugColor;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  vec3 viewSurfaceNormal = normalize(v_viewSurfaceNormal);

  mat4 localToView = worldToView * localToWorld;

  vec3 localOrigin = vec3(0.0);

  vec3 viewLocalOrigin = mat4TransformPosition(localToView, localOrigin);
  vec3 viewDirectionFromLocalOrigin = normalize(
    v_viewSurfacePosition - viewLocalOrigin
  );
  vec3 localDirection = mat4UntransformDirection(
    localToView,
    viewDirectionFromLocalOrigin
  );

  vec3 localSurfaceDirection = mat4UntransformDirection(
    localToView,
    viewSurfaceNormal
  );

  outputColor.rgb = normalToColor(localDirection);
  if (length(debugColor) > 0.0) {
    outputColor.rgb = debugColor;
  }
  outputColor.a = 1.0;
}
