// const array = [1, 2, 3]

// const doubleNum = (num: number) => 2 * num

// const newArray = array.map(doubleNum)

// console.log(newArray)
// // [ 2, 4, 6 ]

// console.log(Object.is(array, newArray))
// // false

const array = [1, 2, 3]

// forEach自体は常にundefined を返します。
array.forEach((element, index)=>{
    array[index] = 2 * element
})

console.log(array)
// [ 2, 4, 6 ]

export {}
