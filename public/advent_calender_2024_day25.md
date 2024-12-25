---
title: レンダリングとクリティカルレンダリングパス
tags:
  - HTML
  - CSS
  - JavaScript
  - ブラウザ
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## はじめに
ブラウザのレンダリングとは、HTML、CSS、JavaScriptをユーザーが実際に画面上で見ることができるピクセルに変換するまでの一連の処理のことです。

この記事では、レンダリングやクリティカルレンダリングパスの流れについてみていきます。
## クリティカルレンダリングパス
レンダリングとは、ブラウザがHTML、CSS、JavaScriptをユーザーが実際に画面上で見ることができるピクセルに変換するまでの一連の処理のことです。

クリティカルレンダリングパスとは、ブラウザが最初のレンダリングを開始する前に行う手順のことです。
レンダリングと似ていますが、クリティカルレンダリングパスは最初の描画までに焦点を当てています。

クリティカルレンダリングパスを最適化することで、ページが初めてレンダリングされるまでの時間を短縮できます。

https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path

https://web.dev/learn/performance/understanding-the-critical-path?hl=ja

## レンダリング
ブラウザのレンダリングとは、HTML、CSS、JavaScriptをユーザーが実際に画面上で見ることができるピクセルに変換するまでの一連の処理のことです。

レンダリングは主に4つの工程があり、Loading工程、Scripting工程、Rendering工程、Painting工程の順で行われます。

この4工程についてみていきます。

https://developer.mozilla.org/ja/docs/Web/Performance/How_browsers_work#%E3%83%AC%E3%83%B3%E3%83%80%E3%83%AA%E3%83%B3%E3%82%B0

ちなみに、GoogleChromeのdevツールのパフォーマンスタブでは、この4工程それぞれにかかった時間を計測することも可能です。

### Loading工程
Loading工程はリソースの読み込みと解析を行う工程です。
URLからHTMLやCSSなどのリソースを取得し、構文解析を行なってDOMツリーとCSSOMツリーを構築します。

この工程については以下の記事で扱っています。

https://qiita.com/axoloto210/items/3208ba1446901fe43cae

https://qiita.com/axoloto210/items/e70b5418d96f7d03dcfe

### Scripting工程
Scripting工程ではJavaScriptの実行が行われます。
JavaScriptのソースコードが字句解析・構文解析・コンパイルを経て実行されます。
JavaScriptはDOMツリーやCSSOMツリーへの変更ができるため、この工程でもDOMツリーやCSSOMツリーへ変更が入ることがあります。

### Rendering工程
Rendering工程では、DOMツリーとCSSOMツリーからレイアウトツリーを構築します。
構築に際して、スタイルの計算を行います。
レイアウトツリーについては以下の記事で扱っています。

https://qiita.com/axoloto210/items/e70b5418d96f7d03dcfe

レイアウトツリー構築後には、レイアウトが行われます。

#### レイアウト
レイアウトは、レイアウトツリーの各要素の位置や大きさを決める処理で、レイアウトツリーが構築された直後に行われます。
レイアウトツリーには、計算済みのスタイルなどの情報も含まれますが、ビューポートの大きさなどはわからないため、実際に画面のどこに配置されるかはレイアウト処理によって決定されます。

レイアウト処理は、DOMやCSSの変更によって再度実行される場合があり、この再計算処理はリフローと呼ばれます。
リフローは要素の大きさや位置を変更した場合などに発生します。
リフローは計算コストが高く、パフォーマンスへ悪影響を与えるため、なるべく避けたい処理です。

リフローの他に、背景色や文字色の変更など位置や大きさによらないスタイル変更があった時には、リペイントが発生します。
リフローが発生すると必ずリペイントも発生します。

https://developer.mozilla.org/ja/docs/Glossary/Reflow

https://developer.mozilla.org/ja/docs/Glossary/Repaint

### Painting工程
Painting工程は目に見える画面の描画を行う工程で、ペイント、ラスタライズ、レイヤーの合成が行われます。
#### ペイント
ペイント工程では、ブラウザのグラフィックエンジンへの命令を生成します。
グラフィックエンジンは生成された命令に基づいてピクセルの描画を行います。

#### ラスタライズ
ラスタライズ工程は、生成された命令をもとにビットマップ（ピクセルの集合）へと描画します。
ビットマップはラスターとも呼ばれ、このラスターへと変換を行うことからラスタライズと呼ばれているわけですね。

ビットマップはレイヤーと呼ばれる単位で一枚ずつ描画され、これらのレイヤーが後ほど合成されることで画面への描画が完了します。
レイヤーは重ね合わせコンテキスト（stacking context）によって重なり順が制御されています。
重ね合わせコンテキストや関連するCSSプロパティである`z-index`については以下でも扱っています。

https://qiita.com/axoloto210/items/1d40f94acf4381cd7225

レイヤーは一度描画されたあとにも再利用されます。
スクロールを行ったときなどには、スクロールのたびに1から描画し直すのではなく、同じレイヤーの再利用によって効率的に描画がなされます。

#### レイヤーの合成
複数作成されたレイヤーを最後に合成して描画することで、ブラウザのレンダリングは完了し、画面上にコンテンツが表示されるようになります。

https://developer.mozilla.org/ja/docs/Web/Performance/How_browsers_work

https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path