import { TagsRepository } from './tags.repository';

export class TagsService {
  private repo = new TagsRepository();

  async list(): Promise<{ id: number; name: string }[]> {
    return this.repo.list();
  }
}
