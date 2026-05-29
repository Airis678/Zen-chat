'use strict';
const postsHandler = require('./posts-handler');
const util = require('./handler-util'); // 1. インポートを追加 [1]

/**
 * リクエストを適切なハンドラに振り分ける
 */
function route(req, res) {
  // 2. 本番環境での HTTPS 強制 [5]
  if (process.env.NODE_ENV === 'production' &&
      req.headers['x-forwarded-proto'] === 'http') {
    util.handleNotFound(req, res);
    return;
  }

  switch (req.url) {
    case '/': // 3. トップページの実装 [8]
      util.handleTopPage(req, res);
      break;
    case '/posts':
      postsHandler.handle(req, res);
      break;
    case '/posts/delete': // 4. 削除機能 [9]
      postsHandler.handleDelete(req, res);
      break;
    case '/logout': // 5. ログアウト [3]
      util.handleLogout(req, res);
      break;
    case '/favicon.ico': // 6. ファビコン [10]
      util.handleFavicon(req, res);
      break;
    case '/style.css': // 7. CSS [11]
      util.handleStyleCssFile(req, res);
      break;
    case '/nn-chat.js': // 8. クライアント側JS [12]
      util.handleNnChatJsFile(req, res);
      break;
    case '/changeTheme': // 9. ダークモード切り替え [2]
      util.handleChangeTheme(req, res);
      break;
    default:
      // 10. 応答待ちを防ぐための 404 処理 [4]
      util.handleNotFound(req, res);
      break;
  }
}

module.exports = {
  route
};