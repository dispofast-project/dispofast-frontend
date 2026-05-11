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

# Pasamos un "placeholder" o comodín en la etapa de build
ENV VITE_APP_BASE_URL="VITE_APP_BASE_URL_PLACEHOLDER"

# Construir la aplicación para producción
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
# URL de fallback (se sobreescribe con lo que pongas en la consola de Google Cloud)
ENV VITE_APP_BASE_URL="http://localhost:8080/api/v1"

EXPOSE 8080

# Iniciar el servidor estático
# Utilizamos "sed" dinámicamente para reemplazar el placeholder con la variable de la consola de Cloud Run
CMD ["sh", "-c", "find ./dist -type f -name '*.js' -exec sed -i \"s|VITE_APP_BASE_URL_PLACEHOLDER|${VITE_APP_BASE_URL}|g\" {} + && serve -s dist -l tcp://0.0.0.0:${PORT}"]
