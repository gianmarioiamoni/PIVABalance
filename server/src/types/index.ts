export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError extends Error {
  statusCode: number;
}

// User related types
export interface IUser {
  _id: string;
  email: string;
  password?: string;
  name: string;
  role: 'user' | 'admin';
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth related types
export interface AuthToken {
  token: string;
  expires: Date;
}
