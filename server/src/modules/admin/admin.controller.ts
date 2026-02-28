import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';

export class AdminController {
  private service = new AdminService();

  // Users

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.service.getAllUsers();
      res.json({ users });
    } catch (err) {
      next(err);
    }
  };

  updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const targetUserId = Number(req.params.id);
      const { role } = req.body;
      const result = await this.service.updateUserRole(targetUserId, role, req.userId!);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const targetUserId = Number(req.params.id);
      const result = await this.service.deleteUser(targetUserId, req.userId!);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // Events

  getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const events = await this.service.getAllEvents();
      res.json({ events });
    } catch (err) {
      next(err);
    }
  };

  deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = Number(req.params.id);
      const result = await this.service.deleteEvent(eventId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
