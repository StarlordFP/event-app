import { AdminRepository } from './admin.repository';
import { NotFoundError, ForbiddenError } from '../../shared/errors';

/**
 * Admin business logic.
 * Only admins can call these — enforced at route level via authorize middleware.
 */
export class AdminService {
  private repo = new AdminRepository();

  // ─── Users ────────────────────────────────────────────────

  async getAllUsers() {
    return this.repo.findAllUsers();
  }

  async updateUserRole(
    targetUserId: number,
    role: 'admin' | 'organizer' | 'attendee',
    requesterId: number
  ) {
    // Prevent admin from changing their own role
    if (targetUserId === requesterId) {
      throw new ForbiddenError('You cannot change your own role');
    }

    const user = await this.repo.findUserById(targetUserId);
    if (!user) throw new NotFoundError('User not found');

    await this.repo.updateUserRole(targetUserId, role);
    return { message: `User role updated to ${role}` };
  }

  async deleteUser(targetUserId: number, requesterId: number) {
    // Prevent admin from deleting themselves
    if (targetUserId === requesterId) {
      throw new ForbiddenError('You cannot delete your own account');
    }

    const user = await this.repo.findUserById(targetUserId);
    if (!user) throw new NotFoundError('User not found');

    await this.repo.deleteUser(targetUserId);
    return { message: 'User deleted successfully' };
  }

  // ─── Events ───────────────────────────────────────────────

  async getAllEvents() {
    return this.repo.findAllEvents();
  }

  async deleteEvent(eventId: number) {
    await this.repo.deleteEvent(eventId);
    return { message: 'Event deleted successfully' };
  }
}
