import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi } from '../api/events';
import api from '../api/client';
import type { Tag, Event } from '../types/index';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [form, setForm] = useState<Partial<Event> & { tag_ids: number[] }>({
    title: '', description: '', location: '', start_at: '', type: 'public', tag_ids: [],
  });

  useEffect(() => {
    Promise.all([eventsApi.get(Number(id)), api.get<Tag[]>('/tags')]).then(([event, tagRes]) => {
      setTags(tagRes.data);
      setForm({
        ...event,
        // format for datetime-local input
        start_at: new Date(event.start_at).toISOString().slice(0, 16),
        tag_ids: event.tags.map((t: { id: any; }) => t.id),
      });
    });
  }, [id]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleTag = (tagId: number) =>
    setForm(f => ({
      ...f,
      tag_ids: f.tag_ids.includes(tagId) ? f.tag_ids.filter(t => t !== tagId) : [...f.tag_ids, tagId],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await eventsApi.update(Number(id), {
      ...form,
      start_at: form.start_at ? new Date(form.start_at).toISOString() : undefined,
    });
    navigate(`/events/${id}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Title</label><input value={form.title || ''} onChange={set('title')} required /></div>
        <div><label>Description</label><textarea value={form.description || ''} onChange={set('description')} required /></div>
        <div><label>Location</label><input value={form.location || ''} onChange={set('location')} required /></div>
        <div><label>Date & Time</label><input type="datetime-local" value={(form.start_at as string) || ''} onChange={set('start_at')} required /></div>
        <div>
          <label>Type</label>
          <select value={form.type || 'public'} onChange={set('type')}>
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}