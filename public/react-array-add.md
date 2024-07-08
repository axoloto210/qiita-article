---
title: React での配列への要素追加
tags:
  - JavaScript
  - React
private: true
updated_at: '2024-07-08T21:33:26+09:00'
id: 2092c31d437418ab94cc
organization_url_name: null
slide: false
ignorePublish: false
---
## React での配列操作
本記事は以下の記事の続きです。

https://qiita.com/axoloto210/items/cb93a3aebc3521cace3f

## 配列へ要素を追加するには
配列へ要素を追加する方法にはスプレッド構文や配列のメソッドなどいくつかの方法あります。

`useState`が配列の変更を検知できるよう、**新しい配列を返す**ような方法によって要素を追加することが推奨されます。

### スプレッド構文による追加
スプレッド構文`...`によって元の配列を新たな配列に展開し、要素を追加する方法です。
```ts
const array = [1, 2, 3]

const newArray = [...array, 4]

console.log(newArray)
//[ 1, 2, 3, 4 ]

console.log(Object.is(newArray, array))
// false
```

上の例では、別の配列の中に元の配列`array`を展開し、その後ろに`4`を追加しています。
`Object.is(newArray, array)`が`false`となっていることから、`newArray`と`array`が別の値であることが`useState`のset 関数によって検知可能であることがわかります。

元の配列の前後に要素を追加する際に有用ですね。
## 新たに配列を返すメソッド
### `Array.prototype.concat()`
`concat()`を使用して要素を追加することもできます[^1]。

`concat()`は、複数の配列を合併し、**新しい配列を返す**メソッドです。
追加したい要素を持つ配列を`concat()`によって結合することで、目的の配列を取得できます。

```ts
const array = [1, 2, 3]

const newArray = array.concat([4])

console.log(newArray)
//[ 1, 2, 3, 4 ]

console.log(Object.is(newArray, array))
// false
```

`concat()`によって新しい配列が返されているため、`Object.is`によって別の配列であると判定されるようになっていますね。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/concat


## 既存の配列に変更を加えるメソッド
### `Array.prototype.push()`
`push()`は**元の配列の末尾に要素を追加する**メソッドで、返り値は要素追加後の配列の長さになります。

`setState`によって変更が検知されない様子は以下の例でも確認できます。

`add 4`ボタンをクリックすると`state`配列に`4`が追加されるコードとなっています。
```jsx:App.jsx
import { useState } from "react";

function App() {
  const [state, setState] = useState([1, 2, 3]);

  const clickHandler = () => {
    state.push(4);
    setState(state);
  };

  const [triger, setTriger] = useState(true);

  return (
    <div>
      <div>{`${state}`}</div>
      <button onClick={clickHandler}>add 4</button>
      <button
        onClick={() => {
          setTriger(!triger);
        }}
      >
        render
      </button>
    </div>
  );
}

export default App;
```
`add 4`ボタンをクリックしても画面上の表示は`1,2,3`のままで変化が起こりません。
これは、`state.push(4)`によって`state`に変更を加えても、`setState`には同じ配列であるとみなされるため、再レンダリングがされません。

`render`ボタンを押してみると、`add 4`ボタンを押した回数と同じ分だけ`4`が追加されてレンダリングされることが確認できます。
配列`state`には確かに変更が加わっていますが、画面へ反映されていなかったわけですね。

### `Array.prototype.unshift()`
`unshift()`は**元の配列の先頭に要素を追加する**メソッドで、返り値は要素追加後の配列の長さになります。
要素の追加位置は異なりますが、`push()`によく似たメソッドとなっています。

```ts
const array = [1, 2, 3]

const length = array.unshift(4)

console.log(array)
// [ 4, 1, 2, 3 ]

console.log(length)
// 4
```

`unshift`によって`state`を操作した場合にも、変更が検知されないため注意が必要です。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift

[^1]:concat はconcatenate の略で、「連結」の意。
