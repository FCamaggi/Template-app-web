# Usar una imagen base de Node 18
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias necesarias para PostgreSQL
RUN apk add --no-cache postgresql-client

# Copiar package.json y package-lock.json primero para aprovechar el cache de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Asegurarse de que el script de entrypoint sea ejecutable
RUN chmod +x ./entrypoint.sh

# Exponer el puerto 3000
EXPOSE 3000

# Usar el script de entrypoint
ENTRYPOINT ["./entrypoint.sh"]