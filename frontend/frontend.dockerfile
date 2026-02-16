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

# Konfiguracja zmiennych środowiskowych dla Nginx
# PORT: port na którym słucha Nginx (Railway go przypisuje)
# BACKEND_URL: adres API (domyślnie 'backend' w sieci Docker)
ENV PORT=80
ENV BACKEND_URL=http://backend:8000

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
