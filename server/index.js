import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cookieParser from 'cookie-parser';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variables

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// In-memory database (for demo purposes)
const users = [
  {
    id: '1',
    username: 'admin',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'administrator'
  },
  {
    id: '2',
    username: 'editor',
    password: bcrypt.hashSync('Editor@123', 10),
    role: 'editor'
  },
  {
    id: '3',
    username: 'viewer',
    password: bcrypt.hashSync('Viewer@123', 10),
    role: 'viewer'
  }
];

// Password validation middleware
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres.');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe incluir al menos una letra mayúscula.');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe incluir al menos una letra minúscula.');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número.');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe tener al menos un carácter especial.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const roleHierarchy = {
      'administrator': 3,
      'editor': 2,
      'viewer': 1
    };
    
    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    
    // Check if the user's role is included in the allowed roles
    const hasRequiredRole = roles.some(role => {
      const requiredRoleLevel = roleHierarchy[role] || 0;
      return userRoleLevel >= requiredRoleLevel;
    });
    
    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user
  const user = users.find(u => u.username === username);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  
  // Create token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // Return user info and token
  res.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    },
    token
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, role = 'viewer' } = req.body;
  
  // Check if username already exists
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  // Validate password
  const validation = validatePassword(password);
  if (!validation.isValid) {
    return res.status(400).json({ 
      message: 'Password does not meet requirements',
      errors: validation.errors
    });
  }
  
  // Create new user
  const newUser = {
    id: (users.length + 1).toString(),
    username,
    password: bcrypt.hashSync(password, 10),
    role
  };
  
  users.push(newUser);
  
  // Create token
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // Return user info and token
  res.status(201).json({
    user: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    },
    token
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// Protected routes examples
app.get('/api/resources', authenticateToken, (req, res) => {
  // All authenticated users can access this
  res.json({ message: 'Public resources', data: ['resource1', 'resource2'] });
});

app.get('/api/resources/edit', authenticateToken, authorize(['editor', 'administrator']), (req, res) => {
  // Only editors and admins can access this
  res.json({ message: 'Edit resources', data: ['edit1', 'edit2'] });
});

app.get('/api/admin', authenticateToken, authorize(['administrator']), (req, res) => {
  // Only admins can access this
  res.json({ message: 'Admin resources', data: ['admin1', 'admin2'] });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Error handling for server shutdown
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server shutting down');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server shutting down');
    process.exit(0);
  });
});

export default app;