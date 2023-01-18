import { IDisposable } from '../core/types.js';
import { Euler3, EulerOrder3 } from '../math/Euler3.js';
import { degToRad } from '../math/Functions.js';
import {
  angleAxisToQuat,
  euler3ToQuat,
  quatMultiply
} from '../math/Quat.Functions.js';
import { Quat } from '../math/Quat.js';
import { Vec3 } from '../math/Vec3.js';

const zAxis = new Vec3(0, 0, 1);
// - PI/2 around the x-axis
const q1 = new Quat(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

export class DeviceOrientation implements IDisposable {
  disposed = false;
  private deviceOrientation = new Euler3(0, 0, 0, EulerOrder3.YXZ);
  private screenOrientation = 0;
  private onDispose: () => void;
  private tempValue = new Quat();

  constructor() {
    // this is required because when invoked on an event, "this" is set to "window"
    const onDeviceOrientation = (event: DeviceOrientationEvent): void => {
      this.deviceOrientation.set(
        degToRad(event.beta ?? 0),
        degToRad(event.alpha ?? 0 - 180),
        -degToRad(event.gamma ?? 0),
        EulerOrder3.YXZ
      );
    };
    const onOrientationChange = (): void => {
      console.log('orientation', window.orientation);
      this.screenOrientation = -degToRad(window.orientation as number);
    };

    /* if (
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
    } else { */
    window.addEventListener('orientationchange', onOrientationChange, false);
    window.addEventListener('deviceorientation', onDeviceOrientation, false);
    // }

    this.onDispose = (): void => {
      window.removeEventListener(
        'orientationchange',
        onOrientationChange,
        false
      );
      window.removeEventListener(
        'deviceorientation',
        onDeviceOrientation,
        false
      );
    };
  }

  get orientation(): Quat {
    const result = euler3ToQuat(this.deviceOrientation);
    // camera looks out the back of the device, not the top
    quatMultiply(result, q1, result);
    // adjust for screen orientation
    quatMultiply(
      result,
      angleAxisToQuat(this.screenOrientation, zAxis, this.tempValue),
      result
    );

    return result;
  }

  dispose(): void {
    if (this.disposed) return;

    this.onDispose();
    this.disposed = true;
  }
}
