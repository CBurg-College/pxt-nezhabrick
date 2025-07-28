/*
The code below is a refactoring of:
- the ElecFreaks 'pxt-nezha' library:
  https://github.com/elecfreaks/pxt-nezha/blob/master/main.ts
MIT-license.
*/

enum Motor {
    //% block="M1"
    M1,
    //% block="M2"
    M2,
    //% block="M3"
    M3,
    //% block="M4"
    M4
}

enum Servo {
    //% block="S1" 
    S1,
    //% block="S2"
    S2,
    //% block="S3" 
    S3,
    //% block="S4"
    S4
}

enum ServoType {
    //% block="180"
    ST180 = 180,
    //% block="180"
    ST27 = 270,
    //% block="360"
    ST360 = 360
}

enum AnalogRJ {
    //% block="J1"
    J1 = AnalogPin.P1,
    //% block="J2"
    J2 = AnalogPin.P2,
    //% block="J3"
    J3 = AnalogPin.P13,
    //% block="J4"
    J4 = AnalogPin.P15
}

enum DigitalRJ {
    //% block="J1"
    J1 = DigitalPin.P8,
    //% block="J2"
    J2 = DigitalPin.P12,
    //% block="J3"
    J3 = DigitalPin.P14,
    //% block="J4"
    J4 = DigitalPin.P16
}

namespace Nezha {

    // MOTOR MODULE

    let MFL = 0
    let MFR = 1
    let MRL = 2
    let MRR = 3
    let Motors = [Motor.M1, Motor.M2, Motor.M3, Motor.M4]
    let Revert = [false, false, false, false]

    export function setFrontLeftMotor(motor: Motor, revert: boolean) {
        Motors[0] = motor
        Revert[0] = revert
    }

    export function setFrontRightMotor(motor: Motor, revert: boolean) {
        Motors[1] = motor
        Revert[1] = revert
    }

    export function setRearLeftMotor(motor: Motor, revert: boolean) {
        Motors[2] = motor
        Revert[2] = revert
    }

    export function setRearRightMotor(motor: Motor, revert: boolean) {
        Motors[3] = motor
        Revert[3] = revert
    }

    // speed in %
    export function motorSpeed(motor: Motor, speed: number): void {
        speed = Math.map(speed, 0, 100, 0, 150)

        let iic_buffer = pins.createBuffer(4);

        if (speed > 150) speed = 150
        else
        if (speed < -150) speed = -150

        iic_buffer[0] = motor + 1
        if (speed >= 0) {
            iic_buffer[1] = 0x01; // forward
            iic_buffer[2] = speed;
        }
        else {
            iic_buffer[1] = 0x02; // reverse
            iic_buffer[2] = -speed;
        }
        iic_buffer[3] = 0;

        pins.i2cWriteBuffer(0x10, iic_buffer);
    }

    // speed in %
    export function setFourWheelSpeed(frontleft: number, frontright: number, backleft: number, backright: number) {
        // supply positive values to obtain 'forward' spinning
        motorSpeed(Motors[MFL], Revert[MFL] ? -frontleft : frontleft)
        motorSpeed(Motors[MFR], Revert[MFR] ? -frontright : frontright)
        motorSpeed(Motors[MRL], Revert[MRL] ? -backleft : backleft)
        motorSpeed(Motors[MRR], Revert[MRR] ? -backright : backright)
    }

    // speed in %
    export function setTwoWheelSpeed(left: number, right: number) {
        // supply positive values to obtain 'forward' spinning
        motorSpeed(Motors[MFL], Revert[MFL] ? -left : left)
        motorSpeed(Motors[MFR], Revert[MFR] ? -right : right)
    }

    // SERVO MODULE

    let Servos = [180, 180, 180, 180] // all ServoType.ST180

    export function setServoType(servo: Servo, st: ServoType) {
        Servos[servo] = st
    }

    export function servoAngle(servo: Servo, angle: number): void {
        angle = Math.map(angle, 0, Servos[servo], 0, 180)
        let iic_buffer = pins.createBuffer(4);
        iic_buffer[0] = 0x10 + servo
        iic_buffer[1] = angle;
        iic_buffer[2] = 0;
        iic_buffer[3] = 0;
        pins.i2cWriteBuffer(0x10, iic_buffer);
    }

    // RJPIN MODULE

    export function analogRead(pin: AnalogRJ): number {
        return pins.analogReadPin(pin)
    }

    export function analogWrite(pin: AnalogRJ, value:number) {
        return pins.analogWritePin(pin, value)
    }

    export function digitalRead(pin: DigitalRJ): boolean {
        return (pins.digitalReadPin(pin) ? true : false)
    }

    export function digitalWrite(pin: DigitalRJ, value: number) {
        return pins.analogWritePin(pin, value)
    }
}
