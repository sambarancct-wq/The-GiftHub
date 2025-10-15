import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventAPI } from "../services/api";
import type { Event } from "../types";
import "../styles/EventListPage.css";

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, searchTerm, categoryFilter, sortBy]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllPublicEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    let filtered = [...events];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter(event => event.type === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  if (loading) {
    return (
      <div className="event-list-container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h1>Browse Events</h1>
        <p>Discover amazing events and see what is going around in the world</p>
      </div>

      {/* Filters and Search */}
      <div className="event-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="BIRTHDAY">Birthdays</option>
            <option value="WEDDING">Weddings</option>
            <option value="ANNIVERSARY">Anniversaries</option>
            <option value="HOLIDAY">Holidays</option>
            <option value="OTHER">Other</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="newest">Sort by Newest</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-stats">
        <span>{filteredEvents.length} event(s) found</span>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <h3>No events found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div 
                className="event-type-badge"
                style={{ backgroundColor: getEventTypeColor(event.type) }}
              >
                {event.type.toLowerCase()}
              </div>

              {!isUpcoming(event.date) && (
                <div className="past-event-badge">Past Event</div>
              )}

              <div className="event-content">
                <h3 className="event-name">{event.name}</h3>
                
                <p className="event-date">
                  📅 {formatDate(event.date)}
                  {!isUpcoming(event.date) && " (Past)"}
                </p>

                <p className="event-description">
                  {event.description.length > 120 
                    ? `${event.description.substring(0, 120)}...` 
                    : event.description
                  }
                </p>

                {event.location && (
                  <p className="event-location">📍 {event.location}</p>
                )}

                <div className="event-organizer">
                  <small>Organized by: {event.creatorUsername}</small>
                </div>

                <div className="event-actions">
                  <Link 
                    to={`/event/${event.id}`} 
                    className="view-event-btn"
                  >
                    View Event & Gifts
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Categories */}
      <div className="quick-categories">
        <h3>Quick Browse</h3>
        <div className="category-buttons">
          {["BIRTHDAY", "WEDDING", "ANNIVERSARY", "HOLIDAY"].map(category => (
            <button
              key={category}
              className={`category-btn ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
              style={{ backgroundColor: getEventTypeColor(category) }}
            >
              {category.toLowerCase()}
            </button>
          ))}
          <button
            className={`category-btn ${categoryFilter === "ALL" ? 'active' : ''}`}
            onClick={() => setCategoryFilter("ALL")}
          >
            show all
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventListPage;