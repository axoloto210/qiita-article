---
title: 文字列を数値に変換するには。NumberとparseIntの使い分け
tags:
  - JavaScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## 文字列を数値に変換するには
JavaScriptで文字列`'123'`を数値`123`に変換したいときには、`Number`や`parseInt`を使用することで実現できます。
本記事では、両者の違いについてみていきます。

## `Number`
`Number()`の引数には整数の他に、浮動小数点数を表す文字列も渡すことができ、数値型に変換してくれます[^1]。

引数に数値として解釈できない文字が含まれる場合には`NaN`が返されますが、先頭と末尾の半角スペースや全角スペースなどの空白は無視してくれます。
数字の間に空白がある場合には無視されず、`NaN`が返されます。

```js
console.log(Number('  　 123')) // 123
console.log(Number('     123.45　'))   // 123.45
console.log(Number('1234 5678'))   // NaN
```

また、`Number`は10進数の場合にしか変換できない点が`parseInt`とは異なります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number

## `parseInt`
`parseInt()`によっても文字列を数値へ変換することができます。

`parseInt()`は名前にInt とあるように整数のみが解析対象です。
また、文字列を先頭から見ていったときに数値として認識されない文字が出てきた場合には、その文字以降が無視されます。
空白を除いた後、数値として認識されない文字が先頭に残る場合には、`NaN`が返されることとなります。

`parseInt()`は第2引数に基数を渡すことで、10進数以外で表現されている文字列を数値に変換することができます。
2進数から36進数までが指定可能です。
```js
console.log(parseInt('   5  ')) // 5
console.log(parseInt('1.234'))  // 1
console.log(parseInt('234xyz')) // 234
console.log(parseInt('FE',16))  // 254
console.log(parseInt('FE',37))  // NaN
```
`Number`と同様に先頭と末尾のスペースは無視されます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/parseInt

`parseInt`では浮動小数点数を扱えませんが、浮動小数点数を変換するために`parseFloat`という関数も用意されています。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/parseFloat

## 余談:`<input>`要素の入力を数値で取得
`<input>`要素では数字が入力されたとしても、`value`プロパティからは文字列型として取得されます。

実は`value`のほかに`valueAsNumber`というプロパティからも入力値を取得可能です。
`valueAsNumber`であれば、数値型として取得できます。
ただし、数値への変換ができない値が入力されていたときには`NaN`が返されます。

[^1]:`new Number()`として呼び出すこともでき、ラッパーオブジェクトが得られますが、現在ではこの方法を使用する必要はないとされています。