import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';
import { UserModel } from '../db/user-models';
import { User, AuthResponse } from '../types';
import { generateToken } from '../middleware/auth';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

export class AuthService {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = nanoid();
    const user = await UserModel.create({
      userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    });

    // Generate token
    const token = generateToken({
      userId: user.userId,
      email: user.email,
      name: user.name
    });

    return {
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin || undefined,
        isActive: user.isActive
      }
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user.userId,
      email: user.email,
      name: user.name
    });

    return {
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin || undefined,
        isActive: user.isActive
      }
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await UserModel.findOne({ userId });
    if (!user) return null;

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin || undefined,
      isActive: user.isActive
    };
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await UserModel.findOne({ userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid current password');
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async deactivateAccount(userId: string): Promise<void> {
    const user = await UserModel.findOne({ userId });
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    await user.save();
  }
}
