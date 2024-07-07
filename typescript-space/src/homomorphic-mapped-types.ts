// type Obj = {
//   readonly num: number
//   str?: string
// }

type Homomorphic = {
  [P in keyof Obj]: Obj[P]
}
// type Homomorphic = {
//     readonly num: number;
//     str?: string | undefined;
// }

type keyStr = "num" | "str"

type NonHomomorphic = {
  [P in keyStr]: Obj[P]
}
// type NonHomomorphic = {
//     num: number;
//     str: string | undefined;
// }

type Obj = {
    readonly num: number
    str?: string
  }
  
type Obj2 = {
    foo: string
    bar: number
}

type HMT<T> = {
    [P in keyof T]: string
}

//type UnionHMT = HMT<Obj> | HMT<Obj2>
type UnionHMT = HMT<Obj | Obj2>

type MT<X extends PropertyKey> = {
[P in X]: string
}

// type UnionMT = {
//     num: string;
//     str: string;
//     foo: string;
//     bar: string;
// }
type UnionMT = MT<keyof Obj | keyof Obj2>


export {}