import { Euler3, euler3ToQuat, Quat, Vec2, vec2Subtract } from '@threeify/math';

import { IDisposable } from '../core/types.js';

export class Orbit implements IDisposable {
  public lastPointerClient = new Vec2();
  public rotation = new Quat();
  public rotationVersion = -1;
  public onPointerDownHandler: (ev: PointerEvent) => any;
  public onPointerCancelHandler: (ev: PointerEvent) => any;
  public onPointerUpHandler: (ev: PointerEvent) => any;
  public onPointerMoveHandler: (ev: PointerEvent) => any;
  public onMouseWheelHandler: (ev: WheelEvent) => any;
  public disposed = false;
  public version = -1;

  // public spherical = new Spherical( 1.0, Math.PI * 0.5, 0.0 );
  public euler = new Euler3();
  public eulerMomentum = new Euler3();

  public zoom = 1;
  public zoomMomentum = 0;
  public zoomMin = 0.5;
  public zoomMax = 5;

  public damping = 0.1;

  constructor(public domElement: HTMLElement) {
    // work around JS / Dom event listener insanity: https://stackoverflow.com/questions/9720927/removing-event-listeners-as-class-prototype-functions
    this.onPointerDownHandler = this.onPointerDown.bind(this);
    this.onPointerCancelHandler = this.onPointerCancel.bind(this);
    this.onPointerUpHandler = this.onPointerUp.bind(this);
    this.onPointerMoveHandler = this.onPointerMove.bind(this);
    this.onMouseWheelHandler = this.onMouseWheel.bind(this);

    this.domElement.style.touchAction = 'none'; // disable touch scroll
    this.domElement.addEventListener('pointerdown', this.onPointerDownHandler, {
      passive: true
    });
    this.domElement.addEventListener(
      'pointercancel',
      this.onPointerCancelHandler,
      {
        passive: true
      }
    );
    this.domElement.addEventListener('wheel', this.onMouseWheelHandler, {
      passive: true
    });
  }

  dirty(): void {
    this.version++;
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
    //console.log('pointer down');
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
    //console.log('pointer up');
    this.domElement.releasePointerCapture(pe.pointerId);
    this.domElement.removeEventListener(
      'pointermove',
      this.onPointerMoveHandler
    );
    this.domElement.removeEventListener('pointerup', this.onPointerUpHandler);
  }

  onMouseWheel(we: WheelEvent) {
    //console.log('wheel');
    this.zoomMomentum += we.deltaY * this.damping * 0.002;
    this.dirty();
  }

  onPointerMove(pe: PointerEvent) {
    //console.log('pointer move', pe);
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
    //console.log('pointerClientDelta', pointerClientDelta);

    this.lastPointerClient.copy(pointerClient);
    this.dirty();
  }

  update() {
    this.euler.x += this.eulerMomentum.x;
    this.euler.y += this.eulerMomentum.y;
    this.eulerMomentum.x *= 1 - this.damping;
    this.eulerMomentum.y *= 1 - this.damping;

    this.rotation = euler3ToQuat(this.euler, this.rotation);

    const newZoom = this.zoom + this.zoomMomentum;
    this.zoomMomentum *= 1 - this.damping;
    this.zoom = Math.min(this.zoomMax, Math.max(this.zoomMin, newZoom));

    this.rotationVersion = this.version;
  }

  onPointerCancel(pe: PointerEvent) {
    // console.log("pointer cancel");
  }
}
