function Type () {
    for (let row = 0; row <= 3; row++) {
        if (row == 0) {
            pins.digitalWritePin(DigitalPin.P9, 1)
            pins.digitalWritePin(DigitalPin.P6, 0)
            pins.digitalWritePin(DigitalPin.P10, 0)
            pins.digitalWritePin(DigitalPin.P4, 0)
        } else if (row == 1) {
            pins.digitalWritePin(DigitalPin.P9, 0)
            pins.digitalWritePin(DigitalPin.P6, 1)
            pins.digitalWritePin(DigitalPin.P10, 0)
            pins.digitalWritePin(DigitalPin.P4, 0)
        } else if (row == 2) {
            pins.digitalWritePin(DigitalPin.P9, 0)
            pins.digitalWritePin(DigitalPin.P6, 0)
            pins.digitalWritePin(DigitalPin.P10, 1)
            pins.digitalWritePin(DigitalPin.P4, 0)
        } else if (row == 3) {
            pins.digitalWritePin(DigitalPin.P9, 0)
            pins.digitalWritePin(DigitalPin.P6, 0)
            pins.digitalWritePin(DigitalPin.P10, 0)
            pins.digitalWritePin(DigitalPin.P4, 1)
        }
        if (pins.digitalReadPin(DigitalPin.P3) == 1) {
            colume = 0
            cur += 1
            I2C_LCD1602.ShowString(group[row][colume], cur, 0)
            key_pressed = group[row][colume]
            input2 = "" + input2 + key_pressed
        } else if (pins.digitalReadPin(DigitalPin.P2) == 1) {
            colume = 1
            cur += 1
            I2C_LCD1602.ShowString(group[row][colume], cur, 0)
            key_pressed = group[row][colume]
            input2 = "" + input2 + key_pressed
        } else if (pins.digitalReadPin(DigitalPin.P1) == 1) {
            colume = 2
            cur += 1
            I2C_LCD1602.ShowString(group[row][colume], cur, 0)
            key_pressed = group[row][colume]
            input2 = "" + input2 + key_pressed
        } else if (pins.digitalReadPin(DigitalPin.P0) == 1) {
            colume = 3
            cur += 1
            I2C_LCD1602.ShowString(group[row][colume], cur, 0)
            key_pressed = group[row][colume]
            input2 = "" + input2 + key_pressed
        }
    }
    basic.pause(20)
}
function Open () {
    if (enabled == 0) {
        I2C_LCD1602.clear()
    } else {
        alarm_on = 1
        radio.sendString("ALARM")
    }
}
function Check () {
    if (input2.includes(code)) {
        I2C_LCD1602.ShowString("|** CORRECT! **|", 0, 0)
        I2C_LCD1602.ShowString("|**    :D    **|", 0, 1)
        enabled = 0
        control_mode_on = 1
    } else {
        I2C_LCD1602.ShowString("|**INCORRECT!**|", 0, 0)
        I2C_LCD1602.ShowString("|**    >:(   **|", 0, 1)
        control_mode_on = 0
    }
}
function startup__pad () {
    code = "4783"
    key_pressed = "w"
    enabled = 1
    input2 = ""
    cur = -1
    led.enable(false)
    I2C_LCD1602.LcdInit(0)
    group = [
    [
    "1",
    "2",
    "3",
    "A"
    ],
    [
    "4",
    "5",
    "6",
    "B"
    ],
    [
    "7",
    "8",
    "9",
    "C"
    ],
    [
    "*",
    "0",
    "#",
    "D"
    ]
    ]
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "ENABLED") {
        enabled = 1
    } else if (receivedString == "DISABLED") {
        enabled = 0
    } else if (receivedString == "ALARMOFF") {
        alarm_on = 0
    }
})
input.onButtonPressed(Button.B, function () {
    I2C_LCD1602.ShowString(input2, 0, 1)
})
let control_mode_on = 0
let code = ""
let alarm_on = 0
let enabled = 0
let input2 = ""
let key_pressed = ""
let group: string[][] = []
let cur = 0
let colume = 0
radio.setGroup(17)
pins.setAudioPin(AnalogPin.P12)
music.setVolume(255)
startup__pad()
loops.everyInterval(15000, function () {
    radio.sendString("whatever")
})
basic.forever(function () {
    Type()
    if (key_pressed.includes("A")) {
        Check()
    } else if (key_pressed.includes("C")) {
        I2C_LCD1602.clear()
        cur = -1
        input2 = ""
        control_mode_on = 0
    }
    // this will allow the user to turn on or off the alarms only after they put in the correct code
    if (control_mode_on == 1) {
        if (key_pressed.includes("B")) {
            alarm_on = 0
            radio.sendString("ALARMOFF")
            control_mode_on = 0
        } else if (key_pressed.includes("D")) {
            if (enabled == 0) {
                enabled = 1
                radio.sendString("ENABLED")
            } else {
                enabled = 0
                radio.sendString("DISABLED")
            }
            control_mode_on = 0
        }
    }
    // detects if a system is open and sends alarm
    // 
    // pins for alarm are pin 16 and __________
    if (pins.digitalReadPin(DigitalPin.P16) == 0 || pins.digitalReadPin(DigitalPin.P16) == 0) {
        Open()
    }
    // this is the alarm code
    if (enabled == 1 && alarm_on == 1) {
        I2C_LCD1602.ShowString("ALARM", 0, 0)
    }
    basic.pause(100)
})
