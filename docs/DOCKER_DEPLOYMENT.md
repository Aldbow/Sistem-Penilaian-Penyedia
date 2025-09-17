# Docker Deployment Guide - Sistem Penilaian Penyedia

## Deskripsi Proyek

Sistem Penilaian Penyedia adalah aplikasi web berbasis Next.js yang digunakan untuk menilai kinerja penyedia jasa/barang. Aplikasi ini menggunakan Google Sheets sebagai database dan memiliki sistem autentikasi PPK (Pejabat Pembuat Komitmen).

## Prasyarat

Sebelum melakukan deployment dengan Docker, pastikan Anda telah memiliki:

1. **Docker Desktop** terinstall di komputer Anda
2. **Docker Compose** (biasanya sudah termasuk dalam Docker Desktop)
3. **Google Service Account** dengan akses ke Google Sheets API
4. **Google Spreadsheet** yang sudah dikonfigurasi sesuai struktur aplikasi
5. **Port 3000** tersedia di komputer Anda

## Struktur File Docker

Untuk deployment dengan Docker, Anda perlu membuat beberapa file konfigurasi:

### 1. Dockerfile

```dockerfile
# Gunakan Node.js 18 sebagai base image
FROM node:18-alpine AS base

# Install dependencies hanya ketika diperlukan
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild source code hanya ketika diperlukan
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build aplikasi
RUN npm run build

# Production image, copy semua files dan run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permission yang benar untuk prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. docker-compose.yml

```yaml
version: '3.8'

services:
  sistem-penilaian:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GOOGLE_SHEETS_PRIVATE_KEY=${GOOGLE_SHEETS_PRIVATE_KEY}
      - GOOGLE_SHEETS_CLIENT_EMAIL=${GOOGLE_SHEETS_CLIENT_EMAIL}
      - GOOGLE_SHEET_ID=${GOOGLE_SHEET_ID}
      - NEXTAUTH_URL=http://0.0.0.0:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    env_file:
      - .env
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 3. .dockerignore

```
node_modules
.next
.git
.gitignore
README.md
Dockerfile
.dockerignore
npm-debug.log
.nyc_output
.coverage
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 4. next.config.js (Update)

Pastikan file `next.config.js` Anda memiliki konfigurasi untuk standalone output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig
```

## Konfigurasi Environment Variables

### 1. Buat file .env

Salin file `.env.example` menjadi `.env` dan isi dengan nilai yang sesuai:

```bash
# Google Sheets Configuration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_SHEET_ID="your_actual_google_sheet_id"

# Next.js Configuration
NEXTAUTH_URL="http://0.0.0.0:3000"
NEXTAUTH_SECRET="your-secure-random-string-here"
```

### 2. Cara Mendapatkan Google Service Account

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan Google Sheets API
4. Buat Service Account:
   - Pergi ke IAM & Admin > Service Accounts
   - Klik "Create Service Account"
   - Isi nama dan deskripsi
   - Klik "Create and Continue"
5. Download JSON key file
6. Buka file JSON dan ambil nilai `private_key` dan `client_email`
7. Share Google Spreadsheet Anda dengan email service account

## Langkah-langkah Deployment

### 1. Persiapan File

```bash
# Clone atau pastikan Anda berada di direktori proyek
cd /path/to/sistem-penilaian-penyedia

# Buat file Docker yang diperlukan
touch Dockerfile
touch docker-compose.yml
touch .dockerignore

# Salin dan edit file environment
cp .env.example .env
# Edit .env dengan nilai yang sesuai
```

### 2. Build dan Run dengan Docker Compose

```bash
# Build image Docker
docker-compose build

# Jalankan aplikasi
docker-compose up -d

# Atau build dan run sekaligus
docker-compose up -d --build
```

### 3. Verifikasi Deployment

```bash
# Cek status container
docker-compose ps

# Lihat logs aplikasi
docker-compose logs -f sistem-penilaian

# Cek apakah aplikasi berjalan
curl http://localhost:3000
```

## Akses dari Komputer Lain

### 1. Konfigurasi Network

Untuk mengakses aplikasi dari komputer lain di jaringan yang sama:

#### Opsi A: Menggunakan IP Address Komputer Host

```bash
# Cari IP address komputer Anda
# Windows:
ipconfig

# Linux/Mac:
ifconfig
# atau
ip addr show
```

Kemudian akses aplikasi melalui: `http://[IP_ADDRESS]:3000`

#### Opsi B: Bind ke Semua Interface

