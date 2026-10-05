import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Camera, Play, MapPin, Tag } from 'lucide-react';

export const GalleryPage = () => {
  const { db } = useAuth();
  const [filter, setFilter] = useState('all');

  const defaultEvents = [
    {
      id: '1',
      title: 'Annual Spiritual Revival Conference 2026',
      date: 'August 15 - 18, 2026',
      category: 'conference',
      type: 'event',
      venue: 'Main Fellowship Hall & Stadium Field',
      image: 'https://images.unsplash.com/photo-1511649475669-e288648b2339?w=800&auto=format&fit=crop&q=80',
      media_type: 'image',
      description: 'Four days of intense worship, intercession, biblical teaching, and evangelism harvest.'
    },
    {
      id: '2',
      title: 'Youth Choir & Worship Team Concert',
      date: 'September 5, 2026',
      category: 'choir',
      type: 'moment',
      venue: 'SKHC Main Sanctuary',
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
      media_type: 'image',
      description: 'Special worship moment featuring Eftah Choir, Johanan Choir, and Salem Team.'
    },
    {
      id: '3',
      title: 'Medeb Sefer Leaders Training Session',
      date: 'July 10, 2026',
      category: 'training',
      type: 'moment',
      venue: 'Pastoral Conference Room',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      media_type: 'image',
      description: 'Leadership development session for cell group leaders across all 5 zones.'
    },
    {
      id: '4',
      title: 'Outreach & Community Health Day (Tena Zerf)',
      date: 'June 22, 2026',
      category: 'outreach',
      type: 'moment',
      venue: 'Stadium Zuria Community Grounds',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      media_type: 'image',
      description: 'Free medical consultations, health screenings, and gospel distribution organized by Tena Zerf.'
    }
  ];

  const dbGalleryEvents = db?.gallery_events || [];
  const events = [...dbGalleryEvents, ...defaultEvents];

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      <div className="card" style={{ textAlign: 'center', backgroundColor: 'var(--primary-light-blue)', padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
          Church Moments, Gallery & Events
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Explore fellowship moments, choir concerts, conferences, and ministry highlights.
        </p>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('all')} className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}>
            All Moments
          </button>
          <button onClick={() => setFilter('conference')} className={`btn btn-sm ${filter === 'conference' ? 'btn-primary' : 'btn-secondary'}`}>
            Conferences
          </button>
          <button onClick={() => setFilter('choir')} className={`btn btn-sm ${filter === 'choir' ? 'btn-primary' : 'btn-secondary'}`}>
            Choir & Worship
          </button>
          <button onClick={() => setFilter('outreach')} className={`btn btn-sm ${filter === 'outreach' ? 'btn-primary' : 'btn-secondary'}`}>
            Outreach & Health
          </button>
          <button onClick={() => setFilter('training')} className={`btn btn-sm ${filter === 'training' ? 'btn-primary' : 'btn-secondary'}`}>
            Trainings
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.5rem' }}>
        {filteredEvents.map(e => (
          <div key={e.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '220px' }}>
              {e.media_type === 'video' ? (
                <video
                  src={e.image}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={e.image}
                  alt={e.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              <span className="badge badge-success" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10 }}>
                {e.category.toUpperCase()}
              </span>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>{e.title}</h3>
              
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={14} />
                  {e.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={14} />
                  {e.venue}
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {e.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
