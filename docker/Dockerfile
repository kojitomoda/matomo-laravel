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

# PHP拡張機能をインストーこル
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリを設定
WORKDIR /app

# 開発用: ボリュームマウントを使用するためCOPYは不要
# 依存関係は起動時にインストール

# アプリケーションを起動
CMD ["sh", "-c", "composer install && php artisan migrate --force 2>/dev/null || true && php artisan config:clear 2>/dev/null || true && echo 'Starting Laravel server...' && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"]
