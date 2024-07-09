// const array = [4, 5, 2, 3, 1]

// const newArray = [...array].sort()

// console.log(newArray)
// // [ 1, 2, 3, 4, 5 ]

// console.log(Object.is(array, newArray))
// // false

const array = [4, 5, 2, 3, 1]

const newArray = array.sort()

console.log(newArray)
// [ 1, 2, 3, 4, 5 ]

console.log(Object.is(array, newArray))
// true

// const array = [4, 5, 2, 3, 1]

// //@ts-ignore
// const newArray = array.toSorted()

// console.log(newArray)
// // [ 1, 2, 3, 4, 5 ]

// console.log(Object.is(array, newArray))
// // false

export {}