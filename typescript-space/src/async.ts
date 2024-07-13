// setTimeout(() => {
//     console.log('実行されました')
//   }, 1000)

// setTimeout(() => { console.log('実行されました') }, 10)

// const array = [1, 2, 3, 4, 5]
// for (let i = 0; i < 20000; i++) {
//   array.push(array.length + 1)
//   array.sort()
//   array.reverse()
// }
// console.log(array.length)

// setTimeout(() => { console.log('1,000ms') }, 1000)
// setTimeout(() => { console.log('5,000ms') }, 5000)
// setTimeout(() => { console.log('10ms') }, 10)

setTimeout(() => {
  console.log("1,000ms")
}, 1000)
setTimeout(() => {
  console.log("5,000ms")
}, 5000)

const startTime = Date.now()
while (Date.now() - startTime < 10000) {}

setTimeout(() => {
  console.log("10ms")
}, 10)
