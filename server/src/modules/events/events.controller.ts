import { Request, Response, NextFunction } from 'express';
import { EventsService } from './events.service';
import { paginated } from '../../shared/response';
import { EventQuerySchema } from '../events/events.schema';


export class EventsController {
  private service = new EventsService();

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = EventQuerySchema.parse(req.query); // Zod handles defaults + coercion
      
      const result = await this.service.list(query, req.userId);
      
      res.json(
        paginated(result.data, {
          page: query.page,
          limit: query.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / query.limit),
        })
      );
    } catch (err) {
      next(err);
    }
  };


  getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const event = await this.service.getById(id, req.userId);
      res.json(event);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const event = await this.service.create(req.body, req.userId!);
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const event = await this.service.update(id, req.body, req.userId!);
      res.json(event);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.delete(Number(req.params.id), req.userId!);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
