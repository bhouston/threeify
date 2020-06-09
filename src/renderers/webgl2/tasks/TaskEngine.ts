import { Node, depthFirstVisitor } from "../../../nodes/Node";
import { ITask } from "./ITask";
import { Mesh } from "../../../nodes/Mesh";
import { RenderingContext } from "../RenderingContext";

export class TaskEngine {
  constructor(public context: RenderingContext) {}

  compileToTasks(node: Node): ITask[] {
    const context = this.context;
    const tasks: ITask[] = [];
    depthFirstVisitor(node, (node) => {
      if (node instanceof Mesh) {
        const mesh = node as Mesh;
        const geometry = mesh.geometry;
        /* const bufferGeometry = context.bufferGeometryPool.request(
          mesh.geometry,
        );
        const program = context.materialPool.request(node.material);
        tasks.push(
          new DrawTask(
            program,
            bufferGeometry,
            uniforms,
            geometry.primitiveType,
            0,
            geometry.indices.count,
          ),
        ); */
      }
    });

    return tasks;
  }

  render(node: Node): void {
    this.executeTasks(this.compileToTasks(node));
  }

  executeTasks(tasks: ITask[]): void {
    tasks.forEach((task) => {
      task.execute(this.context);
    });
  }
}
