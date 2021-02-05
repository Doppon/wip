const LTLOperator = require("./old_ltl.js").LTLOperator

class Foo {
	bar() {
		return 3
	}
}

let o = new Foo()
console.log("hoge")
console.log(LTLOperator.and)
