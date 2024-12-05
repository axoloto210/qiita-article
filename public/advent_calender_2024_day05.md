---
title: CSS詳細度とは
tags:
  - CSS
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## CSSのどの値が適用されるか
CSSでは、CSSルール[^1]によって、条件に該当する要素にスタイルをあてることができます。
```css
p {
  color: red
}

.p-class {
  color: blue
}
```
要素によっては、CSSルールの複数の条件に該当する場合があります。
例えば、上の例では`<p>`タグが`p-class`というクラスに属しているときには2つの条件`p`と`.p-class`に該当することになります。
```html
<p class="p-class">text</p>
```

複数の条件が該当する場合には、必ずしも後から書かれたルールで上書きされるわけではなく、適用されるCSSルールの優先度によってどのルールが適用されるかが決定されます。

## 詳細度
CSS詳細度は、競合するルールのうち、どのCSSルールが適用されるかを決めるアルゴリズムです。

詳細度はCSSルールの条件に設定されているセレクタの種類とその個数によって決まります。

セレクタの種類は`ID`, `CLASS`, `TYPE`に分類されます。
### `ID`
`ID`の分類にはIDセレクターが含まれます。
IDセレクターは`#id`というように記述されます。

### `CLASS`
`CLASS`の分類には、クラスセレクタ（例：`.p-class{...}`）や属性セレクタ、擬似クラスセレクタ（`:hover{...}`など）が属します。

属性セレクタは、`a[title]{...}`のように指定することで要素の属性を条件に設定することができます。
`a[title]`の場合は、`<a>`タグのうち`title`属性をもつものが該当します。

### `TYPE`
`TYPE`の分類には要素型セレクタ（`p{...}`）や擬似要素セレクタ(`::before{...}`)が属します。

### 詳細度の計算
詳細度は`ID`,`CLASS`,`TYPE`の個数によって`<IDの個数>-<CLASSの個数>-<TYPEの個数>`のように表されます。
例えば、`ID`,`CLASS`,`TYPE`に分類されるセレクタがそれぞれ2,1,3個設定されているCSSルールの場合、その詳細度は`2-1-3`となります。

2つのCSSルールのうち、以下をみたす方が優先して適用されます。
- `ID`の個数が多いルール
- `ID`の個数が同じときには、`CLASS`の個数が多い方
- `ID`,`CLASS`の個数が同じときには、`TYPE`の個数が多い方

例として、以下のようなCSSルールを考えてみます。
```css
p.p-class { /* 0-1-1 */
    color: cyan;
}

p { /* 0-0-1 */
  color: red;
}

.p-class { /* 0-1-0 */
  color: blue;
}

#pid { /* 1-0-0 */
    color: yellow;
}
```
```html
<p id="pid" class="p-class">text</p>
```
この例では、`#pid{...}`(`1-0-0`),`p.p-class`(`0-1-1`),`.p-class`(`0-1-0`),`p`(`0-0-1`)の優先順でルールが適用されます。

また、詳細度が同じ場合には、後に書かれているCSSルールが優先して適用されます。


## インラインスタイルによる上書き
HTML要素のstyle属性によってルールを指定することもできます。
このインラインスタイルは詳細度に関わらず、優先して適用されます。

```html
<p id="pid" class="p-class" style="color: skyblue;">text</p>
```
この例では詳細度によらず、textの色が`skyblue`となります。

## `!important`
CSSルールの値に`!important`をつけることで、詳細度の高いルールやインラインスタイルの指定を上書きすることもできます。
```css
p{
  color: blue !important;
}
```
詳細度が`0-0-1`のCSSルールでも、特定のプロパティのみ上書きすることが可能です。

## さいごに
あとから書いたCSSルールで必ずしもスタイルの上書きができないのは、CSS詳細度によって適用するCSSルールが決まっているためです。
うまくスタイルを上書きできないときには、CSS詳細度を確認してみると原因が見つかるかもしれません。

https://developer.mozilla.org/ja/docs/Web/CSS/Specificity

[^1]: セレクターのグループと宣言ブロックの組は[CSSルール](https://developer.mozilla.org/ja/docs/Web/CSS/Syntax#css_%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB%E3%82%BB%E3%83%83%E3%83%88)と呼ばれます。