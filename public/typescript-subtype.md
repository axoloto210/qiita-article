---
title: 部分型って"拡張型"じゃない？集合論で捉えてみる
tags:
  - 'TypeScript'
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
:::note
本記事はZennに投稿している記事の再投稿になります。
https://zenn.dev/axoloto210/articles/advent-calender-2023-day11
:::
## TypeScriptの部分型
TypeScriptの部分型は、構造的部分型というものが採用されています。
「この型はある型の部分型である」というように宣言[^1]するのではなく、型の構造によって部分型かどうかの判定がされます。
（構造的部分型が採用されていることから、一見コード上で関係のなさそうな型同士に部分型の関係が発生することもあります。）
### 部分型の定義
**型`S`が型`T`の部分型であるとは、`S`型の値が`T`型の値でもあることです。**
```ts
type T = { str: string }
type S = { str: string, num: number }

const tObj: T = {str:'t'}
const sObj: S = {str:'s', num:314}

const t: T = sObj
const s: S = tObj // Property 'num' is missing in type 'T' but required in type 'S'.(2741)
```
上のコードでは、`T`型の変数に`S`型のオブジェクトを代入することができています。このようなとき、`S`型は`T`型の部分型であるといいます。
## 部分型というより拡張型？
先のコード例で、型`T`が`string`型の`str`というプロパティが存在することを要求しているのに対し、型`S`は追加で`number`型の`num`というプロパティの存在も要求していました。
&nbsp;
`T`型に含まれる必須プロパティは`S`型にも必ず含まれているのに対し、`S`型の必須プロパティは必ずしも`T`型には含まれません。
集合論において、「SがTの部分集合である」とは、「集合Sに含まれる要素がすべて集合Tに含まれること」でしたから、`S`型は`T`型の部分型というよりは拡張型の方が相応しいのでは？と疑問に感じるかもしれません。
型引数の制約として、型`T`が型`U`の部分型であることを課すときに`T extends U`と書きますが、この`extends`からも拡張型の語の方が適しているように思えます。
&nbsp; 
拡張型の方が相応しいのか、オブジェクトが`T`型に属する条件をみていくことで考えていきたいと思います。
上のコード例で言うと、オブジェクトが`T`型に属する条件とは、「オブジェクトが`string`型のプロパティ`str`をもつこと」でした。
対して、オブジェクトが`S`型に属する条件とは、「オブジェクトが`string`型のプロパティ`str`をもつこと」に加えて、「オブジェクトが`number`型のプロパティ`num`をもつこと」でした。
これらの条件を見比べてみると、`S`型に属するための条件を満たすオブジェクトは必然的に`T`型に属する条件を満たしていることがわかります。
&nbsp;
このことから、型`S`が型`T`の拡張型なのではなく、部分型であることがわかります。
（拡張型では？と言う疑念は型をオブジェクトのように捉えて包含関係を考えてしまっていたことに起因していたわけですね。）

## 集合に対応する型
### 空集合　`never`型
以下の記事でも扱いました、空集合に対応する型として`never`型というものがあります。
https://zenn.dev/axoloto210/articles/advent-calender-2023-day10
### 全体集合 `unknown`型
`unknown`型はどんな値でも代入することができる型です。
このことは、任意の型`T`の値が`unknown`型の値でもあることを示しており、`T`型が`unknown`型の部分型であることがわかります。このことは、「任意の集合は全体集合の部分集合である」という全体集合の性質に対応していますね。
加えて、`T | unknown`が`unknown`型となることや、`T & unknown`型が`T`型になることがそれぞれ「全体集合との和集合は全体集合であること」、「全体集合との積集合はもとの集合自身であること」という全体集合の性質と対応しています。
```ts
type T = {str: string, num: number}
type U = T | unknown //type U = unknown
type V = T & unknown //type V = { str: string; num: number; }
```
これらのことから、`unkonown`型は全体集合に対応していると見なすことができます。


## 関数型の部分型
関数の型にも部分型の関係が発生することがあります。
### 引数型が同じ場合の部分型
引数の型が同じ場合には、返り値の型によって部分型の関係が確認できます。
型`S`を型`T`の部分型としたとき、引数の型を`A`とすると、関数型`(A) => S`は関数型`(A) => T`の部分型となります。
これは、`(A) => S`型の関数は`S`型の値を返すので、部分型の定義から`T`型の値を返す関数と見なすことができるためです。
```ts
type A = string | number

type T = {a: A}
type S = {a: A, str: string}

// Fnの型はfunction Fn(arg: A): T
function Fn(arg: A): T{
    return { a: arg }
}
//Gnの型はfunction Gn(arg: A): S
function Gn(arg: A): S {
    return { str: 'str', a: arg }
}

const fnS: (arg: A) => S = Fn //Type '(arg: A) => T' is not assignable to type '(arg: A) => S'. Property 'str' is missing in type 'T' but required in type 'S'.(2322)
const gnT: (arg: A) => T = Gn
```
上のコード例から、`(arg: A) => T`である関数型の変数に`(arg: A) => S`型である関数`Gn`を代入できていることがわかり、関数型`(A) => S`は関数型`(A) => T`の部分型となることがわかります。
引数の型が同じで返り値の型に部分型関係がある場合、関数型についても部分型関係は保存されることがわかります。

### 返り値の型が同じ場合の部分型
返り値の型が同じ場合にも、引数の型によって部分型の関係が確認できます。
型`S`を型`T`の部分型としたとき、返り値の型を`R`とすると、関数型`(T) => R`は関数型`(S) => R`の部分型となります。
これは、`(T) => R`型の関数の引数`T`型には`S`型の値を代入可能であることからわかります。
```ts
type R = string | number

type T = {a: R}
type S = {a: R, str: string}

// Fnの型はfunction Fn(arg: T): R
function Fn(arg: T): R{
    return arg.a 
}
//Gnの型はfunction Gn(arg: S): R
function Gn(arg: S): R{
    return arg.a
}

const fnT: (arg: T) => R = Gn // Type '(arg: S) => R' is not assignable to type '(arg: T) => R'. Types of parameters 'arg' and 'arg' are incompatible. Property 'str' is missing in type 'T' but required in type 'S'.(2322)
const gnS: (arg: S) => R = Fn
```
上のコード例から、`(arg: S) => R`である関数型の変数に`(arg: T) => R`型である関数`Fn`を代入できていることがわかり、`(arg: T) => R`の値は`(arg: S) => R`の値でもあることがわかります。
部分型の定義から、関数型`(T) => R`は関数型`(S) => R`の部分型となります。
返り値の型が同じで引数の型に部分型関係がある場合、**関数型については部分型関係が逆転している**ことに注意する必要があります。

### 共変性と反変性
「引数型が同じ場合の部分型」の項でもみたように、返り値の部分型関係が関数型の部分型関係と同じ向きとなる性質を**関数型の返り値は関数型の共変の位置**にあると言います。
また、「返り値の型が同じ場合の部分型」の項でみた、引数の部分型関係が関数型の部分型関係と反対の向きとなる性質を**関数型の引数は関数型の反変の位置**にあると言います。

関数型`G`が関数型`F`の部分型であるとは、「引数が反変の条件を満たす」「返り値が共変の条件を満たす」（と「Fの引数の個数がGの引数の個数以下」）を満たすことであると表すことができます。

[^1]: 宣言によって部分型を決定する方法は公称型や名前的部分型と呼ばれています。
