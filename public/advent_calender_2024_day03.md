---
title: イベントオブジェクトにはどのようなプロパティがあるか
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
本記事は[イベントとイベントリスナー](https://qiita.com/axoloto210/items/bcd567e377f9b07fc569)の続きの記事になります。
イベントが発生した際に、どの要素でどのようなイベントが発生したのかなどの情報を含むオブジェクトである、イベントオブジェクトについてみていきます。

## イベントオブジェクトとは
イベントオブジェクトとは、発生したイベントに関する情報をもつオブジェクトです。
イベントが発生するとブラウザによって生成され、windowオブジェクト、documentオブジェクト、その配下のオブジェクト... という順でイベントが発生した要素へと渡されていきます[^1]。

## イベントオブジェクトに含まれるプロパティ
イベントオブジェクトに含まれる主なプロパティとしては以下のようなものがあります。
### type
`type`は発生したイベントの種類を表す文字列で、`click`や`keydown`などの値を持ちます。
`addEventListener`の第1引数に設定した文字列と`type`が同じときに設定したイベントハンドラーが呼び出されます。

### target
`target`はイベントが発生した要素への参照をもちます。

`target`にどのような情報が含まれるかは、`console.dir()`を使うと詳細に確認することができます[^2]。
```js
 const btn = document.getElementById("btn");
    btn.addEventListener("click", (e) => {
      console.dir(e.target);
    });
```

### currentTarget
`currentTarget`には現在イベントを処理している要素の参照がはいっています。
キャプチャリングやバブリングによってイベントの発生源ではない要素でもイベントが処理されることがあり、その場合に`target`と`currentTarget`の値が異なることになります。

### bubbles
`bubbles`にはboolean値がはいっており、バブリングが起こる場合には`true`、起こらない場合には`false`をとります。

### cancelable
`cancelable`にはboolean値がはいっており、イベントがキャンセル可能かを表します[^3]。
`click`や`submit`などはキャンセル可能なため、`true`が格納されていますが、`load`や`DOMContentLoaded`、`scroll`はキャンセルができないため、`false`が格納されています。

### eventPhase
`eventPhase`にはどのフェーズで処理がされているかを表す数値が格納されています。
各数値はそれぞれ以下に対応しています。
`0`: `NONE`
`1`: `CAPTURING_PHASE`
`2`: `AT_TARGET`
`3`: `BUBBLING_PHASE`


## イベントオブジェクトに含まれるメソッド
### preventDefault()
`preventDefault()`を呼び出すことで、デフォルトの動作を無効化することができます。
`submit`イベントでの通常のフォーム送信を停止したり、リンクの`click`イベントで通常のページ遷移を抑止するためなどに使用できます。

### stopPropagation()
`stopPropagation()`を呼び出すことで、イベントの伝播を止めることができます。
例えばキャプチャフェーズで呼び出されたときには、続くターゲットフェーズ、バブリングフェーズでの伝播も起こらなくなります。

同じ要素に複数のイベントリスナーが設定されている時には、`stopPropagation()`が呼び出されても、その要素に設定されたイベントリスナーによる処理は全て実行されます。
`stopImmediatePropagation()`を呼び出した場合には、同じ要素のイベントリスナーであっても呼び出し以降の処理については行われなくなります。

https://dom.spec.whatwg.org/#interface-event

https://developer.mozilla.org/ja/docs/Learn/JavaScript/Building_blocks/Events#%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88

https://developer.mozilla.org/ja/docs/Web/API/Event

[^1]:`addEventListner`の第3引数に`true`や`{capture:true}`が設定されているときには、この伝播の過程でも設定されたイベントハンドラが呼び出されます。（キャプチャーフェーズ）
[^2]:`console.dir()`はオブジェクトのプロパティ全てをコンソール上に表示します。
[^3]: キャンセル可能であるとは、`preventDefault()`によってデフォルトの動作を止められることを指します。