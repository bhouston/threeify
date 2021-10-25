import { Euler, IDisposable, makeQuaternionFromEuler, makeVector3FromSpherical, Quaternion, Spherical, Vector2 } from "..";

export class Orbit implements IDisposable {

    public lastPointerClient = new Vector2();
    public orientation = new Quaternion();
    public onPointerDownHandler: any;
    public onPointerCancelHandler: any;
    public onPointerUpHandler: any;
    public onPointerMoveHandler: any;
    public disposed: boolean = false;

    //public spherical = new Spherical( 1.0, Math.PI * 0.5, 0.0 );
    public euler = new Euler();
    public damping = 0.1;

    constructor(public domElement: HTMLElement) {
        // work around JS / Dom event listener insanity: https://stackoverflow.com/questions/9720927/removing-event-listeners-as-class-prototype-functions
        this.onPointerDownHandler = this.onPointerDown.bind(this);
        this.onPointerCancelHandler = this.onPointerCancel.bind(this);
        this.onPointerUpHandler = this.onPointerUp.bind(this);
        this.onPointerMoveHandler = this.onPointerMove.bind(this);

        this.domElement.style.touchAction = 'none'; // disable touch scroll
        this.domElement.addEventListener('pointerdown', this.onPointerDownHandler, false);
        this.domElement.addEventListener('pointercancel', this.onPointerCancelHandler, false);
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

    onPointerMove(pe: PointerEvent) {
        console.log("pointer move", pe);
        const pointerClient = new Vector2( pe.clientX, pe.clientY );
        const pointerClientDelta = pointerClient.clone().sub( this.lastPointerClient );
 
        // convert to relative
        pointerClientDelta.x /= this.domElement.clientWidth;
        pointerClientDelta.y /= this.domElement.clientHeight;
 
        this.euler.x += pointerClientDelta.y * Math.PI;
        this.euler.y += pointerClientDelta.x * Math.PI;
 
        this.orientation = makeQuaternionFromEuler( this.euler, this.orientation );

        this.lastPointerClient.copy( pointerClient );
    }

    onPointerCancel(pe: PointerEvent) {
        console.log("pointer cancel");
    }


}