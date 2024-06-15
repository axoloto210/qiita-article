---
title: Record型やReturnType型などのユーティリティ型をみてみる
tags:
  - TypeScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
:::note
本記事はZennに投稿している記事に加筆したものになります。
https://zenn.dev/axoloto210/articles/advent-calender-2023-day24
:::
## ユーティリティ型
TypeScriptには標準で組み込まれている型として、ユーティリティ型があります。
代表的なものに`Readonly`型や`Partial`型などがあり、下の記事で実装を確認しましたが、ほかのユーティリティ型についてもみてみたいと思います。

https://zenn.dev/axoloto210/articles/advent-calender-2023-day21
## Mapped Typesを簡単に使える`Record`型
`Record<K, T>`型は、`K`にプロパティキーのユニオン型、`T`にプロパティの値の型を指定することで、対応するオブジェクト型を取得できます。
```ts
type PropertyKeys = "octopus" | "squid"

type Obj = Record<PropertyKeys, string>
// type Obj = {
//     octopus: string;
//     squid: string;
// }
```
`Record<K, T>`型の実装は以下のようになっています。
```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```
`K extends keyof any`から、`K`に指定できるのはプロパティキーとして取りうる型、つまり`string | number | sympol`の部分型に限定されています。
```ts
type anyKey = keyof any
//type anyKey = string | number | symbol
```
実装から`Record`型というのは、Mapped Typesという少し複雑な機能をユーティリティ型としてその複雑さを隠蔽し、使いやすくした型であることがわかります。

https://zenn.dev/axoloto210/scraps/2caa329b85f519#comment-17a2c9b5e144d9

https://zenn.dev/axoloto210/articles/advent-calender-2023-day22
## `Promise`を外す`Awaited`型
`Awaited<T>`型は、非同期処理の`await`に倣って作られた型で、再帰的に`Promise`を外した型を返します。
```ts
async function asyncFunc() {
    setTimeout(()=>{console.log("Loading...")}, 3000)
    return "success"
}

async function main(){
const promiseStr = asyncFunc()
//const promiseStr: Promise<string>
console.log(promiseStr)

const str = await asyncFunc()
//const str: string
console.log(str)

}

const promiseStr = asyncFunc()
//const promiseStr: Promise<string>
type Str = Awaited<typeof promiseStr> 
//type Str = string

main()

//---Logs---
//Promise: {} 
//"success" 
//"Loading..." 
//"Loading..." 
//"Loading..." 
```
`async`による非同期関数の返り値は`Promise`でラップされた型が返ってきます。`await`をつけると非同期処理の完了を待つため、返り値の型は`Promise`が外れた状態となりますが、これと同じように`Awaited<T>`型を使うことで`Promise`を外すことができます。

`Awaited<T>`の実装は以下のようになっています。
```ts
/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
type Awaited<T> = T extends null | undefined ? T : // special case for `null | undefined` when not in `--strictNullChecks` mode
    T extends object & { then(onfulfilled: infer F, ...args: infer _): any; } ? // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
        F extends ((value: infer V, ...args: infer _) => any) ? // if the argument to `then` is callable, extracts the first argument
            Awaited<V> : // recursively unwrap the value
        never : // the argument to `then` was not callable
    T; // non-object or non-thenable
```
`T extends null | undefined ? T :`の部分により、`T`として`null`か`undefined`が渡された場合にはそのまま`T`が返されます。また、`T extends object & ... ? ... : T`の部分から、`T`としてオブジェクト以外が渡された場合にもそのまま返されることがわかります。
`T`がオブジェクトで、`{ then(onfulfilled: infer F, ...args: infer _): any; }`の部分型であるなら、つまり`then`メソッドを持ち、非同期処理成功時のコールバック関数`onfullfilled`を持っているならば、その関数を`F`として次の条件判定に移ります（`then`が呼び出せない場合などは`never`型が返ります）。
`F extends ((value: infer V, ...args: infer _) => any) ? Awaited<V> : never `の部分では、`onfullfilled`で指定したコールバック関数が`value`を引数に持っている場合にはその`value`の型`V`に対して`Awaited<V>`を適用します。`Awaited`の中に`Awaited`型を入れ込むことで再帰的に`Promise`を外しているわけですね。

## 関数の引数の型、`Parameters`型
`Parameters<T>`は関数の型`T`を渡すことで、その関数の引数のタプル型を返します。
```ts
function numToString(num: number, msg:string){
    console.log(msg)
    return String(num)
}

type P = Parameters<typeof numToString>
//type P = [num: number, msg: string]
```

実装は以下のようになっています。
```ts
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```
型引数`T`は関数の型であるという制約が`T extends (...args: any) => any`の箇所で課されており、`T extends (...args: infer P) => any ? P : never;`の箇所で引数の型`P`を`infer`によって取得し、そのまま返しています（`infer`はConditional Typesの中で使用できるジェネリクス型です）。

## 関数の返り値の型を返す、`ReturnType`型
`ReturnType<T>`は関数の型`T`から返り値の型を返すユーティリティ型です。
```ts
function numToObj(num: number){
    return {n:num, msg:"Hello", foo:true}
}

type R = ReturnType<typeof numToObj>
// type R = {
//     n: number;
//     msg: string;
//     foo: boolean;
// }
```

`ReturnType<T>`の実装は`Parameter<T>`の実装と`infer`が引数型か返り値型かの違いしかなく、とても似たものになっています。
```ts
/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

## 文字列リテラル型を操作できる組み込み文字列型
文字列リテラル型の大文字・小文字への変換ができる型も存在します。
それが、`Uppercase<T>`,`Lowercase<T>`,`Capitalize<T>`,`Uncapitalize<T>`というユーティリティ型です。
```ts
type literalStr = "OctoPus" | "sQuID"

type P = Uppercase<literalStr>
//type P = "OCTOPUS" | "SQUID"

type L = Lowercase<literalStr>
//type L = "octopus" | "squid"

type C = Capitalize<literalStr>
//type C = "OctoPus" | "SQuID"

type UC = Uncapitalize<literalStr>
//type UC = "sQuID" | "octoPus"
```
`Uppercase<T>`は全ての文字を大文字に、`Lowercase<T>`は全ての文字を小文字にします。
また、`Capitalize<T>`,`Uncapitalize<T>`はそれぞれ先頭の文字を大文字、小文字にします。
これらのユーティリティ型の実装は以下のようになっています。
```ts
/**
 * Convert string literal type to uppercase
 */
type Uppercase<S extends string> = intrinsic;

/**
 * Convert string literal type to lowercase
 */
type Lowercase<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to uppercase
 */
type Capitalize<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to lowercase
 */
type Uncapitalize<S extends string> = intrinsic;
```
`intrinsic`は型エイリアスがTypeScriptのコンパイラが提供する実装を参照することを表すもので、どのような実装がされているかはコンパイラを確認する必要があります。

https://github.com/microsoft/TypeScript/pull/40580

