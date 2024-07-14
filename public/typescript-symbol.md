---
title: symbol型のプロパティは列挙されない
tags:
  - JavaScript
  - TypeScript
private: false
updated_at: '2024-07-14T13:41:58+09:00'
id: 9f8ad3556519f0ca0978
organization_url_name: null
slide: false
ignorePublish: false
---
## `keyof`と`PropertyKey`型
`keyof`演算子はTypeScript の機能の１つで、オブジェクトのプロパティキーをユニオン型で取得できます。
この`keyof`によって得られる型はすべて`PropertyKey`型の部分型、つまり`string | number | symbol`型の部分型となります。

```ts:/lib.es5.d.ts
declare type PropertyKey = string | number | symbol;
```

オブジェクトのプロパティキーとして`symbol`型を使うこともできるわけですが、どのような用途があるのでしょうか。

この記事では`symbol`型のキーを持つオブジェクトについてみていきたいと思います。

## `symbol`型
`symbol`はプリミティブ値の1つで、「動的に一意の識別値を生成」「文字列への自動変換がされない」などの特徴を持ちます。

`symbol`の識別値はJavaScriptから直接アクセスや表示ができない内部的な値となっています。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Symbol

## オブジェクトと`symbol`型
`symbol`は一意の値となるため、オブジェクトのプロパティキーとして使用しても他のキーと競合しないというメリットがあります。
```ts
const key1 =  Symbol('foo')
const key2 =  Symbol('foo')

const obj = {
   [key1]: 123,
   [key2]: 234
}

console.log(obj[key1])
console.log(obj[key2])
//@ts-ignore
console.log(obj[Symbol('foo')])
```

```
123
234
undefined
```

プロパティキーの競合はしなくなるものの、可読性はあまり高くなく、普段の開発で見かけることはあまりなさそうですね。
主にライブラリやフレームワーク開発で活用されています。

### `symbol`プロパティは列挙されない
オブジェクトには`Object.keys()`や`Object.entries()`といった列挙メソッドがあります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

「列挙可能な」プロパティキーや値を配列の形で返しますので、オブジェクトの各プロパティぞれぞれに処理を行いたいときなどに便利なメソッドです。

```ts
const fish = {
  tuna: "maguro",
  salmon: "sake",
  octopus: "tako",
}

console.log(Object.keys(fish))
// [ 'tuna', 'salmon', 'octopus' ]
console.log(Object.entries(fish))
// [ [ 'tuna', 'maguro' ], [ 'salmon', 'sake' ], [ 'octopus', 'tako' ] ]
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Enumerability_and_ownership_of_properties

### `symbol`型のプロパティキーと列挙
`symbol`型のプロパティキーを持つオブジェクトに列挙メソッドを適用しても、`symbol`型のキーを持つプロパティは列挙されません。
`symbol`型のキーは、「列挙可能な」プロパティキーではないわけです。
```ts
const squidSymbol = Symbol('squid')

const fish = {
  tuna: "maguro",
  salmon: "sake",
  [squidSymbol]: 'ika',
  octopus: "tako",
}

console.log(Object.keys(fish))
// [ 'tuna', 'salmon', 'octopus' ]
console.log(Object.entries(fish))
// [ [ 'tuna', 'maguro' ], [ 'salmon', 'sake' ], [ 'octopus', 'tako' ] ]
```
このプログラムには`symbol`型のキーをもつプロパティを追加していますが、コンソール上に表示される内容は先ほどのプログラムと同じものとなっています。

列挙させたくないプロパティをオブジェクトに持たせたいときには、`symbol`型のキーをもたせることで隠蔽できるわけですね。

ちなみに、`Object.getOwnPropertyNames()`というメソッドを使用すると「列挙不可能な」キーを含めて取得することができますが、このメソッドを使用した場合にも、`symbol`型のキーをもつプロパティは列挙されません。
```ts
const squidSymbol = Symbol('squid')

const fish = {
  tuna: "maguro",
  salmon: "sake",
  [squidSymbol]: 'ika',
  octopus: "tako",
}


console.log(Object.getOwnPropertyNames(fish))
// [ 'tuna', 'salmon', 'octopus' ]
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames


### `symbol`型のキーを列挙するには
`symbol`型のキーはあらゆるメソッドから隠蔽されるわけではなく、`Reflect.ownKeys()`などを使うと確認することができます。
```ts
const squidSymbol = Symbol('squid')

const fish = {
  tuna: "maguro",
  salmon: "sake",
  [squidSymbol]: 'ika',
  octopus: "tako",
}

Object.defineProperty(fish, 'crub', {
    value: 'kani'
  });
  

console.log(Object.keys(fish))
// [ 'tuna', 'salmon', 'octopus' ]
console.log(Object.getOwnPropertyNames(fish))
// [ 'tuna', 'salmon', 'octopus', 'crub' ]
console.log(Reflect.ownKeys(fish))
// [ 'tuna', 'salmon', 'octopus', 'crub', Symbol(squid) ]
```
このプログラムでは、キーが`symbol`型ではない列挙不可能なプロパティを`Object.defineProperty()`によって追加しています[^1]。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys

`symbol`型のキーを使用したとしてもプロパティを完全に隠蔽できるわけではないため、ライブラリやフレームワーク開発など内部のみでしか使用しないプロパティが出てくる場面では有用ですが、セキュリティの向上を目的に使用することにはあまり適していなさそうですね。

[^1]:`defineProperty()`の`enumerable`のデフォルト値は`false`なので、このメソッドでプロパティを追加するだけで列挙不可能なプロパティとなります。
