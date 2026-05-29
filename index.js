'use strict';
const http = require('http');
const auth = require('http-auth');
const router = require('./lib/router');

// 🔐 Basic認証の設定
const basic = auth.basic({
  realm: 'Enter username and password.'
}, (username, password, callback) => {
  // コテハン： admin / 1122  または  sato / 3344
  callback(
    (username === 'admin' && password === '1122') ||
    (username === 'sato' && password === '3344')
  );
});

// ⭕️ バージョン4系における100%正しいミドルウェア接続の書き方
// basic.check() を使用してリクエスト処理を囲みます
const server = http.createServer(basic.check((req, res) => {
  router.route(req, res);
}));

// Renderのポートがあればそれを使い、なければ8000を使う設定
const port = process.env.PORT || 8000; 
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});