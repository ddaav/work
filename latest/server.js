import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, createUsersTable, createDefaultAdmin, createFurnitureTable } from './db.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB
createUsersTable().then(() => {
    createDefaultAdmin();
    createFurnitureTable();
});

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const { rows: existingUsers } = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { rows: newUsers } = await query(
      'INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, email, hashedPassword]
    );
    const user = newUsers[0];

    // Create token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
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
        const { rows } = await query('SELECT * FROM users WHERE id = $1 AND isAdmin = true', [decoded.userId]);
        const user = rows[0];

        if (!user) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ message: 'Welcome to the admin dashboard' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await query('SELECT id, firstName, lastName, email FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

app.post('/api/furniture', async (req, res) => {
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

app.put('/api/furniture/:id', async (req, res) => {
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

app.delete('/api/furniture/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM furniture WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

const startServer = async () => {
  try {
    await createUsersTable();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  }
};

startServer(); 