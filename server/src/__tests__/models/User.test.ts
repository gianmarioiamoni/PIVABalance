import mongoose from 'mongoose';
import { User } from '../../models/User';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const validUserData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Act
      const user = await User.create(validUserData);

      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe(validUserData.email);
      expect(user.name).toBe(validUserData.name);
      expect(user.password).not.toBe(validUserData.password); // Password should be hashed
    });

    it('should fail when creating user with invalid email format', async () => {
      // Arrange
      const invalidUserData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      // Act & Assert
      await expect(async () => {
        const user = new User(invalidUserData);
        await user.validate();
      }).rejects.toThrow();
    });

    it('should fail when creating user without required fields', async () => {
      // Arrange
      const invalidUserData = {
        email: '',
        password: '',
        name: '',
      };

      try {
        // Act
        await User.create(invalidUserData);
        fail('Should have thrown validation error');
      } catch (error: any) {
        // Assert
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
      }
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      // Arrange
      const password = 'testpassword123';
      const userData = {
        email: 'test@example.com',
        password,
        name: 'Test User',
      };

      // Act
      const user = await User.create(userData);

      // Assert
      expect(user.password).not.toBe(password);
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });
  });

  describe('Email Uniqueness', () => {
    it('should not allow duplicate emails', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Act
      await User.create(userData);

      try {
        await User.create(userData);
        fail('Should have thrown duplicate key error');
      } catch (error: any) {
        // Assert
        expect(error).toBeDefined();
        expect(error.code).toBe(11000); // MongoDB duplicate key error code
      }
    });
  });
});
