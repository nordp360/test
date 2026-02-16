server {
    listen ${PORT};
    server_name _;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        # SNI Setup - Wymagane dla połączeń HTTPS na Railway
        proxy_ssl_server_name on;
        proxy_ssl_name $proxy_host;
        proxy_ssl_session_reuse off;
        
        # Resolver dla DNS (Google + Cloudflare)
        resolver 8.8.8.8 1.1.1.1 valid=30s;

        proxy_pass ${BACKEND_URL};
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $proxy_host;
        proxy_cache_bypass $http_upgrade;
        
        # Przekazywanie adresów IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouty (ważne dla AI)
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
