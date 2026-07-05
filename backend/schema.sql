-- Database Schema for Waste Management System

-- Users table (Citizens, Collection Staff, Admins)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'citizen', -- 'citizen', 'staff', 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Waste Collections table (Logged by collection staff)
CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id INTEGER NOT NULL,
  ward_no VARCHAR(50) NOT NULL,
  waste_type VARCHAR(50) NOT NULL, -- 'wet', 'dry', 'hazardous', 'mixed'
  weight_kg DECIMAL(10,2) NOT NULL,
  segregated_correctly INT DEFAULT 1, -- 1 = Yes, 0 = No
  photo_url VARCHAR(255),
  notes TEXT,
  collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES users(id)
);

-- Citizen Issues table (Logged by citizens)
CREATE TABLE IF NOT EXISTS issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  citizen_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'resolved'
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (citizen_id) REFERENCES users(id)
);

-- Notifications & Schedules table (System alerts / awareness schedules)
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_role VARCHAR(50) DEFAULT 'all', -- 'all', 'citizen', 'staff'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
