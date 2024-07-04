---
title: Union DistributionとDistributive Conditional Types
tags:
  - TypeScript
private: false
updated_at: '2024-07-04T10:06:28+09:00'
id: 627b019995b81d918f7d
organization_url_name: null
slide: false
ignorePublish: false
---
## Union Distribution とは
Union Distribution とは、Conditional Types と呼ばれる型の型引数（ジェネリック型）にユニオン型が渡された際に、その**ユニオン型に対して分配（distribution）が行われる**という性質のことです。

本記事では、Conditional Types の構文についてと、ユニオン型を渡した際にどのように型が得られるのかについて見ていきたいと思います。

## Conditional Types について
Conditional Types とは、条件分岐によって表せる型のことで、`T extends U ? A : B`という構文で表されます（`T`は型引数になります）。
`T extends U ? A : B`は、`T`型が`U`型の部分型であれば`A`型を、そうでなければ`B`型となる型を表します。
（`T extends U`の部分をboolean のように捉えると、三項演算子と同じ構造になっていますね。）

```ts
type IsString<T> = T extends string ? true : false
```
上の型は、`T`が`string`型の部分型であれば`true`型となり、そうでなければ`false`型となります。

## ユニオン型を渡すと分配が起こるDistributive Conditional Types
Conditional Types の型引数にユニオン型を渡す形については特別な名前がついており、**Distributive Conditional Types**と呼ばれます。

以下で、型引数`T`が`string`型の場合に`T`の配列型を返す型`ToArray<T>`を考えてみます。
```ts
type ToArray<T> = T extends string ? T[] : never

//type UnionArray = "octopus"[] | "squid"[]
type UnionArray = ToArray<"octopus"|"squid"> 
```
`ToArray<T>`型に`string`型の部分型であるようなユニオン型`"octopus"|"squid"`を渡した際に得られる型を見てみます。

`UnionArray`の型としては、構文を文字通りみていくと`"(octopus"|"squid")[]`という型になりそうですが、Union Distribution が働くため、実際にはユニオン型の構成要素が分配される形となり、`"octopus"[] | "squid"[]`型となります。


ちなみに`"(octopus"|"squid")[]`のようなユニオン型の配列型を得たい場合には、以下のコード例のように`extends`の前後を`[]`で囲むことでUnion Distribution が働かないようにできます。
```ts
type X<T> = [T] extends [string] ? T[] : never

type Y = X<"octopus" | "squid" > //type Y = ("octopus" | "squid")[]
```


もしくは`T`の部分を`[T]`とすることでも（煩雑になりますが）取得可能ではあります。
```ts
type X<T> = T extends string ? [T] : never
//type Y = ("octopus" | "squid")[]
type Y = X<"octopus" | "squid" >[number][]
```

## ユーティリティ型で使われるDistributive Conditional Types
Distributive Conditional Types は少々難解なため、使用頻度はそこまで高くはないかもしれませんが、`Extract`型や`Exclude`型といった組み込み型がどのように実装されているのを理解するのに役立ちます。

以下は`Exclude`型と`Extract`型の実装部分で、Distributive Conditional Types が利用されています。
```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;
```

### Extract の動きを追う
`Extract`型がどのように型を決定しているのかをみていきたいと思います。

`Extract<T, U>`型は、`T`型から`U`型の部分型を抽出するユーティリティ型です。
以下のように`'octopus' | 'squid'`型と`'octopus' | 'tuna'`型を`Extract`に渡してみると、`'octopus'`型が抽出されます。

```ts
type Octopus = Extract<'octopus' | 'squid', 'octopus' | 'tuna'>
//type Octopus = "octopus"
```

どのようにUnion Distribution が起きているかを、`Extract`の形を少し変えてみていきます。
`Extract<'octopus' | 'squid', 'octopus' | 'tuna'>`を、`Exclude<'octopus' | 'squid', T>`として考えてみます。
以下のコードでは`OctopusSquid<T>`にあたります。
```ts
type OctopusSquid<T> = T extends 'octopus' | 'squid' ? T : never

type X = OctopusSquid<'octopus' | 'tuna'>
//type X = "octopus"
```
`OctopusSquid<T>`の型引数`T`に`'octopus' | 'tuna'`型を渡すと、Union Distribution によって、各要素ごとに条件判定がなされる形となります。

まず、`'octopus' | 'tuna'`の`'octopus'`部分について、こちらは`'octopus' | 'squid'`の部分型となっているため、`T extends 'octopus' | 'squid'`の条件を満たしており、`T`型、つまり`'octopus'`型と判定されます。

次に、`'octopus' | 'tuna'`の`'tuna'`部分について、こちらは`'octopus' | 'squid'`の部分型ではないため、`never`型と判定されます。

<br/>

最後に、この2つの結果のユニオン型をとることで、`Extract<'octopus' | 'squid', 'octopus' | 'tuna'>`が得られることになります。

得られる型は`'octopus' | never`となるはずですが、`never`型とのユニオンをとると`never`型は消えてしまいますので（「空集合との和集合」と捉えるとわかりやすいです）、最終的に得られる型は`'octopus'`型となるわけです。

<br/>

以上のように少々難解な動きをするDistributive Conditional Types ですが、ユーティリティ型の実装にロジック部分が組み込まれることで、利用する敷居が下がっていてユーティリティ型となっている有用性を感じられますね。

<br/>

https://qiita.com/axoloto210/items/8fd390c41972bdb8c37e

https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types

