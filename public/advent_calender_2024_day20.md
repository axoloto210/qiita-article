---
title: ジェネレータとyield文
tags:
  - JavaScript
private: false
updated_at: '2024-12-22T04:48:35+09:00'
id: bd6e08c21008d9fb8621
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
この記事は以下の記事の続きになります。

https://qiita.com/axoloto210/private/c23e8b9a4dde3461ef48

本記事では、イテレータを返す関数である、ジェネレータ関数と、ジェネレータ関数内で使用できる`yield`文についてみていきます。

## ジェネレータ
ジェネレータは反復可能なオブジェクトであり、イテレータでもあります。
ジェネレータは、ジェネレータ関数によって生成されます。

ジェネレータ関数は`function*`によって定義します。
この関数は呼び出しても関数自体が実行されるのではなく、ジェネレータが返されます。

ジェネレータが通常のイテレータと異なるのは、`next()`メソッドを呼び出した時に、ジェネレータ関数の最初から`yield`文までが実行される点にあります。次に`next()`が呼ばれた時には、前回の`yield`の後からその次の`yield`文までが実行されます。

```js
function* generatorFn () {
    console.log('start')
    yield 1
    console.log('after yield 1')
    yield 2
    console.log('after yield 2')
    yield 3
    console.log('after yield 3')
}

const generator = generatorFn()

console.log(generator.next().value)
console.log('stopped')
console.log(generator.next().value)
console.log('stopped')
console.log(generator.next().value)
console.log('stopped')
console.log(generator.next().value)
```
```
"start" 
1 
"stopped" 
"after yield 1" 
2 
"stopped" 
"after yield 2" 
3 
"stopped" 
"after yield 3" 
undefined 
```
この例から、ジェネレータの`next()`が呼び出されるたびに、ジェネレータ関数の`yield`文までが実行されていることが分かります。

### ジェネレータ関数の宣言
ジェネレータ関数は`function*`で宣言できます。
他にも、関数式やメソッドの形で宣言することもできます。
```js
//関数式での宣言
const generatorFn = function* () {
    yield 1
    yield 2
    yield 3
}
```
メソッドの形で宣言する場合は、メソッド名の先頭に`*`をつけてジェネレータ関数であることを明示します。
```js
const obj = {
    *generatorFn() {
        yield 1
        yield 2
        yield 3
    }
}
const generator = obj.generatorFn()
```
なお、アロー関数の形式でジェネレータ関数を宣言することはできません。

## ジェネレータで書き換え
前回の記事で作成した以下の反復可能オブジェクトを、ジェネレータを使って書き換えてみます。
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

console.log([...iterableObject])
```
イテレータを返す関数は、ジェネレータ関数を使って以下のように書き換えられます。
```js
const iterableObject = {
    *[Symbol.iterator]() {
        const random = Math.floor(Math.random() * 10) 
        let restNum = random
        
        while (restNum < 10) {
            yield restNum++
        }
    }
}

console.log([...iterableObject])
```
`[Symbol.iterator]()`メソッドをジェネレータ関数に書き換えることで、`next()`や`next()`の返り値である反復結果オブジェクト`{done: false, value: restNum}`は、`yield`文によって簡潔に書けるようになっています。

また、ジェネレータ関数によって`[Symbol.iterator]()`自体を使わずに書き換えることもできます。
```js
const iterableObject = {
    *generatorFn() {
        const random = Math.floor(Math.random() * 10) 
        let restNum = random
        
        while (restNum < 10) {
            yield restNum++
        }
    }
}

console.log([...iterableObject.generatorFn()])
```
この書き換え方では、呼び出し方は変わるものの、`[Synbol.iterator](){...}`を宣言しなくて済むようになっています。
