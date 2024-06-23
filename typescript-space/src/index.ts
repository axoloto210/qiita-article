type Fish = {
    name: string
}

interface Human {
    age: number
}

const a: Fish & Human = {name : 'Salmon'}

interface Fish2 {
    name: string
}