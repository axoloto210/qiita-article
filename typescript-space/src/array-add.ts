// const array = [1, 2, 3]

// const newArray = [...array, 4]

// console.log(newArray)
// //[ 1, 2, 3, 4 ]

// console.log(Object.is(newArray, array))
// // false

// const array = [1, 2, 3]

// const newArray = array.concat([4])

// console.log(newArray)
// //[ 1, 2, 3, 4 ]

// console.log(Object.is(newArray, array))
// // false

const array = [1, 2, 3]

const length = array.unshift(4)

console.log(array)
// [ 4, 1, 2, 3 ]

console.log(length)
// 4

export {}
