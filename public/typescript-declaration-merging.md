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

interface 宣言によって宣言された型と型エイリアスによって宣言された型は基本的には同じ型として扱われますが、宣言方法に関しては性質が大きく異なる点があります。その1つがDeclaration Merging です。

## Declaration Merging
`type`文によって同名の型を宣言しようとするとコンパイルエラーとなりますが、`interface`で宣言した場合にはコンパイルエラーとはならず宣言した複数の型がマージされて1つの型として扱われます。これが**Declaration Merging**です。
プロパティの種類によって、どのようにマージされるかをみていきます。

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
2つの`Fish`型がマージされて、以下のように1つの型として扱われるようになっていることがわかります。
```ts
interface Fish {
    name: string
    weight: number
    height: number
}
```

Declaration Merging と同様のことを型エイリアスで行いたいときには、以下のように交差型を使用することで実現できます（型エイリアスでは`interface`と違って同名の型を複数定義するとエラーが発生します）。
```ts
type Name = {name: string}

type Size = {
    weight: number
    height: number
}

type Fish = Name & Size
```
`interface`によるDeclaration Merging のときは同じ名前の型を宣言すれば、交差型をとる前の型に別の名前をつける必要が出てきてしまっています。
もちろん交差型を使わずに1つの型に統合して宣言できれば可読性が高くなります。
```ts
type Fish = {
    name: string
    weight: number
    height: number
}
```

ライブラリなどではバージョンを上げる際にプロパティの追加などがされますが、各バージョンで追加になったプロパティを持つ同名`interface`を宣言することで各バージョンにあった型を宣言できるため、使い勝手が良いわけですね。

普段の開発では同名の`interface`が散在していると型の管理が煩雑になってしまうので、`interface`を採用するのであれば1つに統合しておく方がよさそうです。

https://www.typescriptlang.org/docs/handbook/declaration-merging.html