How to write a simple but efficient node renderer?

Have a function which retranslates the node graph into the optimized internal representation.  It can skip the VBO and UBO to start, that is just an optimization.

But we should definitely build it in the same fashion.


retranslate( rootNode, renderList );

The render list consists of:

* For each mesh/line/point node:
  * BufferGeometries
  * VBOs.

How to create a VBO:

```glsl

      const vao = gl.createVertexArray();

      gl.bindVertexArray(vao);

      // prettier-ignore
      const positionArray = new Float32Array([
        -0.5, 0, 0,
        0.5, 0, 0
      ]);
      const positionBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      gl.bindVertexArray(null);
```

* The lights are compiled into a light uniform buffer object: lights.
* Each unique material is compiled into a material uniform buffer object: 
* Each node is compiled into a node uniform buffer object, localToWorld, worldToLocal.
* Global state is compiled into a global uniform buffer object: worldToCamera, projection.


How uniform buffer objects work:

In the shading code you do this:
```glsl

        // THIS IS CALLED A UNIFORM BLOCK
        uniform Settings {
          float u_PointSize;
          vec3 u_Color;
        };

```

```js

      // Get the index of the Uniform Block from any program
      const blockIndex = gl.getUniformBlockIndex(program_normal, "Settings");

      // Get the size of the Uniform Block in bytes
      const blockSize = gl.getActiveUniformBlockParameter(
        program_normal,
        blockIndex,
        gl.UNIFORM_BLOCK_DATA_SIZE
      );

      // Create Uniform Buffer to store our data
      const uboBuffer = gl.createBuffer();

      // Bind it to tell WebGL we are working on this buffer
      gl.bindBuffer(gl.UNIFORM_BUFFER, uboBuffer);

      // Allocate memory for our buffer equal to the size of our Uniform Block
      // We use dynamic draw because we expect to respecify the contents of the buffer frequently
      gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);

      // Unbind buffer when we're done using it for now
      // Good practice to avoid unintentionally working on it
      gl.bindBuffer(gl.UNIFORM_BUFFER, null);

      // Bind the buffer to a binding point
      // Think of it as storing the buffer into a special UBO ArrayList
      // The second argument is the index you want to store your Uniform Buffer in
      // Let's say you have 2 unique UBO, you'll store the first one in index 0 and the second one in index 1
      gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uboBuffer);

 // Name of the member variables inside of our Uniform Block
      const uboVariableNames = ["u_PointSize", "u_Color"];

      // Get the respective index of the member variables inside our Uniform Block
      const uboVariableIndices = gl.getUniformIndices(
        program_normal,
        uboVariableNames
      );

      // Get the offset of the member variables inside our Uniform Block in bytes
      const uboVariableOffsets = gl.getActiveUniforms(
        program_normal,
        uboVariableIndices,
        gl.UNIFORM_OFFSET
      );

      // Create an object to map each variable name to its respective index and offset
      const uboVariableInfo = {};

      uboVariableNames.forEach((name, index) => {
        uboVariableInfo[name] = {
          index: uboVariableIndices[index],
          offset: uboVariableOffsets[index],
        };
      });
```

for each program using the UBO (I don't understand)
```js

      let index;

      // The 3rd argument is the binding point of our Uniform Buffer
      // uniformBlockBinding tells WebGL to
      // link the Uniform Block inside of this program
      // to the Uniform Buffer at index X of our Special UBO ArrayList
      //
      // Remember that we placed our UBO at index 0 of our Special UBO ArrayList in line 213 in Part A

      index = gl.getUniformBlockIndex(program_normal, "Settings");
      gl.uniformBlockBinding(program_normal, index, 0);

      index = gl.getUniformBlockIndex(program_inverted, "Settings");
      gl.uniformBlockBinding(program_inverted, index, 0);
```

Then to set the values:

```js

        gl.bindBuffer(gl.UNIFORM_BUFFER, uboBuffer);

        // Push some data to our Uniform Buffer

        gl.bufferSubData(
          gl.UNIFORM_BUFFER,
          uboVariableInfo["u_PointSize"].offset,
          new Float32Array([Math.random() * 100.0 + 100.0]),
          0
        );
        gl.bufferSubData(
          gl.UNIFORM_BUFFER,
          uboVariableInfo["u_Color"].offset,
          new Float32Array([Math.random(), 0.25, 0.25]),
          0
        );

        gl.bindBuffer(gl.UNIFORM_BUFFER, null);

```
