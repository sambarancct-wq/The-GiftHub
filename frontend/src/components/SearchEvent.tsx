import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchEvent: React.FC = () => {
  const [eventKey, setEventKey] = useState('');
  const navigate = useNavigate();

  const searchEvent = async () => {
    try {
      const response = await fetch(`/api/events/key/${eventKey}`);
      if (response.ok) {
        const event = await response.json();
        navigate(`/event/${event.id}/gifts`);
      } else {
        alert('Event not found. Please check the event key.');
      }
    } catch (error) {
      console.error('Error searching event:', error);
    }
  };

  return (
    <div className="search-event">
      <h2>Find Event</h2>
      <p>Enter the event key provided in your invitation</p>
      <input
        type="text"
        value={eventKey}
        onChange={(e) => setEventKey(e.target.value)}
        placeholder="Enter event key"
      />
      <button onClick={searchEvent}>Find Event</button>
    </div>
  );
};

export default SearchEvent;