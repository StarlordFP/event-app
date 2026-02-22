import { useEffect, useState, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../api/events';
import api from '../api/client';
import type { Tag } from '../types/index';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    start_at: '', type: 'public' as 'public' | 'private', tag_ids: [] as number[],
  });

  useEffect(() => {
    api.get<Tag[]>('/tags').then((r: { data: SetStateAction<Tag[]>; }) => setTags(r.data));
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleTag = (id: number) =>
    setForm(f => ({
      ...f,
      tag_ids: f.tag_ids.includes(id) ? f.tag_ids.filter(t => t !== id) : [...f.tag_ids, id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const event = await eventsApi.create({ ...form, start_at: new Date(form.start_at).toISOString() });
    navigate(`/events/${event.id}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Title</label><input value={form.title} onChange={set('title')} required /></div>
        <div><label>Description</label><textarea value={form.description} onChange={set('description')} required /></div>
        <div><label>Location</label><input value={form.location} onChange={set('location')} required /></div>
        <div><label>Date & Time</label><input type="datetime-local" value={form.start_at} onChange={set('start_at')} required /></div>
        <div>
          <label>Type</label>
          <select value={form.type} onChange={set('type')}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label>Tags</label>
          <div>{tags.map(t => (
            <label key={t.id} style={{ marginRight: 12 }}>
              <input type="checkbox" checked={form.tag_ids.includes(t.id)} onChange={() => toggleTag(t.id)} />
              {' '}{t.name}
            </label>
          ))}</div>
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}