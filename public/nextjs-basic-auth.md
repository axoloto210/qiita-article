---
title: Next.jsのMiddlewareでBasic認証をつけるには
tags:
  - TypeScript
  - Next.js
  - AppRouter
  - PagesRouter
private: false
updated_at: '2024-06-15T20:29:34+09:00'
id: 747eb784e61b173d30b8
organization_url_name: null
slide: false
ignorePublish: false
---
## Middlewareを使ってBasic認証を設定できる
Next.jsのMiddlewareを使用することで、Basic認証をかけることができます。
本記事では、App RouterとPages RouterでのBasic認証のかけ方を紹介します。


## Middleware とは
Next.jsにはMiddlewareという機能があり、リクエストが完了する前にコードを実行してリクエストを処理し、レスポンスを変更することができます。

Middlewareでの処理はリクエストごとに実行されるため、重たい処理を行うのには向いていませんが、Basic 認証などの軽い処理を行うのには適しています。

https://nextjs.org/docs/app/building-your-application/routing/middleware

Middlewareは実行環境としてエッジランタイムが想定されており、Node.jsの`fs`など一部APIが使用できない点に注意が必要です。

https://nextjs.org/docs/app/api-reference/edge

middlewareで`fs`を使用しようとすると以下のようなエラーが出ます。
> ⨯ The edge runtime does not support Node.js 'fs' module.
>Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime

## Basic 認証について
Basic 認証はHTTP認証方式の１つで、ユーザー名とパスワードを（Base64によってエンコードして）リクエストヘッダに付加して送信することで、認証を行います。
盗聴に弱くあまり安全な方法とは言えないため、セキュリティ上安全に使用するためには、HTTPS/TLSなど追加のセキュリティ強化機能が必要です。


https://developer.mozilla.org/ja/docs/Web/HTTP/Authentication#basic_%E8%AA%8D%E8%A8%BC%E6%96%B9%E5%BC%8F

## Middleware を実装
Next.jsでMiddleware機能を使用ためには、`middleware.ts`（`middleware.js`）という名前のファイルを`app`(App Router)または`pages`(Pages Router)と同階層に配置することで使用できます。

:::note warn
`middleware.ts`は1つのプロジェクトに1つまでしか配置できないことには注意が必要です。
:::

それでは、Next.js公式のBasic認証実装例を見ていきたいと思います。

https://github.com/vercel/examples/tree/main/edge-middleware/basic-auth-password

```middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/', '/index'],
}

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === '4dmin' && pwd === 'testpwd123') {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}
```
Basic認証の設定については以下のようになっています。
#### Basic認証を要求するパスの設定
```ts
export const config = {
  matcher: ['/', '/index'],
}
```
まず、`config`という定数でMiddlewareで処理を行うパスを設定できます。
この例では、`/`と`/index`にアクセスした時にBasic認証が要求されることになります。

`matcher: ['/:path*']`などのように指定することで全てのパスに対してBasic認証をかけることもできます。

#### ユーザー名とパスワードの設定
```ts
if (user === '4dmin' && pwd === 'testpwd123') {
      return NextResponse.next()
    }
```

:::note warn
ユーザー名とパスワードは直書きせずに、`.env`ファイル等での管理をおすすめします。
:::


この箇所でリクエストヘッダから取得した（`atob`を使用してBase64でデコードした）ユーザー名とパスワードが正しいものか確認を行ないます。
ユーザー名とパスワードが正しく送られてきている場合には、`NextResponse.next()`によって、ルーティングの解決を続けます。

https://nextjs.org/docs/app/api-reference/functions/next-response

ユーザー名とパスワードが一致しない場合には、`/api/auth`へリダイレクトされ、ユーザー名とパスワードの入力を要求します。
```ts
  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
```

<br/>

次に、Basic認証の認証情報送信をクライアント側へ要求するために、`/api/auth` をどのように実装するかを、App RouterとPages Routerとで見ていきます。

### App Router
App Routerでは、`/app/api/auth/`の下に以下のような`route.ts`ファイルを配置します。
```route.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader('WWW-authenticate', 'Basic realm="Secure Area"')
  res.statusCode = 401
  res.end(`Auth Required.`)
}
```

Basic認証による認証が必要であることをレスポンスヘッダーに付加して返しています。

### Pages Router
Pages Router では、`pages/api/`の下に`auth.ts`ファイルを配置します。
（ファイルの内容はApp Routerの場合と同じです。）
```auth.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader('WWW-authenticate', 'Basic realm="Secure Area"')
  res.statusCode = 401
  res.end(`Auth Required.`)
}
```

### 開発モードでは認証を要求しない
開発中に認証情報を入力したくない場合には、`NODE_ENV`による分岐を入れておくと快適です。
```middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/:path*'],
}

export function middleware(req: NextRequest) {
     // 開発モードではBasic認証を要求しない
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

  if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}
```

```.env
BASIC_AUTH_USER='4dmin'
BASIC_AUTH_PASSWORD='testpwd123'
```

### 最後に
Middlewareを使うことでBasic認証を簡潔に設定できました。
他にも様々な処理を行えるので、積極的に活用していきたいですね。
