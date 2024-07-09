---
title: React での配列の並び替え
tags:
  - React
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## React での配列の並び替え
本記事は以下記事での配列の並び替えについての続きです。

https://qiita.com/axoloto210/items/cb93a3aebc3521cace3f

## 直接配列を並び替えるメソッド
配列を並び替えるメソッドとして代表的なものに`sort()`や`reverse()`があります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse

これらのメソッドは配列要素を直接並び替えるため、`useState()`のset 関数に並び替えた後の配列を渡しても、「配列が変更された」とみなされず、画面に反映されません。

```ts
const array = [4, 5, 2, 3, 1]

const newArray = array.sort()

console.log(newArray)
// [ 1, 2, 3, 4, 5 ]

console.log(Object.is(array, newArray))
// true
```

`sort()`や`reverse()`によって配列を並び替えてからset 関数に渡したいときには、あらかじめ配列の複製を作成しておき、複製した配列を並び替えてから渡す必要があります。

```ts
const array = [4, 5, 2, 3, 1]

const newArray = [...array].sort()

console.log(newArray)
// [ 1, 2, 3, 4, 5 ]

console.log(Object.is(array, newArray))
// false
```
スプレッド構文`[...array]`によって、新しい配列を作成することで、並び替え後の配列と元の配列の参照は別のものとなっています。

## 新たに配列を返す並び替えメソッド
比較的新しいメソッドとして、並び替えた配列を新しい配列として返すメソッドが存在します。
TypeScript の設定ファイルの変更が必要だったり、古いブラウザでは動作しない場合があったりもしますが、新しい配列を返すメソッドについても整備されてきています。

https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/#copying-array-methods

### `toSorted()`
`sort()`に対応するメソッドとして`toSorted()`が追加されています。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted

```ts
const array = [4, 5, 2, 3, 1]

//@ts-ignore
const newArray = array.toSorted()

console.log(newArray)
// [ 1, 2, 3, 4, 5 ]

console.log(Object.is(array, newArray))
// false
```
`sort()`とは異なり、並び替え後の配列が元の配列`array`とは別の配列となっていることがわかります。

### `toReversed()`
`toReversed()`は`reverse()`に対応する、並び替え後の配列を新たな配列として返すメソッドです。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed

## 余談:　`splice()`に対応するメソッド
並び替えを行うメソッドではないですが、配列へ直接要素の追加・削除・置き換えができるメソッドに`splice()`があります。
この`splice()`に対応する、新たな配列を返すメソッドとして`toSpliced()`というメソッドも追加されています。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced

配列を複製してから`sort()`や`reverse()`を使用するという方法がとられることが多いと思いますが、`toSorted()`や`toReversed()`というメソッドがあることを知っておくといずれどこかで役立てられるかもしれませんね。