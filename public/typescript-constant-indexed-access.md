---
title: 「実質的な定数」キーのインデックスアクセスで型を絞る
tags:
  - TypeScript
private: false
updated_at: '2024-07-11T23:17:49+09:00'
id: eaf7f72b7be844f67fcc
organization_url_name: null
slide: false
ignorePublish: false
---
## Constant Indexed Accesses
TypeScript 5.5 から、オブジェクトとキーが「実質的な定数」であるときに、インデックスアクセスによって型が絞られるようになりました。

https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#inferred-type-predicates#control-flow-narrowing-for-constant-indexed-accesses


## オブジェクトへのインデックスアクセス
オブジェクトの変数`obj`のプロパティを取得する方法には、`obj.key`のようにプロパティキーを指定して取得する方法がありますが、ほかにもプロパティキーを格納した変数`keyVar`を使って、`obj[keyVar]`という形で取得することができます。

```ts
const obj = {
  foo: 'bar'
}

const key: keyof typeof obj = 'foo'

console.log(obj[key])
// "bar" 
```
オブジェクトのキーを表す変数`key`に`'foo'`を格納し、`obj[key]`という書き方によって`obj`の`foo`キーに対応するプロパティ`'bar'`を取得することができます。

<br/>

`obj.key`によってアクセスしようとした場合には、`key`に格納されている`'foo'`によるアクセスではなく、`'key'`というプロパティキーによって指定しているとみなされ、エラーが発生してしまいます。
```ts
const obj = {
  foo: 'bar'
}

const key: keyof typeof obj = 'foo'

console.log(obj.key)
```
```
Property 'key' does not exist on type '{ foo: string; }'.(2339)
```

変数`key`を使って`obj.key`のようにアクセスすることはできないため、変数によるアクセスをしたい場合にはこのインデックスアクセスが有用ですね。

## 「実質的な定数」とは
「Control Flow Narrowing for Constant Indexed Accesses」 に関するPR には以下のように書かれています。
>With this PR we perform control flow analysis for element access expressions obj[key] where key is a const variable, or a let variable or parameter that is never targeted in an assignment. 

`obj[key]`のようにアクセスするとき、この`key`が`const`で宣言されているか、`let`やパラメータで宣言されているが再代入はされないという場合に、型の絞り込みが働くようになります。

`const`で置き換えても問題ない場合に、「実質的な定数」として扱われるわけですね。

## インデックスアクセスによる型の絞り込み
TypeScript 5.5 からは「実質的な定数」キーを使ったインデックスアクセスによる型の絞り込みが効くようになりました。

型の絞り込みが行えるようになっていることを TypeScript 5.4 とTypeScript 5.5 とで比較して確認してみます。

### TypeScript 5.4 でのインデックスアクセス
まず、TypeScript 5.4 でも型エラーのでない以下のコードを考えてみます。
```ts
type Fish = { name?: string , age?: number}

const fishName: keyof Fish = 'name'

const fish: Fish = Math.random() > 0.5 ? { name: 'salmon' } : { age: 5 }

if (typeof fish[fishName] !== 'undefined') {
  fish[fishName].toUpperCase()
  console.log(fish[fishName])
  // "salmon"
}
```
`Fish`というオブジェクトの型はオプショナルな`name`プロパティを持っています。
上のコードでは、この`name`というキーを**const** で宣言した変数`fishName`に格納しています。

型の絞り込みが行われるのは`if (typeof fish[fishName] !== 'undefined')`のブロック内で、TypeScript 5.4 でも型の絞り込みが行われます。
そのため、`undefined`の場合にはアクセスできないはずの`toUpperCase()`を使用しても型エラーが出ていません。

<br/>

今度は`fishName`を**let** で宣言してみると、以下のように型エラーが出ます。
```ts
type Fish = { name?: string , age?: number}

let fishName: keyof Fish = 'name'

const fish: Fish = Math.random() > 0.5 ? { name: 'salmon' } : { age: 5 }

if (typeof fish[fishName] !== 'undefined') {
  fish[fishName].toUpperCase() // 型エラーが発生
  console.log(fish[fishName])
  // "salmon"
}
```
```
Object is possibly 'undefined'.(2532)
```
`let`で宣言した場合には変数に別の値が代入される可能性があるため、`if(typeof fish[fishName] !== 'undefined')`のブロック内でも`undefined`ではないと保証されていないわけですね。

### TypeScript 5.5 でのインデックスアクセス
今度はTypeScript 5.5 で試してみると、型エラーが出なくなります。
`let`で宣言した変数に再代入が行われていないことをコンパイラが検知できるようになったようですね。

型の絞り込みが行われるのは「実質的な定数」のときですので、別の値が代入されたときには絞り込みが行われずにTypeScript 5.4 のときと同様に型エラーが発生するようになっています。
```ts
type Fish = { name?: string; age?: number }

let fishName: keyof Fish = "name"

fishName = 'age'

const fish: Fish =
  Math.random() > 0.5 ? { name: "salmon" } : { name: undefined }

if (typeof fish[fishName] !== "undefined") {
  fish[fishName].toUpperCase() 
  //Object is possibly 'undefined'.ts(2532)
  //Property 'toUpperCase' does not exist on type 'number'.ts(2339)
  console.log(fish[fishName])
}
```

<br/>

以下のように初期値と同じ`"name"`を再代入した場合にも確かに型エラーが発生します。
（先の例とは異なり、`toUpperCase()`に関する型エラーは出なくなっています。）
```ts
type Fish = { name?: string; age?: number }

let fishName: keyof Fish = "name"

fishName = "name"

const fish: Fish =
  Math.random() > 0.5 ? { name: "salmon" } : { name: undefined }

if (typeof fish[fishName] !== "undefined") {
  fish[fishName].toUpperCase() 
  //Object is possibly 'undefined'.ts(2532)
  console.log(fish[fishName])
}
```

<br/>

TypeScript 5.5 により、ユーザー定義型ガードなどで型の制御が必要となっていた場面が減るのは嬉しい限りですね。
