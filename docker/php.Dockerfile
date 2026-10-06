# XAU Market Pro - PHP 8.2 FPM Dockerfile
FROM php:8.2-fpm-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    linux-headers \
    $PHPIZE_DEPS \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    icu-dev \
    postgresql-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && pecl clear-cache \
    && rm -rf /tmp/pear

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first for caching
COPY backend/composer.json ./

# Copy application code
COPY backend/ .

# Remove host vendor (contains dev packages like collision)
RUN rm -rf vendor

# Remove host composer.lock (contains dev packages like collision)
RUN rm -f composer.lock

# Install PHP dependencies (fresh install without dev packages)
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --no-cache

# Create storage directories and set permissions
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/framework/testing \
    storage/logs \
    storage/app/public \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose PHP-FPM port
EXPOSE 9000

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Default command (passed to entrypoint)
ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
