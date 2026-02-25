import { db } from '../../config/db.js';

/**
 * Tags and event-tag links. Used by EventsService for tag sync.
 */
export class TagsRepository {
  private readonly TABLE = 'tags';
  private readonly LINK_TABLE = 'event_tags';

  async list(): Promise<{ id: number; name: string }[]> {
    return db(this.TABLE).orderBy('name').select('id', 'name');
  }

  async findByName(name: string): Promise<{ id: number; name: string } | undefined> {
    return db(this.TABLE).where('name', name).first();
  }

  async create(name: string): Promise<number> {
    const [id] = await db(this.TABLE).insert({ name });
    return id;
  }

  /** Get or create tag by name; return id. */
  async getOrCreateByName(name: string): Promise<number> {
    let row = await this.findByName(name);
    if (!row) {
      await this.create(name);
      row = await this.findByName(name);
    }
    return row!.id;
  }

  async ensureTagIds(names: string[]): Promise<number[]> {
    if (!names?.length) return [];
    const unique = [...new Set(names)].filter(Boolean);
    const ids: number[] = [];
    for (const name of unique) {
      ids.push(await this.getOrCreateByName(name));
    }
    return ids;
  }

  async deleteLinksForEvent(eventId: number): Promise<void> {
    await db(this.LINK_TABLE).where('event_id', eventId).del();
  }

  async attachEventTags(eventId: number, tagIds: number[]): Promise<void> {
    if (!tagIds.length) return;
    await db(this.LINK_TABLE).insert(tagIds.map((tag_id) => ({ event_id: eventId, tag_id })));
  }

  async syncEventTags(eventId: number, tagNames: string[]): Promise<void> {
    await this.deleteLinksForEvent(eventId);
    if (!tagNames?.length) return;
    const tagIds = await this.ensureTagIds(tagNames);
    await this.attachEventTags(eventId, tagIds);
  }

  async getTagNamesByEventIds(eventIds: number[]): Promise<Record<number, string[]>> {
    if (!eventIds.length) return {};
    const rows = await db(this.LINK_TABLE)
      .join(this.TABLE, `${this.TABLE}.id`, `${this.LINK_TABLE}.tag_id`)
      .whereIn('event_id', eventIds)
      .select('event_id', `${this.TABLE}.name`);
    const out: Record<number, string[]> = {};
    for (const r of rows) {
      if (!out[r.event_id]) out[r.event_id] = [];
      out[r.event_id].push(r.name);
    }
    return out;
  }
}
