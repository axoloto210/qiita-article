---
title: readonlyなプロパティも書き換えられうる
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## readonly修飾士
オブジェクトの型を宣言するときに、プロパティ名の前に`readonly`をつけることで、そのプロパティを読み取り専用にすることができます。
```ts
type ReadonlyObj = {
  readonly num: number
}


const readonlyObj: ReadonlyObj = {
  num: 314
}

readonlyObj.num = 217 //型エラーが発生
```
`readonly`によって読み取り専用にしたプロパティ`num`を値`217`へと直接書き換えようとすると、以下のように型エラーが発生します。
```
Cannot assign to 'num' because it is a read-only property.(2540)
```
`readonly`をつけることによって、変更されたくないプロパティを型で明示することができます。
## readonly なプロパティでも変更されうる
この`readonly`修飾士をプロパティにつけている場合でも、**関数を介すことで値が書き換えられてしまう**場合があります。

```ts
type Obj = {
  num: number
}

type ReadonlyObj = {
  readonly num: number
}

const readonlyObj: ReadonlyObj = {
  num: 314
}

const changeNum = (obj: Obj) => {
  return obj.num = 271
}

console.log(readonlyObj) //{ "num": 314 } 
changeNum(readonlyObj) // readonlyなプロパティを型エラーなしで書き換えられてしまう。
console.log(readonlyObj) //{ "num": 271 } 
```
上の例のように、引数で受け取ったオブジェクトの`num`というプロパティの値を直接`271`に変更する関数`changeNum`について考えてみます。

この`changeNum`に`readonly`な`num`プロパティを持つオブジェクト`readonlyObj`を渡すと、型エラーなしでプロパティの書き換えができていることがわかります。

**`readonly`がついているからといって、プロパティの値が一切変わらないわけではない**ということは、頭の片隅にいれておくと混乱が少なくすむかもしれません。