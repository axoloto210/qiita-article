---
title: タプル型とuseState
tags:
  - TypeScript
  - React
private: false
updated_at: '2024-07-06T22:36:36+09:00'
id: 4fb7fde86b83988a549b
organization_url_name: null
slide: false
ignorePublish: false
---
## タプル型とは
タプル型とは**要素数の決まった配列の型**のことで、`[number, string, boolean]`のように表します。

JavaScript におけるタプルとは配列の一種ですので、タプル型の変数の値には配列のリテラル値を渡すことになります。
タプル型を使用することで、「配列の何番目にどのような型の値を入れられるか」という制約をつけることができます。
```ts
type Tuple = [number, string, boolean]

const tuple: Tuple = [123, 'abc', true]
```

`[number, string, boolean]`型の変数の先頭の要素に`number`型ではない値をもつ配列リテラルを代入してみると、先頭の要素（`'123'`）の箇所に型エラーを出してくれます。
```ts
const errorTuple: Tuple = ['123', 'abc', true] //型エラー
```
```
Type 'string' is not assignable to type 'number'.ts(2322)
```

https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types

## オプショナルな要素を持つタプル型
`?`をつけることで、要素をオプショナルにすることも可能です。
```ts
type OptionalTuple = [number, string, boolean?]

const optionalTuple: OptionalTuple = [123, 'abc']
```
オプショナルな型とできるのはタプルの末尾部分に限られ、オプショナルな要素の後ろに必須要素を続けることはできません。
（オプショナルな要素を続けて複数設定することは可能です。）
```ts
type MidOptional = [number, string?, boolean] //型エラー
```
このコードは、以下のように必須要素をオプショナルな要素に続けることができない旨のエラーが出ます。
```
A required element cannot follow an optional element.ts(1257)
```

## ラベル付きタプル型
タプル型の要素には名前をつけることができ、`[num: number, str: string, bool: boolean ]`のように記述できます。
名前をつけてもオブジェクトの要素のようにアクセスすることはできませんが、何番目にどのような要素を入れておきたいかを読み手に伝えることができるようになっています。

要素番号によるアクセスが必要になってしまうため、基本的にはオブジェクトを使用してアクセスする方が可読性が高そうですね。

## 可変長タプル型
タプル型では`...`という構文を使用することで、長さの定まっていないタプルに対しても型をつけることができます。

以下は公式Docsに記載されている例です。
```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types

タプルの中でどの要素が何の型にあたるかが一意に定まらなくなってしまうため、複数の`...`構文を続けて書くことはできません。
```ts
type RestElementTuple = [string, ...number[], ...string[]] //型エラー
```
この書き方をすると、以下のようにエラーが出ます。
```
A rest element cannot follow another rest element.ts(1265)
```

同様の理由で、オプショナルな要素も`...`構文に続けて書くことはできません。
```ts
type RestOptionalTuple = [number, ...string[], boolean?] //型エラー
```
```
An optional element cannot follow a rest element.ts(1266)
```

## React のuseState とタプル型
公式のDocs には以下のような記載があります。
>Tuple types are useful in heavily convention-based APIs, where each element’s meaning is “obvious”. 

各要素の意味が"明らか"で、**慣習**を重視した場面で有用なようです。

https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types

例えば、React における`useState`の返り値の型はタプル型となっています。
```ts
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
```
`[state, setState] = useState(initialState)`のように（配列の分割代入によって）状態を表す変数`state`とそれを設定する`set`関数を受け取ることで`useState`を使用することができますが、これは「`useState`からは状態を表す変数と`set`関数が常にこの順番で返される」という**慣習**を重視している場面であると捉えられますね。

普段の開発での活用場面は中々ないかもしれませんが、ライブラリの作成や型情報を読み解く際には有用な型となっていそうです。
