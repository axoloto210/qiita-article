

type HMT<T> = {
    [P in keyof T]: string | undefined
}

// type ArrayMT = {
//     [x: number]: string | undefined;
//     length: string | undefined;
//     toString: string | undefined;
//     toLocaleString: string | undefined;
//     pop: string | undefined;
//     push: string | undefined;
//     ... 26 more ...;
//     readonly [Symbol.unscopables]: string | undefined;
// }
type ArrayMT = {
    [P in keyof number[]]: string | undefined
}

//type ArrayHMT = (string | undefined)[]
type ArrayHMT = HMT<number[]>


// type TupleMT = {
//     [x: number]: string | undefined;
//     0: string | undefined;
//     1: string | undefined;
//     length: string | undefined;
//     toString: string | undefined;
//     toLocaleString: string | undefined;
//     pop: string | undefined;
//     ... 27 more ...;
//     readonly [Symbol.unscopables]: string | undefined;
// }
type TupleMT = {
    [P in keyof [number, string]]: string | undefined
}
// type TuppleHMT = [string | undefined, string | undefined]
type TuppleHMT = HMT<[number, string]>


export{}