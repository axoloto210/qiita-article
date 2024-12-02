---
title: イベントとイベントリスナー
tags:
  - JavaScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
ブラウザ上でクリックやキーの入力などの操作が行われたときに特定の動作をさせたいとき、イベントと呼ばれるものを介して動作を規定できます。

本記事ではこのイベントと動作を規定するイベントリスナーについてみていきます。
## イベントとは
イベントとは動作や出来事の通知のことです。

イベントには、クリックという動作を表す`click`イベントやページの読み込みが完了したことを表す`load`イベントなどがあります。
動作や出来事が起きたときにブラウザはこれらのイベントを生成します。
## イベントの伝播
ブラウザによって生成されたイベントは、イベントの発生要因となった要素（イベントトリガー）へとDOMツリーに沿って伝播していきます。

イベントの伝播には「キャプチャフェーズ」「ターゲットフェーズ」「バブリングフェーズ」があります。

「キャプチャフェーズ」はWindowオブジェクトからイベントターゲットまでの伝播が、
「ターゲットフェーズ」ではイベントターゲットでの処理が、
「バブリングフェーズ」ではイベントターゲットからWindowオブジェクトへの伝播が行われます。
（詳しくは別記事で取り扱いたいと思います）

イベントリスナーと呼ばれるイベントの監視機構を設定することで、特定のイベントが特定のイベントターゲットで発生したときに、設定しておいた動作を行わせることができます。
## イベントリスナー
`addEventListener`という関数でイベントリスナーを設定することができます。
第1引数にはイベントを表す文字列を、第2引数には設定したい動作を行う関数を渡します。
```js
const btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
      console.log("clicked!");
    });
```
上の例では、ドキュメント内にある`btn`というidをもつ要素のオブジェクトを`getElementById`によって取得し、そのオブジェクトについている`addEventListener`を使用することでイベントの監視設定をしています。

イベントリスナーが設定されたあとでボタンがクリックされると、コンソール上に`clicked!`と表示されるようになります。

### イベントリスナーの重複登録
イベントリスナーは1つの要素に対して複数登録することも可能です。
```js
const btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
      console.log("clicked!");
    });
    btn.addEventListener("click", () => {
      console.log("clicked!");
    });
```
この例ではボタンを1回クリックすると、コンソール上に`clicked!`が2つ表示されます。

<br/>

イベントリスナーは複数登録が可能ですが、同じ関数が重複して登録されることはありません。
```js
    const btn = document.getElementById("btn");
    const clickHandler = () => {
      console.log("clicked!");
    };
    btn.addEventListener("click", clickHandler);
    btn.addEventListener("click", clickHandler);
```
この例ではボタンを1回クリックすると、コンソール上に`clicked!`が1つだけ表示されます。

`clickHandler`という変数には関数の参照値が格納されており、おなじ参照値が`addEventListener`に渡されています。

参照値が同じ関数を複数回設定しても、実際に登録されるのは1つのみとなります。

誤って複数回同じ関数を設定してしまっても、複数回同じ動作が起こらないようになっているわけですね。
