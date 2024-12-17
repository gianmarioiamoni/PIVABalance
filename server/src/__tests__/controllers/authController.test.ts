import request from 'supertest';
import { Express } from 'express';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { app } from '../../server';

describe('Auth Controller', () => {
  describe('User Registration (POST /api/auth/register)', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should not register user with existing email', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      await request(app).post('/api/auth/register').send(userData);

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already registered');
    });

    it('should not register user with invalid data', async () => {
      // Arrange
      const invalidUserData = {
        email: '',
        password: '',
        name: '',
      };

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUserData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed');
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('User Login (POST /api/auth/login)', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(userData);
    });

    it('should login successfully with correct credentials', async () => {
      // Arrange
      const loginData = {
        email: userData.email,
        password: userData.password,
      };

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should fail to login with incorrect password', async () => {
      // Arrange
      const invalidLoginData = {
        email: userData.email,
        password: 'wrongpassword',
      };

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidLoginData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail to login with non-existent email', async () => {
      // Arrange
      const nonExistentUser = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(nonExistentUser);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('Get Current User (GET /api/auth/me)', () => {
    let authToken: string;
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);
      authToken = registerResponse.body.token;
    });

    it('should get current user with valid token', async () => {
      // Act
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.password).toBeUndefined();
    });

    it('should fail with invalid token', async () => {
      // Arrange
      const invalidToken = 'invalid-token';

      // Act
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${invalidToken}`);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Please authenticate');
    });

    it('should fail with missing token', async () => {
      // Act
      const response = await request(app).get('/api/auth/me');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication token missing');
    });
  });

  describe('User Logout (POST /api/auth/logout)', () => {
    let authToken: string;

    beforeEach(async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);
      authToken = registerResponse.body.token;
    });

    it('should successfully logout user', async () => {
      // Act
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');

      // Wait a bit for token invalidation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify token is invalidated
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);
      expect(meResponse.status).toBe(401);
      expect(meResponse.body.message).toBe('Please authenticate');
    });

    it('should handle logout without token', async () => {
      // Act
      const response = await request(app).post('/api/auth/logout');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});
