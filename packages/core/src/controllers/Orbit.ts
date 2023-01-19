import { IDisposable } from '../core/types.js';
import { vec2Subtract } from '../index.js';
import { Euler3 } from '../math/Euler3.js';
import { euler3ToQuat } from '../math/Quat.Functions.js';
import { Quat } from '../math/Quat.js';
import { Vec2 } from '../math/Vec2.js';

export class Orbit implements IDisposable {
  public lastPointerClient = new Vec2();
  public orientation = new Quat();
  public onPointerDownHandler: (ev: PointerEvent) => any;
  public onPointerCancelHandler: (ev: PointerEvent) => any;
  public onPointerUpHandler: (ev: PointerEvent) => any;
  public onPointerMoveHandler: (ev: PointerEvent) => any;
  public onMouseWheelHandler: (ev: WheelEvent) => any;
  public disposed = false;

  // public spherical = new Spherical( 1.0, Math.PI * 0.5, 0.0 );
  public euler = new Euler3();
  public eulerMomentum = new Euler3();

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
    this.domElement.addEventListener(
      'pointerdown',
      this.onPointerDownHandler,
      false
    );
    this.domElement.addEventListener(
      'pointercancel',
      this.onPointerCancelHandler,
      false
    );
    this.domElement.addEventListener('wheel', this.onMouseWheelHandler, false);
  }

  dispose() {
    if (this.disposed) return;

    this.disposed = true;
    this.domElement.removeEventListener(
      'pointerdown',
      this.onPointerDownHandler
    );
    this.domElement.removeEventListener(
      'pointercancel',
      this.onPointerCancelHandler
    );
  }

  onPointerDown(pe: PointerEvent) {
    // console.log("pointer down");
    this.domElement.setPointerCapture(pe.pointerId);
    this.domElement.addEventListener(
      'pointermove',
      this.onPointerMoveHandler,
      false
    );
    this.domElement.addEventListener(
      'pointerup',
      this.onPointerUpHandler,
      false
    );

    this.lastPointerClient.set(pe.clientX, pe.clientY);
  }

  onPointerUp(pe: PointerEvent) {
    // console.log("pointer up");
    this.domElement.releasePointerCapture(pe.pointerId);
    this.domElement.removeEventListener(
      'pointermove',
      this.onPointerMoveHandler
    );
    this.domElement.removeEventListener('pointerup', this.onPointerUpHandler);
  }

  onMouseWheel(we: WheelEvent) {
    // console.log("wheel");
    this.zoomMomentum += we.deltaY * this.damping * 0.002;
  }

  onPointerMove(pe: PointerEvent) {
    // console.log("pointer move", pe);
    const pointerClient = new Vec2(pe.clientX, pe.clientY);
    const pointerClientDelta = vec2Subtract(
      pointerClient,
      this.lastPointerClient
    );

    // convert to relative
    pointerClientDelta.x /= this.domElement.clientWidth;
    pointerClientDelta.y /= this.domElement.clientHeight;

    this.eulerMomentum.x += pointerClientDelta.y * Math.PI * this.damping;
    this.eulerMomentum.y += pointerClientDelta.x * Math.PI * this.damping;

    this.lastPointerClient.clone(pointerClient);
  }

  update() {
    this.euler.x += this.eulerMomentum.x;
    this.euler.y += this.eulerMomentum.y;
    this.eulerMomentum.x *= 1 - this.damping;
    this.eulerMomentum.y *= 1 - this.damping;

    this.orientation = euler3ToQuat(this.euler, this.orientation);

    this.zoom += this.zoomMomentum;
    this.zoomMomentum *= 1 - this.damping;
    this.zoom = Math.min(1, Math.max(0, this.zoom));
  }

  onPointerCancel(pe: PointerEvent) {
    // console.log("pointer cancel");
  }
}