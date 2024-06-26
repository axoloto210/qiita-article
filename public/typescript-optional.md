---
title: '?(オプショナルプロパティ)と| undefined の違い'
tags:
  - TypeScript
private: false
updated_at: '2024-06-26T18:04:25+09:00'
id: 8328865d3112a32488dc
organization_url_name: null
slide: false
ignorePublish: false
---
## オプショナルプロパティ
TypeScript のオブジェクトの型は`{<key名>: <プロパティの型>}`の形で表されますが、プロパティキーの後に`?`をつけることでそのプロパティがあってもなくてもよいこと（オプショナルであること）を明示できます。
```ts
type Fish = {
  name: string
  age?: number
}
```

一方で、`undefined`型とのユニオン型をとることでも、プロパティが`undefined`であってもよいことを明示できます。
```ts
type Fish = {
  name: string
  age: number | undefined
}
```

一見同じ型に思える`?` と`| undefined` ですが、実はそれぞれ異なる意味を持っています。
以下で両者の違いをみていきたいと思います。

## `?`と`| undefined`の違い
両者の違いは、**プロパティが必須かどうか**にあります。

`?`の場合には、オブジェクトにその**プロパティがなくても型エラーが発生しません**。

一方で、`| undefined` とした場合には、オブジェクトにその**プロパティ自体が存在している**必要があります。
```ts
type Fish = {
  name: string 
  age?: number
}

type Octopus = {
  name: string
  age: number | undefined
}

const fish: Fish = {
  name: 'Tuna'
}

const octopus: Octopus = { //Property 'age' is missing in type '{ name: string; }' but required in type 'Octopus'.(2741)
  name: 'octopus'
}
```
`undefined`型とのユニオン型の場合には、値が`undefined`であることは許すが、プロパティ自体が存在しないことは許さないので、プロパティ自体は持たせておきたいという場合に使用すると、型により詳細な情報を持たせられていいですね。
```ts
const octopus: Octopus = { // プロパティが揃っているので型エラーは出ない
  name: 'octopus',
  age: undefined
}
```
