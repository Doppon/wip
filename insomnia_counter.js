const layer = require("contextjs").layer
const proceed = require("contextjs").proceed
const withLayers = require("contextjs").withLayers

class Patient {
    hasInsomnia() {
        return false
    }
    alarmClockMode() {
        return 'Normal'
    }
}

const hasInsomnia = layer("hasInsomnia")
hasInsomnia.refineClass(Patient, {
    hasInsomnia() { return true },
    alarmClockMode() { return 'Light' }
})

const wake = true
const sleep = false

let trace = [sleep, sleep, sleep, sleep, wake, wake, wake, wake, wake, sleep, sleep, sleep, sleep, wake]
let counter = 0

let p = new Patient()
console.log(p.hasInsomnia())  // False
console.log(p.alarmClockMode())  // Normal

// traceで2回起床していたらHas insomniaとする
for (let i = 1; i < trace.length; i++) {
    if (trace[i - 1] == sleep && trace[i] == wake) {
        counter += 1
    }
    if (counter === 2) {
        console.log("Woke up 2 times. Has insomnia")
        break
    }
    if (i === trace.length - 1) {
        console.log("No insomnia")
    }
}