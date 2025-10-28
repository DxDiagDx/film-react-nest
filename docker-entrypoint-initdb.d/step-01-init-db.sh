#!/bin/bash
set -e

# Проверка обязательных переменных окружения
if [ -z "$DATABASE_USERNAME" ] || [ -z "$DATABASE_PASSWORD" ] || [ -z "$DATABASE_NAME" ]; then
    echo "Ошибка: Не все обязательные переменные окружения установлены"
    exit 1
fi

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER "${DATABASE_USERNAME}" WITH PASSWORD '${DATABASE_PASSWORD}';
    CREATE DATABASE "${DATABASE_NAME}";
    GRANT ALL PRIVILEGES ON DATABASE "${DATABASE_NAME}" TO "${DATABASE_USERNAME}";
EOSQL