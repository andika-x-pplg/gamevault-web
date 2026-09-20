# 🎮 GameVault

<p align="center">
  <strong>Discover, save, and download free & legally distributed PC games.</strong>
</p>

<p align="center">
  GameVault is a full-stack web application built with React and Laravel that provides a modern platform for discovering free-to-play, freeware, open-source, and demo PC games.
</p>

---

## ✨ About GameVault

**GameVault** is a game discovery and distribution platform inspired by modern game storefront experiences.

Users can explore games, search and filter the catalog, save games to their personal library or wishlist, and access legal download sources.

GameVault is designed to support legitimate game distribution only. Direct downloads are intended only for files that are officially authorized for distribution, while games distributed through external platforms are linked to their official sources.

---

## 🚀 Features

### 🎮 Game Discovery

- Browse available games
- Featured games
- Trending games
- Popular downloads
- New releases
- Browse by category
- Search games
- Filter and sort games
- Similar game recommendations
- Detailed game information
- System requirements
- Screenshots

### 👤 Authentication

- User registration
- Login & logout
- Persistent authentication session
- Laravel Sanctum authentication
- Protected user routes
- Role-based access
- User and Admin roles

### 📚 My Library

Users can save games into their personal library.

Library data is stored in MySQL and linked to each authenticated account.

### ❤️ Wishlist

Users can save games they are interested in to their personal wishlist.

Wishlist data is synchronized with the authenticated account instead of relying on browser local storage.

### ⬇️ Download System

GameVault supports two distribution methods:

**Direct Download**

For games/files that are officially authorized for direct distribution.

```text
GameVault
   ↓
Download Now
   ↓
Laravel Download System
   ↓
Browser Download
```

**External Official Distribution**

For games distributed through official platforms such as:

- Steam
- Epic Games Store
- itch.io
- GitHub Releases
- Official developer websites

```text
GameVault
   ↓
Get on Official Source
   ↓
Official Distribution Platform
```

GameVault does **not** support cracked games, repacks, torrents, DRM bypasses, or unauthorized game distribution.

### 📊 Download Tracking

The backend can track legitimate download actions including:

- Total downloads
- Recent downloads
- Popular games
- Download statistics
- Direct vs external distribution

### 🛠️ Admin Panel

GameVault includes an Admin Panel for managing platform content.

Admin features include:

- Dashboard
- Game management
- Add game
- Edit game
- Delete game
- Draft / Published status
- Featured games
- Category management
- Download configuration
- Direct / External distribution type
- Download statistics
- User information

---

## 🧰 Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend

- Laravel
- Laravel Sanctum
- REST API

### Database

- MySQL

### Development Tools

- Laragon
- Composer
- Node.js / npm
- Git
- GitHub
- Visual Studio Code

---

## 🏗️ Architecture

```text
┌─────────────────────────────┐
│       React Frontend        │
│    Vite + Tailwind CSS      │
└──────────────┬──────────────┘
               │
             Axios
               │
               ▼
┌─────────────────────────────┐
│       Laravel REST API      │
│       Laravel Sanctum       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│            MySQL            │
│                             │
│ Users                       │
│ Games                       │
│ Categories                  │
│ Library                     │
│ Wishlist                    │
│ Downloads                   │
└─────────────────────────────┘
```

---

## 📂 Project Structure

```text
gamevault/
│
├── src/
│   ├── components/
│   ├── contexts/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── public/
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   └── tests/
│
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd gamevault
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
composer install
```

### 4. Configure Laravel

Create your environment configuration:

```bash
cp .env.example .env
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Configure your MySQL database inside:

```text
backend/.env
```

Example:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gamevault
DB_USERNAME=root
DB_PASSWORD=
```

Then run:

```bash
php artisan migrate --seed
```

---

## ▶️ Running GameVault

GameVault requires both the React frontend and Laravel backend during development.

### Start Laravel Backend

Open a terminal:

```bash
cd backend
php artisan serve
```

Laravel will normally run at:

```text
http://127.0.0.1:8000
```

### Start React Frontend

Open another terminal from the GameVault root:

```bash
npm run dev
```

Vite will normally run at:

```text
http://localhost:5173
```

Keep both terminals running while developing GameVault.

---

## 🔗 API

GameVault uses a Laravel REST API for communication between the frontend and backend.

Examples include:

```text
/api/games
/api/categories
/api/library
/api/wishlist
/api/downloads
/api/admin/...
```

Authentication is handled using **Laravel Sanctum**.

---

## 🔐 Security

GameVault implements several backend protections, including:

- Laravel Sanctum authentication
- Role-based Admin authorization
- Protected Admin API
- Server-side validation
- Per-user Library and Wishlist
- Published/Draft game visibility
- Controlled download destinations
- Database relationship constraints

Sensitive credentials and environment configuration should never be committed to GitHub.

---

## ⚖️ Legal & Distribution Policy

GameVault is intended for **legal game discovery and distribution only**.

Supported content may include:

- Free-to-play games
- Freeware
- Open-source games
- Game demos
- Other games officially authorized for free distribution

GameVault does not support or promote:

- Pirated games
- Cracked games
- Repacks
- Torrents
- Key generators
- DRM bypasses
- Unauthorized mirrors or redistribution

All external game links should point to official developers, authorized storefronts, official repositories, or other legitimate distribution sources.

---

## 🗺️ Development Progress

- [x] React + Vite foundation
- [x] Home page
- [x] Browse & filtering
- [x] Game detail
- [x] Authentication UI
- [x] Library & Wishlist UI
- [x] Admin Panel
- [x] Laravel backend
- [x] MySQL database
- [x] Public REST API
- [x] React ↔ Laravel integration
- [x] Laravel Sanctum authentication
- [x] Admin CRUD
- [x] Database-backed Library
- [x] Database-backed Wishlist
- [x] Download system
- [x] Download tracking

---

## 👨‍💻 Developer

**Andika Esda Saputra**

Flutter Developer & Web Developer from Indonesia.

### Technologies I Work With

`Flutter` • `React` • `Laravel` • `PHP` • `JavaScript` • `Tailwind CSS` • `MySQL`

---

## 📄 License

This project is developed for learning, portfolio, and software development purposes.

Third-party games, artwork, trademarks, and other assets remain the property of their respective owners and are subject to their respective licenses.

---

<p align="center">
  Made with 🎮 by <strong>Andika Esda Saputra</strong>
</p>
