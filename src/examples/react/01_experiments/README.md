Q: Support inline variables in the glsl?
A: Via standard javascript literal template syntax. It is clearly not glsl.

But how to pass in parameters to an inline glsl code? How to define a function interface for it?

Q: How to highlight glsl code?
A: https://marketplace.visualstudio.com/items?itemName=boyswan.glsl-literal

```javascript
const glsl = (x) => x;

export function sampler2D({ title: Sampler2D, uv: Vector2 }) {
  return glsl`sampler2D( ${title}, ${uv} );`;
}

export function sampler2D({ title: Sampler2D, uv: Vector2 }) {
  return glsl`sampler2D( ${title}, ${uv} );`;
}
```

Q: What are the best concepts of glslify?

```glsl
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: tint = require("./tint.glsl");

void main() {
     vec2 st = gl_FragCoord.xy/u_resolution; // get the screen space

    vec3 pos = vec3(st.xy, u_time); // travel along the Z-dimension in time.
    vec3 rgb = vec3(0.1, cos(u_time), 0.5); // cycle the green color
    vec3 noise = vec3(snoise3(pos),snoise3(pos),snoise3(pos)); // generate the noise

    gl_FragColor = vec4(tint(noise, rgb), 1.0); // tint the noise with our function and draw the pixel
}
```

A: Just a function definition.

Q: How goes glslify work with tree shaking?

```javascript
var src = glsl`shader source...`;
//Compile a shader inline using glsl as a tagged template string function.

var src = glsl(file, opts);
var src = glsl(shaderSource, opts);
// Compile a shader using an inline shader string or a file name.
// These are convenience methods provided that call glsl.compile() or glsl.file() accordingly. These methods are also provided for backwards compatibility with the previous < 6 interface.

// Optionally provide:
opts.basedir; //  directory to resolve relative paths
opts.transform; //  an array of transform functions, transform module name

var src = glsl.compile(src, opts);
//Compile a shader string from a string src.

opts.basedir; // directory to resolve relative paths in src
opts.transform; // an array of transform functions, transform module name strings, or [trname,tropts] pairs
var src = glsl.file(filename, opts);
//Compile a shader from a filename.

opts.basedir; // directory to resolve relative paths in src
opts.transform; // an array of transform functions, transform module name strings, or [trname,tropts] pairs
```

GLSL seems to focus on importing functions. One can provide a name for that function upon import.
It likely hoists these and deduplicates them.

There is another library here:
https://www.npmjs.com/package/glsl-template-loader

It supports includes as well as variables via a non-literal format. \$bedtime.

There is this minifier - it could be used during the build process:
https://www.npmjs.com/package/glsl-minifier

The math library from toji is used in stack-gl. And they have a module per class.

Q: How does the three.js node-based system work?
A:

Q: How does the babylon.js node-based system work?
A:
