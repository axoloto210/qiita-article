---
title: インデックスシグネチャと型安全性
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## インデックスシグネチャとは
インデックスシグネチャとは、オブジェクトの型を宣言する際に使用できる構文で、任意のプロパティキーに対して、プロパティの型を設定することができます。

オブジェクトの型を宣言するときにはプロパティのキー名が必要になりますが、プロパティに変数を使ってアクセスする場合など、型を宣言する時点ではプロパティキーがなにか判明していない場面などで有用です。

`{[key: T]: U}`という構文で表され、プロパティキーの型`T`とプロパティ値の型`U`を設定できます。

:::note warn
Mapped Types の構文`{ [key in T]: U } `と見かけが似ているので、混同しないよう注意が必要です。
:::


```ts
type Fish = {
  [name : string]: string
}
```
上の例の`Fish`型は、プロパティキー、プロパティ値がともに`string`型であるオブジェクト型となっています。

`number`型のプロパティ値をもつオブジェクトリテラルを`Fish`型の変数に代入しようとすると、以下のように`string`型に合致していない旨の型エラーを出してくれます。
```ts
const fish: Fish = {
  name: 'Tuna',
  age: 20
}
```
```
Type 'number' is not assignable to type 'string'.(2322)
input.tsx(2, 3): The expected type comes from this index signature.
```

## 通常のプロパティと一緒に使う
インデックスシグネチャは通常のプロパティと一緒にオブジェクト型の記述に使用可能です。
ただし、使用できるプロパティには、**インデックスシグネチャで指定した型の部分型**という制約がつきます。
```ts
type Fish = {
  [name : string]: string
  habitat: 'sea' | 'river'
}
```
`sea`|`river`型は`string`型の部分型ですので、上の例では問題なく使用できます。
インデックスシグネチャのみのままでも型エラーは出ないのですが、プロパティのキー名で指定することによって`Fish`型の値が`habitat`プロパティを必ず持っていなければならないことを型で明示できるので、より厳格な型チェックができるようになっています。


```ts
type Fish = {
  [name : string]: string
  age: number
}

```
一方で上の例のように、インデックスシグネチャの型に合致しない`number`型のプロパティ`age`を追加することはできません。
```
Property 'age' of type 'number' is not assignable to 'string' index type 'string'.(2411)
```

## 型安全性が損なわれるケースに注意
インデックスシグネチャはプロパティ名の判明していないプロパティを型に入れるときなどに有用ではありますが、型安全性を損なう面を持ち合わせていることを意識しておく必要があります。

インデックスシグネチャではプロパティ名を指定せずに型が定義できるので、存在しないプロパティへアクセスした場合にも型エラーが出ないといったことが起こり得ます。

以下のように存在しないプロパティへ`string`型の変数でアクセスするコードを考えてみます。
```ts
type Fish = {
  [name : string]: string
  habitat: 'sea' | 'river'
}

const fish: Fish = {
  name: 'Tuna',
  habitat: 'sea'
}

const key = 'foo'

console.log(fish.key)
console.log(fish.bar)
```

`Fish`型の変数`fish`には`foo`というプロパティは存在しないのですが、インデックスシグネチャによって任意の`string`型のプロパティキーをもつことが認められているため、存在しないプロパティへのアクセスを型エラーで検知できなくなってしまっています。

インデックスシグネチャには以上のような型安全性を損なう面もあるため、使用に際しては注意が必要です。

インデックスシグネチャが必要になった際には、より安全な方法として`Map`の使用を検討してみてもいいかもしれません。