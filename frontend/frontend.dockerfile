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
# Używamy formatu $VAR bez klamerek {} aby uniknąć błędu 'awk: bad regex'
# Ten filtr sprawi, że envsubst podmieni TYLKO te dwie zmienne.
ENV NGINX_ENVSUBST_FILTER='$PORT $BACKEND_URL'

# Domyślne wartości
ENV PORT=80
ENV BACKEND_URL=http://backend:8000

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
