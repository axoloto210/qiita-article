---
title: z-indexを設定しても前に出てこない？重ね合わせコンテキストとz-index
tags:
  - CSS
  - HTML
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## `z-index`を設定しても前に出てこない？
`z-index`はCSSプロパティの1つで、要素の重なりの順を指定できます[^1]。
しかし、`z-index`のみを要素に設定しても重なり順が変わらないことがあります。

`z-index`がどのような状況の場合に重なり順を指定できるのかをみていきます。

https://developer.mozilla.org/ja/docs/Web/CSS/z-index

## `z-index`が適用できる条件
`z-index`は`position:static`の要素に対しては適用できません。
`position`が`absolute`,`relative`,`fixed`,`sticky`である要素や、`flex`アイテム、`grid`アイテムに対して`z-index`値が適用できます。

しかし、`z-index`の数値が大きいものから順に前面に配置されるかというとそうではありません。
`z-index`の値は重ね合わせコンテキストと呼ばれる空間内での順序を設定しているためです。

## 重ね合わせコンテキスト（Stacking Context）
重ね合わせコンテキスト（Stacking Context）とは、HTML要素の3次元的な重なり順を決定する、概念的な空間のことです。
要素は必ず最も近い祖先の重ね合わせコンテキストに属します。
また、重ね合わせコンテキストを生成した要素は、そのコンテキスト内で最背面に配置されます。

重ね合わせコンテキストが生成される条件はいくつかありますが、その中でも代表的なものとして、`position`プロパティの設定があります。

- `position`が`absolute`または`relative`で`z-index`が`auto`以外
- `position`が`fixed`または`sticky`

これらの場合には重ね合わせコンテキストが生成されて、`z-index`が適用できますが、`position:static`(デフォルト値)の場合には、`z-index`による指定ができません。

### 重ね合わせコンテキストの生成条件
`position`の値以外に、以下のような条件でも重ね合わせコンテキストが生成されます（他にもあります）。
- `<html>`（ルート要素）
- `opacity` が`1`未満
- `transform` が `none`以外
- `filter` が `none`以外
- `flex`アイテムか`grid`アイテムで`z-index`が`auto`以外

### z-index を大きくしても前に出てこない例 
以下のようなケースを考えてみます。
```html
<!DOCTYPE html>
<html>
<head>
    <link href="stacking_context.css" rel="stylesheet"/>
</head>
<body>
    <div class="div1">div 1</div>
    <div class="div2">
        div 2
        <div class="div3">div3</div>
    </div>
</body>
</html>
```
```css
.div1{
    background-color: red;
    height: 80px;
    width: 240px;
    position: absolute;
    z-index: 10;
}
.div2{
    background-color: yellow;
    height: 120px;
    width: 280px;
    position: absolute;
    z-index: 1;
}
.div3{
    background-color: blue;
    height: 160px;
    width: 80px;
    position: absolute;
    z-index: 10000;
}
```
![stacking_context.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3806599/06d2af47-367a-40ac-856e-62a27d352945.png)

画像の赤い領域が`div1`、黄色い領域が`div2`、青い領域が`div3`に対応しています。

`div1`と`div2`は兄弟要素であり、`div3`は`div2`の子要素です。

設定している`z-index`は、
- `div1` `z-index: 10;`
- `div2` `z-index: 1;`
- `div3` `z-index: 10000;`
 
となっており、単純に`z-index`の値を比較すると前面から順に`div3`,`div1`,`div2`と表示されるような気がします。

しかし、実際には`div1`,`div3`,`div2`の順で表示されています。

これは`z-index`が同一の重ね合わせコンテキスト内で比較される値であるからです。

<br/>

この例では、重ね合わせコンテキストが4つ生成されています。
```
html
├── div1
└── div2
    └── div3
```

`div1`と`div2`はルート要素の生成した重ね合わせコンテキストに属すため、`z-index`値の比較によって`div1`が前面にきます。

しかし、`div3`はルート要素の重ね合わせコンテキストには属さないため（`div2`の生成した重ね合わせコンテキストに属す）、`div3`と`div1`のどちらが前面にくるかは、`div3`と`div1`の`z-index`値ではなく、`div3`の親要素である`div2`と`div1`の`z-index`値の比較で決定されています。

`div2`と`div3`については、同一の重ね合わせコンテキストに属さないため、`z-index`による比較はされません。
`div2`の`z-index`値を`div3`のものより大きくなるように設定した場合でも、`div3`が前面にきます。
これは、重ね合わせコンテキストを生成した要素は、そのコンテキスト内で最も奥に配置されるためです[^2]。

https://developer.mozilla.org/ja/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context

## さいごに
`z-index`によって重なり順を指定するためには、`position:static`でないことなどの条件があります。
また、条件を満たした場合でも、必ずしも`z-index`の大きい順に前面にくるのではなく、重ね合わせコンテキスト同士の前後関係が関わってきます。
なぜか前面にこないという場合には、これらを疑ってみるとよさそうですね。

[^1]: `z-index`の`z`とはz軸のことです。画面上の水平方向がx軸、垂直方向がy軸、奥行きがz軸です。このz軸上での順番(index)を表すわけです。
[^2]:このため、html（ルート要素）が前面にくることもないわけですね。