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

# Konfiguracja środowiska
ENV PORT=80
ENV BACKEND_URL=http://backend:8000

EXPOSE 80

# Skrypt startowy:
# 1. Podmienia zmienne w locie (tylko te wymienione w parametrze envsubst)
# 2. Wypisuje konfigurację do logów dla celów debugowania
# 3. Uruchamia Nginx
CMD ["/bin/sh", "-c", "envsubst '$PORT $BACKEND_URL' < /nginx.conf.template > /etc/nginx/conf.d/default.conf && echo 'Generated Nginx Config:' && cat /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
