//
// basic shader material
//
// Authors:
// * @bhouston
//

import { ShaderMaterial } from "../common/ShaderMaterial.js";
import { Shader, ShaderType } from "./Shader.js";
import { Context } from "./Context.js";
import { Uniform } from "./Uniform.js";
import { Attribute } from "./Attribute.js";

export class Program {

    context: Context;
    vertexShader: Shader;
    fragmentShader: Shader;
    glProgram: WebGLProgram;
    uniforms: Array<Uniform> = [];
    attributes: Array<Attribute> = [];

    // attributes (required attribute buffers)
    // varying (per instance parameters)

    constructor(context: Context, vertexShader: Shader, fragmentShader: Shader ) {

        this.context = context;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;

        let gl = this.context.gl;

        // create a program.
        {
            var glProgram = gl.createProgram();
            if (!glProgram) {
                throw new Error("could not create program");
            }
            this.glProgram = glProgram;
        }

        // attach the shaders.
        gl.attachShader(this.glProgram, this.vertexShader.glShader);
        gl.attachShader(this.glProgram, this.fragmentShader.glShader);

        // link the program.
        gl.linkProgram(this.glProgram);

        // Check if it linked.
        var success = gl.getProgramParameter(this.glProgram, gl.LINK_STATUS);
        if (!success) {
            // something went wrong with the link
            throw new Error("program filed to link:" + gl.getProgramInfoLog(this.glProgram));
        }

        var numActiveUniforms = gl.getProgramParameter( this.glProgram, gl.ACTIVE_UNIFORMS );
        for ( var i = 0; i < numActiveUniforms; ++ i ) {
    
            this.uniforms.push( new Uniform( this, i ) );

        }

    	var numActiveAttributes = gl.getProgramParameter( this.glProgram, gl.ACTIVE_ATTRIBUTES );
        for ( var i = 0; i < numActiveAttributes; ++ i ) {
    
            this.attributes.push( new Attribute( this, i ) );

        }
    
    }
}