Update `docker-compose.yml`:

```yaml
services:
  sistem-penilaian:
    # ... konfigurasi lainnya
    ports:
      - "0.0.0.0:3000:3000"  # Bind ke semua interface
    environment:
      - NEXTAUTH_URL=http://0.0.0.0:3000
```

### 2. Konfigurasi Firewall

#### Windows:
```powershell
# Buka Windows Defender Firewall
# Atau jalankan sebagai Administrator:
netsh advfirewall firewall add rule name="Next.js App" dir=in action=allow protocol=TCP localport=3000
```

#### Linux:
```bash
# UFW
sudo ufw allow 3000

# iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

### 3. Akses Melalui Hostname

Jika komputer Anda memiliki hostname yang dapat diakses di jaringan:

```
http://[COMPUTER_NAME]:3000
```

## Monitoring dan Maintenance

### 1. Monitoring Container

```bash
# Lihat resource usage
docker stats

# Lihat logs real-time
docker-compose logs -f

# Restart aplikasi
docker-compose restart

# Stop aplikasi
docker-compose down

# Update dan restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 2. Backup dan Restore

```bash
# Backup image
docker save -o sistem-penilaian-backup.tar sistem-penilaian-penyedia_sistem-penilaian

# Restore image
docker load -i sistem-penilaian-backup.tar
```

### 3. Update Aplikasi

```bash
# Pull perubahan code terbaru
git pull origin main

# Rebuild dan restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### 1. Container Tidak Bisa Start

```bash
# Cek logs error
docker-compose logs sistem-penilaian

# Cek konfigurasi
docker-compose config

# Rebuild dari scratch
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

### 2. Tidak Bisa Akses dari Komputer Lain

1. Pastikan firewall tidak memblokir port 3000
2. Cek apakah aplikasi bind ke `0.0.0.0` bukan `127.0.0.1`
3. Pastikan komputer berada di jaringan yang sama
4. Test koneksi: `telnet [IP_ADDRESS] 3000`

### 3. Google Sheets API Error

1. Pastikan Service Account memiliki akses ke spreadsheet
2. Cek format private key di environment variable
3. Pastikan Google Sheets API sudah diaktifkan
4. Verifikasi GOOGLE_SHEET_ID benar

### 4. Performance Issues

```bash
# Increase memory limit
docker-compose down
# Edit docker-compose.yml, tambahkan:
# deploy:
#   resources:
#     limits:
#       memory: 1G
#     reservations:
#       memory: 512M
docker-compose up -d
```

## Security Considerations

### 1. Environment Variables

- Jangan commit file `.env` ke repository
- Gunakan secrets management untuk production
- Rotate API keys secara berkala

### 2. Network Security

```yaml
# docker-compose.yml - Production setup
services:
  sistem-penilaian:
    # ... konfigurasi lainnya
    networks:
      - internal
    # Hanya expose port yang diperlukan
    ports:
      - "127.0.0.1:3000:3000"  # Hanya bind ke localhost

networks:
  internal:
    driver: bridge
    internal: true  # Isolasi network
```

### 3. Container Security

```dockerfile
# Dockerfile - Security best practices
FROM node:18-alpine AS base

# Update packages
RUN apk update && apk upgrade

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ... rest of Dockerfile

# Run as non-root user
USER nextjs
```

## Production Deployment

Untuk deployment production, pertimbangkan:

1. **Reverse Proxy**: Gunakan Nginx atau Traefik
2. **SSL Certificate**: Implementasi HTTPS
3. **Load Balancer**: Untuk high availability
4. **Monitoring**: Prometheus + Grafana
5. **Backup Strategy**: Automated backup untuk data
6. **CI/CD Pipeline**: Automated deployment

### Contoh dengan Nginx Reverse Proxy

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - sistem-penilaian
    networks:
      - app-network

  sistem-penilaian:
    build: .
    expose:
      - "3000"
    # Tidak expose port ke host, hanya ke nginx
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=https://yourdomain.com
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Kesimpulan

Dengan mengikuti panduan ini, Anda dapat:

1. Deploy aplikasi Sistem Penilaian Penyedia menggunakan Docker
2. Mengakses aplikasi dari komputer lain di jaringan yang sama
3. Melakukan monitoring dan maintenance aplikasi
4. Mengatasi masalah umum yang mungkin terjadi

Untuk pertanyaan lebih lanjut atau troubleshooting, silakan merujuk ke dokumentasi Docker dan Next.js official, atau hubungi tim development.
