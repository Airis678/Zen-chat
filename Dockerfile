# ベースとなるイメージを指定（Node.js バージョン 22.22.0） [1], [2], [3]
FROM node:22.22.0

# コンテナ内の作業ディレクトリを /app に設定 [4]
WORKDIR /app

# 必要なツール（日本語ロケール、tmux、curlなど）のインストール [2], [3]
RUN apt-get update && apt-get install -y locales tmux curl \
    && locale-gen ja_JP.UTF-8 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 環境変数の設定（日本語対応とタイムゾーン） [2], [3]
ENV LANG ja_JP.UTF-8
ENV TZ Asia/Tokyo

# 1. パッケージ管理ファイルをコンテナにコピー
COPY package*.json ./

# 2. 本番環境に必要なパッケージのみをインストール
RUN npm ci --only=production

# 3. プロジェクトの全ファイルをコンテナにコピー
COPY . .

# 4. 本番用のPrismaクライアントを生成
RUN npx prisma generate

# 5. データベースのテーブルを同期（db push）してからアプリを起動する
CMD ["sh", "-c", "npx prisma db push && node index.js"]