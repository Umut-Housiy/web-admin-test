FROM node:15.11.0-buster AS builder

WORKDIR /src/web-admin

COPY ./web-admin/package*.json ./

RUN npm install --legacy-peer-deps

COPY ./web-admin/ ./

RUN npm run build

FROM nginx:1.19.7-alpine

COPY --from=builder /src/web-admin/build /usr/share/nginx/html

RUN echo "server { listen 80; server_name localhost; location / { root /usr/share/nginx/html; add_header 'Referrer-Policy' 'origin'; add_header X-Frame-Options 'DENY'; add_header X-Content-Type-Options nosniff; add_header Referrer-Policy 'strict-origin'; try_files \$uri \$uri/ /index.html; index index.html index.htm; } error_page  500 502 503 504 /50x.html; error_page 405 =200 $uri; location = /50x.html {  root   /usr/share/nginx/html; } }" > /etc/nginx/conf.d/default.conf

EXPOSE 80

RUN nginx
