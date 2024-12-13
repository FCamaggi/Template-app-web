#!/bin/sh

# Esperar a que la base de datos esté disponible
until npx sequelize-cli db:migrate:status > /dev/null 2>&1; do
  echo "Esperando a que la base de datos esté lista..."
  sleep 3
done

# Ejecutar migraciones
echo "Ejecutando migraciones..."
npx sequelize-cli db:migrate

# Verificar y ejecutar seeds
echo "Verificando y ejecutando seeds..."
npx sequelize-cli db:seed:all

# Iniciar el servidor
echo "Iniciando la aplicación..."
exec npm start