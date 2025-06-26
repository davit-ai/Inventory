# Inventory Management System

A modern inventory management system built with Nuxt.js and PostgreSQL.

## Features

- **User Authentication**: Secure login and registration system
- **Product Management**: Add, edit, and track products
- **Category Management**: Organize products by categories
- **Stock Tracking**: Monitor inventory levels and low stock alerts
- **Dashboard**: Overview of inventory statistics
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Nuxt.js 3, Vue.js, Tailwind CSS
- **Backend**: Nuxt.js API routes
- **Database**: PostgreSQL
- **Authentication**: JWT with HTTP-only cookies
- **Icons**: Heroicons

## Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- PostgreSQL database server
- npm or yarn package manager

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Database Setup

First, make sure PostgreSQL is running on your system. Then:

1. Create a PostgreSQL database named `inventory_db`
2. Copy the environment variables:

```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
JWT_SECRET=your-very-secure-secret-key-here
```

### 3. Run Database Migrations

```bash
npm run db:migrate
```

This will:
- Create the database if it doesn't exist
- Create all necessary tables (users, categories, products)
- Insert default categories
- Create database indexes

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Hashed password
- `name` - User's full name (optional)
- `created_at`, `updated_at` - Timestamps

### Categories Table
- `id` - Primary key
- `name` - Category name (unique)
- `description` - Category description
- `created_at`, `updated_at` - Timestamps

### Products Table
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price (decimal)
- `stock_quantity` - Current stock level
- `min_stock_level` - Minimum stock threshold
- `category_id` - Foreign key to categories
- `sku` - Stock Keeping Unit (unique)
- `created_at`, `updated_at` - Timestamps

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product

### Categories
- `GET /api/categories` - Get all categories

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Usage

1. **Registration/Login**: Create an account or sign in
2. **Dashboard**: View inventory overview and statistics
3. **Add Products**: Navigate to Products → Add Product
4. **Manage Categories**: View and organize product categories
5. **Monitor Stock**: Track inventory levels and low stock alerts

## Learning PostgreSQL with this Project

This project is perfect for learning PostgreSQL because it demonstrates:

1. **Database Design**: Proper table relationships and constraints
2. **CRUD Operations**: Create, Read, Update, Delete operations
3. **Joins**: Connecting related data across tables
4. **Aggregations**: Calculating statistics and summaries
5. **Indexes**: Optimizing query performance
6. **Migrations**: Managing database schema changes

## Production Deployment

For production deployment:

1. Set up a PostgreSQL database (AWS RDS, DigitalOcean, etc.)
2. Update environment variables with production database credentials
3. Set `NODE_ENV=production`
4. Use a strong JWT secret
5. Enable SSL for database connections
6. Run migrations on production database

```bash
npm run build
npm run preview
```

## Contributing

Feel free to contribute to this project by:
- Adding new features
- Improving the UI/UX
- Optimizing database queries
- Adding tests
- Improving documentation

## License

This project is open source and available under the MIT License.