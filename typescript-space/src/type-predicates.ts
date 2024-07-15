// type Fish = {
//   name: string
//   age?: number
// }

// function isFish(fish: any): fish is Fish {
//   if (fish === null) {
//     return false
//   }
//   return (
//     typeof fish.name === "string" &&
//     (typeof fish.age === "number" || typeof fish.age === undefined)
//   )
// }

// const tuna: unknown = {
//   name: "tuna",
//   age: 5,
// }

// if (isFish(tuna)) {     // const tuna: unknown
//   console.log(tuna.age) // const tuna: Fish
// }

function isNumber(value: unknown): asserts value is number {
  if (typeof value !== "number") {
    throw new Error()
  }
  return
}

const value: unknown = 314
try {
  // const value: unknown
  console.log(value) // 314

  // const value: unknown
  isNumber(value)

  //const value: number
  console.log(value.toString(16)) //　"13a"
} catch (error) {
  console.log("error occurred")
}
