/*
The code below is a refactoring of:
- the ElecFreaks 'pxt-nezha' library:
  https://github.com/elecfreaks/pxt-nezha/blob/master/main.ts
MIT-license.
*/

let AnalogRJ = [AnalogPin.P8, AnalogPin.P1,
                AnalogPin.P12, AnalogPin.P2,
                AnalogPin.P14, AnalogPin.P13,
                AnalogPin.P16, AnalogPin.P15]

let DigitalRJ = [DigitalPin.P8, DigitalPin.P1,
                DigitalPin.P12, DigitalPin.P2,
                DigitalPin.P14, DigitalPin.P13,
                DigitalPin.P16, DigitalPin.P15]

namespace Nezha {

    // MOTOR MODULE

    let MFL = 0
    let MFR = 1
    let MRL = 2
    let MRR = 3
    let Motors = [Motor.M1, Motor.M2, Motor.M3, Motor.M4]
    let Revert = [false, false, false, false]

    export function setLeftMotor(motor: Motor, revert: boolean) {
        Motors[0] = motor
        Revert[0] = revert
    }

    export function setRightMotor(motor: Motor, revert: boolean) {
        Motors[1] = motor
        Revert[1] = revert
    }

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
    export function fourWheelSpeed(frontleft: number, frontright: number, backleft: number, backright: number) {
        // supply positive values to obtain 'forward' spinning
        motorSpeed(Motors[MFL], Revert[MFL] ? -frontleft : frontleft)
        motorSpeed(Motors[MFR], Revert[MFR] ? -frontright : frontright)
        motorSpeed(Motors[MRL], Revert[MRL] ? -backleft : backleft)
        motorSpeed(Motors[MRR], Revert[MRR] ? -backright : backright)
    }

    // speed in %
    export function twoWheelSpeed(left: number, right: number) {
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

    export function servoSpeed(servo: Servo, speed: number): void {
        if ( Servos[servo] != ServoType.ST180) return
        speed = Math.map(speed, -100, 100, 0, 180)
        let iic_buffer = pins.createBuffer(4);
        iic_buffer[0] = 0x10 + servo
        iic_buffer[1] = speed;
        iic_buffer[2] = 0;
        iic_buffer[3] = 0;
        pins.i2cWriteBuffer(0x10, iic_buffer);
    }

    // RJPort MODULE

    export function analogRead(port: RJPort, line: RJLine): number {
        return pins.analogReadPin(AnalogRJ[port * 2 + line])
    }

    export function analogWrite(port: RJPort, line: RJLine, value: number) {
        pins.analogWritePin(AnalogRJ[port * 2 + line], value)
    }

    export function digitalRead(port: RJPort, line: RJLine): Digital {
        return pins.digitalReadPin(DigitalRJ[port * 2 + line])
    }

    export function digitalWrite(port: RJPort, line: RJLine, value: Digital) {
        pins.digitalWritePin(DigitalRJ[port * 2 + line], value);
    }
}


