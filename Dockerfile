FROM php:8.3.6-apache

# Instalamos extensiones necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copiamos php.ini custom
COPY docker/php.ini /usr/local/etc/php/

# Habilitamos mod_rewrite de Apache
RUN a2enmod rewrite

# Copiamos virtualhost custom
COPY docker/vhost.conf /etc/apache2/sites-available/000-default.conf

# Copiamos todo el proyecto al contenedor
COPY . /var/www/html/

# Establecemos el directorio de trabajo
WORKDIR /var/www/html

# Dar permisos adecuados para www-data
RUN chown -R www-data:www-data /var/www/html && chmod -R 775 /var/www/html
