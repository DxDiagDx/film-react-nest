#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Даем права на существующие таблицы
    GRANT ALL ON ALL TABLES IN SCHEMA public TO "${DATABASE_USERNAME}";
    -- Даем права на будущие таблицы
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${DATABASE_USERNAME}";
EOSQL