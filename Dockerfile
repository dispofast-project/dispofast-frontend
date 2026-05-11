# Etapa 1: Construcción (Build)
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci || npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción (Vite crea la carpeta 'dist')
RUN npm run build

# Etapa 2: Servidor Ligero de Producción (Serve)
FROM node:20-alpine AS production

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar 'serve' globalmente con npm para servir archivos estáticos
RUN npm install -g serve

# Copiar los archivos estáticos construidos desde la etapa anterior
COPY --from=build /app/dist ./dist

# Variables de entorno recomendadas
ENV NODE_ENV=production
# Cloud Run inyecta su propia variable de entorno PORT, por defecto es 8080.
ENV PORT=3000

EXPOSE 3000

# Iniciar el servidor estático
# La bandera '-s' (single) permite que las rutas de React Router carguen de forma correcta (reenviando a index.html)
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT}"]
