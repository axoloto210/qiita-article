---
title: interface宣言~オブジェクト型を宣言するもう１つの方法~
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## interface 宣言 とは
interface 宣言によって、オブジェクトの型を作成することができます。

`type`文（型alias）を使って、 `type Foo = { num: number }`のようにオブジェクトの型を宣言することができますが、他の方法として、`interface Foo { num : number}`の形でオブジェクトの型を宣言できます。
これがinterface 宣言です。

interface 宣言がどうしても必要となる場面はそこまでなく、基本的には`type`文を使用していて問題ないでしょう。
ただ、ライブラリの型にはinterface 宣言が使用されることも多く、どのような性質があるかを知っておくと理解の助けになる場面もあるかと思います。

## interface 宣言の構文
`interface 型名 オブジェクトの型`で宣言します。
```ts
interface Fish {
    name: string
}
```
interface 宣言はオブジェクトの型を宣言する方法の一つなので、型alias で宣言した型との交差型をとったりと、いわゆる通常の型として扱うことができます。
```ts
type Fish = {
    name: string
}

interface Age {
    age: number
}
```
`Fish`型と`Age`型の交差型`Fish & Age`の変数を以下のように宣言してみます。
```ts
const salmon: Fish & Age = { name : 'Salmon' }
```
変数`salmon`は`Age`型に必要な`age`プロパティを持たず、型エラーが発生します。
```
Type '{ name: string; }' is not assignable to type 'Fish & Age'.
  Property 'age' is missing in type '{ name: string; }' but required in type 'Age'.ts(2322)
```

基本的には型alias で宣言したオブジェクト型と同様の使い方ができます。
## interface 宣言の使い方
基本的には`type`で宣言されたオブジェクトの型と同じものだと捉えられます。`type`との差は、主に宣言する時にできることにあります。

interface の宣言時にはオブジェクト以外に型をつけられなかったり、Mapped Types が使用できなかったりと`type`文にしかできないことが多くありますが、代わりにinterface 宣言でしか使えない記法や性質もあります。
### extends
interface 宣言では`extends`によってinterface を拡張（継承）することができます。
拡張元にあたるinterface がもつ構造を拡張先のinterface がもつように制約をつけることができます。

```ts
interface Age {
    age: number
}

interface Fish extends Age {
    name: string
}
```
```ts
const salmon: Fish = { age: 2 }
```
`name`プロパティがないオブジェクトリテラルを代入しようとすると以下のように型エラーが出ます。
```
Property 'name' is missing in type '{ age: number; }' but required in type 'Fish'.ts(2741)
```
`Age`型を拡張したオブジェクト型である`Fish`型に値を代入するためには、`name`と`age`プロパティのどちらをも持つことが必須になっているわけです。

`interface Fish extends Age { name: string }`を型aliasで表す場合には、交差型を利用して `type Fish = Age & { name: string }`と表せます。
こちらの場合も`name`と`age`プロパティを持つことが必須となります。

### 構造的型付けシステム
TypeScript は構造的型付けシステム（structurally typed type system）が採用されています。
どのような構造をしているかによって型を判別するため、同じ構造をしたオブジェクト型であれば型alias で宣言した型でもinterface で宣言した型でも同じように扱うことができるわけですね。

https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces