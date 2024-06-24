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
export {};
