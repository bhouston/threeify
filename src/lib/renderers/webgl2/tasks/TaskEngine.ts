import { Context } from "../Context";
import { Framebuffer } from "../Framebuffer";
import { Node, depthFirstVisitor } from "../../../nodes/Node";
import { Mesh } from "../../../nodes/Mesh";
import { DrawTask } from "./DrawTask";
import { ITask } from "./ITask";

export class TaskEngine {

    context: Context;

    constructor( context: Context ) {
        this.context = context;
    }

    compileToTasks( node: Node, framebuffer: Framebuffer ) {
        let context = this.context;
        let tasks: ITask[] = [];
        depthFirstVisitor( node, node => {
            if( node instanceof Mesh ) {
                let mesh = node as Mesh;
                let geometry = mesh.geometry;
                /*var bufferGeometry = context.bufferGeometryPool.request( mesh.geometry );
                var program = context.materialPool.request( node.material );
                tasks.push( new DrawTask( program, bufferGeometry, uniforms, geometry.primitiveType, 0, geometry.indices.count ) );
                */
            }
        });

        return tasks;
    }

    render( node: Node, framebuffer: Framebuffer ) {
        this.executeTasks( this.compileToTasks( node, framebuffer ) );
    }

    executeTasks( tasks: ITask[] ) {
        tasks.forEach( task => {
            task.execute( this.context );
        });
    }

}