import type { Request, Response, NextFunction } from 'express';
import db from '../configs/db.js';
import type { Tag } from '../types/index.js';

export const listTags = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tags = await db<Tag>('tags').select('*').orderBy('name');
    res.json(tags);
  } catch (err) {
    next(err);
  }
};