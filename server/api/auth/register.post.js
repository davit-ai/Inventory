import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '~/server/utils/database';

export default defineEventHandler(async (event) => {
  try {
    const { email, password, name } = await readBody(event);

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required',
      });
    }
    console.log('Received registration data:', { email, password, name });

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long',
      });
    }
    console.log('Password validation passed');

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [
      email,
    ]);

    console.log('Existing user check:', existingUser.rows.length);

    if (existingUser.rows.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User already exists with this email',
      });
    }

    console.log('No existing user found, proceeding with registration');

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name || null]
    );

    console.log('User created successfully:', result.rows[0]);

    const user = result.rows[0];

    // Generate JWT token
    const config = useRuntimeConfig();
    if (!config.jwtSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'JWT secret is not configured',
      });
    }
    console.log('JWT secret found, generating token');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    console.log('JWT token generated successfully');

    // Set HTTP-only cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log('HTTP-only cookie set successfully');

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
    console.log('Registration successful');
  } catch (error) {
    console.error('Registration error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Registration failed',
    });
  }
});
