import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FindEventPage.css';

const FindEventPage: React.FC = () => {
  const [eventKey, setEventKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const findEvent = async () => {
    if (!eventKey.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/events/key/${eventKey}`);
      if (response.ok) {
        const event = await response.json();
        navigate(`/event/${event.id}/gifts`); // Redirect to gift browsing page
      } else {
        alert('Event not found. Please check the event key.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('Error finding event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="find-event-page">
      <div className="find-event-container">
        <h1>🔍 Find Event</h1>
        <p>Enter the event key from your invitation email</p>
        
        <div className="search-box">
          <input
            type="text"
            value={eventKey}
            onChange={(e) => setEventKey(e.target.value)}
            placeholder="Enter event key (e.g., EVT123456789)"
            onKeyPress={(e) => e.key === 'Enter' && findEvent()}
          />
          <button onClick={findEvent} disabled={loading || !eventKey.trim()}>
            {loading ? 'Searching...' : 'Find Event'}
          </button>
        </div>

        <div className="help-text">
          <h3>Where to find your event key?</h3>
          <ul>
            <li>📧 Check your invitation email</li>
            <li>💬 Ask the event host</li>
            <li>📱 Look in your text messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FindEventPage;