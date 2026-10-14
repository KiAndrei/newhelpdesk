#!/bin/sh
set -e

PORT="${PORT:-10000}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

cd /var/www/html

# Cache config from the runtime environment variables
php artisan config:clear
php artisan config:cache

# Safe on every deploy: only runs migrations that have not run yet. Never drops data.
php artisan migrate --force

chown -R www-data:www-data storage bootstrap/cache

exec apache2-foreground
