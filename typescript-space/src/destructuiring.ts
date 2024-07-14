
// const obj = {
//   foo: 271,
//   bar: "str",
//   "1234": 314,
// }
// const { foo, "1234": var1234 } = obj

// console.log( foo )
// // 271
// console.log( var1234 )
// // 314

const nestedObj = {
    foo: 123,
    obj: {
      bar: 1,
      obj2: {
        baz: 2,
      },
    },
  }
  const { obj: {bar, obj2: { baz }}} = nestedObj
  
  console.log(bar)
  // 1
  console.log(baz)
  // 2