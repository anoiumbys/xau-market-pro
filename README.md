# XAU Market Pro

[![CI Pipeline](https://github.com/anoiumbys/xau-market-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/anoiumbys/xau-market-pro/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Aplikasi web untuk memantau pasar emas (XAU/USD): dashboard, chart TradingView, jurnal trading, price alert, langganan berjenjang, laporan, dan panel admin. Backend **Laravel 11** (REST API), frontend **React 18 + TypeScript**.

> **UTS Pemrograman Website** (individu)
> Nama: Firgiawan Zhaliam · NIM: 60225081 · Kelas: ADPL A

## Demo publik

klik link dibawah untuk mengakses website :

**https://backend-autumn-grove-6913.fly.dev/**

> Data pasar pada aplikasi ini masih berupa simulasi. Jangan memasukkan informasi pribadi atau data sensitif.

## Daftar isi

- [Fitur](#fitur)
- [Status dan keterbatasan](#status-dan-keterbatasan)
- [Tech stack](#tech-stack)
- [Struktur proyek](#struktur-proyek)
- [Menjalankan aplikasi](#menjalankan-aplikasi)
- [Akun demo](#akun-demo)
- [Pengujian](#pengujian)
- [CI/CD](#cicd)
- [Lisensi](#lisensi)

## Fitur

| Area | Yang tersedia |
| --- | --- |
| Autentikasi | Register, login, logout, lupa dan reset password, ubah profil (Laravel Sanctum, token Bearer) |
| Role | `guest`, `trader`, `admin` (Spatie Permission + middleware `AdminOnly`) |
| Dashboard | Harga XAUUSD, perubahan 24 jam, statistik trading, ringkasan alert dan langganan |
| Chart | Widget TradingView Advanced Chart |
| Jurnal trading | CRUD trade, tutup posisi, ringkasan statistik (win rate, total PnL). Trade yang menyentuh Stop Loss / Take Profit ditutup otomatis oleh scheduler tiap menit |
| Price alert | Buat, lihat, hapus alert (di atas / di bawah / menembus level harga). Dicek tiap menit oleh job terjadwal |
| Langganan | Paket Basic, Pro, Enterprise. Pengguna mengajukan, admin menyetujui / menolak / membatalkan / memperpanjang |
| Laporan | Ekspor jurnal ke CSV, laporan lanjutan (khusus Pro/Enterprise, dijaga middleware `CheckSubscription`) |
| Panel admin | Kelola pengguna (ubah role, ban/unban, hapus), pasar, langganan, alert, jurnal, laporan (ringkasan, pengguna, langganan, pendapatan), pengaturan dan parameter pasar |
| Audit | Tabel `audit_logs` dengan observer pada model |
| Antarmuka | 3 bahasa (Inggris, Spanyol, Indonesia, masing-masing 243 teks), tema terang/gelap/sistem, sidebar responsif, PWA |

Daftar lengkap endpoint ada di [`backend/routes/api.php`](backend/routes/api.php).

## Status dan keterbatasan

Bagian ini sengaja ditulis jujur agar sesuai dengan kode yang ada.

- **Harga pasar adalah data simulasi.** `MarketDataService::fetchFromExternal()` membangkitkan harga acak di sekitar nilai dasar, belum terhubung ke penyedia data pasar sungguhan. Price alert dan jurnal menggunakan data simulasi tersebut.
- **WebSocket real-time belum aktif.** Class event broadcast dan konfigurasinya sudah disiapkan, tetapi paket server WebSocket belum terpasang dan frontend belum punya client WebSocket. Frontend memperbarui data melalui interval HTTP.
- **Batas paket belum dipaksakan.** Batas Basic (3 alert, tanpa ekspor) sudah didefinisikan dan ditampilkan di data langganan, tetapi belum divalidasi saat alert dibuat. Yang sudah dijaga middleware adalah jenis laporan lanjutan.
- **Dokumentasi OpenAPI/Swagger belum tersedia.** Gunakan `backend/routes/api.php` sebagai acuan endpoint.
- **Tes backend masih minim** (baru tes contoh bawaan Laravel). Frontend punya 34 tes unit.
- **Aplikasi sudah dideploy secara publik.** Deployment saat ini menggunakan Fly.io dan SQLite pada volume persisten.

## Tech stack

**Backend**: PHP 8.2+, Laravel 11, Laravel Sanctum, Spatie Laravel Permission, MySQL 8 (Docker) atau SQLite (lokal), Redis (Docker), Laravel Pint (code style)

**Frontend**: React 18, TypeScript, Vite 5, React Router 6, Zustand, Tailwind CSS, Axios, vite-plugin-pwa, Vitest + Testing Library, ESLint + Prettier

**DevOps**: Docker Compose, GitHub Actions, Fly.io, Turborepo (npm workspaces)

## Struktur proyek

```
xau-market-pro/
├── backend/            # Laravel API
│   ├── app/            # Models, Controllers, Services, Jobs, Events, Middleware
│   ├── database/       # migrations, seeders, factories
│   ├── routes/         # api.php, console.php (jadwal scheduler)
│   └── tests/
├── frontend/           # React SPA
│   └── src/            # pages, components, hooks, stores, api, locales
├── contracts/          # tipe TypeScript bersama
├── docker/             # Dockerfile PHP, konfigurasi Nginx, entrypoint
├── .github/workflows/  # ci.yml, deploy.yml, release.yml
└── docker-compose.yml
```

## Menjalankan aplikasi

### Opsi A: Docker

Prasyarat: Docker dan Docker Compose.

```bash
git clone https://github.com/anoiumbys/xau-market-pro.git
cd xau-market-pro

docker compose up -d --build

docker compose exec app composer install
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed

# queue dan scheduler dimulai sebelum dependency terpasang, restart setelah composer install
docker compose restart queue scheduler
```

Buka:

- Frontend: http://localhost:3000 (container frontend menjalankan `npm install` sendiri saat pertama kali, tunggu beberapa saat)
- API: http://localhost:8000/api

### Opsi B: Lokal tanpa Docker (SQLite)

Prasyarat: PHP 8.2+, Composer, Node.js 20+.

```bash
git clone https://github.com/anoiumbys/xau-market-pro.git
cd xau-market-pro/backend

composer install
cp .env.example .env
php artisan key:generate
```

Edit `backend/.env` agar tidak membutuhkan MySQL dan Redis:

```env
DB_CONNECTION=sqlite
# hapus atau komentari: DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
CACHE_STORE=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
```

Buat file database kosong lalu migrasi:

```bash
# Linux / macOS / Git Bash
touch database/database.sqlite
# PowerShell
# New-Item database/database.sqlite -ItemType File

php artisan migrate --seed
```

Jalankan tiga proses di terminal terpisah:

```bash
# 1. API (http://localhost:8000)
cd backend && php artisan serve

# 2. Scheduler (tutup otomatis SL/TP dan cek price alert tiap menit)
cd backend && php artisan schedule:work

# 3. Frontend (http://localhost:3000)
cd frontend && cp .env.example .env && npm install && npm run dev
```

Variabel frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8000/api
VITE_TRADINGVIEW_SYMBOL=XAUUSD
```

## Akun demo

Dibuat oleh `php artisan migrate --seed`. Khusus untuk pengembangan dan penilaian, jangan dipakai di lingkungan produksi.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@xaupro.test` | `password123` |
| Trader | `trader@xaupro.test` | `password123` |
| Guest | `guest@xaupro.test` | `password123` |

Panel admin ada di `/admin` (login sebagai admin).

## Pengujian

```bash
# Frontend (Vitest, 34 tes: util, komponen UI, store, i18n)
cd frontend
npm run test -- --run

# Backend
cd backend
php artisan test
```

Tes frontend mencakup fungsi format dan helper warna, komponen `Button` dan `Badge`, store UI (sidebar, toast, tema), hook terjemahan, serta pemeriksaan bahwa ketiga file bahasa memiliki kunci yang lengkap.

Kualitas kode otomatis dicek oleh CI: Laravel Pint (backend), ESLint, `tsc` dan Prettier (frontend).

## CI/CD

- `ci.yml`: berjalan di setiap push dan pull request ke `main` / `develop`. Isinya Pint, tes backend, ESLint + TypeScript + Prettier, tes frontend, build frontend, build image Docker, dan audit keamanan.
- `deploy.yml`: template deploy via SSH, dijalankan manual (`workflow_dispatch`) dan membutuhkan secrets server.
- `release.yml`: membuat rilis saat tag `v*` di-push atau dijalankan manual.

<!--
## Tampilan aplikasi

Hapus tanda komentar bagian ini setelah file gambar ditambahkan ke docs/screenshots/

| Dashboard | Chart |
| --- | --- |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Chart](docs/screenshots/chart.png) |

| Jurnal | Panel admin |
| --- | --- |
| ![Jurnal](docs/screenshots/journal.png) | ![Admin](docs/screenshots/admin.png) |
-->

## Lisensi

[MIT](LICENSE) © 2026 Firgiawan Zhaliam
