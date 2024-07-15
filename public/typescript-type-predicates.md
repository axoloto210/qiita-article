---
title: ユーザー定義型ガード（型述語）で少しでも型安全に
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## 型ガード
型ガードとは`if(typeof value === 'string')`のように型情報による条件分岐や`in`演算子などによってブロック内の型を絞り込む機能を指します。
この絞り込み部分をユーザー（実装者）が関数の形で作成して、型ガードとして利用するのがユーザー定義型ガード（型述語）です。
## ユーザー定義型ガード（型述語）
ユーザー定義型ガードとは、条件を満たした時に関数の引数の型をユーザーが設定した型としてTypeScriptのコンパイラに扱わせる機能です。
`as`による型アサーションや`any`型と同様にTypeScriptの型安全性を破壊しうる危険な機能ですが、確認すべき範囲が`as`や`any`に比べて明確であることから、これらの機能をやむを得ず使用する場合にはユーザー定義型ガードの使用が推奨されています。
## `引数 is 型`によるユーザー定義型ガード
関数によって型の絞り込みを行いたい場合には、ユーザー定義型ガードが使用できます。
とくに、`unknown`型の値を扱うのに便利な機能となっています。
```ts
type Fish = {
  name: string
  age?: number
}

function isFish(fish: any) {
  if (fish === null) {
    return false
  }
  return (
    typeof fish.name === "string" &&
    (typeof fish.age === "number" || typeof fish.age === undefined)
  )
}

const tuna: unknown = {
  name: "tuna",
  age: 5,
}

if (isFish(tuna)) {
  console.log(tuna.age) //'tuna' is of type 'unknown'.ts(18046)
}

```
上のコード例のように関数による型の条件分岐を行なっても、TypeScriptのコンパイラは型の絞り込みを認識できず、コンパイルエラーとなってしまいます。
```
 'tuna' is of type 'unknown'.ts(18046)
```
そこで、関数の返り値の型に`fish is Fish`とつけることで、関数が`true`を返した場合にはコンパイラに引数として渡した変数の型は`Fish`型であると認識させることができます。
ここの実装を間違えると誤った型をコンパイラが認識したままの状態になり、型安全性が損なわれるので注意が必要です。
```ts
type Fish = {
  name: string
  age?: number
}

function isFish(fish: any): fish is Fish {
  if (fish === null) {
    return false
  }
  return (
    typeof fish.name === "string" &&
    (typeof fish.age === "number" || typeof fish.age === undefined)
  )
}

const tuna: unknown = {
  name: "tuna",
  age: 5,
}

if (isFish(tuna)) {     // const tuna: unknown
  console.log(tuna.age) // const tuna: Fish
}

```
ユーザー定義型ガードを追加した後のプログラムでは型エラーが出なくなっており、`if(isFish(tuna))`に書かれている変数`tuna`は`unknown`と認識されていますが、ユーザー定義型ガードを通った後の`tuna`変数が使用されている箇所`console.log(tuna.age)`では、`Fish`型として推論されるようになっています。
## `asserts 引数 is 型`によるユーザー定義型ガード
関数が例外を投げて終了しない可能性がある場合には、`asserts 引数 is 型`の構文によるユーザー定義型ガードが使えます。
こちらは関数が`true`を返した場合に型を強制するのではなく、関数が最後の処理まで到達した場合に型を強制します。
```ts
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

```
`try`ブロック内では`isNumber`より後ろの箇所での`value`の型が`number`型として推論されています。

ユーザーが「`isNumber`が正常終了しているのならば`value`の型は`number`型である」と保証しているわけですが、ここの保証の部分、つまりユーザー定義型ガードの実装に誤りがあると型安全性は大きく損なわれてしまうため、慎重に使用する必要があります。

`any`や型アサーションに比べると、ユーザーが責任を負うべき箇所が関数ないのみと明確なので、やむを得ない場合にはユーザー定義型ガードの使用を先に検討することが推奨されているわけですね。

https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards

