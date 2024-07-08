---
title: Reactの配列操作にご用心
tags:
  - JavaScript
  - React
private: true
updated_at: '2024-07-08T23:39:12+09:00'
id: cb93a3aebc3521cace3f
organization_url_name: null
slide: false
ignorePublish: false
---
## `useState` での配列変化の検知
React では`useState`を用いて、コンポーネントに`state`変数を紐づけることによって状態を管理できます。

この`state`変数には配列を指定することもできます。
ただし、`useState`の第２引数として返されるset 関数は、配列に変更が入ったことを`Object.is()`によって検知しているため、すでにある配列に対して操作を行っても変更が検知されず、状態の変更が反映されないことがあります。

https://ja.react.dev/reference/react/useState#:~:text=state%20%E3%81%AE%E5%90%8C%E4%B8%80%E6%80%A7%E3%81%AE%E6%AF%94%E8%BC%83%E3%81%AF%E3%80%81Object.is%20%E3%81%AB%E3%82%88%E3%81%A3%E3%81%A6%E8%A1%8C%E3%82%8F%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82

`Object.is()`は厳密等価演算子`===`とほとんど同じ判定をしますが、`0`と`-0`を一致と判定しない点と、`NaN`同士を一致判定する点で異なっています。

<br/>

変数に配列を代入するとき、変数には配列自体ではなく配列への参照（格納されているメモリのアドレスのこと）が代入されます。

配列に変更を加えるメソッドの中には、（参照を変えることなく）配列を直接変更するメソッドがいくつかあり、それらを使用してもReact 側へは配列に加えた変更が伝わらないこととなります。

## `Object.is()`と配列
変数に配列を代入するとき、変数には配列自体ではなく配列への参照が代入されます。
そのため、以下のように同じ要素を持つ配列を別々に宣言しても、`Object.is()`には一致していると判定されません。
```ts
const arr = [1, 2, 3, 4]

const arr2 = [1, 2, 3, 4]

console.log(Object.is(arr, arr2))
// false
```

しかし、別の変数に配列を代入してからその配列に要素を直接追加して、元の変数と比較したときには一致判定がされます。
```ts
const initialState = ['a', 'b', 'c']
const state = initialState

state[3] = 'd'

console.log(state)
// [ 'a', 'b', 'c', 'd' ]

console.log(Object.is(state, initialState))
//true
```
配列に要素を直接追加しても、`Object.is()`には元と同じ配列であるとみなされて変更が検知できないわけですね。

`state`に配列を格納して値を変更するときには、その変更が検知されるような書き方をする必要があります。

## 新たな配列を返すメソッド
配列を操作するメソッドのうち、変更結果を新しい配列として返すメソッドがいくつか存在します。
基本的にはそれらのメソッドを使用するようにすることで、配列への変更が検知されない事態を避けることができます。

配列操作後に新たな配列を返すメソッドとしては、`concat()`や`map()`、`filter()`や`slice`などが挙げられます。

配列への追加や削除、更新などの用途に応じて以下でみていきます。
### 配列への追加
スプレット構文や`concat`、`push`や`unshift`など

https://qiita.com/axoloto210/items/2092c31d437418ab94cc

### 配列への更新
`map`や`splice`など
### 配列要素の削除
`filter`や`slice`、`splice`など
### 配列要素の並び替え
`sort`や`reverse`など
