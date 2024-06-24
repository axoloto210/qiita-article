---
title: interface 宣言のDeclaration Merging とは
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---

## interface 宣言
`type`文による型宣言（型エイリアス）のほかに、オブジェクト型を宣言する方法がinterface 宣言です。

https://qiita.com/axoloto210/items/b4b61484438b487a68eb

「interface 宣言によって宣言された型」と「型エイリアスによって宣言された型」は基本的には同じ型として扱われますが、宣言方法に関しては性質が大きく異なる点があります。その1つが**Declaration Merging** です。

## interface 宣言のDeclaration Merging
`type`文によって同名の型を宣言しようとするとコンパイルエラーとなりますが、`interface`で宣言した場合にはコンパイルエラーとはならず、宣言した複数の型がマージされて1つの型として扱われます。
これが`interface`の**Declaration Merging**です。

<br/>

以下ではプロパティの種類によって、どのように`interface`がマージされるのかをみていきます。
### 関数でないプロパティのマージ
同名の`interface`を以下のように宣言してみます。
```ts
interface Fish {
    name: string
}

interface Fish {
    weight: number
    height: number
}
```
`Fish`型の型注釈をつけた変数に以下のようなオブジェクトリテラルを代入してみます。
```ts
const salmon: Fish = {
    name: 'Salmon',
} 
```
すると、以下の型エラーが出ることが確認できます。
```
Type '{ name: string; }' is missing the following properties from type 'Fish': weight, height ts(2739)
```

`weight`と`height`プロパティが含まれていないオブジェクトリテラル`{ name: 'Salmon' }`を代入しようとしたために型エラーとなっています。
Declaration Merging によって2つの`Fish`型がマージされて、以下のように1つの型として扱われるようになっていることがわかります。
```ts
interface Fish {
    name: string
    weight: number
    height: number
}
```

<br/>

Declaration Merging と同様のことを型エイリアスで行いたいときには、以下のように交差型を使用することで実現できます（型エイリアスでは`interface`と違って同名の型を複数定義するとエラーが発生するため、交差型を使用します）。
```ts
type Name = {name: string}

type Size = {
    weight: number
    height: number
}

type Fish = Name & Size
```
`interface`によるDeclaration Merging のときは同じ名前の型を複数宣言すればよかったわけですが、型エイリアスの交差型によって宣言する場合には、交差型をとる前の型に別の名前をつける必要が出てきてしまっています。

<br/>
もちろん交差型を使わずに1つの型に統合して宣言できれば可読性が高くなります。

```ts
type Fish = {
    name: string
    weight: number
    height: number
}
```

### 関数でない同名プロパティのDeclaration Merging
Declaration Merging によって`interface`がマージされるためには、「関数ではない同名のプロパティ」についてはその型が一致している必要があります。
```ts
interface Octopus {
  name: string
}

interface Octopus {
  name: 'octopus'
}
//Subsequent property declarations must have the same type.  Property 'name' must be of type 'string', but here has type '"octopus"'. ts(2717)
```
上の例のように、`string`型とその部分型である`"octopus"`型の`name`プロパティをもつ`interface`同士をDeclaration Merging しようとすると、以下のように`name`プロパティの型不一致による型エラーが出ます。
```
Subsequent property declarations must have the same type.  Property 'name' must be of type 'string', but here has type '"octopus"'. ts(2717)
```
### 関数プロパティのDeclaration Merging
Declaration Merging によって同名の関数プロパティをもつ`interface`がマージされる場合には、関数のオーバーロードが適用されて、関数プロパティの型が異なっていても型エラーが出ずにマージできる場合があります。
関数のオーバーロードと同様に、`interface`の宣言順によって関数プロパティの型が変わります。

```ts
interface Tuna {
  weight: number;
  height: number;
  swim(velocity: 123): number;
}
interface Tuna {
  name: string;
  swim(velocity: number): number;
}

const tuna: Tuna = {
  name: "Tuna",
  weight: 40,
  height: 80,
  swim: (velocity) => velocity, // (method) Tuna.swim(velocity: 123): number (+1 overload)
};

```

```ts
interface Tuna {
  name: string;
  swim(velocity: number): number;
}

interface Tuna {
  weight: number;
  height: number;
  swim(velocity: 123): number;
}

const tuna: Tuna = {
  name: "Tuna",
  weight: 40,
  height: 80,
  swim: (velocity) => velocity, // (method) Tuna.swim(velocity: number): number (+1 overload)
};
```
Declaration Merging によって関数プロパティのマージを行うときには、（関数のオーバーロードと同様に）より詳細な関数型をもつ`interface`から先に宣言しておく必要があるわけですね。

## つかいどき
ライブラリなどではバージョンを上げる際にプロパティの追加などがされますが、各バージョンで追加になったプロパティを持つ同名`interface`を宣言することで各バージョンにあった型を宣言できるため、使い勝手が良いわけですね。

普段の開発では同名の`interface`が散在していると型の管理が煩雑になってしまうので、`interface`を採用するのであれば1つに統合しておく方がよさそうです。

https://www.typescriptlang.org/docs/handbook/declaration-merging.html