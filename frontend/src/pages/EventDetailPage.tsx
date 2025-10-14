import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { eventAPI, giftAPI } from "../services/api";
import type { Event, Gift } from "../types";
import "../styles/EventDetailPage.css";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [giftFilter, setGiftFilter] = useState("ALL");

  useEffect(() => {
    if (id) {
      fetchEventAndGifts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEventAndGifts = async () => {
    try {
      setLoading(true);

      // Fetch event details
      const eventResponse = await eventAPI.getEventById(parseInt(id!));
      setEvent(eventResponse.data);

      // Fetch gifts for this event
      const giftsResponse = await giftAPI.getGiftsByEvent(parseInt(id!));
      setGifts(giftsResponse.data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Error loading event");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED': return '#28a745';
      case 'CANCELLED': return '#ffc107';
      case 'PURCHASED': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'Planned';
      case 'CANCELLED': return 'Cancelled';
      case 'PURCHASED': return 'Purchased';
      default: return status;
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

  // Updated filtering for PLANNED/CANCELLED/PURCHASED
  const filteredGifts = gifts.filter(gift => {
    if (giftFilter === "ALL") return true;
    return gift.status === giftFilter;
  });

  // Updated stats for PLANNED/CANCELLED/PURCHASED
  const giftStats = {
    total: gifts.length,
    planned: gifts.filter(g => g.status === 'PLANNED').length,
    cancelled: gifts.filter(g => g.status === 'CANCELLED').length,
    purchased: gifts.filter(g => g.status === 'PURCHASED').length
  };

  // Updated isOrganizer for DTO shape
  const isOrganizer = () => {
    const userData = localStorage.getItem('user');
    if (!userData || !event) return false;
    console.log(userData);
    console.log(event);
    const user = JSON.parse(userData);
    return !!user && event.creatorId && user.userId === event.creatorId;
  };

  if (loading) {
    return (
      <div className="event-detail-container">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail-container">
        <div className="error-state">
          <h3>Event Not Found</h3>
          <p>{error || "The event you're looking for doesn't exist."}</p>
          <Link to="/events" className="back-to-events-btn">
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail-container">
      {/* Header */}
      <div className="event-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        <div className="event-title-section">
          <div className="event-type-badge" style={{ backgroundColor: getEventTypeColor(event.type) }}>
            {typeof event?.type === 'string' ? event.type.toLowerCase() : "unknown"}
          </div>
          <h1>{event.name}</h1>
          <p className="event-description">{event.description}</p>
        </div>

        {/* Organizer can add gift for themselves */}
        {isOrganizer() && (
          <div className="organizer-actions">
            <Link
              to={`/add-gift?eventId=${event.id}`}
              className="add-gift-btn"
            >
              + Add Gift
            </Link>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="event-details-grid">
        <div className="event-info-card">
          <h3>Event Details</h3>
          <div className="detail-item">
            <span className="detail-label">📅 Date:</span>
            <span className="detail-value">{formatDate(event.date)}</span>
            {!isUpcoming(event.date) && <span className="past-badge">Past Event</span>}
          </div>

          {event.location && (
            <div className="detail-item">
              <span className="detail-label">📍 Location:</span>
              <span className="detail-value">{event.location}</span>
            </div>
          )}

          <div className="detail-item">
            <span className="detail-label">👤 Organizer:</span>
            <span className="detail-value">{event.creatorUsername}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">📝 Created:</span>
            <span className="detail-value">
              {new Date(event.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Gift Statistics */}
        <div className="gift-stats-card">
          <h3>Gift Registry</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{giftStats.total}</span>
              <span className="stat-label">Total Gifts</span>
            </div>
            <div className="stat-item planned">
              <span className="stat-number">{giftStats.planned}</span>
              <span className="stat-label">Planned</span>
            </div>
            <div className="stat-item cancelled">
              <span className="stat-number">{giftStats.cancelled}</span>
              <span className="stat-label">Cancelled</span>
            </div>
            <div className="stat-item purchased">
              <span className="stat-number">{giftStats.purchased}</span>
              <span className="stat-label">Purchased</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gifts Section */}
      <div className="gifts-section">
        <div className="gifts-header">
          <h2>Gift Registry ({gifts.length} items)</h2>

          <div className="gift-filters">
            <button
              className={`filter-btn ${giftFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setGiftFilter('ALL')}
            >
              All
            </button>
            <button
              className={`filter-btn ${giftFilter === 'PLANNED' ? 'active' : ''}`}
              onClick={() => setGiftFilter('PLANNED')}
            >
              Planned
            </button>
            <button
              className={`filter-btn ${giftFilter === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setGiftFilter('CANCELLED')}
            >
              Cancelled
            </button>
            <button
              className={`filter-btn ${giftFilter === 'PURCHASED' ? 'active' : ''}`}
              onClick={() => setGiftFilter('PURCHASED')}
            >
              Purchased
            </button>
          </div>
        </div>

        {/* If organizer, show surprise message */}
        {isOrganizer() ? (
          <div className="surprise-message">
            <h3>🎉 It's a surprise for you!</h3>
            <p>As the event creator, you can't see the gifts selected by your guests. Enjoy the surprise!</p>
          </div>
        ) : (
          filteredGifts.length === 0 ? (
            <div className="no-gifts">
              <h3>No gifts found</h3>
              <p>
                {gifts.length === 0
                  ? "This event doesn't have any gifts yet."
                  : "No gifts match your current filter."
                }
              </p>
            </div>
          ) : (
            <div className="gifts-grid">
              {filteredGifts.map(gift => (
                <div key={gift.id} className="gift-card">
                  <div className="gift-image">
                    {gift.image ? (
                      <img src={gift.image} alt={gift.name} />
                    ) : (
                      <div className="gift-placeholder">🎁</div>
                    )}
                    <div
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(gift.status) }}
                    >
                      {getStatusText(gift.status)}
                    </div>
                  </div>
                  <div className="gift-info">
                    <h4 className="gift-name">{gift.name}</h4>
                    <p className="gift-recipient">For: {gift.recipient}</p>
                    <p className="gift-price">${gift.price.toFixed(2)}</p>
                    {gift.notes && (
                      <p className="gift-notes">{gift.notes}</p>
                    )}
                    <div className="gift-actions">
                      <button className="view-btn">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
