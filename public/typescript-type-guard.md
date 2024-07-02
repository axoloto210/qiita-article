---
title: 型アサーションよりユーザー定義型ガードを。
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## 型ガード
型ガードとは`if(typeof value === 'string')`のように型による条件分岐や`in`演算子などによってブロック内の型を絞り込む機能のことです。

この絞り込み部分を実装者（ユーザー）が関数の形で作成して、型ガードとして利用するのがユーザー定義型ガードです。
## ユーザー定義型ガード
ユーザー定義型ガードは、関数が`true`を返したときに、その引数として渡した変数の型をユーザーが設定した型として扱う機能です。
`as`による型アサーションによっても変数の型を別の型として扱うことはできますが、ユーザーの設定した型が正しいものであるかを関数で検証する点で型アサーションと異なっています。

`as`による型アサーションや`any`型と同様にTypeScriptの型安全性を破壊しうる危険な機能ではありますが、確認すべき範囲が`as`や`any`に比べて狭く、関数の中に限定されることから、これらの機能をやむを得ず使用する場合にはユーザー定義型ガードの使用が推奨されています。
## `引数 is 型`によるユーザー定義型ガード
関数によって型の絞り込みを行いたい場合には、ユーザー定義型ガードが使用できます。
とくに、`unknown`型の値を扱うのに便利な機能となっています。

引数が数値か文字列の場合に`true`を返す、以下のようなコードを考えてみます。
```ts
function isNumberOrString(value: unknown){
  return typeof value === 'number' || typeof value === 'string' 
}

const value: unknown = "314"
if(isNumberOrString(value)){
    //'value' is of type 'unknown'.(18046)
    console.log(value.toString())
}
```
上のコード例のように関数による型の条件分岐を行なっても、型の絞り込みが認識されずに型エラーとなってしまいます。
そこで、以下のように`value is string | number`とつけることで、関数が`true`を返した場合にはコンパイラに`value`は`string | number`型であると認識させることができます。
ここの実装を間違えると誤った型をコンパイラが認識したままの状態になり、型安全性が損なわれるので注意が必要です。
```ts
function isNumberOrString(value: unknown): value is string | number {
  return typeof value === 'number' || typeof value === 'string' 
}

const value: unknown = "314"
if(isNumberOrString(value)){
    //const value: string | number
    console.log(value.toString())// 314
}
```
## `asserts 引数 is 型`によるユーザー定義型ガード
関数が例外を投げて終了しない可能性がある場合には、`asserts 引数 is 型`の構文によるユーザー定義型ガードが使えます。
こちらは関数が`true`を返した場合に型を強制するのではなく、関数が最後の処理まで到達した場合に型を強制します。
```ts
function isNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error()
  }
  return;
}

const value: unknown = 314
try {
  // const value: unknown
  console.log(value)// 314

  isNumber(value)

  //const value: number
  console.log(value.toString(16))//　"13a" 
} catch (error) {
  console.log('error occurred')
}
```
`try`ブロック内では`isNumber`以降の箇所での`value`の型が`number`型として扱われています。
ユーザーが「`isNumber`が正常終了しているのならば`value`の型は`number`型である」と保証しているわけですが、ここの保証の部分、つまりユーザー定義型ガードの実装に誤りがあると型安全性は大きく損なわれてしまうため、慎重に使用する必要があります。
`any`や型アサーションに比べると、ユーザーが責任を負うべき箇所が明確なので、やむを得ない場合にはユーザー定義型ガードの使用を先に検討することが推奨されているわけですね。