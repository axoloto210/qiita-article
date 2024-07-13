---
title: useStateの初期値計算とパフォーマンス改善
tags:
  - TypeScript
  - React
private: true
updated_at: '2024-07-13T13:45:54+09:00'
id: 4d72447e6b951e3717e8
organization_url_name: null
slide: false
ignorePublish: false
---
## 要旨
React の`useState`は引数に`state`の初期値をとりますが、関数を渡す事もできます。
関数を渡した場合には、`state`が初期化されるときにのみ関数が実行されて、初期値が渡されます。
レンダーのたびに初期化関数が呼び出されないため、計算量が大きい場合にはパフォーマンスの改善につながります。

この記事では、初期値の渡し方の異なる2つのコンポーネントの例をまじえながら動きを確認してみたいと思います。

https://ja.react.dev/reference/react/useState#avoiding-recreating-the-initial-state

## useState とstateの初期値
React では`state`と呼ばれる変数をコンポーネントに紐づけて状態を管理できます。

この`state`は`useState`というhooks によって`state`変更用の関数（`set`関数）とともに返されます。
```ts
const [state, setState] = useState(initialValue)
```

`useState`は引数として受け取った値を`state`の初期値とし、初回のレンダー時のみその値を`state`に格納します。
（`state`が返された後に`useState`の引数の値を変更しても、元の`state`には変更が入りません。）

https://ja.react.dev/learn/managing-state

## 計算量の大きい初期値
`useState`に渡す初期値として、ある程度計算をしてから渡すこともあるかと思います。

初期値の計算量が多い、以下のようなコンポーネントを考えてみます。

```tsx
import { useState } from "react";

const initializeState = () => {
  const expensivelyProcessedList: number[] = [];
  for (let i = 0; i < 10000; i++) {
    expensivelyProcessedList.push(i);
    expensivelyProcessedList.sort();
    expensivelyProcessedList.reverse();
  }
  console.log("非最適化コンポーネントでinitializeState が呼び出されました");
  return [1, 2, 3];
};

export const NonOptimizedList = () => {
  const [state] = useState(initializeState());
  const [lang, setLang] = useState<"en" | "ja">("ja");

  return (
    <>
      <button
        onClick={() => {
          setLang((prevLang) => {
            return prevLang === "ja" ? "en" : "ja";
          });
        }}
      >
        {lang}
      </button>
      <ul>
        {state.map((element) => {
          return <li key={element}>{element}</li>;
        })}
      </ul>
    </>
  );
};
```

このコンポーネントでは、`initializeState`という関数によって配列を無駄に何度も並び替える処理をしています。
計算量の大きい初期化用の関数`initializeState`を`useState(initializeState())`のように実行する形で`useState`の初期値として渡しています。

`useState`に渡した初期値はReact によって初期化時以外には呼び出されたあとで破棄されます。
そのため、重たい処理によって初期値を計算してから渡してしまうと、重い処理が何度も呼び出されることになってしまいます。

<br/>

上のコンポーネントには言語表示を切り替えるボタン（`en`や`ja`と書かれたボタン）がつけられています。

このボタンを押した際にもReact のレンダーによってこのコンポーネントが呼び出されるため`initializeState()`が実行されてしまっています。
（コンソール上には`"非最適化コンポーネントでinitializeState が呼び出されました"`がボタンを押すたびに表示されます。）

そのため、ボタンの表示を変えるだけの処理にも時間がかかってしまっています。

## 初期化関数を初期値に渡す
`useState`の初期値には初期化用の関数を渡すことができます。
関数を初期値として渡した場合には、React は`useState`が**初期化を行うときにのみ関数を実行**して、その結果を初期値として渡してくれるようになります。

<br/>

先ほどのコンポーネント例を以下のように書き換えてみます。
```tsx
import { useState } from "react";

const initializeState = () => {
  const expensivelyProcessedList: number[] = [];
  for (let i = 0; i < 10000; i++) {
    expensivelyProcessedList.push(i);
    expensivelyProcessedList.sort();
    expensivelyProcessedList.reverse();
  }
  console.log("最適化コンポーネントでinitializeState が呼び出されました");
  return [3, 2, 1];
};

export const OptimizedList = () => {
  const [state] = useState(initializeState);
  const [lang, setLang] = useState<"en" | "ja">("ja");

  return (
    <>
      <button
        onClick={() => {
          setLang((prevLang) => {
            return prevLang === "ja" ? "en" : "ja";
          });
        }}
      >
        {lang}
      </button>
      <ul>
        {state.map((element) => {
          return <li key={element}>{element}</li>;
        })}
      </ul>
    </>
  );
};
```

先の例では関数実行後の値を`useState(initializeState())`という形で渡していましたが、この例では関数を直接渡す形`useState(initializeState)`となっています。

<br/>

`initializeState`は実行されると「最適化コンポーネントでinitializeState が呼び出されました」というメッセージがコンソール上に表示されるようになっています。

しかし、このコンポーネントの言語切り替えボタンを押してみてもコンソール上に新たにメッセージが表示されることはなく、画面への反映もスムーズに行われていることが確認できます。

https://ja.react.dev/reference/react/useState#avoiding-recreating-the-initial-state

### パフォーマンス比較
React Developer Tools のProfile タブで言語切り替えボタンを押した際に起こるレンダーにかかった時間をそれぞれ計測してみました。

`useState`に直接値を渡している`NonOptimizedList`の方ではRender Duration が約1,000ms かかっているのに対し、初期化関数を渡している`OptimizedList`の方では0.2 ms ~ 0.3ms という結果となりました。

初期値の計算にとても時間がかかるような場合には、初期値の渡し方一つでここまでパフォーマンスが変わることがあるわけですね。

今回扱ったコード例は以下に置いてあります。

https://github.com/axoloto210/qiita-article/tree/main/react-usestate-initialize

## さいごに
React で計算量を抑える方法としては`useMemo`や`useCallback`の使用などもありますが、`useState`への初期値の渡し方一つとってみてもパフォーマンスに大きな違いが出うるということは意識しておきたいですね。

単純に値を渡すのではなく関数自体を渡すようなコードとなるため、場合によっては可読性が低下することがあるかもしれません。
最適化によるパフォーマンス改善の効果とコードの可読性低下の度合いはトレードオフの関係となることも多いため、バランスを考えて採用するかどうかを検討したいですね。

https://ja.react.dev/reference/react/useMemo

### 余談: React Compiler
`useMemo`や`useCallback`については、React 19 以降、React Compiler によって自動で最適化できるようになるみたいですね。

>このコンパイラは、JavaScript と React のルールに関する知識を使用して、コンポーネントやフック内にある値や値のグループを、自動的にメモ化します。[^1]

https://ja.react.dev/learn/react-compiler

[^1]:React Compiler のドキュメントは執筆時点では暫定版であり、内容が変わる場合があります。
