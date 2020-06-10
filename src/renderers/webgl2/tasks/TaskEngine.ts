import { Group, depthFirstVisitor } from "../../../nodes/Group";
import { ITask } from "./ITask";
import { Mesh } from "../../../nodes/Mesh";
import { RenderingContext } from "../RenderingContext";

export class TaskEngine {
  constructor(public context: RenderingContext) {}

  compileToTasks(node: Group): ITask[] {
    const context = this.context;
    const tasks: ITask[] = [];
    depthFirstVisitor(node, (node) => {
      if (node instanceof Mesh) {
        const mesh = node as Mesh;
        const geometry = mesh.geometry;
        /* let bufferGeometry = context.bufferGeometryPool.request( mesh.geometry );
                let program = context.materialPool.request( node.material );
                tasks.push( new DrawTask( program, bufferGeometry, uniforms, geometry.primitiveType, 0, geometry.indices.count ) );
                */
      }
    });

    return tasks;
  }

  render(node: Group): void {
    this.executeTasks(this.compileToTasks(node));
  }

  executeTasks(tasks: ITask[]): void {
    tasks.forEach((task) => {
      task.execute(this.context);
    });
  }
}
