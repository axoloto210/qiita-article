---
title: 'export {};でファイルをモジュールとして扱わせる'
tags:
  - JavaScript
  - TypeScript
private: false
updated_at: '2024-07-15T16:04:34+09:00'
id: ba4afc16ff92e43d9b5f
organization_url_name: null
slide: false
ignorePublish: false
---
## 先に結論
TypeScript では`export`か`import`が使用されている場合にモジュールとなり、そうでない場合にはスクリプトとして扱われます。

スクリプトではトップレベルで宣言された変数や型のスコープがグローバルなものとなるため、別のスクリプトファイルであっても同名の変数や型を宣言できません。

モジュールではスコープがファイル内に閉じるため、別のファイルであれば同名の変数や型を宣言可能です。

## スクリプトとモジュール
TypeScript（JavaScript）のファイルはスクリプトとモジュールに分類され、スコープや記法がそれぞれ少し異なります。

別のファイルでそれぞれ同名の変数や型を宣言すると、モジュールではエラーとならないが、スクリプトではエラーとなってしまう、といったことも起こります。

### スコープの違い
モジュールの場合には、変数のスコープはそのファイルの中に閉じており、外部ファイルから使用できるようにするには`import`・`export`文が必要になります。
モジュールのファイルであれば、それぞれのファイルで同じ名前の変数や型を定義してもエラーが出ることはありません。

スクリプトの場合には、変数や型のスコープはグローバルなものとなり、別々のスクリプトファイルに同じ名前の変数や型を宣言するとエラーが発生します。

>In particular, all scripts loaded onto the same page share the same scope—appropriately called the “global scope”—meaning the scripts had to be very careful not to overwrite each others’ variables and functions.

https://www.typescriptlang.org/docs/handbook/modules/theory.html

```ts:tuna.ts
type Fish = {
  name: string
  age: number
};

const fish: Fish = {
  name: "tuna",
  age: 5,
};
```
```ts:salmon.ts
type Fish = {
  name: string
  age: number
};

const salmon: Fish = {
  name: "salmon",
  age: 10,
};
```
上の２つのファイルでは、トップレベルで`Fish`型を宣言しています。
しかし、これらの2ファイルがスクリプトとして扱われている場合、以下のようなエラーが発生します。
```:tuna.ts でのエラー
Duplicate identifier 'Fish'.ts(2300)
salmon.ts(1, 6): 'Fish' was also declared here.
```
```:salmon.ts でのエラー
Duplicate identifier 'Fish'.ts(2300)
tuna.ts(1, 6): 'Fish' was also declared here.
```
`Fish`のスコープがグローバルスコープとなってしまっているため、型の重複エラーが発生しています。

ファイルがモジュールとして扱われていればこのエラーが発生することはありません。

## モジュールとして扱わせるには
### `export`や`import`を使用する
`export`文や`import`文が使用されている場合には、そのファイルはモジュールとして扱われます。

`export`や`import`は不要だが、モジュールとして扱わせたいというときには、`export {}`を記述しておく方法があります。
`export {}`は一見すると特に意味のない記述に見えますが、`export`自体は使われているのでファイルをモジュールとして扱わせることができるわけですね。

```ts:tuna.ts
type Fish = {
  name: string
  age: number
};

const fish: Fish = {
  name: "tuna",
  age: 5,
};

export {};
```
```ts: salmon.ts
type Fish = {
  name: string
  age: number
};

const salmon: Fish = {
  name: "salmon",
  age: 10,
};

export {};
```
先ほどの例とは`export {}`の有無だけが異なりますが、型エラーが発生しなくなりました。

### 基本はスクリプト扱い
`export`や`import`が使用されていない場合には、基本的にはスクリプトとして扱われます。

別のファイルに同名の変数や型を宣言してエラーが出てしまった場合には、スクリプトとして扱われていないかを確認してみると解決するかもしれませんね。
