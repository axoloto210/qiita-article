const iterableObject = {
    *[Symbol.iterator]() {
        const random = Math.floor(Math.random() * 10) 
        let restNum = random
        
        while (restNum < 10) {
            yield restNum++
        }
    }
}

console.log([...iterableObject])



// const iterableObject = {
//     *generatorFn() {
//         const random = Math.floor(Math.random() * 10) 
//         let restNum = random
        
//         while (restNum < 10) {
//             yield restNum++
//         }
//     }
// }

// console.log([...iterableObject.generatorFn()])


function* generatorFn(){
    yield 1
} 

type a = Generator