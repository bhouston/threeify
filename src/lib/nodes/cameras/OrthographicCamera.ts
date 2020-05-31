import { Camera } from './Camera.js';
import { Vector3 } from '../../math/Vector3.js';
import { Vector2 } from '../../math/Vector2.js';

export class OrthographicCamera extends Camera {

    center: Vector2;
    verticalWidth: number;
    near: number;
    far: number;

    constructor( center: Vector2, verticalWidth: number, near: number, far: number ) {

        super();

        this.center = center;
        this.verticalWidth = verticalWidth;
        this.near = near;
        this.far = far;
    }

    copy( c: OrthographicCamera) {

        super.copy( c );

        this.center.copy( c );
		this.verticalWidth = c.verticalWidth;
		this.near = c.near;
        this.far = c.far;
        
        return this;

    }

    updateProjectionMatrices( viewAspectRatio: number ) {

        let horizontalWidth = this.verticalWidth * viewAspectRatio * this.pixelAspectRatio;
        let left = this.center.x - horizontalWidth * 0.5;
        let right = left + horizontalWidth;

        let top = this.center.y - this.verticalWidth * 0.5;
        let bottom = top + this.verticalWidth;

        this.localToScreenProjection.makeOrthographicProjection( left, right, top, bottom, this.near, this.far );
		this.screenToLocalUnprojection.copy( this.localToScreenProjection ).invert();

    }

}

OrthographicCamera.prototype = Object.assign( Object.create( Camera.prototype ), {

	constructor: OrthographicCamera,

	isOrthographicCamera: true,

	copy: function ( source, recursive ) {

		Camera.prototype.copy.call( this, source, recursive );

		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.near = source.near;
		this.far = source.far;

		this.zoom = source.zoom;
		this.view = source.view === null ? null : Object.assign( {}, source.view );

		return this;

	},

	setViewOffset: function ( fullWidth, fullHeight, x, y, width, height ) {

		if ( this.view === null ) {

			this.view = {
				enabled: true,
				fullWidth: 1,
				fullHeight: 1,
				offsetX: 0,
				offsetY: 0,
				width: 1,
				height: 1
			};

		}

		this.view.enabled = true;
		this.view.fullWidth = fullWidth;
		this.view.fullHeight = fullHeight;
		this.view.offsetX = x;
		this.view.offsetY = y;
		this.view.width = width;
		this.view.height = height;

		this.updateProjectionMatrix();

	},

	clearViewOffset: function () {

		if ( this.view !== null ) {

			this.view.enabled = false;

		}

		this.updateProjectionMatrix();

	},

	updateProjectionMatrix: function () {

		var dx = ( this.right - this.left ) / ( 2 * this.zoom );
		var dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
		var cx = ( this.right + this.left ) / 2;
		var cy = ( this.top + this.bottom ) / 2;

		var left = cx - dx;
		var right = cx + dx;
		var top = cy + dy;
		var bottom = cy - dy;

		if ( this.view !== null && this.view.enabled ) {

			var scaleW = ( this.right - this.left ) / this.view.fullWidth / this.zoom;
			var scaleH = ( this.top - this.bottom ) / this.view.fullHeight / this.zoom;

			left += scaleW * this.view.offsetX;
			right = left + scaleW * this.view.width;
			top -= scaleH * this.view.offsetY;
			bottom = top - scaleH * this.view.height;

		}

		this.projectionMatrix.makeOrthographic( left, right, top, bottom, this.near, this.far );

		this.projectionMatrixInverse.getInverse( this.projectionMatrix );

	},

	toJSON: function ( meta ) {

		var data = Object3D.prototype.toJSON.call( this, meta );

		data.object.zoom = this.zoom;
		data.object.left = this.left;
		data.object.right = this.right;
		data.object.top = this.top;
		data.object.bottom = this.bottom;
		data.object.near = this.near;
		data.object.far = this.far;

		if ( this.view !== null ) data.object.view = Object.assign( {}, this.view );

		return data;

	}

} );


export { OrthographicCamera };
