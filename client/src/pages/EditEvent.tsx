import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, type EventItem } from '../api/client';
import { Button, Card, FormField } from '../components/ui';

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState<'public' | 'private'>('public');
  const [tagsStr, setTagsStr] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api<EventItem>(`/events/${id}`).then((res) => {
      setFetching(false);
      if (res.error) setError(res.error);
      else if (res.data) {
        const e = res.data;
        setTitle(e.title);
        setDescription(e.description || '');
        setEventDate(e.event_date.slice(0, 16));
        setLocation(e.location || '');
        setEventType(e.event_type);
        setTagsStr((e.tags || []).join(', '));
      }
    });
  }, [id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const tags = tagsStr.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean);
    setLoading(true);
    api(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title,
        description: description || undefined,
        event_date: eventDate,
        location: location || undefined,
        event_type: eventType,
        tags,
      }),
    }).then((res) => {
      setLoading(false);
      if (res.error) setError(res.error);
      else navigate(`/events/${id}`, { replace: true });
    });
  }

  if (fetching) return <div className="app-container">Loading...</div>;

  return (
    <div className="app-container" style={{ maxWidth: 560 }}>
      <h1 className="page-header">Edit event</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <FormField label="Title *" htmlFor="title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Description" htmlFor="description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
          <FormField label="Date & time *" htmlFor="event_date">
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Location" htmlFor="location">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormField>
          <FormField label="Event type" htmlFor="event_type">
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as 'public' | 'private')}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </FormField>
          <FormField label="Tags (comma or space separated)" htmlFor="tags">
            <input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
            />
          </FormField>
          {error && <p className="error-message">{error}</p>}
          <Button type="submit" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </Card>
      </form>
    </div>
  );
}
