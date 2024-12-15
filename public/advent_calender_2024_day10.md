---
title: 正規表現と文字クラス・フラグ
tags:
  - JavaScript
  - 正規表現
private: false
updated_at: '2024-12-11T20:38:13+09:00'
id: 7814c2ccd60ce3dbfe69
organization_url_name: null
slide: false
ignorePublish: false
---
## 正規表現
正規表現は文字パターンを表す記法で、JavaScriptでは`/foo/`や`new RegExp("foo")`のようにして正規表現を表すオブジェクトを生成できます。

正規表現で使用される文字クラス・フラグについて簡単にまとめてみます。

### 文字クラス
`[abc]`のように`[]`で囲むことで宣言できます。
この例では`a`または`b`または`c`にマッチします。

`-`を使用すると範囲指定ができます。
`[1-9]`は`1`から`9`を、`[a-z]`は`a`から`z`までを表します。

他にも、`\d`のようにバックスラッシュと文字で指定できる汎用的な文字クラスがいくつか用意されています。
#### よく使われる文字クラス
`\d`:ASCII文字での数字。`[0-9]`と同じ。
`\D`:ASCII文字での数字以外。`[^0-9]`と同じ。
`\s`:Unicode空白文字。改行なども含まれています。
`\S`:Unicode空白文字以外。
`\w`:ASCII文字での単語文字。`[A-Za-z0-9_]`と同じ。
`\W`:ASCII文字での単語文字以外。`[^A-Za-z0-9_]`と同じ。
`.`:Unicodeの行末文字（改行）以外の文字。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Regular_expressions/Character_class_escape

### 正規表現中のエスケープ
`^`で否定を表すように、正規表現では特別な意味を持つ文字がいくつかあります。
この`^`自体を正規表現で使用したいときには`\`でエスケープする必要があります。

以下はエスケープしている文字自体を表します。
`\^`, `\$`, `\\`, `\.`, `\*`, `\+`, `\?`, `\(`, `\)`, `\[`, `\]`, `{`, `}`, `\|`, `\/`

文字によっては`\`をつけると、`\d`のように別の意味を持つようになるため注意が必要です。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Regular_expressions/Character_escape

### 正規表現のフラグ
正規表現`//`の２つ目の`/`のあとに特定の文字（フラグ）を記述することで、正規表現の動作を変更できます。
フラグには、`g`,`i`,`m`,`s`,`u`などがあります。

#### `g`フラグ
`//g`のように`g`を指定すると、正規表現に最初にマッチしたものだけでなく、文字列内での全てのマッチを検索するようになります。

#### `i`フラグ
大文字・小文字の区別をしなくなります。

#### `m`フラグ
文字列が改行されている場合、`^`と`$`は文字列の先頭と末尾だけでなく、各行の先頭と末尾にもマッチするようになります。

#### `s`フラグ
`.`が改行も含めてマッチするようになります。

#### `u`フラグとUnicode 文字クラス
`\u{}`によるコードポイントの指定や`\p{}`、`\P{}`の使用が可能になります。
`/\u{61}/`はuが61回繰り返したものにマッチしますが、`/\u{61}/u`はコードポイント`U+0061`、`a`にマッチするようになります。
また、サロゲートペア文字など複数の文字として扱われてしまう文字も1文字として扱われるようになります。

他にも、`\p{}`によってUnicode文字クラスを使用することができるようになります。
`/\p{Decimal_Number}/u`のようにUnicode文字プロパティを指定することができます[^1]。
```js
/\p{Decimal_Number}/u.test('٣') //true
/\d/.test('٣') //false
```
`\d`ではアラビア数字の0から9にしかマッチしませんが、`/\p{Decimal_Number}/u`であればインド数字`٣`[^2]などにもマッチするようになります。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape

[^1]:Unicode文字には複数のUnicode文字プロパティが設定されています。
[^2]:`٣`はアラビア数字で3にあたる数字です。
