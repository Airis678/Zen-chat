'use strict';
const postsHandler = require('./posts-handler');

/**
 * リクエストを適切なハンドラに振り分ける
 */
function route(req, res) {
  switch (req.url) {
    case '/posts':
      postsHandler.handle(req, res);
      break;
    // 今後 /logout などをここに追加していきます
    default:
      break;
  }
}

module.exports = {
  route
};