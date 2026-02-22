import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../configs/db.js';
import type { SignupBody, LoginBody, User } from '../types/index.js';
import { createError } from '../middleware/errorHandler.js';
import type { SignOptions } from 'jsonwebtoken';

export const signup = async (
  req: Request<{}, {}, SignupBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existing = await db<User>('users').where({ email }).first();
    if (existing) {
      return next(createError('Email already in use', 409));
    }

    const password_hash = await bcrypt.hash(password, 12);
    const [id] = await db<User>('users').insert({ name, email, password_hash });

    const signOptions: SignOptions = { expiresIn: '7d' };

    const token = jwt.sign(
    { id, name, email },
    process.env.JWT_SECRET as string,
    signOptions
    );


    res.status(201).json({ token, user: { id, name, email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await db<User>('users').where({ email }).first();
    if (!user) {
      return next(createError('Invalid credentials', 401));
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return next(createError('Invalid credentials', 401));
    }

    const signOptions: SignOptions = { expiresIn: '7d' };

    const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET as string,
    signOptions
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as any;
    const user = await db<User>('users')
      .select('id', 'name', 'email', 'created_at')
      .where({ id: authReq.user.id })
      .first();

    if (!user) return next(createError('User not found', 404));
    res.json(user);
  } catch (err) {
    next(err);
  }
};