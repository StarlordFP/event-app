import { Request, Response, NextFunction } from 'express';
import { TagsService } from './tags.service.js';

export class TagsController {
  private service = new TagsService();

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tags = await this.service.list();
      res.json({ tags });
    } catch (err) {
      next(err);
    }
  };
}
