# PHP公式イメージを使用
FROM php:8.2-cli

# 必要な拡張機能をインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

# PHP拡張機能をインストール
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリを設定
WORKDIR /app

# アプリケーションファイルをコピー
COPY . .

# 依存関係をインストール
RUN composer install --no-dev --optimize-autoloader
RUN npm ci && npm run build

# SQLiteデータベースを作成
RUN touch /tmp/database.sqlite
RUN php artisan migrate --force
RUN php artisan config:cache
RUN php artisan route:cache

# ポートを公開
EXPOSE $PORT

# アプリケーションを起動
CMD php artisan serve --host=0.0.0.0 --port=$PORT