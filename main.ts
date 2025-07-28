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

enum RJPin {
    //% block="RJ1"
    RJ1,
    //% block="RJ2"
    RJ2,
    //% block="RJ3"
    RJ3,
    //% block="RJ4"
    RJ4
}

namespace Nezha {

    // MOTOR MODULE

    let MFL = 0
    let MFR = 1
    let MBL = 2
    let MBR = 3
    let Motors = [Motor.M1, Motor.M2, Motor.M3, Motor.M4]
    let Revert = [false, false, false, false]

    function setFrontLeftMotor(motor: Motor, revert: boolean) {
        Motors[0] = motor
        Revert[0] = revert
    }

    function setFrontRightMotor(motor: Motor, revert: boolean) {
        Motors[1] = motor
        Revert[1] = revert
    }

    function setBackLeftMotor(motor: Motor, revert: boolean) {
        Motors[2] = motor
        Revert[2] = revert
    }

    function setBackRightMotor(motor: Motor, revert: boolean) {
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
        motorSpeed(Motors[MBL], Revert[MBL] ? -backleft : backleft)
        motorSpeed(Motors[MBR], Revert[MBR] ? -backright : backright)
    }

    // speed in %
    export function setTwoWheelSpeed(left: number, right: number) {
        // supply positive values to obtain 'forward' spinning
        motorSpeed(Motors[MFL], Revert[MFL] ? -left : left)
        motorSpeed(Motors[MFR], Revert[MFR] ? -right : right)
    }

    // SERVO MODULE

    let Servos = [180, 180, 180, 180] // all ServoType.ST180

    function setServoType(servo: Servo, st: ServoType) {
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

    let ANAPIN = [DigitalPin.P1, DigitalPin.P2, DigitalPin.P13,DigitalPin.P15]
    let DIGPIN = [DigitalPin.P8, DigitalPin.P12, DigitalPin.P14, DigitalPin.P16]

    export function analogRead(pin: RJPin): number {
        return pins.analogReadPin(ANAPIN[pin])
    }

    export function analogWrite(pin: RJPin, value:number) {
        return pins.analogWritePin(ANAPIN[pin], value)
    }

    export function digitalRead(pin: RJPin): boolean {
        return (pins.digitalReadPin(DIGPIN[pin]) ? true : false)
    }

    export function digitalWrite(pin: RJPin, value: number) {
        return pins.analogWritePin(ANAPIN[pin], value)
    }
}
