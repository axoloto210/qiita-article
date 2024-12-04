---
title: イベントの伝播・キャプチャリングとバブリング
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
本記事は[イベントオブジェクトにはどのようなプロパティがあるか](https://qiita.com/axoloto210/items/930f4a18810419c84470)の続きになります。

イベントが発生すると、イベントリスナーで設定した処理がされます。
しかし、イベントが発生したことはボタン要素が直接検知しているのではなく、ブラウザが生成したイベントオブジェクトを介して祖先要素から順次伝播していく形で検知されます。

本記事では、イベントが発生し、祖先要素から発生源の要素へと伝播していく過程をみていきます。

## イベントの伝播
イベントが発生すると、ブラウザはイベントオブジェクトを作成してイベントの発生源の要素に向かって伝播させます。

Windowオブジェクトでイベントが発生した場合には、Windowオブジェクトへそのままイベントオブジェクトが渡されますが、ドキュメントやドキュメント内の要素でイベントが発生した場合には、その要素に直接渡されるのではなく、DOMツリーに沿って、中間の要素を経由しながらイベントが伝播していきます。
### イベント伝播のフェーズ
イベントの伝播には、キャプチャリング、ターゲットフェーズ、バブリングフェーズという段階があります。
これらのうち、イベントの発生源となる要素に設定したイベントリスナーが動作するのは、ターゲットフェーズになります。
イベントリスナーが動作をする前後にイベントが伝播していく過程があり、それがキャプチャリングフェーズとバブリングフェーズです。

例として、以下のようなHTMLについて考えてみます。
```html
<html>
  <body id="body">
    <button id="btn">ボタン</button>
  </body>
</html>
```
上の例でボタンがクリックされると、イベントオブジェクトは以下の順に渡されていきます（キャプチャリングフェーズ）。
- Window
- Document
- html (`HTMLHtmlElement`)
- body (`HTMLBodyElement`)
- button (`HTMLButtonElement`)

その後、buttonで処理が行われ（ターゲットフェーズ）、先とは逆の順で再度イベントが伝播していきます（バブリングフェーズ）。


### キャプチャリングフェーズ（`CAPTURING_PHASE`）
キャプチャリングフェーズでは、イベントがイベントの発生源の要素へとDOMツリーに沿って渡されていきます。
はじめにWindowオブジェクトに渡され、その後にDocumentオブジェクト、その子要素という順で渡されます。

`addEventListner`では、デフォルトではバブリングフェーズ用のイベントハンドラが登録されますが、キャプチャリングフェーズ用のイベントハンドラを登録することも可能です。
`addEventListner`の第3引数に`true`や`{capture: true}`を渡すと、登録したイベントハンドラはキャプチャリングフェーズで呼び出されるようになります。

### ターゲットフェーズ（`AT_TARGET`）
イベント発生源の要素での伝播過程です。
ターゲットフェーズでは、キャプチャリング用・バブリング用の両方のイベントハンドラが呼び出されます。

### バブリングフェーズ（`BUBBLING_PHASE`）
イベント発生源の要素から、Documentオブジェクト、WindowオブジェクトへとDOMツリーに沿ってイベントが伝播していく過程です。
親要素に設定したバブリング用のイベントハンドラもこの過程で順次呼び出されていきます。

イベントの中にはバブリングが起こらないものもある点には注意が必要です。
`scroll`イベントはバブリングが起こりますが、Windowオブジェクトまでは伝播しません。
また、`focus`や`resize`などのイベントはそもそもバブリングが起こりません。

### 伝播を止める`preventPropagation()`
`event`オブジェクトの`preventPropagation()`を呼び出すことで伝播を止めることができます。
各フェーズ単位で止まるのではなく、フェーズ全体を通して伝播が止まります。
そのため、キャプチャリングフェーズやターゲットフェーズで呼び出した場合には、その先のバブリングが発生しないこととなります。

親要素に設定したイベントハンドラは実行したくないというケースなどに利用できます。

### イベントの委譲（Event Delegation）
複数の要素に対するイベントリスナーを、それらの親要素にまとめて設定する手法のことです。
バブリングの仕組みを利用することで、1つの要素にイベントリスナーを集約できるわけですね。

### 伝播の実際の仕組み
イベントが伝播していく際、1つのイベントオブジェクトのプロパティが書き変わっていくことで伝播を実現しています。
イベントが送出される際に`dispatchEvent()`が呼び出されますが、このときに`path`と呼ばれる、イベントの受け渡しの経路が構築されます。
この`path`に登録されている要素のオブジェクト（`EventTarget`）を`currentTarget`の値として順次更新していくことで受け渡しが実現されています。
イベントオブジェクトの`conposedPath()`によって、以下のような`path`の情報の一部を確認することができます。
```html
<html>
  <body id="body">
    <button id="btn">ボタン</button>
  </body>
  <script>
    const body = document.getElementById("body");
    body.addEventListener("click", (e) => console.log(e.composedPath()));
  </script>
</html>

```
```
(5) [button#btn, body#body, html, document, Window]
0: button#btn
1: body#body
2: html
3: document
4: Window {window: Window, self: Window, document: document, name: '', location: Location, …}
length: 5
```

`eventPhase`プロパティによって、キャプチャリングフェーズやバブリングフェーズなど、どのフェーズにいるかが表現され、`currentTarget`プロパティによってどの要素に受け渡されたかが表現されます。
また、`target`プロパティによって発生源の要素が表されます。

`currentTarget`や`eventPhase`は読み取り専用のプロパティですが、このことによって、イベントの伝播の整合性が保たれているわけですね。

https://dom.spec.whatwg.org/commit-snapshots/bb30d16be620b09e7020bbb824b93cedfa4bbd6a/#interface-event

https://dom.spec.whatwg.org/commit-snapshots/bb30d16be620b09e7020bbb824b93cedfa4bbd6a/#dispatching-events
