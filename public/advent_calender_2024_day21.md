---
title: ジェネレータでyieldに値を渡す
tags:
  - JavaScript
private: false
updated_at: '2024-12-23T01:42:07+09:00'
id: e91232ca08b04f49f363
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
この記事は以下の記事の続きになります。

https://qiita.com/axoloto210/items/bd6e08c21008d9fb8621

ジェネレータ関数では、`next()`の呼び出しごとに`yield`式までが実行されていました。
この`yield`式へは、`next()`メソッドの引数から値を渡すことが可能です。

本記事では、ジェネレータ関数で使用できる`yield`への値の受け渡しや、ジェネレータ関数の返り値、ジェネレータの`return()`メソッドや`throw()`メソッドについてもみていきます。

## `next()`の引数と`yield`
`next()`メソッドの引数に値を渡すことで、ジェネレータで前回値を返した`yield`へ引数の値が渡されます。
前回呼び出された`next()`には`yield`から値が渡されていますが、今度はその`yield`へ次の`next()`メソッドの呼び出し元から値を渡すことができるわけです。

`next()`に引数を渡す例をみてみます。
```js
const generatorFn = function* (){
    let y1 = yield 1
    console.log('y1:',y1)
    let y2 = yield 2
    console.log('y2',y2)
    let y3 = yield 3
    console.log('y3:',y3)
}

const generator = generatorFn()

console.log(generator.next(2).value)
console.log(generator.next(3).value)
console.log(generator.next(5).value)
```
```
1 
"y1:",  3 
2 
"y2",  5 
3 
```
この例では、3回`next()`を呼び出しています。
1回目の呼び出しでは`next(2)`で値を渡そうとしていますが、この呼び出しが初回ですので、引数の値`2`を渡す先の`yield`がなく、無視されています。
2回目の呼び出しでは`next(3)`で前回の`next()`呼び出しに対応する`yield`式へ値を渡しています。
その後、`console.log('y1:',y1)`が実行されてから、`yield 2`によって呼び出し元へ`2`が渡されています。

`yield`式は値を返した後、次の`next()`呼び出しを待機します。
`next()`が呼び出されると、待機していた`yield`式へ`next()`の引数が渡され、次の`yield`式まで処理が進んでいきます。

この仕組みを利用することで、呼び出し側での値の状況に応じて、柔軟に対応できるわけですね。

## ジェネレータ関数の返り値
ジェネレータ関数は返り値を返すこともできます。
この返り値は、反復結果オブジェクトの`done`プロパティが`true`になったときに、本来であれば`undefined`となっている`value`プロパティからアクセスできます。

先の例のジェネレータ関数に返り値を設定してみます。
```js
const generatorFn = function* (){
    let y1 = yield 1
    console.log('y1:',y1)
    let y2 = yield 2
    console.log('y2',y2)
    let y3 = yield 3
    console.log('y3:',y3)
    return 42
}

const generator = generatorFn()

console.log(generator.next(2))
console.log(generator.next(3))
console.log(generator.next(5))
console.log(generator.next())
console.log(generator.next())
```
```
{ "value": 1, "done": false } 
"y1:",  3 
{ "value": 2, "done": false } 
"y2",  5 
{ "value": 3, "done": false } 
"y3:",  undefined 
{ "value": 42, "done": true } 
{ "value": undefined, "done": true } 
```
ジェネレータ関数に返り値として`42`を設定しています。
この`42`は`done`が`true`となったとき、つまりイテレータが終端に達したタイミングでのみ反復結果オブジェクトの`value`値に格納されています。
一度`done`が`true`になった後には、再度`next()`を呼び出したとしても、ジェネレータ関数の返り値が`value`に格納されません。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Generator/return

## ジェネレータの`return()`
ジェネレータ関数に返り値が設定できることをみてきましたが、ジェネレータから`return()`を呼び出すことも可能です。
ジェネレータから`return()`を呼び出すと、ジェネレータの処理を途中で終了させ、引数として渡した値をジェネレータの結果とすることができます。

先の例に`return()`メソッドの呼び出しを追加してみます。
```js
const generatorFn = function* (){
    let y1 = yield 1
    console.log('y1:',y1)
    let y2 = yield 2
    console.log('y2',y2)
    let y3 = yield 3
    console.log('y3:',y3)
    return 42
}

const generator = generatorFn()

console.log(generator.next(2))
console.log(generator.return(100))
console.log(generator.next(3))
console.log(generator.next(5))
console.log(generator.next())
console.log(generator.next())
```
```
{ "value": 1, "done": false } 
{ "value": 100, "done": true } 
{ "value": undefined, "done": true } 
{ "value": undefined, "done": true } 
{ "value": undefined, "done": true } 
{ "value": undefined, "done": true } 
```
この例では、2回目の`next()`の呼び出しの前に、ジェネレータの`return()`メソッドを呼び出しています。
`return()`メソッドが呼び出されると、反復結果オブジェクトの`done`プロパティは`true`となり、`value`プロパティは`return()`に渡した引数の値`100`となっています。
以降の`next()`の呼び出しでは、`value`が`undefined`で返されており、ジェネレータ関数の処理も行われていないことがわかります。

`try/finally`と組み合わせることで、ジェネレータの終了時の処理を呼び出したり、クリーンアップ処理を行ったりと、`return()`メソッドによって処理の制御を行うことができます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Generator/return

## ジェネレータの`throw()`
ジェエネレータには`return()`メソッドの他に`throw()`メソッドもあり、こちらは使用することで呼び出し側から例外を投げることが可能です。

先の例で追加した`return()`の代わりに、`throw()`を追加してみます。
```js
const generatorFn = function* () {
    try {
        let y1 = yield 1
        console.log('y1:', y1)
        let y2 = yield 2
        console.log('y2', y2)
        let y3 = yield 3
        console.log('y3:', y3)
        return 42
    } catch (e) {
        console.log(e.message)
    }
}

const generator = generatorFn()

console.log(generator.next(2))
console.log(generator.throw(new Error('error occurred')))
console.log(generator.next(3))
console.log(generator.next(5))
console.log(generator.next())
console.log(generator.next())
```

```
{ "value": 1, "done": false } 
"error occurred" 
{ "value": undefined, "done": true } 
{ "value": undefined, "done": true } 
{ "value": undefined, "done": true } 
{ "value": undefined, "done": true } 
{ "value": undefined, "done": true } 
```
`return()`メソッドと同様に、`throw()`メソッドが呼び出されたあとにジェネレータの処理が終了していることがわかります。

`catch`内でも`yield`で値を返すことも可能で、`throw()`メソッドはエラー発生時の制御に活用できます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Generator/throw
