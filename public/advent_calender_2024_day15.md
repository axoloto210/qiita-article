---
title: 正規表現とRegExpクラス
tags:
  - JavaScript
  - 正規表現
  - TypeScript
private: false
updated_at: '2024-12-16T01:06:49+09:00'
id: 393b30b73fcb1664d017
organization_url_name: null
slide: false
ignorePublish: false
---
## `RegExp`オブジェクト
`JavaScript`には正規表現によって文字列内の検索や置換、パターンマッチングを行える`RegExp`オブジェクトがあります。
`//`で囲むことで正規表現を宣言できますが、これは文字列などではなく、`RegExp`オブジェクトと呼ばれるものにあたります。

本記事では`RegExp`クラスのプロパティやメソッドについてみていきます。

### `RegExp`オブジェクトの作成方法
`RegExp`オブジェクトは`//`でパターンを囲むことで作成できます。
```js
const regex = /\d+/ //1個以上の数字
```
この`regex`は、TypeScriptでは`string`型ではなく、`RegExp`型となります。

また、`RegExp`コンストラクタを使って、`new RegExp("abc","g")`や`new RegExp(/abc/g)`のように作成することもできます。

### `RegExp`のプロパティ
`RegExp`オブジェクトには、正規表現の内容に関する情報を持つプロパティが多数存在します。
#### `source`
`source`は正規表現の文字列そのものを格納する、read onlyなプロパティです。
```js
const regex = new RegExp(/ab+c/g)

console.log(regex.source) //"ab+c" 

console.log(regex.source="bcd") //書き込みは不可
//Cannot set property source of [object Object] which has only a getter 
```
#### `flags`
`flags`は正規表現のフラグ文字列を格納する、read onlyなプロパティです。
```js
const regex = new RegExp(/ab+c/gi)

console.log(regex.flags) //"gi"
```
#### 各フラグが設定されているかを表すプロパティ
正規表現ではいくつかのフラグを設定できますが、フラグが設定されているかを表すBoolean型のプロパティが各フラグそれぞれに対して存在しています。全てread only です。
##### `global`
`g`フラグが設定されていれば`true`。
正規表現に最初にマッチしたものだけでなく、文字列内での全てのマッチを検索するようになります。
##### `ignoreCase`
`i`フラグが設定されていれば`true`。
大文字・小文字の区別をしなくなります。
##### `multiline`
`m`フラグが設定されていれば`true`。
文字列が改行されている場合、`^`と`$`は文字列の先頭と末尾だけでなく、各行の先頭と末尾にもマッチするようになります。
##### `dotAll`
`s`フラグが設定されていれば`true`。
`.`が改行も含めてマッチするようになります。
##### `unicode`
`u`フラグが設定されていれば`true`。
`\u{}`によるコードポイントの指定や`\p{}`、`\P{}`の使用が可能になります。
##### `sticky`
`y`フラグが設定されていれば`true`。
`lastIndex`番目から検索を行うようになります。

#### `lastIndex`
`g`か`y`フラグが設定されているときに、検索を開始する位置を指定します。
このプロパティはread only ではなく、書き込み可能です。

例えば`RegExp.prototype.test`を`g`や`y`フラグ付きの正規表現で使用すると、デフォルトでは先頭の文字から検索をはじめますが、`lastIndex`の値を変更することで、検索開始位置を変更することが可能です。
```js
const regex = new RegExp(/a{3}\d+/g) //"a"の3回の繰り返し後に数字が1回以上繰り返されるパターン

regex.test('aaa123bbb')// true

regex.lastIndex = 4

regex.test('aaa123bbb')//false
```
`lastIndex`はプロパティであるため、新たに`RegExp`のオブジェクトが生成されるケースではデフォルト値の`0`で処理されてしまうため、`lastIndex`を指定したオブジェクトとメソッドを呼び出すオブジェクトが同一のものかに注意する必要があります。

## `RegExp`のメソッド
### `test()`
`test()`はパターンにマッチする場合に`true`を返します。
```js
const regex = /\d+/
regex.test('abc') // false
regex.test('ab1') // true
```

内部的には`exec()`を呼び出しており、`exec()`の結果が`null`以外のときに`true`を返し、`null`のときに`false`を返しています。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test

### `exec()`
`exec()`は文字列を引数にとり、マッチする場合には配列を返し、マッチしない場合には`null`を返します。

返り値となる配列には１つ目の要素にマッチした文字列、２つ目以降の要素にはサブパターン（キャプチャグループのパターン）にマッチした文字列が格納されています。

また、`index`や`input`、`groups`など、以下の値を格納しているプロパティももちます。
- `index`は最初にマッチした文字位置
- `input`は検索された文字列
- `groups`は名前付きキャプチャグループのグループ名をキーとし、マッチした文字列を値とするオブジェクト

`g`フラグを指定していないときの`match`メソッドと同じような返り値ですが、`exec`の場合は`g`フラグがあっても同様の結果を返します。

https://qiita.com/axoloto210/items/1c473298d3e4d5b155c7


## 動的なデータから正規表現を扱うには
`//`によって正規表現を宣言するときには、テンプレートリテラル``${}``が使用できないため、動的なデータを含めることができません。
動的なデータを利用したい時には、`//`ではなく`new RegExp()`によって`RegExp`オブジェクトを作成する必要があります。

文字列を引数に渡す時にはエスケープ処理に注意が必要です。
`/\d+/`のようにして作成していた正規表現は、`RegExp`コンストラクタで作成する時には、`\`が文字列内でエスケープ用の記号として使用されているため、`\`自体を指定するには`\\`のように`\`をエスケープする必要があります。
```js
const regex = new RegExp("\d+")
regex.test('12345') // false
```

```js
const regex = new RegExp(`\\d+`)
regex.test('12345') // true
```

`new RegExp`であればテンプレートリテラルが使用できるため、動的なデータから正規表現を生成可能です。
```js
const randomNumber = Math.floor(Math.random() * 10) //0から9の整数をランダムに生成

const regex = new RegExp(`${randomNumber}{3}`) //生成された整数が3つ連続で続くことを表す正規表現

//実行例
console.log(randomNumber)                     // 6
console.log(regex.test('666777888999'))       //true
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp
