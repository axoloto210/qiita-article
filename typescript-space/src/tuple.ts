
type Tuple = [number, string, boolean]

const tuple: Tuple = [123, 'abc', true]

// const errorTuple: Tuple = ['123', 'abc', true]
// // Type 'string' is not assignable to type 'number'.ts(2322)


// type RestElementTuple = [string, ...number[], ...string[]]


type OptionalTuple = [number, string, boolean?]

const optionalTuple: OptionalTuple = [123, 'abc']


// type MidOptional = [number, string?, boolean]
// const midOptional: MidOptional = [123, ,true]

// type RestOptionalTuple = [number, ...string[], boolean?]
//type RestOptionalTuple = [number, ...string[], boolean?]

export {}