---
title: 正規表現とStringのメソッド
tags:
  - JavaScript
  - 正規表現
private: false
updated_at: '2024-12-15T18:50:47+09:00'
id: 1c473298d3e4d5b155c7
organization_url_name: null
slide: false
ignorePublish: false
---
## 正規表現を引数にとれるメソッド
`String.prototype`には正規表現を引数にとれるメソッドがいくつか存在します。
正規表現を引数に使用することで、さまざまなパターンを柔軟に設定することができるようになります。

この記事では正規表現を使用できる`String`メソッドについて簡単にまとめてみます。

### `replace()`
`replace()`は第1引数に指定した正規表現にマッチする箇所を、第2引数で指定した文字列で置換できます。
```js
const regex = /\d+/
'a1b2c3'.replace(regex,'foo') // "afoob2c3"
```
パターンに`g`フラグを指定すれば、マッチしたすべての文字列を置換することもできます。
```js
const regex = /\d+/g
'a1b2c3'.replace(regex,'foo') // "afoobfoocfoo"
```

#### `replaceAll()`
また、マッチ箇所全てを置換するためのメソッドとして`replaceAll`というものも用意されています。
`replaceAll`を使用する場合にも正規表現に`g`フラグがないとエラーとなります。
`replace`でも`g`フラグがあれば全置換となりますが、`replaceAll`の方が対象全てを置換することが明確ですね。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace

### `search()`
`search()`は最初にマッチした文字の位置を返します。
文字位置の先頭は0から数えます。
```js
const regex = /\d+/
'foo1bar2'.search(regex)// 3
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/search

### `split()`
`split()`は引数で指定した区切り文字によって、文字列を分割した配列を返します。
この区切り文字は正規表現によって指定することが可能です。
```js
// 区切り文字を複数指定した例
const regex = /[,.]/
const fish = "octopus,squid.tuna,salmon.".split(regex)
//["octopus", "squid", "tuna", "salmon", ""]
```

引数に指定した正規表現がキャプチャグループをもつときには、返り値の配列にキャプチャグループにマッチした文字列も含まれます。
```js
const regex = /([,.])/
const fish = "octopus,squid.tuna,salmon.".split(regex)
//["octopus", ",", "squid", ".", "tuna", ",", "salmon", ".", ""] 
```

#### サロゲートペア文字の分割
`split()`を使用すると1文字ずつに分割することもできます。
```js
'abc'.split('') //["a", "b", "c"] 
```
しかし、`split('')`はコードユニット単位（16bit単位）で文字を分割するため、サロゲートペア文字などの複数のコードユニットで構成される文字をうまく分割することができません。
```js
'a🧑c'.split('') //["a", "�", "�", "c"]
```
このようなケースでは、`Array.from`やスプレッド構文`[...]`を使用することでうまく分割できるようになります[^1]。
```js
Array.from('a🧑c') // ["a", "🧑", "c"]
[...'a🧑c']        // ["a", "🧑", "c"]
```
`split`に`u`フラグの正規表現を渡すことによっても分割することができ、16bit単位ではなくUnicode文字単位でのマッチをさせられるようにできます。
```js
const regex = /(?=[\s\S])/u
'a🧑c'.split(regex) //["a", "🧑", "c"]
```
上の例の`[\s\S]`は`\s`（空白文字）と`\S`（空白文字以外）のいずれかの文字を文字クラス`[\s\S]`で表しており、これはすべての文字にあたります。
また、先読み言明`(?=)`によって、後ろに文字がある場合にマッチするように指定しています。
`//u`のようにして空文字を指定することはできないため、間接的な方法を取る必要があります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split

先読み言明については以下でも扱っています。

https://qiita.com/axoloto210/items/e561944e5f0feea71c43#pattern-%E5%85%88%E8%AA%AD%E3%81%BF%E8%A8%80%E6%98%8E



### `match()`
`match()`はマッチした箇所を配列で返します。

```js
const pattern = /\d+/;

const text = 'a123b2c3'
text.match(pattern) //["123"] 
```
#### `g`を設定しないときの挙動
`g`フラグが設定されていないときにはマッチした箇所に関するキャプチャグループの文字列を配列に含めて返します。
```js
const regex = /(abc){3}/  //"abc"を3回繰り返すパターン
"abcabcabc".match(regex)  // ["abcabcabc", "abc"] 
```


キャプチャグループを含めたくない場合には、パターン内のグループを`(`と`)`で囲むのではなく、`(?:`と`)`で囲みます。
```js
const regex = /(?:abc){3}/
"abcabcabc".match(regex)   // ["abcabcabc"]
```

また、`g`フラグが設定されていないときの返り値の配列には、配列要素の他にいくつかのオブジェクトプロパティが含まれます。

`index`や`input`, `groups`などの正規表現や呼び出し元の文字列に関する情報が取得できます。

`input`プロパティには`match()`の呼び出し元の文字列が格納されています。
`index`プロパティにはマッチ箇所の始めの位置が格納されます。
また、`groups`プロパティにはキャプチャグループが格納されます。
```js
const regex = /(?<abc_group>abc){3}/
const match = "abcabcabc".match(regex)

match?.input  // "abcabcabc"
match?.index  // 0
match?.groups //{"abc_group": "abc"} 
```


https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/match

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/Symbol.match

[^1]:`🧑‍🧑‍🧒`など複数の絵文字で構成されている絵文字はこの方法でも見た目通り（書記素クラスタ単位）には分割されません。
