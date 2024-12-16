---
title: 見た目の単位で文字を扱うには？書記素クラスターとゼロ幅接合子
tags:
  - JavaScript
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
## JavaScriptとUTF-16
JavaScript は、内部的な文字列エンコーディングにUTF-16を使用しており、16bit （2byte）単位で1つの文字を表しています。

しかし、16bit では最大で2^16個の値しか表現できないため、32bit で1文字を表現するサロゲートペア文字や、ゼロ幅接合子とよばれる制御文字を使って文字同士を結合して別の文字を表したりといったことをしています。

サロゲートペア文字やゼロ幅接合子によって結合された文字は、`split()`によって分割すると見た目の1文字ずつには分割されなかったりと不都合なことが起こります。

この記事では、見た目の1文字を1つの単位として扱う方法についてみていきます。

## 書記素クラスタ（Grapheme Cluster）
ユーザーが1文字として認識する、見た目の1文字のことを**書記素クラスタ**といいます。
`"が"`や`"é"`、`"👨‍👩‍👧‍👦"`など、見た目で1文字と認識される単位が書記素クラスタです。

`split()`によって、文字列の1文字ずつを要素に持つ配列に変換してみることを考えてみます。
```js
console.log('あいうえおabc123'.split('')) //["あ", "い", "う", "え", "お", "a", "b", "c", "1", "2", "3"] 
```
この例では見た目の1文字ずつに分割されています。
`split()`は16bit 単位で文字列を分割していくため、16bit で表される文字[^1]のみで構成されている文字列についてはうまく分割できます。

しかし、`"𩸽"`や`"𠮷"`といったサロゲートペア文字にたいして`split()`を適用してみると、以下のような結果となります。
```js
console.log('𩸽と𠮷'.split('')) //["�", "�", "と", "�", "�"]
```
見た目通りの文字で分割されておらず、`"�"`という文字が表示されてしまっています。
### `"�"`: REPLACEMENT CHARACTER
`"�"`はUnicode置換文字（REPLACEMENT CHARACTER）と呼ばれる文字で、`U+FFFD`で表されます。
サロゲートペアを指定する32bit のうちの片方16bit（孤立サロゲート）や未定義のコードポイントを指定したときなど、認識できない文字や表現できない文字の置き換え先として使われています。
この文字1つで1つの書記素クラスタとして扱われます。

### サロゲートペア文字を書記素クラスタ単位で分割するには
`"𩸽"`や`"𠮷"`といったサロゲートペア文字を書記素クラスタ単位で配列に格納するには、`Arry.from`やスプレッド構文`[...]`が有用です。
```js
console.log(Array.from('𩸽と𠮷')) //["𩸽", "と", "𠮷"] 
console.log([...'𩸽と𠮷'])        //["𩸽", "と", "𠮷"] 
```
`Array.from`や`[...]`はUTF-16のコードユニット単位（16bit）ではなく、コードポイント単位で分割します。

この方法でサロゲートペア文字を見た目の1文字ずつ扱うことができるわけですが、この方法でも見た目の通りには分割できない文字が存在します。
例えば、`🧑‍🧑‍🧒`などは複数の絵文字が結合してできているため、コードポイント単位で分割しても見た目の通りに分かれません。
```js
console.log(Array.from('👨‍👩‍👧‍👦')) //["👨", "‍", "👩", "‍", "👧", "‍", "👦"] 
```
`"👨‍👩‍👧‍👦"`は絵文字がゼロ幅接合子（ZWJ）と呼ばれる制御文字で結合されることで作られています。

## ゼロ幅接合子（Zero Width Joiner）
ゼロ幅接合子は`U+200D`で表される制御文字です。
先の`"👨‍👩‍👧‍👦"`の分割の例をコードポイントで確認してみます。
```js
console.log(Array.from('👨‍👩‍👧‍👦').map((char)=>char.codePointAt(0)?.toString(16))) 
//["1f468", "200d", "1f469", "200d", "1f467", "200d", "1f466"]
```
空文字`""`のようにみえていた箇所は、確かにゼロ幅接合子`U+200D`であることがわかります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Lexical_grammar

ゼロ幅接合子をもつ文字を書記素クラスタ単位で扱うには、`Intl.Segmenter`を使用します。

### `Intl.Segmenter`
`Intl.Segmenter`は`locales`とオプションを指定することで、`locale`に応じて書記素クラスタ単位や単語単位、文単位で文字列を分割できます。
`new Intl.Segmenter("ja", { granularity: "grapheme" })`のように引数を指定してSegmenterオブジェクトを作成し、`segment`メソッドで文字列から`Segments`というイテレータオブジェクトを生成できます。
この`Segments`によって、書記素クラスタ単位や単語単位への分割ができます。

`Segments`には`segment`や`index`、`input`プロパティを持つオブジェクトが複数格納されており、`input`が引数として受け取った文字列、`index`はそのオブジェクトが何番目のものかを表すインデックス、`segment`が書記素クラスタ単位の文字や単語単位の文字列をもっています。
#### 書記素クラスタ単位での分割
```js
const graphemeSegmenter = new Intl.Segmenter('ja',{granularity:'grapheme'})

const text = "この👨‍👩‍👧‍👦は、とても仲がいい。4人家族だ。"

const graphemeSegments = graphemeSegmenter.segment(text)

console.log([...graphemeSegments].map(s => s.segment))
// ["こ", "の", "👨‍👩‍👧‍👦", "は", "、", "と", "て", "も", "仲", "が", "い", "い", "。", "4", "人", "家", "族", "だ", "。"]
```
たしかに`"👨‍👩‍👧‍👦"`が見た目の1文字に分割できていますね。

単語単位での分割や文単位での分割は以下のようになります。
#### 単語単位での分割
```js
const wordSegmenter = new Intl.Segmenter('ja',{granularity:'word'})

const text = "この👨‍👩‍👧‍👦は、とても仲がいい。4人家族だ。"

const wordSegments = wordSegmenter.segment(text)

console.log([...wordSegments].map(s => s.segment))
//["この", "👨‍👩‍👧‍👦", "は", "、", "とても", "仲", "が", "いい", "。", "4", "人", "家族", "だ", "。"]
```
#### 文単位での分割
```js

const sentenceSegmenter = new Intl.Segmenter('ja',{granularity:'sentence'})

const text = "この👨‍👩‍👧‍👦は、とても仲がいい。4人家族だ。"

const sentenceSegments = sentenceSegmenter.segment(text)

console.log([...sentenceSegments].map(s => s.segment))
//["この👨‍👩‍👧‍👦は、とても仲がいい。", "4人家族だ。"] 
```

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter


[^1]: 16bit で表される文字群は基本多言語面（BMP: Basic Multilingual Plane）と呼ばれる範囲に含まれます。BMPは`U+0000`から`U+FFFF`までのコードポイント範囲のこと。