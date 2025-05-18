import request from 'supertest';
import app from '../index.js';
import jwt from 'jsonwebtoken';

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'Admin@123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.username).toEqual('admin');
      expect(res.body.user.role).toEqual('administrator');
    });
    
    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'NewUser@123',
          role: 'viewer'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.username).toEqual('newuser');
      expect(res.body.user.role).toEqual('viewer');
    });
    
    it('should reject registration with weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'weakuser',
          password: 'weak',
          role: 'viewer'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
    
    it('should reject duplicate usernames', async () => {
      // First register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicateuser',
          password: 'Duplicate@123',
          role: 'viewer'
        });
      
      // Try to register with the same username
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicateuser',
          password: 'Duplicate@123',
          role: 'viewer'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('exists');
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should return user data with valid token', async () => {
      // First login to get a token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'Admin@123'
        });
      
      const token = loginRes.body.token;
      
      // Use the token to get user data
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.username).toEqual('admin');
    });
    
    it('should reject requests without a token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
    });
  });
  
  describe('Authorization', () => {
    let adminToken, editorToken, viewerToken;
    
    beforeAll(async () => {
      // Get tokens for different user roles
      const adminRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'Admin@123' });
      adminToken = adminRes.body.token;
      
      const editorRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'editor', password: 'Editor@123' });
      editorToken = editorRes.body.token;
      
      const viewerRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'viewer', password: 'Viewer@123' });
      viewerToken = viewerRes.body.token;
    });
    
    it('should allow all authenticated users to access public resources', async () => {
      // Admin access
      let res = await request(app)
        .get('/api/resources')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      
      // Editor access
      res = await request(app)
        .get('/api/resources')
        .set('Authorization', `Bearer ${editorToken}`);
      expect(res.statusCode).toEqual(200);
      
      // Viewer access
      res = await request(app)
        .get('/api/resources')
        .set('Authorization', `Bearer ${viewerToken}`);
      expect(res.statusCode).toEqual(200);
    });
    
    it('should restrict editor resources to editors and admins', async () => {
      // Admin access (allowed)
      let res = await request(app)
        .get('/api/resources/edit')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      
      // Editor access (allowed)
      res = await request(app)
        .get('/api/resources/edit')
        .set('Authorization', `Bearer ${editorToken}`);
      expect(res.statusCode).toEqual(200);
      
      // Viewer access (denied)
      res = await request(app)
        .get('/api/resources/edit')
        .set('Authorization', `Bearer ${viewerToken}`);
      expect(res.statusCode).toEqual(403);
    });
    
    it('should restrict admin resources to admins only', async () => {
      // Admin access (allowed)
      let res = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      
      // Editor access (denied)
      res = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${editorToken}`);
      expect(res.statusCode).toEqual(403);
      
      // Viewer access (denied)
      res = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${viewerToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });
});