'use strict';
const http = require('node:http');
const auth = require('http-auth');
const router = require('./lib/router');

// 1. Basic認証の設定 [3], [4]
// users.htpasswd ファイルを使用して認証情報を管理します
const basic = auth.basic({
  file: './users.htpasswd'
});

// 2. HTTPサーバーの作成 [5], [6], [4]
// 全てのリクエストを basic.check で囲むことで、認証を必須にします
const server = http.createServer(basic.check((req, res) => {
  // 認証に成功した場合、routerモジュールに処理を渡します [2]
  router.route(req, res);
}));

// 3. エラーハンドリング [7]
server.on('error', (e) => {
  console.error(new Date() + ' Server Error', e);
});
server.on('clientError', (e) => {
  console.error(new Date() + ' Client Error', e);
});

// 4. サーバーの起動設定 [8], [9]
// Render環境では process.env.PORT を使用し、ローカルでは 8000番を使用します
const port = process.env.PORT || 8000;

// 修正ポイント：listen の呼び出しはこれ「1回だけ」にします
// 第2引数に '0.0.0.0' を指定することで、Render上での接続待ち受けを確実にします
server.listen(port, '0.0.0.0', () => {
  console.info(new Date() + ` Listening on ${port}`);
});