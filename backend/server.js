import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db, { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Express Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if not exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer Config for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Authenticate Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Check role middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

// ==========================================
// Authentication Routes
// ==========================================

// Register
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email address already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Set default role to citizen if not provided or invalid
    const assignedRole = ['citizen', 'staff', 'admin'].includes(role) ? role : 'citizen';
    
    const result = await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, assignedRole]
    );
    
    // Generate JWT
    const token = jwt.sign({ id: result.id, name, email, role: assignedRole }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      token,
      user: { id: result.id, name, email, role: assignedRole }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Registration failed due to server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed due to server error' });
  }
});

// Get current user details
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user details' });
  }
});

// ==========================================
// Waste Collection Routes
// ==========================================

// Get collections
app.get('/api/collections', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT c.*, u.name as staff_name 
      FROM collections c 
      JOIN users u ON c.staff_id = u.id 
    `;
    let params = [];
    
    if (req.user.role === 'staff') {
      // Staff only sees their own logs
      query += ' WHERE c.staff_id = ? ';
      params.push(req.user.id);
    }
    
    query += ' ORDER BY c.collected_at DESC ';
    
    const collections = await db.all(query, params);
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving collection logs' });
  }
});

// Log waste collection (Staff only)
app.post('/api/collections', authenticateToken, requireRole(['staff']), upload.single('photo'), async (req, res) => {
  try {
    const { ward_no, waste_type, weight_kg, segregated_correctly, notes } = req.body;
    
    if (!ward_no || !waste_type || !weight_kg) {
      return res.status(400).json({ message: 'Ward number, waste type, and weight are required' });
    }
    
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const isSegregated = parseInt(segregated_correctly) || 0;
    
    const result = await db.run(
      'INSERT INTO collections (staff_id, ward_no, waste_type, weight_kg, segregated_correctly, photo_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, ward_no, waste_type, parseFloat(weight_kg), isSegregated, photoUrl, notes || '']
    );
    
    res.status(201).json({
      message: 'Waste collection logged successfully',
      collectionId: result.id
    });
  } catch (err) {
    console.error('Error logging collection:', err);
    res.status(500).json({ message: 'Failed to record collection log' });
  }
});

// ==========================================
// Citizen Report / Issue Routes
// ==========================================

// Get issues
app.get('/api/issues', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT i.*, u.name as citizen_name 
      FROM issues i 
      JOIN users u ON i.citizen_id = u.id 
    `;
    let params = [];
    
    if (req.user.role === 'citizen') {
      query += ' WHERE i.citizen_id = ? ';
      params.push(req.user.id);
    }
    
    query += ' ORDER BY i.created_at DESC ';
    
    const issues = await db.all(query, params);
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving issues' });
  }
});

// File new issue (Citizen only)
app.post('/api/issues', authenticateToken, requireRole(['citizen']), upload.single('photo'), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await db.run(
      'INSERT INTO issues (citizen_id, title, description, photo_url) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description, photoUrl]
    );
    
    res.status(201).json({
      message: 'Issue reported successfully',
      issueId: result.id
    });
  } catch (err) {
    console.error('Error reporting issue:', err);
    res.status(500).json({ message: 'Failed to submit issue report' });
  }
});

// Resolve issue (Admin only)
app.put('/api/issues/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    await db.run('UPDATE issues SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Issue status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update issue status' });
  }
});

// ==========================================
// Notifications & Schedule Routes
// ==========================================

// Get notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const role = req.query.role || 'all';
    let query = 'SELECT * FROM notifications ';
    let params = [];
    
    if (role !== 'all') {
      query += ' WHERE target_role = "all" OR target_role = ? ';
      params.push(role);
    }
    
    query += ' ORDER BY created_at DESC ';
    
    const notifications = await db.all(query, params);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Post notification (Admin only)
app.post('/api/notifications', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { title, message, target_role } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    
    const target = ['all', 'citizen', 'staff'].includes(target_role) ? target_role : 'all';
    
    const result = await db.run(
      'INSERT INTO notifications (title, message, target_role) VALUES (?, ?, ?)',
      [title, message, target]
    );
    
    res.status(201).json({
      message: 'Notification posted successfully',
      notificationId: result.id
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

// ==========================================
// Admin Dashboard Stats Route
// ==========================================
app.get('/api/dashboard/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // 1. Total waste collected by category
    const categoryStats = await db.all(
      'SELECT waste_type, SUM(weight_kg) as total_weight FROM collections GROUP BY waste_type'
    );
    
    // 2. Compliance summary
    const complianceStats = await db.get(
      `SELECT 
        COUNT(*) as total_collections,
        SUM(CASE WHEN segregated_correctly = 1 THEN 1 ELSE 0 END) as compliant_collections
       FROM collections`
    );
    
    const complianceRate = complianceStats.total_collections > 0 
      ? Math.round((complianceStats.compliant_collections / complianceStats.total_collections) * 100)
      : 100;
      
    // 3. Ward wise statistics
    const wardStats = await db.all(
      `SELECT 
        ward_no, 
        SUM(weight_kg) as total_weight,
        ROUND((SUM(CASE WHEN segregated_correctly = 1 THEN 1.0 ELSE 0 END) / COUNT(*)) * 100, 1) as compliance_percentage
       FROM collections 
       GROUP BY ward_no`
    );
    
    // 4. Monthly/daily trends
    // Grouping by date in SQL (SQLite compatible `strftime` or MySQL `DATE`)
    let trendQuery = '';
    if (process.env.DB_TYPE === 'mysql') {
      trendQuery = `
        SELECT DATE(collected_at) as date_label, SUM(weight_kg) as total_weight
        FROM collections 
        GROUP BY DATE(collected_at)
        ORDER BY date_label ASC LIMIT 14
      `;
    } else {
      trendQuery = `
        SELECT strftime('%Y-%m-%d', collected_at) as date_label, SUM(weight_kg) as total_weight
        FROM collections 
        GROUP BY date_label
        ORDER BY date_label ASC LIMIT 14
      `;
    }
    const trendStats = await db.all(trendQuery);

    // 5. Total pending issues
    const pendingIssues = await db.get('SELECT COUNT(*) as count FROM issues WHERE status = "pending"');
    
    // 6. Recent collections
    const recentCollections = await db.all(
      `SELECT c.*, u.name as staff_name
       FROM collections c 
       JOIN users u ON c.staff_id = u.id 
       ORDER BY c.collected_at DESC LIMIT 5`
    );

    res.json({
      complianceRate,
      pendingIssuesCount: pendingIssues ? pendingIssues.count : 0,
      categoryStats,
      wardStats,
      trendStats,
      recentCollections
    });
  } catch (err) {
    console.error('Error generating dashboard stats:', err);
    res.status(500).json({ message: 'Error retrieving statistics' });
  }
});

// Launch server after database initialization
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Waste Management API Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Server startup failed because of database error:', err);
});
