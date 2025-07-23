import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, createUsersTable, createDefaultAdmin, createFurnitureTable } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Check if user already exists
    const { rows: existingUsers } = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await query(
      'INSERT INTO users ("firstName", "lastName", email, password) VALUES ($1, $2, $3, $4) RETURNING id, "firstName", "lastName", email, "isAdmin"',
      [firstName, lastName, email, hashedPassword]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id, isAdmin: newUser.rows[0].isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { rows } = await query('SELECT * FROM users WHERE id = $1 AND "isAdmin" = true', [decoded.userId]);
        const user = rows[0];

        if (!user) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ message: 'Welcome to the admin dashboard' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // The query to the database is removed to keep the verification lightweight.
    // The user object from the token is returned.
    // If a full user object is needed, the client should make a separate request.
    res.json({ user: decoded });

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('A token is required for authentication');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send('Access denied. Admins only.');
  }
};

// User management routes
app.get('/api/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const { rows } = await query('SELECT id, "firstName", "lastName", email, "isAdmin" FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.delete('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, isAdmin: newIsAdmin } = req.body;
    const { rows } = await query(
      'UPDATE users SET "firstName" = $1, "lastName" = $2, "isAdmin" = $3 WHERE id = $4 RETURNING id, "firstName", "lastName", email, "isAdmin"',
      [firstName, lastName, newIsAdmin, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/furniture', async (req, res) => {
    try {
        const { rows } = await query('SELECT * FROM furniture');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/furniture', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, price, image, category } = req.body;
        const { rows } = await query(
            'INSERT INTO furniture (name, price, image, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, price, image, category]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/furniture/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, image, category } = req.body;
        const { rows } = await query(
            'UPDATE furniture SET name = $1, price = $2, image = $3, category = $4 WHERE id = $5 RETURNING *',
            [name, price, image, category, id]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/furniture/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM furniture WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/furniture/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await query('SELECT * FROM furniture WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

const startServer = async () => {
  try {
    await createUsersTable();
    await createDefaultAdmin();
    await createFurnitureTable();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database and start server', err);
    process.exit(1);
  }
};

startServer(); 