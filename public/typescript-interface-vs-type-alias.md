---
title: interface vs type alias
tags:
  - TypeScript
private: false
updated_at: '2024-06-26T00:32:20+09:00'
id: 5514ea94278e305b7df1
organization_url_name: null
slide: false
ignorePublish: false
---
## type alias とinterface 宣言
オブジェクトの型を宣言する方法には、`type`文を使った型エイリアス（type alias）による宣言と`interface`を使った`interface`宣言があります。

https://qiita.com/axoloto210/items/b4b61484438b487a68eb


本記事では型エイリアスとinterface宣言の差についてみていきたいと思います。
## 宣言時に使える構文
オブジェクトの宣言時に使える構文が型エイリアスと`interface`宣言とでは異なります。
### 型エイリアスにしかできないこと
基本的には型エイリアスにしかできないことの方が多くあります。

まず、型エイリアスではMapped Types による型の構成が可能で、`interface`宣言では使用できません。

https://qiita.com/axoloto210/items/f019854bc9c6af2f0979

ほかにも、型エイリアスではオブジェクト型以外の型を宣言可能です。

### interface宣言にしかできないこと
`interface`宣言でできることは型エイリアスでも代用できるものが多くありますが、Declaration Merging については`interface`宣言特有の性質だと言えます。

https://qiita.com/axoloto210/items/bccc48dd900f86bd47bd

型エイリアスで同名の型を宣言すると型エラーとなりますが、`interface`宣言の場合には型エラーとはならず、1つの`interface`として扱われるようになる性質があります。

## エラーメッセージの種類
型エイリアスと`interface`とでエラーメッセージの内容が異なる場合があります。

以下は、`interface`宣言による型のプロパティが足りないときにでる型エラーメッセージです。
```ts
interface Fish {
  name: string
}

interface Fish {
  weight: number
  height: number
}

const salmon: Fish = {
  name: "Salmon",
};
```
```
Type '{ name: string; }' is missing the following properties from type 'Fish': weight, height ts(2739)
```
`interface`宣言のときのエラーメッセージには、`weight`と`height`が無いという旨のエラーメッセージになっています。

一方で、同様のことを型エイリアスと交差型で確認してみると、エラーメッセージの種類が少し変わります。
```ts
type Name = { name: string }

type Size = {
  weight: number
  height: number
};

type Fish = Name & Size

const salmon: Fish = {
  name: "Salmon",
};
```
```
Type '{ name: string; }' is not assignable to type 'Fish'.
Type '{ name: string; }' is missing the following properties from type 'Size': weight, height ts(2322)
```
型エイリアスのときのエラーメッセージには、`{ name: string; }`が`Fish`型の変数に代入できないという旨のメッセージが追加されており、エラーコードも`interface`宣言のときとは異なっています。

## コンパイラのパフォーマンスの違い
複数のオブジェクト型を合併して1つのオブジェクト型として宣言したいときに、`interface`宣言では`extends`を使用して表現できます。
型エイリアスの場合には、交差型`&`を使って同様の型を表現できます。

型エイリアスと交差型による型の宣言に比べて、`interface`と`extends`によって宣言する方がコンパイラのパフォーマンスが上がるという違いがあるようです。

型エイリアスでは再帰的にプロパティをマージを行い、場合によっては`never`型ができてしまうのに対し、`interface`宣言では1つのオブジェクト型にまとめられて平坦な構造になるため、パフォーマンスが良くなるようですね。

>Using interfaces with extends can often be more performant for the compiler than type aliases with intersections

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces

https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections
