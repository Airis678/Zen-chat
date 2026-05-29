'use strict';
const http = require('http');
const router = require('./lib/router'); // authの読み込みを外す

// Basic認証（basic.check）を完全に外し、直接ルーターを呼び出す
const server = http.createServer((req, res) => {
  router.route(req, res);
});

// ポート番号の設定
const port = process.env.PORT || 8000; 
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});