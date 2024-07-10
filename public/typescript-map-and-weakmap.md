---
title: MapとWeakMapとガベージコレクションと
tags:
  - TypeScript
private: false
updated_at: '2024-07-10T21:09:16+09:00'
id: 35e89511d1a5c79309cf
organization_url_name: null
slide: false
ignorePublish: false
---
## Map の型
### Map
`Map`はキーとそれに対応する値を保持する機能を持つ組み込みオブジェクトです。
キーとして任意の値を用いることができ、オブジェクトをキーとすることも可能です。

また、`Map`の型は`Map<K, V>`のように表されます（Kはキーの型、Vは値の型です）。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map

### Map の操作
`Map`にキーと値を追加するには`set`メソッドを利用します。

`Map`に格納された値を取得する`get`メソッドや、引数として渡したキーが`Map`に保持されているかを判定できる`has`メソッドなどもあります。

```ts
type KeyObj = { key: string }
const map: Map<string | KeyObj, number> = new Map()

const keyObj: KeyObj = { key: 'value' }

map.set(keyObj, 210)

console.log(map)
// Map (1) {{ "key": "value" } => 210} 

console.log(map.has(keyObj))
// true

console.log(map.has({ key: 'value' }))
// false
```
`{ key: 'value' }`というオブジェクトをキーとしてMap に渡すことができています。

取り出すときには、`set`で登録したオブジェクトと同じ参照をもつオブジェクトを渡す必要があります。
同じ構造のオブジェクトを渡しただけでは、別のキーとしてみなされてしまうわけですね。

### Mapの値を列挙する
`Map`には`keys`、`values`、`entries`といった、保持している値を列挙するためのメソッドも備わっています。
これらのメソッドの返り値はイテレータと呼ばれるもので、ループ処理での使用頻度が高いです。
```ts
const map: Map<string|KeyObj,number> = new Map()
type KeyObj = {key: string}
const keyObj: KeyObj = {key: 'value'}
map.set('key1',1234)
map.set(keyObj,210)

for(const key of map.keys()){
console.log(key)
}
//"key1" 
//{"key": "value"} 

for(const value of map.values()){
console.log(value)
}
//1234
//210

for(const[key, value] of map.entries()){
    console.log(key)
    console.log(value)
}
//"key1" 
//1234 
//{"key": "value"} 
//210 
```

## WeakMap
`Map`に似た組み込みオブジェクトに`WeakMap`というものがあります。
`Map`と違って列挙を行うためのメソッド（`keys`、`values`、`entries`）を持たず、キーとしてはオブジェクト（もしくはnon-registered なシンボル）のみを設定することができ、数値や文字列を設定することはできません。
```ts
const weakMap = new WeakMap()
//Argument of type 'string' is not assignable to parameter of type 'object'.ts(2345)
weakMap.set('str','test')
//実行時エラーが発生（Invalid value used as weak map key）
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/WeakMap

### ガベージコレクション
ガベージコレクションとは、使用しなくなったメモリを自動で解放する仕組みのことです。
`WeakMap`はこのガベージコレクションを目的として採用されることがあります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Memory_management#%E3%82%AC%E3%83%99%E3%83%BC%E3%82%B8%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3


`WeakMap`が`Map`と異なる点として、キーへの参照が弱参照である点があります。

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management#garbage_collection

このことは、キーとして設定できる値がオブジェクトかnon-registered なシンボルしか許されていない理由の一端となっています。
registered なシンボルはガベージコレクションの対象とならないため、`WeakMap`のキーとしての使用が許可されていないようです。
>Because registered symbols can be arbitrarily created anywhere, they behave almost exactly like the strings they wrap. Therefore, they are not guaranteed to be unique and are not garbage collectable. Therefore, registered symbols are disallowed in WeakMap, WeakSet, WeakRef, and FinalizationRegistry objects.


https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#shared_symbols_in_the_global_symbol_registry

`Map`でキーとして使用されているオブジェクトは、`Map`自体がガベージコレクトされない限りはガベージコレクションの対象とならず、メモリ上に保持され続けます。
これは、`Map`がキーを列挙するメソッドを持っているため、キーとして登録されたオブジェクトが不要になったと判断できないためです。
