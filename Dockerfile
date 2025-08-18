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

# 起動時にSQLiteデータベースを作成するスクリプト
RUN echo '#!/bin/bash\ntouch /tmp/database.sqlite\nchmod 666 /tmp/database.sqlite\nphp artisan migrate --force 2>/dev/null || true\nphp artisan config:clear 2>/dev/null || true\necho "Starting Laravel server..."\nexec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}' > /start.sh
RUN chmod +x /start.sh

# ポートを公開
EXPOSE 8080

# アプリケーションを起動
CMD ["/start.sh"]