//
// based on BoxBufferGeometry from Three.js
//
// Authors:
// * @bhouston
//

import { Geometry } from '../core/Geometry.js';
import { Vector3 } from '../math/Vector3.js';
import { Int32AttributeAccessor, Float32AttributeAccessor } from '../core/AttributeAccessor.js';

export class BoxParameters {

    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
	depthSegments: number;
	
	constructor(
		width: number = 1,
		height: number = 1,
		depth: number = 1,
		widthSegments: number = 1,
		heightSegments: number = 1,
		depthSegments: number = 1
	) {
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.widthSegments = widthSegments;
		this.heightSegments = heightSegments;
		this.depthSegments = depthSegments;
	}

}

export class BoxGeometry extends Geometry {

    parameters: BoxParameters;

	constructor( parameters: BoxParameters = new BoxParameters() ) {

		super();

        this.parameters = parameters;

		// buffers

		const indices: number[] = [];
		const vertices: number[] = [];
		const normals: number[] = [];
		const uvs: number[] = [];

		// helper variables

		let numberOfVertices = 0;
		let groupStart = 0;

		// build each side of the box geometry

        let p = this.parameters;
		buildPlane( 2, 1, 0, - 1, - 1, p.depth, p.height, p.width, p.depthSegments, p.heightSegments, 0 ); // px
		buildPlane( 2, 1, 0, 1, - 1, p.depth, p.height, - p.width, p.depthSegments, p.heightSegments, 1 ); // nx
		buildPlane( 0, 2, 1, 1, 1, p.width, p.depth, p.height, p.widthSegments, p.depthSegments, 2 ); // py
		buildPlane( 0, 2, 1, 1, - 1, p.width, p.depth, - p.height, p.widthSegments, p.depthSegments, 3 ); // ny
		buildPlane( 0, 1, 2, 1, - 1, p.width, p.height, p.depth, p.widthSegments, p.heightSegments, 4 ); // pz
		buildPlane( 0, 1, 2, - 1, - 1, p.width, p.height, - p.depth, p.widthSegments, p.heightSegments, 5 ); // nz

		// build geometry

		this.setIndices( new Int32AttributeAccessor( new Int32Array( indices ), 1 ) );
		this.setAttribute( 'position', new Float32AttributeAccessor( new Float32Array( vertices ), 3 ) );
		this.setAttribute( 'normal', new Float32AttributeAccessor( new Float32Array( normals ), 3 ) );
		this.setAttribute( 'uv', new Float32AttributeAccessor( new Float32Array( uvs ), 2 ) );

		function buildPlane( u: number, v: number, w: number, udir: number, vdir: number, width: number, height: number, depth: number, gridX: number, gridY: number, materialIndex: number ) {

			const segmentWidth = width / gridX;
			const segmentHeight = height / gridY;

			const widthHalf = width / 2;
			const heightHalf = height / 2;
			const depthHalf = depth / 2;

			const gridX1 = gridX + 1;
			const gridY1 = gridY + 1;

			let vertexCounter = 0;
			let groupCount = 0;

			const vector = new Vector3();

			// generate vertices, normals and uvs

			for ( let iy = 0; iy < gridY1; iy ++ ) {

				const y = iy * segmentHeight - heightHalf;

				for ( let ix = 0; ix < gridX1; ix ++ ) {

					const x = ix * segmentWidth - widthHalf;

					// set values to correct vector component

					vector.setComponent( u, x * udir );
					vector.setComponent( v, y * vdir );
					vector.setComponent( w, depthHalf );

					// now apply vector to vertex buffer

					vertices.push( vector.x, vector.y, vector.z );

					// set values to correct vector component

					vector.setComponent( u, 0 );
					vector.setComponent( v, 0 );
					vector.setComponent( w, depth > 0 ? 1 : - 1 );

					// now apply vector to normal buffer

					normals.push( vector.x, vector.y, vector.z );

					// uvs

					uvs.push( ix / gridX );
					uvs.push( 1 - ( iy / gridY ) );

					// counters

					vertexCounter += 1;

				}

			}

			// indices

			// 1. you need three indices to draw a single face
			// 2. a single segment consists of two faces
			// 3. so we need to generate six (2*3) indices per segment

			for ( let iy = 0; iy < gridY; iy ++ ) {

				for ( let ix = 0; ix < gridX; ix ++ ) {

					const a = numberOfVertices + ix + gridX1 * iy;
					const b = numberOfVertices + ix + gridX1 * ( iy + 1 );
					const c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
					const d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

					// faces

					indices.push( a, b, d );
					indices.push( b, c, d );

					// increase counter

					groupCount += 6;

				}

			}

		}

	}

}