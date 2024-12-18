---
title: position stickyでHTML要素を画面にとどまらせる
tags:
  - CSS
  - JavaScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## HTML要素を画面に張り付かせる
小さなダイアログやヘッダー、広告といった、スクロールをしても画面の特定の位置に表示しておきたい要素がでてくることがあります。

JavaScript による実装で位置を固定しておくことも可能ですが、CSSの`position: sticky`を利用すると、要素を画面の特定の位置に表示しておく粘着動作を簡潔に実現することが可能です。

## `position: sticky`
`position: sticky`は要素を粘着させるCSSプロパティです。
スクロールを行った際に、要素を特定の箇所にとどまらせることができます。

`position: sticky`によって、粘着をさせるには、`top`や`bottom`、`left`や`right`といった、いわゆる`inset`プロパティも一緒に指定する必要があります。
`inset`プロパティが1つも指定されていない時には、`position: relative`として扱われ、粘着動作は起こらなくなります。

### 粘着先の要素の決まり方
`position:sticky`が指定された要素は、その祖先要素のうち`overflow: visible`(デフォルト値)以外の値をもつ最も近いものに粘着します。
そのため、画面全体のスクロールに粘着させるには、各祖先要素が`overflow: visible`を持たないことが必要になります。

`overflow-x: scroll`や`overflow-x:hidden`など、横軸への指定であってもその祖先要素へ粘着することとなる点には注意が必要です。

https://developer.mozilla.org/ja/docs/Web/CSS/position

## JavaScript での実装
`position: sticky`は、祖先要素の`overflow`プロパティによっては画面全体に粘着させられないため、祖先要素の`overflow`プロパティを変更したくない場合には別の方法で粘着動作を実現する必要が出てきます。

スクロールに応じて要素の位置を変更する方法の一つとして、JavaScriptで`scroll`イベントを監視し、位置を更新する方法があります。
`getClientBoundingRect`[^1]や`document.body.scrollTop`などを使用して位置を計算し、要素の`style`属性を使って位置を指定して実現します。

しかし、`getClientBoundingRect`を使用すると、ページ上の要素の正確な位置とサイズを計算する必要があるため、強制リフロー[^2]が発生する点には注意が必要です。

強制リフローによるパフォーマンスの低下を回避するには、デバウンスやスロットリングによって頻度を落とす方法のほか、`Intersection Observer`API を利用する方法もあります。

`Intersection Observer`はスクロールなどのイベントではなく、要素が画面に表示されているかを監視できるため、スクロールイベントを監視するよりもパフォーマンスの点で優れます。

https://developer.mozilla.org/ja/docs/Web/API/Intersection_Observer_API

[^1]: [`getClientBoundingRect`](https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect)は、ビューポートの上端から要素の上端までの距離やビューポートの左端から要素の右端までの距離を返す`Element`のメソッドです。
[^2]: ブラウザが要素の位置やサイズを再計算し、画面上のレイアウトを即座に再構成すること。Forced Synchronous Layout とも呼ばれます。ブラウザの通常の最適化サイクルを中断して強制的に行われるためパフォーマンスに悪影響をあたえます。