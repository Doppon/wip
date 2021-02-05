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

let trace = [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1]
let counter = 0

let p = new Patient()
console.log(p.hasInsomnia())  // False
console.log(p.alarmClockMode())  // Normal

// traceで3回起床していたらHas insomniaとする
for (let i = 1; i < trace.length; i++) {
    if (trace[i - 1] == 0 && trace[i] == 1) {
        counter += 1
    }
    if (counter === 3) {
        console.log("Woke up 3 times. Has insomnia")
        break
    }
    if (i === trace.length - 1) {
        console.log("No insomnia")
    }
}