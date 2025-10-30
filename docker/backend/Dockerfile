# PHP-FPM (Alpineベース)
FROM php:8.4-fpm-alpine

# Composerをコピー
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 必要パッケージをインストール
RUN apk add --no-cache \
    zip unzip curl bash icu-dev oniguruma-dev libxml2-dev libzip-dev && \
    docker-php-ext-install pdo pdo_mysql bcmath intl opcache && \
    rm -rf /var/cache/apk/*

# Xdebug インストール（軽量版）
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    linux-headers \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && apk del .build-deps \
    && rm -rf /tmp/pear

# php.ini を配置（Xdebug設定含む）
COPY php.ini /usr/local/etc/php/php.ini

# 作業ディレクトリ
WORKDIR /var/www/html

# 権限調整
RUN chown -R www-data:www-data /var/www/html

# php-fpm起動
CMD ["php-fpm"]
