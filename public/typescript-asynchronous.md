---
title: setTimeoutの型と非同期処理
tags:
  - JavaScript
  - TypeScript
private: false
updated_at: '2024-07-13T20:53:24+09:00'
id: 6ff2b5dbf1ddcdc90565
organization_url_name: null
slide: false
ignorePublish: false
---
## 同期処理と非同期処理
JavaScriptの処理方式 には同期処理と非同期処理があります。

同期処理の場合には、一つ前の処理が完了するまで次の処理には移れないため、時間がかかるような処理があると他の処理を開始できなくなってしまいます[^1]。

非同期処理は、時間がかかる処理に適した処理方式で、同期処理とは異なり、処理の完了を待たずに次の処理へ移れます。

ただし、次の処理と非同期な処理が同時に並列して実行されているわけではないことには注意が必要です。

https://developer.mozilla.org/ja/docs/Learn/JavaScript/Asynchronous

## 非同期処理の開始
非同期処理を行う関数の代表的なものに、`setTimeout`があります。

`setTimeout(code, delay)`のように呼び出し、`delay`ms が経過すると`code`を実行してくれるような挙動をする関数です。

```ts
setTimeout(() => {
  console.log('実行されました')
}, 1000)
```

https://developer.mozilla.org/ja/docs/Web/API/setTimeout

しかし、実際には`setTimeout`というのは「`delay`ms 後に`code`を実行すること」を開始する関数です。

このことについて以下でみていきます。
## `setTimeout`の計測開始タイミング
`setTimeout`は`delay`ms 後に処理を開始しますが、`setTimeout`が呼び出されてから`delay`ms 後に処理が始まるわけではないことに注意が必要です。

以下のように、`setTimeout`の後で時間がかかる同期処理を実行するプログラムを考えてみます。
```ts
setTimeout(() => { console.log('実行されました') }, 10)

const array = [1, 2, 3, 4, 5]
for (let i = 0; i < 20000; i++) {
  array.push(array.length + 1)
  array.sort()
  array.reverse()
}
console.log(array.length)
```
このプログラムを実行すると`setTimeout`によって、10ms 後に「実行されました」とコンソール上に表示されるように思えますが、実際には表示までに1秒ほどの時間がかかります。
```
20005
実行されました
```
これは、`setTimeout`が並行して時間計測などの処理を始めるのではなく、10ms 後にコールバック関数をタスクキューに追加する関数だからです（`setTimeout`に限らず非同期処理を実行する関数は、即時実行するのではなく、コールバック関数をタスクキューに追加し、追加したタスクの順番が来ると実行が開始されます）。

### 複数の`setTimeout`
```ts
setTimeout(() => { console.log('1,000ms') }, 1000)
setTimeout(() => { console.log('5,000ms') }, 5000)
setTimeout(() => { console.log('10ms') }, 10)
```
このプログラムでは、`delay`を1,000ms、5,000ms、10ms に設定しています。
このプログラムを実行すると以下の結果が得られます。
```
10ms
1,000ms
5,000ms
```
遅延時間の短いものから実行されており、直感通りの順となっていますね。

今度は2秒かかる同期処理を、5,000ms と10ms を指定している`setTimeout`の間に入れてみます。
```ts
setTimeout(() => {
  console.log("1,000ms")
}, 1000)
setTimeout(() => {
  console.log("5,000ms")
}, 5000)

const startTime = Date.now()
while (Date.now() - startTime < 2000) {}

setTimeout(() => {
  console.log("10ms")
}, 10)
```
結果は以下のようになります。
```
1,000ms
10ms
5,000ms
```
1,000ms という表示が10ms よりも先に来ていますね。

`setTimeout`は呼び出されたときにコールバック関数（`setTimeout`の第１引数に指定した関数）をタスクキューへ`delay`ms 後に追加するという関数なので、このプログラムで行われる処理は「1,000ms後にキューに追加」、「5000ms 後にキューに追加」、2秒の同期処理のあと、「10ms 後にキューに追加」となります。
つまり、「10ms 後にキューに追加」は2秒以上経ってから行われるため、「1,000ms 後にキューに追加」による追加の方が先に起こり、1000ms が先に表示されるわけです。

同期処理の時間を2秒から10秒に変えてみると、表示順が変わります。
```ts
setTimeout(() => {
  console.log("1,000ms")
}, 1000)
setTimeout(() => {
  console.log("5,000ms")
}, 5000)

const startTime = Date.now()
while (Date.now() - startTime < 10000) {}

setTimeout(() => {
  console.log("10ms")
}, 10)

```
```
1,000ms
5,000ms
10ms
```

`setTimeout`が呼び出されたときから数えて`delay`ms 後にコールバック関数をキューに追加しているという点が肝ですね。

`setTimeout`に限らず他の非同期処理を行う関数も（遅延時間は設定せずに）コールバック関数をタスクキューに追加しています。
（タスクにはマクロタスクやマイクロタスクがあったりします。）

https://developer.mozilla.org/ja/docs/Web/API/HTML_DOM_API/Microtask_guide

https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth

## `setTimeout`の型
setTimeout の型は以下のようになっています。
```ts:typescript/lib/lib.dom.d.ts
function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number
```
```ts
type TimerHandler = string | Function;
```
`setTimeout`の第１引数としては、関数の他に文字列を指定することも許されています。
文字列をコンパイルしてくれて、関数として使用できるようですね。
```ts
setTimeout("console.log('実行されました')", 1000)
```

1秒後にコンソールに「実行されました」と表示されます。

MDN によると、第１引数での文字列の使用は非推奨とされているようです。

>関数の代わりに文字列を含める代替構文も許容されており、タイマーが満了したときに文字列をコンパイルして実行します。 eval() の使用にリスクがあるのと同じ理由で、この構文は推奨しません。

https://developer.mozilla.org/ja/docs/Web/API/setTimeout#%E5%BC%95%E6%95%B0

ちなみにこの挙動はNode.js で実行しようとするとエラーが出ます。

https://nodejs.org/api/timers.html#settimeoutcallback-delay-args

[^1]:JavaScript ではシングルスレッドモデルが採用されており、WebWorker を使用する場合などを除き、基本的には複数の箇所が同時に並行して実行されることはありません。
