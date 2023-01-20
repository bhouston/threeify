import { WebIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { mat4FromArray } from '@threeify/core';
import { SceneNode } from '../scene/SceneNode';

export async function loadGLTF(url: string): Promise<SceneNode> {
  const io = new WebIO();
  io.registerExtensions(KHRONOS_EXTENSIONS);

  const document = await io.read('input.glb');
  const root = document.getRoot();
  const scene = root.listScenes()[0];

  const rootNode = new SceneNode();

  scene.listChildren().forEach((node) => {
    const localNode = new SceneNode();
    const localTransform = mat4FromArray(node.getMatrix());

    console.log('localTransform', localTransform);
    const mesh = node.getMesh();
    if (mesh !== null) {
      mesh.listPrimitives().forEach((primitive) => {
        console.log('primitive', primitive.getName(), primitive);
        primitive.listAttributes().forEach((attribute) => {
          console.log('attribute', attribute.getName(), attribute);
        });
      });
    }
    rootNode.children.push(localNode);
  });

  return new Promise<SceneNode>((resolve) => {
    resolve(rootNode);
  });
}
