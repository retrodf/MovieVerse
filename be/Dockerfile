# Gunakan Node.js sebagai base image
FROM node:16

# Direktori kerja di container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh file backend
COPY . .

# Expose port backend
EXPOSE 5000

# Jalankan aplikasi
CMD ["npm", "run", "start:dev"]
