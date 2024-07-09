// const array = [1, 2, 3]

// const newArray = array.filter((element)=> {
//     return true
// })

// console.log(newArray)
// // [ 1, 2, 3 ]

// console.log(Object.is(newArray, array))
// // false

// const array = [1, 2, 3]

// const poppedElement = array.pop()

// console.log(poppedElement)
// // 3

// console.log(array)
// // [ 1, 2 ]
// const empty = [].pop()

// console.log(empty)
// // undefined

// const array = ['a', 'b', 'c', 'd']
// array.splice(1, 2, 'e', 'f')

// console.log(array)
// //[ 'a', 'e', 'f', 'd' ]

// const array = ['a', 'b', 'c', 'd']
// array.splice(2, Infinity)

// console.log(array)
// // [ 'a', 'b' ]


const array = ['a', 'b', 'c', 'd', 'e', 'f']
array.splice(2, 3, 'g')

console.log(array)
//[ 'a', 'b', 'g', 'f' ]

export {}
