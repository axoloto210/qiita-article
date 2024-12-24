---
title: CSSOMツリーとレンダリングツリーの構築
tags:
  - HTML
  - CSS
  - JavaScript
  - ブラウザ
private: true
updated_at: '2024-12-25T03:36:24+09:00'
id: e70b5418d96f7d03dcfe
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
この記事は以下の続きです。

https://qiita.com/axoloto210/items/3208ba1446901fe43cae

レンダリングエンジンのHTMLパーサーは`<link>`や`<style>`タグ、`style`属性をみつけるとCSSOMツリーと呼ばれる木構造の構築を行います。
DOMツリーとCSSOMツリーが構築されると、この2つの木構造から画面上での表示位置や大きさといった情報を持つレイアウトツリーを構築します。

この記事では、これらの木構造が構築されるまでの流れについてみていきます。

## `CSSOM`
`CSSOM`はCSS Object Model の略で、（HTMLでのDOMのように、）CSSルールへのアクセスや、スタイルの変更を行うAPIを提供するオブジェクトモデルです。

`CSSOM`は「シーエスエスオブジェクトモデル」や「シーエスエスオーエム」と読まれます。

### `CSS`の字句解析・構文解析
レンダリングエンジンのHTMLパーサーは`<link>`や`<style>`タグ、`style`属性をみつけるとCSSOMツリーと呼ばれる木構造の構築を行います。
JavaScriptによるスタイルの変更もCSSOMツリーへ反映されます。

CSS もHTML と同様に字句解析・構文解析が行われます。
字句解析によって、CSSを構成する文字列はトークン化され、`p`や`h1`といったセレクタトークン、`{`や`}`を表すトークン、プロパティや値、`:`を表すトークンなどに分割されます。

そのトークンをもとに、CSSOMツリーという木構造が構文解析によって構築されます。
`StyleSheetList`をルート要素とする木構造で、`document.styleSheets`でアクセスできます。

https://developer.mozilla.org/ja/docs/Web/API/StyleSheet

https://www.w3.org/TR/cssom-1/

https://www.w3.org/TR/css-syntax-3/#tokenizing-and-parsing


## レイアウトツリー
DOMツリーとCSSOMツリーが構築されると、この2つの木構造からレイアウトツリーが構築されます。
レイアウトツリーは画面での実際の位置や大きさなどのレイアウト情報をもつ木構造です。

レンダリングエンジンは、DOMツリーの各DOM要素に対して、CSSOMツリーの各CSSルールセットがセレクタに適合するかを確認していきます。
セレクタが適合するCSSルールセットが各DOM要素について出揃ったら、どのルールが優先して適用されるかの指標であるCSS詳細度を計算し、そのほかいくつかの変換を経て、適用されるプロパティと値が決定されます。

https://qiita.com/axoloto210/items/a0cef9e7bdd27cd3345e

### 計算済みスタイル
先の過程でDOM要素に適用されるプロパティと値が決定されましたが、これは計算済みスタイルと呼ばれます。
計算済みスタイルは画面に表示される値を表すため、`%`や`em`などの相対値は`px`などの絶対値に変換されています。
また、プロパティの初期値の設定や継承関係の解決、カスケーディングの適用が行われます。

計算済みスタイルは、`Window.getComputedStyle()`によって取得することも可能です。

https://developer.mozilla.org/ja/docs/Web/API/Window/getComputedStyle

### レイアウトツリーの構築
これらの情報をもとに、どの要素がどのように表示されるかの情報を持つ、レイアウトツリーが構築されます。
このレイアウトツリーをもとにブラウザは画面の描画を行います。

要素の大きさや位置が変わるとレイアウトツリーは再構築されます。

レイアウトツリーの構築はコストが高いため、頻繁に再構築される状況は避けたいところです。
