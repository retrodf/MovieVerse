# Tahap build menggunakan Node.js
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

# Tahap kedua menggunakan NGINX
FROM nginx:alpine

# Salin hasil build dari tahap sebelumnya ke direktori Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Salin file nginx.conf yang sudah diperbarui
COPY ./nginx.conf /etc/nginx/nginx.conf  

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
