import { WebIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { Mat4 } from '../../math/Mat4';

import { Node } from '../../nodes/Node';

export async function loadGLTF(url: string): Promise<Node> {
  const io = new WebIO();
  io.registerExtensions(KHRONOS_EXTENSIONS);

  const document = await io.read('input.glb');
  const root = document.getRoot();
  const scene = root.listScenes()[0];

  const rootNode = new Node();

  scene.listChildren().forEach((node) => {
    const localNode = new Node();
    const localTransform = new Mat4().setFromArray( node.getMatrix() );
    const 
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
    rootNode.children.add(localNode);
  });
}
