---
title: リテラル型のwideningと型推論
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## リテラル型のwidening とは
リテラル型の**widening** とは、一定の条件下で**リテラル型がプリミティブ型へと拡張（widening）されて型推論される**働きのことです。

型推論が行われるときに`123`型や`'foo'`型といったリテラル型が`number`型や`string`型へと拡げられて（widening）型推論される場合があるというものです。

**他の値が代入されうる場合に型widening が起こる**のですが、リテラル型がプリミティブ型へと拡張されて型推論される条件をより詳しくみていきたいと思います。

### 型注釈なしのlet で変数を宣言
まずは、型注釈をつけずに`let`を使って変数を宣言した場合に型widening が発生する場合があります。

`const`と`let`で宣言した変数に同じ文字列を代入してみると、型推論の結果が異なることとなります。
```ts
const tuna = 'tuna' //const tuna: "tuna"

let fish = 'tuna'  //let fish: string
```
`const`で宣言した変数には値が再代入されることがないため、`'tuna'`型で型推論がされています。
一方`let`で宣言した場合には、`'tuna'`という文字列以外が代入される可能性があるため、`'tuna'`型と推論するのではなく、型をプリミティブ型へ拡げて、`string`型へ推論されています。

`'tuna'`しか値をとらないことを型注釈した場合には、型のwidening は起こりません。
```ts
type Tuna = 'tuna'

let fish: Tuna = 'tuna'  //let fish: "tuna"
```

`const`ではなくあえて`let`で変数が宣言されるということは、この変数には値が再代入されうると明示しているようなものですので、変数の型が何になるかを考えてみると、初期値のリテラル型として推論するよりも、そのプリミティブ型が代入されうると考えてプリミティブ型に拡げて型を推論しておく方が合理的だと思えますね。

