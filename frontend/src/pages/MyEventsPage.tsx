import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventAPI } from "../services/api";
import type { Event } from "../types";
import "../styles/MyEventPage.css";

const MyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await eventAPI.getEventsByOrganizer(user.userId);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching my events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "BIRTHDAY": return "#FF6B6B";
      case "WEDDING": return "#4ECDC4";
      case "ANNIVERSARY": return "#45B7D1";
      case "HOLIDAY": return "#96CEB4";
      case "OTHER": return "#FFEAA7";
      default: return "#DDD";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="my-events-container">
        <div className="loading">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="my-events-container">
      <div className="my-events-header">
        <h1>My Events</h1>
        <p>Manage your created events and their gifts</p>
        <Link to="/create-event" className="create-event-btn">
          + Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <div className="no-events-content">
            <h3>No events created yet</h3>
            <p>Start by creating your first event to build a gift registry!</p>
            <Link to="/create-event" className="create-first-event-btn">
              Create Your First Event
            </Link>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div 
                className="event-type-badge"
                style={{ backgroundColor: getEventTypeColor(event.type) }}
              >
                {event.type.toLowerCase()}
              </div>

              <div className="event-content">
                <h3 className="event-name">{event.name}</h3>
                
                <p className="event-date">
                  📅 {formatDate(event.date)}
                </p>

                <p className="event-description">
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...` 
                    : event.description
                  }
                </p>

                {event.location && (
                  <p className="event-location">📍 {event.location}</p>
                )}

                <div className="event-stats">
                  <span className="stat">
                    🎁 {event.gifts?.length || 0} gifts
                  </span>
                  <span className="stat">
                    📅 Created: {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="event-actions">
                  <Link 
                    to={`/event/${event.id}`} 
                    className="view-event-btn"
                  >
                    View Event
                  </Link>
                  <Link 
                    to={`/add-gift?eventId=${event.id}`}
                    className="add-gift-btn"
                  >
                    Add Gift
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;