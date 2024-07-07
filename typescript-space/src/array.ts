const arr = [1, 2, 3, 4]

const arr2 = [1, 2, 3, 4]

console.log(Object.is(arr, arr2))
// false


const initialState = ['a', 'b', 'c']
const state = initialState

state[3] = 'd'

console.log(state)
// [ 'a', 'b', 'c', 'd' ]

console.log(Object.is(state, initialState))
//true


export {}