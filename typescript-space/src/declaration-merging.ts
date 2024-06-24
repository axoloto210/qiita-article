interface Fish {
  name: string;
}

interface Fish {
  weight: number;
  height: number;
}

type Name = { name: string };

type Size = {
  weight: number;
  height: number;
};

// type Fish = Name & Size

const salmon: Fish = {
  name: "Salmon",
};

//interface　のときのエラー
//Type '{ name: string; }' is missing the following properties from type 'Fish': weight, height ts(2739)

//型エイリアスのときのエラー
//Type '{ name: string; }' is not assignable to type 'Fish'.
//Type '{ name: string; }' is missing the following properties from type 'Size': weight, height ts(2322)

interface Octopus {
  name: string;
}

interface Octopus {
  name: "octopus";
}
//Subsequent property declarations must have the same type.  Property 'name' must be of type 'string', but here has type '"octopus"'.ts(2717)


// interface Tuna {
//   weight: number;
//   height: number;
//   swim(velocity: 123): number;
// }
// interface Tuna {
//   name: string;
//   swim(velocity: number): number;
// }



// const tuna: Tuna = {
//   name: "Tuna",
//   weight: 40,
//   height: 80,
//   swim: (velocity) => velocity, // (method) Tuna.swim(velocity: 123): number (+1 overload)
// };


interface Tuna {
  name: string;
  swim(velocity: number): number;
}

interface Tuna {
  weight: number;
  height: number;
  swim(velocity: 123): number;
}

const tuna: Tuna = {
  name: "Tuna",
  weight: 40,
  height: 80,
  swim: (velocity) => velocity, // (method) Tuna.swim(velocity: number): number (+1 overload)
};

export {};
