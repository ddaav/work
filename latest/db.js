import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);

export const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      "firstName" VARCHAR(255) NOT NULL,
      "lastName" VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log('Users table structure ensured.');

    // Add isAdmin column if it doesn't exist
    try {
      await pool.query('ALTER TABLE users ADD COLUMN "isAdmin" BOOLEAN DEFAULT FALSE');
      console.log('Added isAdmin column to users table.');
    } catch (e) {
      if (e.code !== '42701') { // ignore duplicate column error
        throw e;
      }
    }
    
    await createDefaultAdmin();
  } catch (err) {
    console.error('Error in createUsersTable:', err);
    throw err;
  }
};

export const createDefaultAdmin = async () => {
    try {
      const adminEmail = 'admin@gmail.com';
  
      // Check if admin user already exists
      const { rows } = await query("SELECT * FROM users WHERE email = $1", [adminEmail]);
  
      if (rows.length === 0) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        await query(
          'INSERT INTO users ("firstName", "lastName", email, password, "isAdmin") VALUES ($1, $2, $3, $4, $5)',
          ['Admin', 'User', adminEmail, hashedPassword, true]
        );
        console.log('Default admin user created.');
      } else {
        console.log('Admin user already exists. Skipping creation.');
      }
    } catch (err) {
      console.error('Error creating default admin user:', err);
      throw err;
    }
  };
  

export const createFurnitureTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS furniture (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      image VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log('Furniture table created or already exists.');
  } catch (err) {
    console.error('Error creating furniture table:', err);
    throw err;
  }
}; 