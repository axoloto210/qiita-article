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
**リテラル型のwidening** とは、一定の条件下で**リテラル型がプリミティブ型へと拡張（widening）されて型推論される**働きのことです。

型推論が行われるときに`123`型や`'foo'`型といったリテラル型が`number`型や`string`型へと拡げられて（widening）型推論される場合があるというものです。

**他の値が代入されうる場合にリテラル型のwidening が起こる**のですが、リテラル型がプリミティブ型へと拡張されて型推論される場面をより詳しくみていきたいと思います。

### 型注釈なしのlet で変数を宣言
まずは、型注釈をつけずに`let`を使って変数を宣言した場合にwidening が発生する場合があります。

`const`と`let`で宣言した変数に同じ文字列をそれぞれ代入してみると、型推論の結果が異なることとなります。
```ts
const tuna = 'tuna' //const tuna: "tuna"

let fish = 'tuna'  //let fish: string
```
`const`で宣言した変数には値が再代入されることがないため、代入した値のリテラル型である`'tuna'`型で型推論がされています。

一方`let`で宣言した場合には、`'tuna'`という文字列以外が変数に代入される可能性があるため、`'tuna'`型と推論するのではなく、プリミティブ型へと拡げて`string`型で推論されています。

<br/>

`'tuna'`しか値をとらないことを型注釈で明示した場合には、型のwidening は起こりません。
```ts
type Tuna = 'tuna'

let fish: Tuna = 'tuna'  //let fish: "tuna"
```

`const`ではなくあえて`let`で変数が宣言されるということは、**この変数には値が再代入されうる**と明示しているようなものですので、変数の型をどのようの推論すべきかを考えてみると、初期値のリテラル型として推論するよりも、そのプリミティブ型が代入されうると考えてプリミティブ型に拡げて型を推論しておく方が合理的だと思えますね。

### オブジェクトリテラルの型推論
オブジェクトリテラルのプロパティにリテラル型の値をもたせた場合にもwidening が起こります。
```ts
const tuna = {
  name: 'tuna',
  age: 2
}

//型の推論結果
// const tuna: {
//   name: string;
//   age: number;
// }
```
オブジェクトリテラルの場合にも、**プロパティの値があとから上書きされうる**ために型widening が起こっていると捉えられます。

#### as const
`as const`の働きの１つに、widening が起こらないようにするというものがあります。
オブジェクトリテラルに`as const`をつけることで各プロパティには`readonly`がつけられて上書きできなくなるため、型widening が起こらなくなるわけです。
```ts
const tuna = {
  name: 'tuna',
  age: 2
} as const

// 型の推論結果
// const tuna: {
//     readonly name: "tuna";
//     readonly age: 2;
// }
```
### 型注釈
リテラル型のwidening は型推論によって起こるものです。

型注釈をつけて型を明示してしまえば型推論の必要もなくなり、widening も起こらなくなります。

すでに型が明確に定まっていてwidening されたくない場合には、`as const`や型注釈をつけて明示しておくと読み手にもやさしいコードになりそうですね。