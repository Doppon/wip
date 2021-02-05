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
