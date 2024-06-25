// type Fish = {
//     name: string
// }

// interface Age {
//     age: number
// }
// const salmon: Fish & Age = { name : 'Salmon' }

interface Age {
  age: number
}

interface Fish extends Age {
  name: string
}

// const salmon: Fish = { //Property 'name' is missing in type '{ age: number; }' but required in type 'Fish'.ts(2741)
//     age: 2
// }

export {}
