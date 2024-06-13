# Usar una imagen base de Node.js
FROM node:16.10.0 as build

# Instalar Angular CLI de forma global
RUN npm install -g @angular/cli@14.2.11

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json al directorio de trabajo
COPY app/package*.json ./

# Instalar las dependencias del proyecto
# Ci es como npm install pero esta instala la versiones especificas de todas las dependencias
RUN npm install --f

# Copiar todos los archivos del proyecto al directorio de trabajo
COPY app/ .

# Construye la aplicación Angular
#RUN npm run build
RUN ng build

# Exponer el puerto 80 en el contenedor
EXPOSE 4200

# Iniciar la aplicación cuando se ejecute el contenedor
#CMD ["npm", "start"]
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check", "--poll", "2000"]
