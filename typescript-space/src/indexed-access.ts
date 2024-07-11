type Fish = { name?: string; age?: number }

let fishName: keyof Fish = "name"

const fish: Fish =
  Math.random() > 0.5 ? { name: "salmon" } : { name: undefined }

if (typeof fish[fishName] !== "undefined") {
  fish[fishName].toUpperCase() // Object is possibly 'undefined'.ts(2532)
  console.log(fish[fishName])
}

export {}
