import { IDisposable } from "../core/types";
import { Euler } from "../math/Euler";
import { degToRad } from "../math/Functions";
import { Quaternion } from "../math/Quaternion";
import { makeQuaternionFromAxisAngle, makeQuaternionFromEuler } from "../math/Quaternion.Functions";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

export class Orbit implements IDisposable {

    public lastPointerClient = new Vector2();
    public orientation = new Quaternion();
    public onPointerDownHandler: any;
    public onPointerCancelHandler: any;
    public onPointerUpHandler: any;
    public onPointerMoveHandler: any;
    public onMouseWheelHandler: any;
    public disposed: boolean = false;

    //public spherical = new Spherical( 1.0, Math.PI * 0.5, 0.0 );
    public euler = new Euler();
    public eulerMomentum = new Euler();

    public zoom = 0;
    public zoomMomentum = 0;

    public damping = 0.1;

    constructor(public domElement: HTMLElement) {
        // work around JS / Dom event listener insanity: https://stackoverflow.com/questions/9720927/removing-event-listeners-as-class-prototype-functions
        this.onPointerDownHandler = this.onPointerDown.bind(this);
        this.onPointerCancelHandler = this.onPointerCancel.bind(this);
        this.onPointerUpHandler = this.onPointerUp.bind(this);
        this.onPointerMoveHandler = this.onPointerMove.bind(this);
        this.onMouseWheelHandler = this.onMouseWheel.bind(this);

        this.domElement.style.touchAction = 'none'; // disable touch scroll
        this.domElement.addEventListener('pointerdown', this.onPointerDownHandler, false);
        this.domElement.addEventListener('pointercancel', this.onPointerCancelHandler, false);
        this.domElement.addEventListener('wheel', this.onMouseWheelHandler, false);

    }

    dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.domElement.removeEventListener('pointerdown', this.onPointerDownHandler);
            this.domElement.removeEventListener('pointercancel', this.onPointerCancelHandler);
        }
    }

    onPointerDown(pe: PointerEvent) {
        console.log("pointer down");
        this.domElement.setPointerCapture(pe.pointerId);
        this.domElement.addEventListener('pointermove', this.onPointerMoveHandler, false);
        this.domElement.addEventListener('pointerup', this.onPointerUpHandler, false);

        this.lastPointerClient.set( pe.clientX, pe.clientY );
    }

    onPointerUp(pe: PointerEvent) {
        console.log("pointer up");
        this.domElement.releasePointerCapture(pe.pointerId);
        this.domElement.removeEventListener('pointermove', this.onPointerMoveHandler);
        this.domElement.removeEventListener('pointerup', this.onPointerUpHandler);
    }

    onMouseWheel(we: WheelEvent) {
        console.log("wheel");
        this.zoomMomentum += we.deltaY * this.damping * 0.002;
    }

    onPointerMove(pe: PointerEvent) {
        console.log("pointer move", pe);
        const pointerClient = new Vector2( pe.clientX, pe.clientY );
        const pointerClientDelta = pointerClient.clone().sub( this.lastPointerClient );

        // convert to relative
        pointerClientDelta.x /= this.domElement.clientWidth;
        pointerClientDelta.y /= this.domElement.clientHeight;

        this.eulerMomentum.x += ( pointerClientDelta.y * Math.PI ) * this.damping;
        this.eulerMomentum.y += ( pointerClientDelta.x * Math.PI ) * this.damping;


        this.lastPointerClient.copy( pointerClient );
    }

    update() {
      this.euler.x += this.eulerMomentum.x;
      this.euler.y += this.eulerMomentum.y;
      this.eulerMomentum.x *= ( 1 - this.damping );
      this.eulerMomentum.y *= ( 1 - this.damping );

      this.orientation = makeQuaternionFromEuler( this.euler, this.orientation );

      this.zoom += this.zoomMomentum;
      this.zoomMomentum *= (1 - this.damping );
      this.zoom = Math.min( 1, Math.max( 0, this.zoom ));
    }

    onPointerCancel(pe: PointerEvent) {
        console.log("pointer cancel");
    }


}
