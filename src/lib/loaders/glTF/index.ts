import { WebIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';

export async function loadGLTF(url: string): Promise<void> {
  const io = new WebIO();
  io.registerExtensions(KHRONOS_EXTENSIONS);

  const document = await io.read('input.glb');
  const root = document.getRoot();
  const scene = root.listScenes()[0];
  scene.listChildren().forEach((node) => {
    const localTransform = node.getMatrix();
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
  });
}
