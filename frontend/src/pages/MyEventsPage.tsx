import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventAPI } from "../services/api";
import type { Event } from "../types";
import { useAuth } from "../context/AuthContext";
import "../styles/MyEventPage.css";

function getStoredUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}
const MyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user:contextUser } = useAuth();
  const user = contextUser || getStoredUser();

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      console.log(user.userId);
      const response = await eventAPI.getEventsByCreator(user.userId);
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
        <p>Manage your events and track guest RSVPs</p>
        <Link to="/create-event" className="create-event-btn">
          + Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <div className="no-events-content">
            <h3>No events created yet</h3>
            <p>Create your first event and start inviting guests!</p>
            <Link to="/create-event" className="create-first-event-btn">
              Create Your First Event
            </Link>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              user={user}
              getEventTypeColor={getEventTypeColor}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Separate EventCard component to handle individual event states
const EventCard: React.FC<{ 
  event: Event; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  getEventTypeColor: (type: string) => string;
  formatDate: (date: string) => string;
}> = ({ event, user, getEventTypeColor, formatDate }) => {
  const [rsvpStats, setRsvpStats] = useState({ attending: 0, declined: 0, pending: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if(user && user.userId) {
      fetchRSVPStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id,user]);

  const fetchRSVPStats = async () => {
    try {
      if (!user || !user.userId) return;
      const response = await fetch(`/api/events/dashboard/${event.id}?creatorId=${user.userId}`);
      if (response.ok) {
        const data = await response.json();
        setRsvpStats({
          attending: data.attendingCount || 0,
          declined: data.declinedCount || 0,
          pending: data.pendingCount || 0
        });
      }
    } catch (error) {
      console.error("Error fetching RSVP stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="event-card">
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

        {/* RSVP Statistics */}
        <div className="rsvp-stats">
          <h4>Guest Responses:</h4>
          {loadingStats ? (
            <div className="loading-stats">Loading RSVPs...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-item attending">
                <span className="stat-number">{rsvpStats.attending}</span>
                <span className="stat-label">Attending</span>
              </div>
              <div className="stat-item declined">
                <span className="stat-number">{rsvpStats.declined}</span>
                <span className="stat-label">Not Coming</span>
              </div>
              <div className="stat-item pending">
                <span className="stat-number">{rsvpStats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          )}
        </div>

        <div className="event-key">
          <strong>Event Key:</strong> 
          <code>{event.event_key}</code>
          <button 
            onClick={() => navigator.clipboard.writeText(event.event_key)}
            className="copy-key-btn"
            title="Copy event key"
          >
            📋
          </button>
        </div>

        <div className="event-actions">
          <Link 
            to={`/dashboard/${event.id}`} 
            className="dashboard-btn"
          >
            🎛️ Manage Event
          </Link>
          <Link 
            to={`/event/${event.id}`}
            className="view-event-btn"
          >
            👀 View Public Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyEventsPage;