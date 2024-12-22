---
title: ジェネレータとイテレータの型をみてみよう
tags:
  - TypeScript
private: false
updated_at: '2024-12-23T04:11:44+09:00'
id: ae2358ed98aa9a660101
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
この記事では、ジェネレータとイテレータにどのような型が設定されているかをみていきます。
ジェネレータやイテレータ自体については以下でも取り扱っています。

https://qiita.com/axoloto210/items/c23e8b9a4dde3461ef48

https://qiita.com/axoloto210/items/bd6e08c21008d9fb8621

https://qiita.com/axoloto210/items/e91232ca08b04f49f363

## ジェネレータの型
ジェネレータの型は以下のようになっています。
```ts:typescript@5.7.2/node_modules/typescript/lib/lib.es2015.generator.d.ts
interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: any): IteratorResult<T, TReturn>;
    [Symbol.iterator](): Generator<T, TReturn, TNext>;
}
```
ジェネレータの型`Generator`は型引数`T`、`TReturn`、`TNext`を取ります。
まずはこの`T`が何を表しているかについてみてみます。

型引数`T`は`IteratorResult`に渡されているため、そちらの型をみてみます。
```ts:typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts
interface IteratorYieldResult<TYield> {
    done?: false;
    value: TYield;
}

interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
}

type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;
```
`IteratorResult`は反復結果オブジェクトの型であり、`done`が`true`のときと`false`のときの型のユニオン型となっています。

この型定義から、`T`は`yield`式の型であり、`TReturn`は反復結果オブジェクトの`done`プロパティが`true`のときに返される値の型、つまりジェネレータの返り値の型であることがわかります。

また、`TNext`は`next()`メソッドの引数として渡されています。
`next()`メソッドが`yield`に値を渡すときに引数をとりますが、`yield`に渡す値の型を`TNext`としているわけですね。

### ジェネレータはイテレータであり反復可能
ジェネレータはイテレータの一種であり、反復可能なオブジェクトでもあります。
このことが、型の上でも表現されています。

```ts
interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext>
```

とあるように、`Generator`は`Iterator`の部分型であることが必要で、これはジェネレータがイテレータでもあることを型の上で要請しています。

また、`Generator`型は`[Symbol.iterator](): Generator<T, TReturn, TNext>;`というメソッドを持つことが規定されており、反復可能であることも型の上で要請されています。

`[Symbol.iterator]()`の返り値の型が`Iterator`型ではなく`Generator`型なのは、ジェネレータの`[Symbol.iterator]()`は自分自身を返すためです。

```js
function* generatorFn() {
    yield 1;
}

const generator = generatorFn();
const genIterator = generator[Symbol.iterator]();

console.log(genIterator === generator); //true
```
上の例は、ジェネレータとジェネレータの`[Symbol.iterator]()`メソッドで返されたイテレータが同じオブジェクトであることを示しています。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Iteration_protocols#%E3%82%A4%E3%83%86%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%E3%83%97%E3%83%AD%E3%83%88%E3%82%B3%E3%83%AB

### ジェネレータのメソッドの型
`Generator`の型定義から、ジェネレータがもつ`next()`メソッド、`return()`メソッド、`throw()`メソッドがそれぞれ反復結果オブジェクト`IteratorResult`を返していることが分かります。

```ts
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: any): IteratorResult<T, TReturn>;
```
`next()`は引数をもたないか、`TNext`型の引数を1つだけもち、反復結果オブジェクトが返されることが規定されています。
`return()`は`TReturn`型の引数をもち、こちらも反復結果オブジェクトが返されます。
`throw()`については引数が`any`型となっており、エラーの他に数値や文字列などの値も渡すこと自体はできます（推奨はされません）。

## イテレータの型
さいごに、`Iterator`型についてもみてみます。

```ts:typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts
interface Iterator<T, TReturn = any, TNext = any> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
    return?(value?: TReturn): IteratorResult<T, TReturn>;
    throw?(e?: any): IteratorResult<T, TReturn>;
}
```
イテレータの型もジェネレータの型とほとんど同じものとなっていますが、大きな違いとしては、`[Symbol.iterator]()`メソッドがない点が挙げられます。
イテレータ自体は必ずしも反復可能ではないため、`[Symbol.iterator]()`メソッドを型にもっていないわけですね。


