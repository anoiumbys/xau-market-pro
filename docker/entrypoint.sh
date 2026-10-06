#!/bin/sh
set -e

# Set dummy env vars for package:discover (avoids Pusher error during discovery)
export PUSHER_APP_ID="${PUSHER_APP_ID:-dummy}"
export PUSHER_APP_KEY="${PUSHER_APP_KEY:-dummy}"
export PUSHER_APP_SECRET="${PUSHER_APP_SECRET:-dummy}"
export PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER:-mt1}"

# Clear cached packages (may contain old collision provider)
php artisan config:clear || true
php artisan cache:clear || true
rm -f bootstrap/cache/packages.php bootstrap/cache/services.php bootstrap/cache/config.php

# Generate optimized autoload (WITH dev for collision)
composer dump-autoload --optimize

# Run package:discover with dummy env vars
php artisan package:discover --ansi

# Execute the CMD (php-fpm, or overridden command like artisan websockets:serve)
exec "$@"