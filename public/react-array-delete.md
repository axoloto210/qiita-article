---
title: React での配列要素の削除方法
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## React での配列要素の削除方法
本記事は以下記事での配列要素の削除方法についての続きです。

https://qiita.com/axoloto210/items/cb93a3aebc3521cace3f

## `useState`が検知できる配列要素の削除方法
`useState`のset 関数に配列から要素が削除されたことを検知させるには、元の配列とは異なる配列（の参照）をset 関数に渡す必要があります。

`useState()`によって検知できるようにするためには、新たな配列を返すメソッドを利用するようにします。

以下では、要素を削除する際に**新たな配列を返すメソッド**と元の配列から要素を削除してしまうメソッドについてみていきます。

## 要素削除後に新たな配列として返すメソッド
### `Array.prototype.filter()`
`filter()`は配列の各要素を、引数に渡した関数へと渡し、関数の結果が`true`（truthy）となる要素のみをもつ配列を新たに作成して返します。

条件に合致しない要素を削除した、新たな配列を得ることができます。

```ts
const array = [1, 2, 3]

const newArray = array.filter((element)=> {
    return true
})

console.log(newArray)
// [ 1, 2, 3 ]

console.log(Object.is(newArray, array))
// false
```
上の例では、`filter()`適用後も同じ内容の配列となっていますが、`Object.is()`による比較では不一致判定となっており、確かに新しい配列が返ってきていますね。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

### `Array.prototype.slice()`
`slice()`は引数で指定した範囲の要素をもつ配列を新たに作成して返します。

`slice(start, end)`のように開始位置と終端位置を引数にとります。`end`で指定した番号の要素`array[end]`は含まれません。
`start`や`end`は省略可能であり、`end`を省略した場合には`array[start]`から末尾までの要素を持つ配列が返されます。
`start`と`end`を省略した場合には、配列のコピーが返されます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice

## 元の配列の要素を直接削除するメソッド
### `Array.prototype.pop()`
`pop()`は元の配列の最後の要素を直接取り除きます。
返り値は削除された要素であり、削除された要素がない場合には`undefined`が返されます。
```ts
const array = [1, 2, 3]

const poppedElement = array.pop()

console.log(poppedElement)
// 3

console.log(array)
// [ 1, 2 ]
const empty = [].pop()

console.log(empty)
// undefined
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/pop

### `Array.prototype.shift()`
`shift()`は`pop()`に似たメソッドで、元の配列の最初の要素を取り除きます。
返り値も`pop()`と同様に削除された要素であり、削除された要素がない場合には`undefined`が返されます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/shift

### `Array.prototype.splice()`
`splice()`によって、元の配列に対して直接要素の追加・削除・置き換えができます。

`splice(start, deleteCount, item1, item2)`のように、`splice`は複数の引数を取ります。
第１引数の`start`によって、変更を加える配列の要素の位置を指定します。

第２引数の`deleteCount`によって、`start`番目の要素からいくつ要素を削除するかを指定します。
削除する要素には`start`番目の要素を含みます。
また、`start`番目以降の要素を削除するには`Infinity`を指定します。
```ts
const array = ['a', 'b', 'c', 'd']
array.splice(2, Infinity)

console.log(array)
// [ 'a', 'b' ]
```

第３引数以降は追加する要素を指定できます。
削除処理の後、`start`番目から順次要素を追加していきます。

```ts
const array = ['a', 'b', 'c', 'd']
array.splice(1, 2, 'e', 'f')

console.log(array)
//[ 'a', 'e', 'f', 'd' ]
```
上の例では、第１引数の`1`によって`array`のインデックスでの1番目、つまり配列の先頭から2番目の要素`'b'`の位置が開始位置として指定されています。
第２引数の`2`によって、2番目の要素から2つ、つまり2番目の要素`'b'`と3番目の要素`'c'`が削除されます。
最後に第3引数以降の値が第１引数で指定した箇所から順次追加されていきます。

追加される要素数よりも削除される要素数の方が多い場合についてもみてみます。
```ts
const array = ['a', 'b', 'c', 'd', 'e', 'f']
array.splice(2, 3, 'g')

console.log(array)
//[ 'a', 'b', 'g', 'f' ]
```
`array`から`'c'`、`'d'`、`'e'`が削除され、開始位置である`'c'`のあった箇所に`'g'`が追加されます。
最終的な結果は`['a', 'b', 'g', , , 'f']`のように`'d'`や`'e'`があった箇所が空となりそうですが、実際には追加された要素の直後に`'f'`がきています。
この配列をバラバラにしてからつなぎ合わせるような挙動から、`splice`（接合する）という名がついたのであろうと思えますね。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

`pop()`や`shift()`、`splice()`など直接配列から要素を削除するメソッドを使用する際には、配列の複製を新たに作成してから削除処理を行うことで、`useState`のset 関数に変更が検知されるようにできます。