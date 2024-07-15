---
title: Mapped Types による配列型・タプル型の保持
tags:
  - TypeScript
private: true
updated_at: '2024-07-15T15:48:19+09:00'
id: 9020310b88f68190b6e7
organization_url_name: null
slide: false
ignorePublish: false
---
## Mapped Types
Mapped Types は`{ [P in X]: Y }`の形で宣言できる型で、`X`で指定したキーを持つオブジェクト型を宣言できます。
`X`に指定できる型はプロパティのキーとなれる型`string | number | symbol`の部分型に限られます。

ちなみに`string | number | symbol`には、`PropertyKey`という別名がついています。
```ts: typescript/lib/lib.es5.d.ts
declare type PropertyKey = string | number | symbol;
```
https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

## 配列型・タプル型の構造の保持
型引数`T`をもち、`{ [P in keyof T]: U }`という形の型に`T`として配列型やタプル型を渡した場合、配列構造やタプル構造がそのまま保持されます。

これはTypeScript 3.1 から導入された仕組みのようですね。

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.html#mapped-types-on-tuples-and-arrays

### 配列型の構造の保持
`type HMT<T> = { [P in keyof T]: string | undefined }`という型引数`T`をとる`HMT<T>`型について考えてみます。
以下のように`T`として配列を渡した場合と、型引数を介さずに直接`T`の部分に配列を記述した場合を比べてみると、得られる型が異なっていることがわかります。
```ts
type HMT<T> = {
    [P in keyof T]: string | undefined
}

//type ArrayHMT = (string | undefined)[]
type ArrayHMT = HMT<number[]>

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

```
型引数を介した場合（`HMT<number[]>`）には、得られる型が配列型`(string | undefined)[]`となっています。

一方で、直接配列型を記述した場合には、配列ではなくインデックスシグネチャ`[x: number]: string | undefined;`に変換されており、配列操作用の関数名`pop`や`push`もプロパティキーに含まれてしまっています。

### タプル型の構造の保持
配列と同様のことがタプル型にも適用されます。
```ts
type HMT<T> = {
    [P in keyof T]: string | undefined
}

// type TuppleHMT = [string | undefined, string | undefined]
type TuppleHMT = HMT<[number, string]>

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
```
`[number, string]`型を型引数に渡した場合には、タプル構造が保持された状態の方が得られています。
一方、直接タプル型を記述した場合にはタプルの配列操作用の関数に加えて、タプルの要素番号`0`や`1`も含めて型情報に含まれてしまっています。

## おわりに
配列型やタプル型をMapped Types によって操作する場面で配列のラッパーオブジェクトのプロパティキーが顔を出してくると使いづらいため、型引数を介した操作の場合には配列やタプルの構造をそのまま保持するようにしてくれているみたいですね。

`{ [P in keyof T]: U }`という形のMapped Types はHomomorphic Mapped Types という名で呼ばれ、配列型・タプル型の他にも、オブジェクト型を受け取った場合に構造が保持されるような仕組みとなっています。
