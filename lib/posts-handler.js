'use strict';
const pug = require('pug');
const { PrismaClient } = require('../generated/prisma'); // パスはそのまま
const prisma = new PrismaClient({ log: ['query'] });

// --- ここから Day.js の設定を追加 ---
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
require('dayjs/locale/ja');

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ja');
// --- ここまで ---

async function handle(req, res) {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
      break;
    default:
      break;
  }
}

async function handleGet(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  // データベースから投稿一覧を取得（古い順 ＝ 最新が一番下になる）
  const posts = await prisma.post.findMany({
  orderBy: { id: 'asc' } // ⭕️ desc から asc に変更
  });

  // 🔔 テンプレートへ渡す前に日時データを加工する
  posts.forEach((post) => {
    post.relativeCreatedAt = dayjs(post.createdAt).fromNow(); // 「〜分前」
    post.absoluteCreatedAt = dayjs(post.createdAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒'); // 詳細日時
  });

  res.end(pug.renderFile('./views/posts.pug', { posts, user: req.user }));
}

/**
 * POSTリクエスト：新しい投稿を保存する
 */
function handlePost(req, res) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    }).on('end', async () => {
      const params = new URLSearchParams(body);
      const content = params.get('content');
      
      // 🔔 チェックボックスがONなら「true」、OFFなら「null」が返ってくるため、=== 'true' で判定します
      const isAnonymous = params.get('anonymous') === 'true';
      const postedBy = isAnonymous ? '名無しさん' : req.user;

      console.info(`投稿されました: ${content} (by ${postedBy})`);

      // データベースへの保存処理
      await prisma.post.create({
        data: {
          content: content,
          postedBy: postedBy // ◀︎ 判定された名前を格納
        }
      });

      handleRedirectPosts(req, res);
      resolve();
    });
  });
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, { 'Location': '/posts' });
  res.end();
}

module.exports = {
  handle
};