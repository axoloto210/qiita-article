---
title: Homomorphic Mapped Types と準同型写像
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## Homomorphic Mapped Types　とは
**Homomorphic Mapped Types** は、Mapped Types の一種で、オプショナル修飾子`?`や`readonly`などの修飾子をそのままに、オブジェクトの型の構造を保持したまま新しい型を宣言できることが特徴的です。
書き方にMapped Types との違いは特になく、`{[P in X]: Y}`のように記述しますが、これがHomomorphic Mapped Types となる条件は、**`X`の部分がオブジェクトのプロパティキーの型となっていること**です。
つまり、Homomorphic Mapped Types は、`{[P in keyof T]: U}`の形で表されるものとなります。

`T`の部分にオブジェクトのキー（のユニオン型）が渡されると、宣言されるオブジェクトの型には`T`と同じプロパティキーが含まれることになります（プロパティの型自体は`U`の部分によって変化します）。

## Homomorphic Mapped Types の性質

### `?`や`readonly`の保持
以下の例では、Mapped Types `{[P in X]: Y}`の`in X`の部分に`keyof`を使ってオブジェクトのキーを指定した場合には`?`や`readonly`が保持され、オブジェクトのキーを単にユニオン型で指定した場合には修飾子が保持されないことを確認できます。
```ts
type Obj = {
  readonly num: number
  str?: string
}

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
```

### Union Distribution
Homomorphic Mapped Types には、Conditional Types と同様にユニオン型を分配する働き（Union Distribution）があります。

https://qiita.com/axoloto210/items/627b019995b81d918f7d

型引数`T`をとるHomomorphic Mapped Types `HMT<T>`に対してユニオン型`X | Y`を渡すと、`HMT<X | Y>`は`HMT<X> | HMT<Y>`のようにユニオン型が分配される形となります。

型引数`T`をとるHomomorphic Mapped Types `HMT<T>`と通常のMapped Types `MT<T>`のそれぞれにユニオン型を渡してみます。
```ts
type Obj = {
    readonly num: number
    str?: string
  }
  
type Obj2 = {
    foo: string
    bar: number
}

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

type HMT<T> = {
    [P in keyof T]: string
}

//type UnionHMT = HMT<Obj> | HMT<Obj2>
type UnionHMT = HMT<Obj | Obj2>
```
Mapped Types `MT<X extends PropertyKey>`に`keyof Obj`と`keyof Obj2`のユニオン型を渡した場合にはUnion Distribution は働かずに、2つのオブジェクトのプロパティキーを合併したオブジェクト型になっています。

一方でHomomorphic Mapped Types `HMT<T>`に`Obj`と`Obj2`のユニオン型を渡した場合にはUnion Distribution が働き、`HMT<Obj> | HMT<Obj2>`とユニオン型が分配されていることがわかります。


## Homomorphic Mapped Types と準同型写像
構造を保存する写像である、準同型写像(homomorphic mapping)が名前の由来となっているようです。
Homomorphic Mapped Types`{[P in keyof T]: U}`は、作成元となるオブジェクト型`T`と全く同じプロパティキーをもつため、オブジェクトの構造が保存されていることを**homomorphic**と表しているようですね。

>A mapped type of the form { [P in keyof T]: X } is homomorphic with T (because it has the same set of properties as T) and now preserves the optional and readonly modifiers as they exist on the properties in T.

https://github.com/microsoft/TypeScript/pull/12563

ちなみに、ユニオン型を分配する働きが追加されたころは、Isomorphic Mapped Types と呼ばれていたようです。

https://github.com/microsoft/TypeScript/pull/12447