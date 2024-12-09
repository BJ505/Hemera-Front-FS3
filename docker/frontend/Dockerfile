# Usa Node.js para construir la aplicación Angular
FROM node:18 as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Compila la aplicación en modo producción
RUN npm run build -- --configuration production

# Usa una imagen de NGINX para servir la aplicación
FROM nginx:alpine

# Copia los archivos compilados al directorio de NGINX
COPY --from=build /app/dist/hemera /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
