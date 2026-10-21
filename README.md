# XAU Market Pro 🥇

> Professional Gold (XAU/USD) Market Analysis Platform with Real-time Data, Price Alerts, and Trade Journaling

[![CI Pipeline](https://github.com/anoiumbys/xau-market-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/anoiumbys/xau-market-pro/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 About

XAU Market Pro is a comprehensive platform for gold market traders and analysts, providing real-time market data visualization, customizable price alerts, trade journaling, and detailed reporting capabilities. Built with a modern tech stack for performance and scalability.

## ✨ Features

### Core Features
- 📊 **Real-time Market Data** - Live gold price tracking with WebSocket integration
- 📈 **Advanced Charting** - TradingView integration for professional technical analysis
- 🔔 **Price Alerts** - Customizable notifications for price movements
- 📝 **Trade Journal** - Track and analyze your trading performance
- 📊 **Reports & Analytics** - Comprehensive trading reports and insights
- 💼 **Subscription Management** - Flexible tier-based access control
- 🛡️ **Admin Panel** - Complete administrative dashboard

### Technical Features
- ⚡ Real-time updates via WebSockets
- 🔐 Secure authentication with Laravel Sanctum
- 📱 Progressive Web App (PWA) support
- 🐳 Docker containerization for easy deployment
- 🔄 CI/CD pipeline with GitHub Actions
- 📚 OpenAPI documentation

## 🏗️ Architecture

This is a monorepo project using Turborepo, consisting of:

- **Backend** - Laravel 11 API with WebSocket support
- **Frontend** - React 18 + TypeScript + Vite
- **Contracts** - Shared type definitions and OpenAPI specs

### Tech Stack

#### Backend
- PHP 8.2+
- Laravel 11
- MySQL 8.0+
- Redis (for caching & queues)
- Laravel WebSockets (beyondcode/laravel-websockets)
- Laravel Sanctum (authentication)

#### Frontend
- React 18
- TypeScript
- Vite
- Zustand (state management)
- Tailwind CSS
- TradingView Charting Library
- Axios

#### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Turborepo (monorepo management)
- Nginx

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose (recommended)
- **OR** Node.js 20+ and PHP 8.2+ (for local development)
- Git

### Option A: Docker Setup (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/anoiumbys/xau-market-pro.git
cd xau-market-pro
```

2. **Start with Docker Compose**
```bash
# Build and start all services
docker-compose up -d --build

# Install backend dependencies
docker-compose exec app composer install

# Setup environment
docker-compose exec app cp .env.example .env
docker-compose exec app php artisan key:generate

# Run migrations and seeders
docker-compose exec app php artisan migrate --seed

# Install frontend dependencies
docker-compose exec frontend npm install
```

3. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:8000/api
- WebSockets: ws://localhost:6001
- API Documentation: http://localhost:8000/api/documentation

### Option B: Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/anoiumbys/xau-market-pro.git
cd xau-market-pro
```

2. **Backend Setup**
```bash
cd backend

# Install PHP dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env file
# Then run migrations
php artisan migrate --seed
```

3. **Frontend Setup**
```bash
cd ../frontend

# Install Node dependencies
npm install

# Setup environment
cp .env.example .env
```

4. **Start Development Servers**

Open 3 terminal windows:

```bash
# Terminal 1 - Laravel API
cd backend
php artisan serve

# Terminal 2 - WebSocket Server
cd backend
php artisan websockets:serve

# Terminal 3 - Frontend Dev Server
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- API: http://localhost:8000/api
- WebSockets: ws://localhost:6001

## 📦 Project Structure

```
xau-market-pro/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Events/
│   │   └── Jobs/
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/
│   └── routes/
├── frontend/            # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   └── public/
├── contracts/           # Shared types
│   └── types/
├── docker/             # Docker configs
├── .github/            # GitHub Actions
└── docs/              # Documentation
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
APP_NAME="XAU Market Pro"
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=xau_market_pro
DB_USERNAME=root
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PORT=6379

BROADCAST_DRIVER=pusher
PUSHER_APP_ID=local
PUSHER_APP_KEY=local
PUSHER_APP_SECRET=local
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_HOST=localhost
VITE_WS_PORT=6001
VITE_WS_SECURE=false
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test

# With coverage
php artisan test --coverage
```

### Frontend Tests
```bash
cd frontend
npm run test

# With coverage
npm run test -- --coverage
```

### Run All Tests
```bash
# From root directory
npm run test
```

## 📝 API Documentation

API documentation is available via Swagger UI:
- Local: http://localhost:8000/api/documentation
- The API follows RESTful conventions
- Authentication via Bearer tokens (Laravel Sanctum)

## 🔐 Authentication

The platform uses Laravel Sanctum for API authentication:

1. **Register**: `POST /api/register`
2. **Login**: `POST /api/login` - Returns Bearer token
3. **Use token**: Include in headers: `Authorization: Bearer {token}`
4. **Logout**: `POST /api/logout`

## 📊 Database Schema

Key tables:
- `users` - User accounts and profiles
- `markets` - Market data and configurations
- `subscriptions` - User subscription tiers
- `price_alerts` - User-defined price alerts
- `trade_journals` - Trading activity records
- `market_parameters` - Technical indicators
- `audit_logs` - System audit trail

## 🚢 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Optimize backend
cd ../backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Backend: Laravel Pint for code style
- Frontend: ESLint + Prettier
- Run `npm run lint` before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **anoiumbys** - *Initial work* - [GitHub](https://github.com/anoiumbys)

## 🙏 Acknowledgments

- TradingView for charting library
- Laravel & React communities
- All contributors and supporters

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Note**: This project is in active development. Features and documentation are subject to change.

**Last Updated**: October 2026
