# General

## Goals

- Simplification
- Minimize dependencies

## Changes from Three.js

# Node

## Interface

- clone() : T
- copy( t: T )
- dispose() - indicates that resources can be released.

## Changes from Three.js

- position, rotation and scale use setters, getters and hide the versioning behind them.
- Removed automatic updating of local to world matrix.
- Rename worldMatrix to localToWorldMatrix per matrix naming conversions.
- add toLocalToWorldMatrix function to get the latest version of the matrices.
- Do not use backgrounds in the same fashion as Three.js as they lead to a lot of complexity with regards to render passes used in effects. Maybe the solution is not not have Backgrounds get into the WebGL renderer at all.

# Learning from Babylon

```javascript
// Create a basic BJS Scene object
var scene = new BABYLON.Scene(engine);
// Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vec3(0, 5, -10), scene);
// Target the camera to scene origin
camera.setTarget(BABYLON.Vec3.Zero());
// Attach the camera to the canvas
camera.attachControl(canvas, false);
// Create a basic light, aiming 0, 1, 0 - meaning, to the sky
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vec3(0, 1, 0), scene);
// Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
// Move the sphere upward 1/2 of its height
sphere.position.y = 1;
// Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene, false);
```

# Learning from Play Canvas

- What is this "addComponent" call that is always done after the creation of the entities?
- What exactly is an "entity" from a programmatic standpoint?
- Could one have an entity type node in Threeify that has animations?

```javascript
// create box entity
const box = new pc.Entity("cube");
box.addComponent("model", {
  type: "box",
});
app.root.addChild(box);

// create camera entity
const camera = new pc.Entity("camera");
camera.addComponent("camera", {
  clearColor: new pc.Color(0.1, 0.1, 0.1),
});
app.root.addChild(camera);
camera.setPosition(0, 0, 3);

// create directional light entity
const light = new pc.Entity("light");
light.addComponent("light");
app.root.addChild(light);
```
