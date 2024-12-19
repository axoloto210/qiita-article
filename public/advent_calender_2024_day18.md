---
title: 包含ブロックとposition
tags:
  - CSS
private: false
updated_at: '2024-12-20T02:15:45+09:00'
id: dc00f40138385a8d2dfb
organization_url_name: null
slide: false
ignorePublish: false
---
## 包含ブロックとは
CSSにおける包含ブロックとは、要素の位置や大きさを計算する際に基準となるブロックのことです。
`width`や`height`が`%`によって指定されているときには、包含ブロックの大きさをもとに計算されます。
例えば、`width:50%`と指定されていて、その要素の包含ブロックの横幅が`400px`と指定されているときには、その要素の横幅は`200px`と計算されるといった具合です。

包含ブロックは、要素の直近のブロックレベルの祖先要素が該当することが多いですが、例外もあります。

https://developer.mozilla.org/ja/docs/Web/CSS/Containing_block

## 包含ブロックの決まり方
包含ブロックは、基本的には`position`（デフォルト値は`static`）の値によって決まります。
### `static`,`relative`,`sticky`
`static`,`relative`,`sticky`はどれも通常のフロー（Normal Flow）で配置される`position`値です。

https://www.w3.org/TR/CSS2/visuren.html#normal-flow

`position`が`static`,`relative`,`sticky`のいずれかのときには、**ブロックコンテナ**か**ブロック整形コンテキスト**(BFC)を形成する直近の祖先要素のパディングボックスの辺が包含ブロックとなります。

**ブロックコンテナ**には、`div`などのブロック要素やインラインブロック要素、テーブルのセル`th`、`td`やflex アイテム、grid アイテムが該当します。

**ブロック整形コンテキスト**(BFC)とは、**レイアウトを管理する独立した空間**のことです。
異なるBFC 同士ではマージンの相殺が起こらなかったり、float 要素とは重ならないなど、独立性をもっています。

BFC を生成する代表例には、以下のようなものがあります。
- `<html>`（root要素）
- `float`要素
- `position: fixed`、`position: sticky`が指定されている要素
- `display: inline-block` の要素
- overflow が visible 以外の値であるブロック要素
- テーブルのセル
- flex アイテム
- grid アイテム

上のような条件を満たす直近の祖先要素の（パディングボックスの）辺の長さや位置が`%`や`top`の基準になるわけですね。

### `fixed`
`positon:fixed`の場合、基本的にはビューポート（画面の表示領域）が包含ブロックとなります[^1]。

### `absolute`
`positon:absolute`の場合、`position:static`以外の直近の祖先要素のパディングボックスが包含ブロックとなります[^1]。

https://developer.mozilla.org/ja/docs/Web/CSS/CSS_flow_layout/Introduction_to_formatting_contexts

## `%`がうまくきかないとき
`width`や`height`で`%`値を指定しているのに大きさがかわらなかったり、想定とは異なる大きさになっているときには、その要素の包含ブロックがどの要素で、包含ブロックに幅が設定されているかを確認してみると原因が見つかるかもしれません。

以下の構造を考えてみます。
```html
<div class="block_div">
    <span class="inline_span">
        inline span
        <div class="div1">div1</div>
    </span>
    <div class="div2">div2</div>
</div>
```
```css
.div1 {
  height: 40%;
  background-color: orange;
}
.div2 {
  height: 40%;
  background-color: red;
}
.block_div{
  height: 160px;
  background-color: yellow;
}
.inline_span{
  height: 40px;
  background-color: green;
}
```
![bfc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3806599/f266074c-d6ff-691d-af2e-898d11aeb2fc.png)

このHTML では、`div1`の親要素が`span`要素となっています。

しかし、`div1`の高さは`span`の高さの`40%`にあたる`16px`ではなく、`div2`と同じ`64px`となります。
これは、`div1`の包含ブロックが`span`ではなく、`<div class="block_div">`となるためで、`%`の基準が`span`の高さ`40px`ではなく、`<div class="block_div">`の高さ`160px`になるためです。

計算の基準となっている包含ブロックを見つけ、`%`指定を使いこなしていきたいですね。

[^1]:`position:fixed`や`position:absolute`が指定されている要素については、`transform`、`perspective`、`will-change`、`filter`、`contain` などが指定された祖先要素があるときにはその要素が包含ブロックとなることがあります。
