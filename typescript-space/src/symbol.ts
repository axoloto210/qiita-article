// const key1 =  Symbol('foo')
// const key2 =  Symbol('foo')

// const obj = {
//    [key1]: 123,
//    [key2]: 234
// }

// console.log(obj[key1])
// console.log(obj[key2])
// //@ts-ignore
// console.log(obj[Symbol('foo')])

const squidSymbol = Symbol('squid')

const fish = {
  tuna: "maguro",
  salmon: "sake",
  [squidSymbol]: 'ika',
  octopus: "tako",
}

Object.defineProperty(fish, 'crub', {
    value: 'kani'
  });
  

console.log(Object.keys(fish))
// [ 'tuna', 'salmon', 'octopus' ]
console.log(Object.getOwnPropertyNames(fish))
// [ 'tuna', 'salmon', 'octopus', 'crub' ]
console.log(Reflect.ownKeys(fish))
// [ 'tuna', 'salmon', 'octopus', 'crub', Symbol(squid) ]