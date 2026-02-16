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
# Kopiujemy własną konfigurację Nginx (ważne dla SPA i proxy API)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
