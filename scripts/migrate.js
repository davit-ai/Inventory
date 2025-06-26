import pkg from 'pg';
const { Client } = pkg;
require('dotenv').config();
// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'inventory_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
};

async function createDatabase() {
  // First connect to postgres database to create our inventory database
  const adminClient = new Client({
    ...config,
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await adminClient.connect();

    // Check if database exists
    const dbExists = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.database]
    );

    if (dbExists.rows.length === 0) {
      console.log(`Creating database: ${config.database}`);
      await adminClient.query(`CREATE DATABASE ${config.database}`);
      console.log('Database created successfully!');
    } else {
      console.log(`Database ${config.database} already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error.message);
  } finally {
    await adminClient.end();
  }
}

async function runMigrations() {
  const client = new Client(config);

  try {
    await client.connect();
    console.log('Connected to database');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created/verified');

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Categories table created/verified');

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        min_stock_level INTEGER DEFAULT 5,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        sku VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Products table created/verified');

    // Insert default categories if they don't exist
    const categoryCheck = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCheck.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO categories (name, description) VALUES
        ('Electronics', 'Electronic devices and accessories'),
        ('Furniture', 'Office and home furniture'),
        ('Kitchen', 'Kitchen appliances and utensils'),
        ('Books', 'Books and educational materials'),
        ('Clothing', 'Apparel and accessories')
      `);
      console.log('Default categories inserted');
    }

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log('Indexes created/verified');

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('Starting database setup...');
  await createDatabase();
  await runMigrations();
  console.log('Database setup completed!');
}

main().catch(console.error);
