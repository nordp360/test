# Etap 1: Budowanie
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etap 2: Serwowanie (Nginx)
FROM nginx:stable-alpine

# Kopiujemy zbudowane pliki
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Kopiujemy szablon konfiguracji Nginx
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# KONFIGURACJA DLA RAILWAY:
# 1. Filtrowanie zmiennych envsubst (zapobiega usuwaniu $host, $remote_addr itp. przez Nginx)
ENV NGINX_ENVSUBST_FILTER='${PORT} ${BACKEND_URL}'

# 2. Domyślne wartości
ENV PORT=80
ENV BACKEND_URL=http://backend:8000

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
