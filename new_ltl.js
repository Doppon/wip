const LTLOperator = {
  not: "not",
  and: "and",
  or: "or",
  next: "next",
  always: "always",
  eventually: "eventually"
};

function evalT(formula, lookup = () => {}) {
  // formula: true | false
  if (typeof formula === "boolean") {
    return formula;
  // formula: { type: 'and', value:  true }
  } else if (typeof formula === "string") {
    return lookup(formula);
  }

  switch (formula.type) {
    case LTLOperator.not: {
      const f = evalT(formula.value, lookup);
      return typeof f === "boolean" ? !f : { type: LTLOperator.not, value: f };
    }

    case LTLOperator.and: {
      const fs = formula.value.map(f => evalT(f, lookup));    
      if (fs.indexOf(false) !== -1) return false; // valueのリストの中に false が入っていた場合は false に
      const fsWOBool = fs.filter(f => typeof f !== "boolean");
      return fsWOBool.length === 0 ? true // an empty conjunction is a conjunction of trues
           : fsWOBool.length === 1 ? fsWOBool[0] // "and" with one formula is just that formula
           : {
               type: LTLOperator.and,
               value: fsWOBool
           };
    }

    case LTLOperator.or: {
      const fs = formula.value.map(f => evalT(f, lookup));
      if (fs.indexOf(true) !== -1) return true; // valueのリストの中に true が入っていた場合は true に
      const fsWOBool = fs.filter(f => typeof f !== "boolean");
      return fsWOBool.length === 0 ? false // an empty disjunction is a disjunction of falses
           : fsWOBool.length === 1 ? fsWOBool[0] // "or" with one formula is just that formula
           : {
               type: LTLOperator.or,
               value: fsWOBool
             };
    }
    
    case LTLOperator.next: {
      // indexOf で value を見つけ, その次の値を評価するようにする
      return formula.value;
    }

    case LTLOperator.always: {
      // 受け取った経路に対して 全てなりたっているかを確認
      const f = evalT(formula.value, lookup);
      return typeof f === "boolean"
           ? !f
             ? f // false! done!
             : formula // if f is true, keep evaluating formula
           : {
               type: LTLOperator.and,
               value: [f, formula] // f is a partially evaluated formula
             };
    }

    case LTLOperator.eventually: {
      const f = evalT(formula.value, lookup);
      return typeof f === "boolean"
           ? f
             ? f // true! done!
             : formula // if f is false, keep evaluating formula
           : {
               type: LTLOperator.or,
               value: [f, formula] // f is a partially evaluated formula
             };
    }

    default: {
      throw new Error(`Unknown type: ${formula.type}`);
    }
  }
}

// ------------------------------------------------------

// メモ: 現状の仕様で以下のLTL式は解釈可能
let p1 = {
  type: LTLOperator.and,
  value: [
    {
      type: LTLOperator.next,
      value: false
    },
    {
      type: LTLOperator.next,
      value: false
    }
  ]
}

evalT( { type: LTLOperator.and, value: [ true, false ] } )

let p4 = {
  type: LTLOperator.always,
  value: true
}

// not の例
// ~A
let f1 = {
  type: LTLOperator.not,
  value: false
};
console.log( evalT(f1) ) // => true
console.log( evalT({ type: LTLOperator.not, value: false }) )

// and の例
// A /\ B
let f2 = {
  type: LTLOperator.and,
  value: [
    true,
    false
  ]
}
console.log( evalT(f2) ) // => false
console.log( evalT({ type: LTLOperator.and, value: [true, false] }) )

// and の例
// A /\ ~B
let f3 = {
  type: LTLOperator.and,
  value: [
    true,
    {
      type: LTLOperator.not,
      value: false
    }
  ]
}
console.log( evalT(f3) ) // => true

// and の例
// A /\ ~B /\ C
let f4 = {
  type: LTLOperator.and,
  value: [
    true,
    {
      type: LTLOperator.not,
      value: false
    },
    true
  ]
}
console.log( evalT(f4) )

// next の例
// ○A
let f4 = {
  type: LTLOperator.next,
  value: [
    true,
    {
      type: LTLOperator.not,
      value: false
    },
    true
  ]
}

// 公式の例
// A /\ ○B
let f = {
  type: LTLOperator.and,
  value: [
    "a",
    {
      type: LTLOperator.next,
      value: "b"
    }
  ]
};

f = evalT(f, literal => {
  const state = { a: true, b: true };
  return state[literal] ? state[literal] : false;
});
console.log("f after t0", f);

f = evalT(f, literal => {
  const state = { b: true };
  return state[literal] ? state[literal] : false;
});
console.log("f after t1", f);
