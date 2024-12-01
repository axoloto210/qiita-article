---
title: ブラウザでのJavaScript 実行の流れ
tags:
  - 'JavaScript'
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
本記事ではWebブラウザによってHTML 解析時にJavaScript がどのような流れで実行されるのかをまとめます。

WebブラウザがHTMLを受け取ってから、リソースの読み込みが完了したことを表す`load`イベントが発生するまでの流れを見ていきます。


## HTML の解析
レンダリングエンジン[^1]のHTML パーサーが、受け取ったHTML を解析しながらDocument オブジェクトを作成していきます。

JavaScript エンジンからこのDocument オブジェクトに要素を追加・削除・更新する際には、`getElementById`などのDOM API を通じて行います。

## スクリプトの読み込み・実行
HTML パーサーは「`async`,`defer`,`type="module"`」の**ない**`<script>`要素をみつけるとドキュメント（DOM ツリー）に追加し、スクリプトを実行します。

スクリプトがダウンロード、実行されている間、HTMLパーサーによる解析は停止し、DOMツリーの構築がブロックされる点には注意が必要です（レンダリングブロッキング）。

`document.write()`によってHTML ドキュメントに直接HTML文字列が追加される可能性があるため、解析を停止する必要があるわけです。
`defer`や`async`の使用時にはレンダリングブロッキングは起こりません。

このスクリプトで参照できるDocument オブジェクトは、すでに構築済みのものに限られます。
`<script>`要素よりもあとに記述されている要素に`getElementById`などでアクセスすることはできないわけです。

### async属性
`async`をもつ`<script>`要素については、スクリプトのダウンロードが非同期的に行われ、実行されます。
非同期実行のため、`<script>`要素の後ろにあるdocumentオブジェクトにアクセスできる場合もあります。

## HTMLの解析の完了
HTML ドキュメントの解析が完了し、DOM ツリーの構築が完了すると[^2]、「`defer`,`type="module"`」をもつ`<script>`がHTML に記述された順番に実行されていきます。
これらのスクリプトはDOM ツリーの構築完了後に実行されているため、ドキュメントツリー全体にアクセスできます。

これらの`<script>`の同期処理が完了すると、ブラウザはDocument オブジェクトに対して`DOMContentLoaded`イベントを発生させます。
この時点では画像やCSS などリソースの読み込みが完了していません。

`async`をもつスクリプトはこの時点で実行が完了していない場合もあります。
## `load`イベントの発生
リソースの読み込みや`async`スクリプトの読み込み、実行がされたときにブラウザはWindow オブジェクトに対して`load`イベントを発生させます[^3]。



[^1]:Google Chrome ではBlink, Safari ではWebkit が使用される）
[^2]: このタイミングで`doccument.readyState`の値が`loading`から`inter active`へ変わります。
[^3]:`document.readyState`は`inter active`から`complete`へ変わります。