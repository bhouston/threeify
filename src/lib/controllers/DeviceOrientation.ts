import { Euler, EulerOrder } from "../math/Euler";
import { Quaternion } from "../math/Quaternion";
import { makeQuaternionFromAxisAngle, makeQuaternionFromEuler } from "../math/Quaternion.Functions";
import { degToRad } from "../math/Utilities";
import { Vector3 } from "../math/Vector3";
import { Controller } from "./Controller";

export class DeviceOrientationController extends Controller {
  deviceOrientation = new Euler(0, 0, 0, EulerOrder.YXZ);
  screenOrientation = 0;
  onDispose: (() => void) | undefined = undefined;

  constructor(public fnCallback: (orientation: Quaternion) => void) {
    super();

    // this is required because when invoked on an event, "this" is set to "window"
    const onDeviceOrientation = (event: DeviceOrientationEvent): void => {
      this.deviceOrientation.set(degToRad(event.beta ?? 0), degToRad(event.alpha ?? 0), degToRad(event.gamma ?? 0));
    };
    const onOrientationChange = (): void => {
      this.screenOrientation = -degToRad(window.orientation as number);
    };

    if (
      // iOS 13+
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      window.DeviceOrientationEvent !== undefined &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias, cflint/no-this-assignment
      window.DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("orientationchange", onOrientationChange, false);
            window.addEventListener("deviceorientation", onDeviceOrientation, false);
          }
        })
        .catch(() => {
          throw new Error("DeviceOrientation API not available.");
        });
    } else {
      window.addEventListener("orientationchange", onOrientationChange, false);
      window.addEventListener("deviceorientation", onDeviceOrientation, false);
    }

    this.onDispose = (): void => {
      window.removeEventListener("orientationchange", onOrientationChange, false);
      window.removeEventListener("deviceorientation", onDeviceOrientation, false);
    };
  }

  update(): void {
    if (!this.enabled) {
      return;
    }

    const zAxis = new Vector3(0, 0, 1);
    const q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    const result = makeQuaternionFromEuler(this.deviceOrientation);
    result.multiply(q1); // camera looks out the back of the device, not the top
    result.multiply(makeQuaternionFromAxisAngle(zAxis, this.screenOrientation)); // adjust for screen orientation

    this.fnCallback(result);
  }

  dispose(): void {
    if (!this.disposed) {
      if (this.onDispose !== undefined) {
        this.onDispose();
      }
      super.dispose();
    }
  }
}
