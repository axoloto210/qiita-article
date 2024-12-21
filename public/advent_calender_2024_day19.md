---
title: スプレッド構文やfor/ofを支えるイテレータとはなにか？仕様からみてみよう
tags:
  - JavaScript
  - ECMAScript
private: true
updated_at: '2024-12-22T03:09:31+09:00'
id: c23e8b9a4dde3461ef48
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
スプレッド構文`...`や`for/of`によって配列要素を1つずつ取得して変数に代入したり、処理したりすることができます。
`for/of`などによる繰り返し処理はどのようなオブジェクトに対しても行えるわけではなく、反復可能オブジェクトと呼ばれるオブジェクトに限られます。

反復可能オブジェクトとは、`Symbol.iterator`メソッドを持つオブジェクトのことで、`Symbol.iterator`メソッドは**イテレータ**を返します。

この記事では反復処理を可能とする、イテレータの概要についてまとめてみたいと思います。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Iteration_protocols#%E5%8F%8D%E5%BE%A9%E5%8F%AF%E8%83%BD%E3%83%97%E3%83%AD%E3%83%88%E3%82%B3%E3%83%AB

## 反復可能オブジェクト
反復可能オブジェクトは、`Symbol.iterator`メソッドを持つオブジェクトのことです。
`Symbol.iterator`メソッドは**イテレータ**を返します。

組み込みの反復可能オブジェクトには、`String`や`Array`、`Map`や`Set`などがあります。
自作の反復可能オブジェクトを作成することも可能で、`Symbol.iterator`メソッドやイテレータを自前で実装します。

`Synbol.iterator`メソッドを定義して、「0から9までのランダムな数値」から9までを反復する、反復可能オブジェクトは次のように作ることができます。
```js
const iterableObject = {
    [Symbol.iterator]() {
        const random = Math.floor(Math.random() * 10) // 0から9の整数値をランダムに生成
        let restNum = random
        return {
            next() {
                restNum++
                if (restNum < 10) {
                    return { done: false, value: restNum }
                } else {
                    return { done: true, value: undefined }
                }
            }
        }
    }
}

for(const num of iterableObject){
    console.log(num)
}
```
オブジェクトの中に`[Symbol.iterator](){...}`の形でメソッドを定義しています。
このメソッドが返しているオブジェクトが**イテレータ**です。


## イテレータ
イテレータとは、要素に順にアクセスするための仕組みのことで、JavaScript では`next()`メソッドを実装したオブジェクトのことをイテレータと呼びます。
### `next()`メソッド
`next()`メソッドは、**反復結果オブジェクト**（IteratorResult）を返すメソッドです。

**反復結果オブジェクト**とは、`done`、`value`プロパティを持つオブジェクトで、`done`には`boolean`が、`value`には任意の値[^1]がはいります。

### `next()`の仕様
[ECMAScript 仕様書](https://tc39.es/ecma262/2024/#sec-iterator-interface)には、`next()`について次のように記載されています。

>value
>a function that returns an IteratorResult object

`next()`メソッドの返り値は反復結果オブジェクトであることが明記されていますね。

また、`next()`は以下の要件を満たす必要があることが記されています。
>Requirement
>The returned object must conform to the IteratorResult interface. If a previous call to the next method of an Iterator has returned an IteratorResult object whose "done" property is true, then all subsequent calls to the next method of that object should also return an IteratorResult object whose "done" property is true. However, this requirement is not enforced.

（拙訳）
`next`メソッドから返されるオブジェクトは `IteratorResult`インターフェースに準拠すること。 
イテレータが呼び出した`next`メソッドが、`done`が`true`の反復結果オブジェクトを返した場合、それ以降の`next()`メソッドの呼び出しもすべて、`done`が`true`の反復結果オブジェクトを返す必要がある。しかし、この要件は強制されない。

`next()`メソッドは反復結果オブジェクトを返すことが最低限の要件となっているわけですね。

#### `done`プロパティ
`done`については、仕様では以下のような要件となっています。
>Requirement
>This is the result status of an iterator next method call. If the end of the iterator was reached "done" is true. If the end was not reached "done" is false and a value is available. If a "done" property (either own or inherited) does not exist, it is considered to have the value false.

`done`はイテレータの`next()`メソッドの結果を表すプロパティです。
イテレータが終端に達した時に`true`となります。
イテレータが終端に達していない時は`false`となり、値が利用可能です。
`done`プロパティ（自身のプロパティまたは継承したプロパティ）がないときには、`false`として扱われます。

#### `value`プロパティ
`value`については、仕様では以下のような要件となっています。
>Requirement
>If done is false, this is the current iteration element value. If done is true, this is the return value of the iterator, if it supplied one. If the iterator does not have a return value, "value" is undefined. In that case, the "value" property may be absent from the conforming object if it does not inherit an explicit "value" property.

`value`は、`done`が`false`のときには現在の反復要素の値をもちます。
`done`が`true`のときにはイテレータに設定されている返り値となります。
イテレータが返り値をもたないときは、`value`が`undefined`となるか、明示的な`value`プロパティを継承していないならば`value`プロパティ自体が省略されることがあります。

https://tc39.es/ecma262/2024/#sec-iteratorresult-interface

https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Iterators_and_generators

ここで、先ほどの例で`Synbol.iterator`が返していたオブジェクトをみてみます。
```js
 {
    next() {
        restNum++
        if (restNum < 10) {
            return { done: false, value: restNum }
        } else {
            return { done: true, value: undefined }
        }
    }
}
```
`next()`は`{ done: false, value: restNum }`か`{ done: true, value: undefined }`という反復結果オブジェクトを返しており、`done`が`false`のときにのみ値が設定されていることがわかります。
また、一度`done`が`true`となると、それ以降は処理が反復されたとしても`restNum < 10`を満たすことはなく、常に`done`が`true`を返すこともわかります。

確かにこのオブジェクトはイテレータの仕様要件を満たしていますね。

## まとめ
複数の似た名前のオブジェクトが出てきたため、最後にまとめてみます。
- **反復可能オブジェクト（Iterable Object）**
  - `Symbol.iterator`メソッドを持つオブジェクト
  - `Array`や`Map`は組み込みの反復可能オブジェクト
- **イテレータ（Iterator）**
  - `next()`メソッドを持つオブジェクト
  - `Symbol.iterator`メソッドはイテレータを返す
- **反復結果オブジェクト（Iterator Reslut Object）**
  - イテレータの`next()`メソッドから返されるオブジェクト
  - `done`と`value`プロパティをもつ


[^1]: 任意の値とは、仕様では[ECMAScript Language Types](https://tc39.es/ecma262/2024/#sec-ecmascript-language-types)と呼ばれる値です。
