---
title: 配列とオブジェクトの分割代入
tags:
  - JavaScript
  - TypeScript
  - React
private: false
updated_at: '2024-07-14T15:07:18+09:00'
id: 7d81f8f8253984305138
organization_url_name: null
slide: false
ignorePublish: false
---
## 分割代入とは
JavaScript では分割代入と呼ばれる変数への代入方法があります。
配列やオブジェクトなどに含まれる複数の要素を別々の変数へ分割して代入することができます。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

## オブジェクトの分割代入
オブジェクトの分割代入構文を用いると、オブジェクトの値を取り出す処理を簡潔に書けます。
```ts
const obj = {
  foo: 271,
  bar: "str",
  "1234": 314,
}
const { foo, bar } = obj
console.log(foo) //271
console.log(bar) //str
```

変数名と同じプロパティキーに対応する値が変数に代入されます。
ただし型注釈をつけることはできず、変数の型は型推論によって決定されます。

### 識別子でないプロパティ名
プロパティ名が識別子ではない場合（数字で始まっていたり、特定の記号を含んでいる場合）には、変数名を変更することで分割代入が可能となります。
```ts
const obj = {
  foo: 271,
  bar: "str",
  "1234": 314,
}
const { foo, "1234": var1234 } = obj

console.log( foo )
// 271
console.log( var1234 )
// 314
```
`const { foo, bar } = obj`という書き方は、`const { foo: foo, bar: bar } = obj`という書き方の省略形となっていたわけです。
分割代入において、変数名とプロパティキー名が同じ場合にはこの省略形が使用できます。

### ネストされているオブジェクト
ネストされているオブジェクトから値を取り出したいときにも活用できます。
```ts
const nestedObj = {
  foo: 123,
  obj: {
    bar: 1,
    obj2: {
      baz: 2,
    },
  },
}
const { obj: {bar, obj2: { baz }}} = nestedObj

console.log(bar)
// 1
console.log(baz)
// 2
```
#### React のイベントオブジェクト`e.target.value`と分割代入
先の記法により、例えばReact のイベントオブジェクト`e`の`target`に含まれる`value`値を取得して変数に格納したい場合に、`e.target.value`のように書かずに直接`value`へ分割代入して格納する事もできます。
```tsx
function App() {
  const [name, setName] = useState("");

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Name: {name}</p>
    </>
  );
}
```
以下のプログラムでは`(e)=>setInputValue(e.target.value)`の部分を書き換えています。
```tsx
function App() {
  const [name, setName] = useState("");

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={({ target: { value } }) => setName(value)}
      />
      <p>Name: {name}</p>
    </>
  );
}
```

`({ target: { value } }) => setInputValue(value)`と分割代入によって受けとることで、`e.target.value`と書いていた箇所が`value`だけで済むようになっていますね。

https://ja.react.dev/reference/react-dom/components/common#react-event-object

## 配列の分割代入
配列についても分割代入が使用可能です。

複数の変数をもつ配列に対して、代入元の配列の先頭要素から順に代入されていきます。
オブジェクトの場合と同じで型注釈をつけることはできず、型推論のみによって型が決定されます。
```ts
const arr = ["hello", 123, true]

const [foo, bar] = arr

console.log(foo)
// "hello" 
console.log(bar)
// 123
```
１つ目の変数`foo`には`arr`の先頭の要素である`"hello"`が代入され、２つ目の変数`bar`には`arr`の先頭から２つ目の要素である`123`が代入されています。
#### `useState`と分割代入
配列の分割代入が利用されている例として、React の`useState`があります。
`useState`からは`state`とset 関数が配列の形（タプル型）で返されます。
```ts
const [state, setState] = useState()
```
`state`や`setState`の部分にはどのような変数名をつけても１つ目の変数に`state`用の値が代入されて、２つ目の要素にset 関数が代入されます。
`const [setState, state] = useState()`のような書き方もできるわけですが、この場合には`state`の方にset 関数が代入されます。
##### 命名の自由度
配列の分割代入によって値を受けとることで自由な変数名を簡潔につけることができますが、自由に名前をつけられる一方で変数名の付け方によっては`useState`のset 関数なのか等がわかりにくくなってしまいます。

そのためset 関数の代入先の変数名の先頭には`set`を付すことが推奨されているわけですね。
