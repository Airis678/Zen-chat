'use strict';

const fs = require('node:fs'); // ファイル読み込み用 [3]
const Cookies = require('cookies'); // Cookie操作用 [4]
const config = require('../config'); // 定数管理用 [5]

// 1. ログアウト処理 [1]
function handleLogout(req, res) {
  res.writeHead(401, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end('<!DOCTYPE html><html lang="ja"><body>' +
    '<h1>ログアウトしました</h1>' +
    '<a href="/posts">ログイン</a>' +
    '</body></html>');
}

// 2. 404 Not Found (ページ未定義) [6], [7]
function handleNotFound(req, res) {
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.write('<p>ページがみつかりません</p>');
  res.write('<a href="/posts">チャットへ戻る</a>');
  res.end();
}

// 3. 400 Bad Request (不正リクエスト) [8], [9]
function handleBadRequest(req, res) {
  res.writeHead(400, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('未対応のリクエストです');
}

// 4. ファビコンの配信 [10]
function handleFavicon(req, res) {
  res.writeHead(200, {
    'Content-Type': 'image/vnd.microsoft.icon',
    'Cache-Control': 'public, max-age=604800' // 7日間のキャッシュ [10]
  });
  const favicon = fs.readFileSync('./favicon.ico');
  res.end(favicon);
}

// 5. CSSファイルの配信 [11]
function handleStyleCssFile(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/css'
  });
  const file = fs.readFileSync('./public/style.css');
  res.end(file);
}

// 6. クライアント側JSの配信 [12]
function handleNnChatJsFile(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/javascript'
  });
  const file = fs.readFileSync('./public/nn-chat.js');
  res.end(file);
}

// 7. ダークモードのテーマ切り替え [13]
function handleChangeTheme(req, res) {
  const cookies = new Cookies(req, res);
  // 現在のテーマを反転させる
  const theme = cookies.get(config.currentThemeKey) === 'light' ? 'dark' : 'light';
  cookies.set(config.currentThemeKey, theme, { maxAge: 30 * 86400 * 1000 }); // 30日保存 [14]
  res.writeHead(303, { 'Location': '/posts' });
  res.end();
}

// 8. トップページ (/) の表示 [15]
function handleTopPage(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.write('<!DOCTYPE html><html lang="ja"><body>' +
    '<h1>NN チャットへようこそ</h1>' +
    '<a href="/posts">チャットルームへ移動する</a>' +
    '</body></html>');
  res.end();
}

// 関数のエクスポート (末尾のカンマを活用) [6], [13], [15]
module.exports = {
  handleLogout,
  handleNotFound,
  handleBadRequest,
  handleFavicon,
  handleStyleCssFile,
  handleNnChatJsFile,
  handleChangeTheme,
  handleTopPage
};