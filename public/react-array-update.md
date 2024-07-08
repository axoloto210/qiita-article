---
title: React での配列の更新方法
tags:
  - JavaScript
  - React
private: true
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## React での配列更新方法
本記事は以下記事での配列更新方法についての続きです。

https://qiita.com/axoloto210/items/cb93a3aebc3521cace3f

## `useState`に検知される配列更新の方法
配列が更新されたことを`useState`に検知させるには、**更新後の配列を新しい配列として**set 関数に渡す必要があります。

## 新たな配列を返す更新方法
### `Array.prototype.map()`
`map()`は与えられた配列の各要素それぞれに対して、`map()`の引数の関数を適用し、その値を要素とする新しい配列を返します。

配列の各要素を２倍に更新する例を考えてみます。
```ts
const array = [1, 2, 3]

const doubleNum = (num: number) => 2 * num

const newArray = array.map(doubleNum)

console.log(newArray)
// [ 2, 4, 6 ]

console.log(Object.is(array, newArray))
// false
```

`Object.is(newArray, array)`が`false`となっていることから、`newArray`と`array`が別の値であることが`useState`のset 関数によって検知可能であることがわかります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map

## 元の配列を直接更新してしまう方法
### `Array.prototype.splice()`
`splice()`は配列に対して、直接要素の削除や追加、置き換えを行うことができます。
返り値は削除された要素の配列で、削除された要素がない場合には空の配列`[]`が返されます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

### 要素番号を指定しての更新
配列`array`について、要素番号を指定して値を更新することも避けるべきです。
こちらも配列を直接操作しているため、set 関数では検知できません。
```ts
const array = [1, 2, 3]

// forEach自体は常にundefined を返します。
array.forEach((element, index)=>{
    array[index] = 2 * element
})

console.log(array)
// [ 2, 4, 6 ]
```

元の配列が変更されてしまう方法を使いたい場合には、元の配列をコピーした配列を新たに用意し、その配列に対して更新を行えば問題ありません。

[1^]: `splice` は「接合する、より継ぎする」の意。