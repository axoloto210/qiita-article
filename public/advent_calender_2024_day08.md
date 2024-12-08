---
title: 配列のようなオブジェクト、Array-like object とは
tags:
  - JavaScript
private: false
updated_at: '2024-12-09T02:43:18+09:00'
id: 77143467309876eebbcb
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
JavaScriptには、配列ではないが、配列に似たオブジェクトであるArray-like object と呼ばれるオブジェクトがあります。
配列のように扱えるが、配列の機能が全て使用できるわけではない、この配列のようなオブジェクトについてみていきたいと思います。
## Array-like object、配列のようなオブジェクトとは
Array-like object とは、以下の配列の特徴をもつが、配列ではないオブジェクトのことです。
- `length`プロパティをもつ
- 0から始まる数値インデックスによる要素へのアクセスが可能

Array-like object は配列ではないため、`map`や`filter`といった配列メソッドを直接呼び出すことができません。

### `querySelectorAll()`
Array-like object を返す関数として、`querySelectorAll()`が挙げられます。

`querySelectorAll()`は引数に渡したセレクタに合致した`NodeList`を返しますが、この`NodeList`は配列ではなくArray-like object です[^1]。
`NodeList`からは、`map`や`filter`を直接呼び出すことができませんが、`forEach`については実装されており、呼び出すことができます。

```html
<body>
    <div class="foo">a</div>
    <div class="foo">b</div>
    <div class="foo">c</div>
</body>
```
```js
const nodeList = document.querySelectorAll('.foo')

console.log(nodeList)
```

```:console.log
NodeList(3) [div.foo, div.foo, div.foo]
0: div.foo
1: div.foo
2: div.foo
length: 3
[[Prototype]]: NodeList
```
`prototype`が`Array.prototype`ではなく、`NodeList.prototype`となっていることがわかります。
`NodeList.prototype`には以下のようなプロパティが含まれています。
```
[[Prototype]]: NodeList
entries: ƒ entries()
forEach: ƒ forEach()
item: ƒ item()
keys: ƒ keys()
length: (...)
values: ƒ values()
constructor: ƒ NodeList()
Symbol(Symbol.iterator): ƒ values()
Symbol(Symbol.toStringTag): "NodeList"
get length: ƒ length()
[[Prototype]]: Object
```

確かに`forEach`が存在しています。
`map`や`filter`は見当たらず、使用しようとするとエラーとなります。


https://developer.mozilla.org/ja/docs/Web/API/Document/querySelectorAll

https://developer.mozilla.org/ja/docs/Web/API/NodeList

### 文字列
文字列はプリミティブな値ですが、Array-like な振る舞いをします。
`length`プロパティをもち、数値インデックスによって文字へアクセスが可能なためです。

また、文字列に対しても`forEach`や`map`、`filter`などを呼び出すことはできません。

## 配列メソッドを使うには
### `Array.from()`を使う方法
`Array.from()`はArray-like object や iterble object を配列にすることができます[^2]。
イテレート可能でないオブジェクトを配列に変換するためには、`length`プロパティを持つ必要があります[^3]。


先の例での`nodeList`を`Array.from()`の引数として渡すと、`Array.prototype`をもつ配列が返されます。
```js
const nodeList = document.querySelectorAll('.foo')

const nodeListArray = Array.from(nodeList)

console.log(nodeListArray)
```
```

(3) [div.foo, div.foo, div.foo]
0: div.foo
1: div.foo
2: div.foo
length: 3
[[Prototype]]: Array(0)
```
`NodeList`や文字列に対して`map`や`filter`を使いたい場合には、配列へと変換すればいいわけですね。

### `Function.call()`で呼び出す方法
`Function.call()`はオブジェクトのメソッドを他のオブジェクトに割り当てて使用できるようにするメソッドです。
`Function.call()`を使用すれば、配列に変換せずに、`Array.prototype`から間接的に`map`や`filter`を呼び出すことも可能です。

第1引数には`this`として使われるオブジェクトを指定し、第2引数以降には呼び出す関数への引数を指定します。
`Array.prototype.filter`を使いたいときには、第1引数にArray-like object、第2引数に`filter`関数への引数を渡して使用します。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/call

#### 例
```js
const foo = {}

for(let i=0; i<3; i++){
    foo[i] = i;
}

foo.length = 3;

const bar = Array.prototype.filter.call(foo, (fooProperty)=>fooProperty >= 1)

console.log(bar)
```
```
[1, 2]
```
この例では`foo`というArray-like object に`filter`を間接的に呼び出して適用しています。
Array-like object に`filter`を適用したことで、1以上の要素のみに絞り込まれた配列が返ってきていることがわかります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Indexed_collections#%E9%85%8D%E5%88%97%E9%A2%A8%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E6%89%B1%E3%81%84

[^1]:`querySelectorAll()`から返される`NodeList`は、DOM要素が変化しても`NodeList`への変化はない、静的な`NodeList`と呼ばれるものです。反対に、DOMが更新されるとリストも自動的に更新されるものを生きた`NodeList`と呼びます。
[^2]:シャローコピーによって引数を複製して配列に変換するため、Array-like object 内の要素がオブジェクトの場合などには、変換後の配列の要素も同じ参照をもつことになるため注意が必要です。
[^3]:`length`も持たない場合には、空配列`[]`が返されます。
