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
# Nginx w Dockerze automatycznie przetwarza pliki .template z /etc/nginx/templates/
# i wstawia zmienne środowiskowe do plików wynikowych w /etc/nginx/conf.d/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Ustawiamy domyślny port na wypadek braku zmiennej PORT
ENV PORT=80

EXPOSE 80

# Nginx obraz automatycznie obsłuży envsubst dla nas przed startem
CMD ["nginx", "-g", "daemon off;"]
