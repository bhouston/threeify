// how to load a glTF?
// fail if it isn't a glb.
// get its json and its data block.
// on demand loading strategy would be:
//  load scene
//   load nodes
//    load meshes
//     load materials
//     load textures

export async loadGLB( url: string ): Promise{
    geometries: Geometry[],
    materials: Material[],
    textures: Texture[]
} {

    getGLBJsonAndBody( url)
}