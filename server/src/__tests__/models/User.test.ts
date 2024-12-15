import { User } from '../../models/User';
import mongoose from 'mongoose';

describe('User Model Test', () => {
  const validUserData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  it('should create & save user successfully', async () => {
    const validUser = new User(validUserData);
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUserData.email);
    expect(savedUser.name).toBe(validUserData.name);
    expect(savedUser.password).not.toBe(validUserData.password); // Password should be hashed
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({ email: 'test@example.com' });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should correctly compare passwords', async () => {
    const user = new User(validUserData);
    await user.save();
    
    const isMatch = await user.comparePassword(validUserData.password);
    expect(isMatch).toBe(true);
    
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
});
