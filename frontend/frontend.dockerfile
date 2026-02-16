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

# Kopiujemy szablon konfiguracji
COPY nginx.conf.template /nginx.conf.template

# Ustawienia dla Railway
ENV NGINX_ENVSUBST_FILTER='$PORT $BACKEND_URL'
ENV PORT=80
ENV BACKEND_URL=http://backend:8000

EXPOSE 80

# Start z podmianą zmiennych
CMD ["/bin/sh", "-c", "envsubst '$PORT $BACKEND_URL' < /nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
