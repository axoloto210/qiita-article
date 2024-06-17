---
title: JSX(React)のreturn文でifをそのまま使えないのはなぜか？
tags:
  - React.js
  - JSX
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---

## 結論から
返り値として**式**を返す必要があるためです。
`if`文は式ではなく文ですので、そのままJSXのreturn内で使うことはできません。

## JSXと条件分岐
JSX とはReactでも採用されているJavaScriptの拡張構文であり、JavaScriptにHTMLのタグのようなマークアップを記述することができます。
JSXでは、return内の条件分岐は主に論理積演算子`&&`や三項演算子`? :`によって表されることが多いですが、これはどちらも条件分岐を式で表現できる点で`if`とは異なります。

論理積演算子`&&`による条件分岐
```js:App.js
function App() {
  const random = Math.random();
  return (
    <div>
      {random >= 0.5 && (<div>{random} is greater than or equal to 1/2</div>)}
    </div>
  );
}

export default App;
```
:::note warn
`&&`や`?:`による条件分岐で条件部分が表示されていないのは、JSX がboolean や`undefined`、`null`を表示しないように無視するためです。
`{0 && (<div>No Display</div>)}`のように書くと`0`が表示されてしまいますので`!!`をつけてbooleanに変換するなど対応が必要です。
:::

https://ja.react.dev/learn/writing-markup-with-jsx

### if をreturn 内で使うには
どうしても`if`文を使用したいという場合には、`(()=>{if文})`というような関数を`return`内で実行することで**式**を返すようにすることで、`if`の使用が可能になります（即時関数）。
```js:App.js
function App() {
  const random = Math.random();
  return (
    <div>
      {(() => {
        if (random >= 0.5) {
          return <div> {random} is greater than or equal to 1/2</div>;
        } else {
          return <div> {random} is less than 1/2 </div>;
        }
      })()}
    </div>
  );
}

export default App;
```
`if`を使用することはできていますが上の例では三項演算子を利用する方が可読性は上がりますね。
```js
{random >= 0.5 ? (
        <div> {random} is greater than or equal to 1/2</div>
      ) : (
        <div> {random} is less than 1/2 </div>
      )}
```

分岐が多い場合には`switch`文なども使用することができます。
文であっても、式を返すようにすれば使用可能になります。
```js:App.js
function App() {
  const random = Math.random();
  return (
    <div>
      {(() => {
        const value = Math.floor(random * 4)
        switch (value) {
          case 0:
            return <div>{`0 <= ${random} < 0.25`}</div>;
          case  1:
            return <div>{`0.25 <= ${random} < 0.5`}</div>;
          case 2:
            return <div>{`0.5 <= ${random} < 0.75`}</div>;
          case 3:
            return <div>{`0.75 <= ${random} < 1`}</div>;
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default App;
```


:::note warn
`if`や`switch`を使用しなければ分岐が煩雑になってしまうような場合には、`return`の外側にロジックを移すことをおすすめします。
:::

## JSXに関する余談: サニタイズ
JSX の`{}`構文には、式が自動でエスケープ処理される機能がついています。
XSS脆弱性などを含まないように、`React`が自動で文字列をサニタイズ（消毒）してくれます。
`dangerouslySetInnerHTML`属性によってエスケープ処理をせずに文字列をセットすることも可能ですが、XSS脆弱性を含まないように注意する必要があります。

https://ja.react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html