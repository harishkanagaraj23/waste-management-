import sqlite3 from 'sqlite3';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || 'sqlite';
let sqliteDb = null;
let mysqlPool = null;

// Initialize connection
if (DB_TYPE === 'mysql') {
  console.log('Connecting to MySQL database...');
  mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  console.log('Connecting to SQLite database...');
  const dbPath = path.resolve(process.env.SQLITE_DB_PATH || 'database.sqlite');
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('SQLite connection error:', err.message);
  });
}

// Uniform DB interfaces
const db = {
  // Execute a query returning multiple rows
  all: async (sql, params = []) => {
    if (DB_TYPE === 'mysql') {
      const [rows] = await mysqlPool.execute(sql, params);
      return rows;
    } else {
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
  },

  // Get a single row
  get: async (sql, params = []) => {
    if (DB_TYPE === 'mysql') {
      const [rows] = await mysqlPool.execute(sql, params);
      return rows[0] || null;
    } else {
      return new Promise((resolve, reject) => {
        sqliteDb.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row || null);
        });
      });
    }
  },

  // Execute an INSERT/UPDATE/DELETE query
  run: async (sql, params = []) => {
    if (DB_TYPE === 'mysql') {
      const [result] = await mysqlPool.execute(sql, params);
      return {
        id: result.insertId,
        changes: result.affectedRows
      };
    } else {
      return new Promise((resolve, reject) => {
        sqliteDb.run(sql, params, function (err) {
          if (err) reject(err);
          else {
            resolve({
              id: this.lastID,
              changes: this.changes
            });
          }
        });
      });
    }
  }
};

// Initialize database structure (runs schema.sql and seeds initial data)
export async function initDb() {
  try {
    const schemaPath = path.resolve('schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');

    if (DB_TYPE === 'mysql') {
      // Adapt schema file for MySQL
      schemaSql = schemaSql.replace(/AUTOINCREMENT/g, 'AUTO_INCREMENT');
      // Create Database first in MySQL if not exists (runs on separate connection)
      const conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
      });
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\``);
      await conn.end();

      // Split queries and execute
      const queries = schemaSql
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);
      for (const query of queries) {
        await mysqlPool.execute(query);
      }
    } else {
      // SQLite execution
      const queries = schemaSql
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);
      
      for (const query of queries) {
        await new Promise((resolve, reject) => {
          sqliteDb.run(query, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }
    console.log('Database tables verified/created successfully.');

    // Seed default users if users table is empty
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count === 0) {
      console.log('Seeding initial users (admin, staff, citizen)...');
      const passHash = await bcrypt.hash('admin123', 10);
      const staffHash = await bcrypt.hash('staff123', 10);
      const citizenHash = await bcrypt.hash('citizen123', 10);

      await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
        'System Admin', 'admin@waste.com', passHash, 'admin'
      ]);
      await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
        'Collection Staff Alpha', 'staff@waste.com', staffHash, 'staff'
      ]);
      await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
        'John Citizen', 'citizen@waste.com', citizenHash, 'citizen'
      ]);

      // Seed some initial collections
      console.log('Seeding dummy collection logs...');
      const staffRow = await db.get('SELECT id FROM users WHERE role = "staff" LIMIT 1');
      const staffId = staffRow ? staffRow.id : 1;
      
      const collections = [
        [staffId, 'Ward 1', 'wet', 120.5, 1, '2026-07-01 09:15:00'],
        [staffId, 'Ward 1', 'dry', 85.2, 1, '2026-07-01 10:30:00'],
        [staffId, 'Ward 2', 'hazardous', 15.0, 1, '2026-07-02 08:45:00'],
        [staffId, 'Ward 2', 'mixed', 45.8, 0, '2026-07-02 11:20:00'],
        [staffId, 'Ward 3', 'wet', 190.0, 1, '2026-07-03 09:00:00'],
        [staffId, 'Ward 3', 'dry', 110.5, 1, '2026-07-03 10:15:00'],
        [staffId, 'Ward 4', 'mixed', 95.0, 0, '2026-07-04 14:00:00'],
        [staffId, 'Ward 1', 'wet', 140.2, 1, '2026-07-04 15:30:00'],
        [staffId, 'Ward 2', 'dry', 75.3, 1, '2026-07-05 10:00:00'],
        [staffId, 'Ward 3', 'hazardous', 8.5, 1, '2026-07-05 11:45:00']
      ];

      for (const col of collections) {
        await db.run(
          'INSERT INTO collections (staff_id, ward_no, waste_type, weight_kg, segregated_correctly, collected_at) VALUES (?, ?, ?, ?, ?, ?)',
          col
        );
      }

      // Seed some notifications
      console.log('Seeding awareness notifications...');
      await db.run('INSERT INTO notifications (title, message, target_role) VALUES (?, ?, ?)', [
        'Weekly Waste Collection Schedule',
        'Wet waste (biodegradable) will be collected on Monday, Wednesday, and Friday. Dry waste (recyclables) on Tuesday and Thursday. Hazardous waste on the first Saturday of each month.',
        'all'
      ]);
      await db.run('INSERT INTO notifications (title, message, target_role) VALUES (?, ?, ?)', [
        'Segregation Policy Reminder',
        'Please ensure wet, dry, and hazardous waste are sorted before collection. Mixing waste categories creates massive sorting effort and increases environment impact.',
        'citizen'
      ]);
    }
  } catch (err) {
    console.error('Database initialization/seeding failed:', err.message);
  }
}

export default db;
