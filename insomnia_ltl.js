const { LTLOperator, evaluate } = require('./new_ltl.js')

const wake = true
const sleep = false

let trace = [sleep, sleep, sleep, sleep, wake, wake, wake, wake, wake, sleep, sleep, sleep, sleep, wake]

let f = {
    type: LTLOperator.and,
    value: [
        true, true
    ]
};

console.log(evaluate(f))