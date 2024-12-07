---
title: getElementByIdとquerySelectorの要素探索方法
tags:
  - JavaScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## 要素の取得
要素オブジェクトの参照を取得する方法として、`getElementById`や`querySelector`というDOM APIがあります。
この2つのAPIはどちらも`id`を指定して要素を取得できますが、目的の要素の探索方法が異なります。

`id`というのはドキュメント内で一意である必要があります。
`querySelector`は`id`の他にも様々な方法で取得する要素の条件を指定できるため、`id`のみの指定を受け付ける`getElementById`とは探索アルゴリズムが異なっているわけですね。

## querySelector
`querySelector()`はCSS セレクタの記法を用いて要素を取得する関数です。
ドキュメント内の要素でセレクタに一致する最初のものを返します。
`document`オブジェクトのほか、要素オブジェクトにも存在するAPIで、要素オブジェクトにある`querySelector`はその要素内のみを探索します。

`id`を指定するときには、`querySelector(#foo)`のように`#`を使って指定します。
`getElementById`の場合には`#`の指定は不要ですが、`querySelector`では`#`をつけないと`id`ではなくタグ名で探索されてしまいます。

### 探索方法
`querySelector()`はドキュメント内を上から順に探索していきます。
上から順に1つずつ探索し、セレクタに一致した要素が返されます。
これは線形探索であり、計算量はO(N) となります。

## getElementById
`getElementById()`は引数に渡した`id`をもつ要素オブジェクトを取得する関数です。
`document`オブジェクトから生えているAPIであり、要素オブジェクトには生えていない点が`querySelector`とは異なっています。

`id`が一意に設定されていなかった場合には、指定した`id`をもつドキュメント内の最初の要素が返されます。
また、指定した`id`をもつ要素が見つからなかった場合には`null`が返されます。

### 探索方法
`getElementById()`によって要素を探索するとき、（ブラウザの実装によりますが、）ハッシュマップのようなデータ構造を使用して探索を行う場合、計算量はO(1)となります。
`id`と対応する要素を紐づけているため、高速に取得することができるわけです。

`getElementById`は`querySelector`と比べて高速です。

## 計測
10万個ほどの要素をもつドキュメント内の初めの方にある要素と終わりの方にある要素を取得するのにかかる時間を以下のような`html`で計測してみます（計測は１度のみ行っています）。

```html
<html>
<body>
    <div id="first">first target</div>
    {... 約10万個の<div>要素}
    <div id="target">last target</div> 
</body>
<script>
console.time('querySelector')
const target = document.querySelector('#target')
console.timeEnd('querySelector')

console.time('getElementById')
const targetElementById = document.getElementById('#target')
console.timeEnd('getElementById')

console.time('querySelectorFirst')
const targetFirst = document.querySelector('#first')
console.timeEnd('querySelectorFirst')

console.time('getElementByIdFirst')
const targetElementByIdFirst = document.getElementById('#first')
console.timeEnd('getElementByIdFirst')

</script>
</html>
```

ドキュメントの初めの方にある要素`<div id="first">first target</div>`を取得するまでにかかった時間は以下の通りです。

```
querySelectorFirst: 0.001953125 ms
getElementByIdFirst: 0.0009765625 ms
```
ドキュメントの初めの方にある要素を取得する場合には、`querySelector()`は`getElementById()`の約２倍の時間がかかっています。


一方、ドキュメントの最後の方にある要素`<div id="target">last target</div> `を取得するまでにかかった時間は以下の通りです。
```
querySelector: 0.069091796875 ms
getElementById: 0.003173828125 ms
```
10万個の要素を上から探索している`querySelector()`は、`getElementById()`の２0倍以上の時間がかかってしまっています。
要素数が大きいほど、両者の処理時間の差が開いていくことが確認できます。

### 計測環境
以下の環境で計測を行っています。
```
OS	macOS バージョン15.1.1
Google Chrome	131.0.6778.109 (Official Build) （arm64） 
JavaScript	V8 13.1.201.15
```

## さいごに
`document.querySelector()`と`document.getElementById()`とでは、`getElementById()`の方が高速に処理できます。
`id`を指定して要素を取得する際には、パフォーマンスの観点では`getElementById()`に軍配が上がります。

https://developer.mozilla.org/ja/docs/Web/API/Document/getElementById

https://developer.mozilla.org/ja/docs/Web/API/Document/querySelector