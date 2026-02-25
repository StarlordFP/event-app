import { TagsRepository } from './tags.repository';

/**
 * Tags listing. Business logic is minimal; repository does the work.
 */
export class TagsService {
  private repo = new TagsRepository();

  async list(): Promise<{ id: number; name: string }[]> {
    return this.repo.list();
  }
}
