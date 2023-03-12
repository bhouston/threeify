precision highp float;

struct Triangle {
  vec3 color;
};

struct TriangleArray {
  vec3 color[2];
};

uniform vec3 colors[2];
uniform Triangle triangle;
uniform Triangle triangles[2];
uniform TriangleArray triangleArray;


out vec4 outputColor;

void main() {
  outputColor = vec4(triangle.color + triangles[0].color  + triangles[1].color+ colors[0] + triangleArray.color[0] + triangleArray.color[1], 1.);
}
