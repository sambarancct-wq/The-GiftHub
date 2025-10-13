/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//import { useAuth } from '../context/AuthContext';
import '../styles/EventGiftsPage.css';

interface Gift {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  productUrl: string;
  store: string;
  status: 'AVAILABLE' | 'RESERVED' | 'PURCHASED';
  reservedBy?: {
    id: number;
    username: string;
  };
}

interface AddGiftFormProps {
  onSubmit: (giftData: any) => void;
  onCancel: () => void;
}

interface GiftCardProps {
  gift: Gift;
}

// AddGiftForm Component
const AddGiftForm: React.FC<AddGiftFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    productUrl: '',
    store: 'AMAZON'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0
    });
  };

  return (
    <div className="add-gift-form-overlay">
      <div className="add-gift-form">
        <h3>Add New Gift</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Gift Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Coffee Maker, Book, etc."
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the gift..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Store</label>
              <select name="store" value={formData.store} onChange={handleChange}>
                <option value="AMAZON">Amazon</option>
                <option value="FIRST_CRY">FirstCry</option>
                <option value="OTHER">Other Store</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Product URL</label>
            <input
              type="url"
              name="productUrl"
              value={formData.productUrl}
              onChange={handleChange}
              placeholder="https://www.amazon.com/product-link"
            />
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Gift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// GiftCard Component
const GiftCard: React.FC<GiftCardProps> = ({ gift }) => {
  //const { user } = useAuth();

  const getStoreLogo = (store: string) => {
    switch (store) {
      case 'AMAZON':
        return 'https://cdn-icons-png.flaticon.com/512/906/906361.png';
      case 'FIRST_CRY':
        return 'https://cdn-icons-png.flaticon.com/512/3481/3481079.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return '#00b894';
      case 'RESERVED':
        return '#fdcb6e';
      case 'PURCHASED':
        return '#636e72';
      default:
        return '#00b894';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Available';
      case 'RESERVED':
        return `Reserved by ${gift.reservedBy?.username}`;
      case 'PURCHASED':
        return 'Purchased';
      default:
        return 'Available';
    }
  };

  return (
    <div className="gift-card">
      <div className="gift-image">
        {gift.imageUrl ? (
          <img src={gift.imageUrl} alt={gift.name} />
        ) : (
          <div className="gift-placeholder">🎁</div>
        )}
      </div>
      
      <div className="gift-info">
        <h3>{gift.name}</h3>
        {gift.description && <p className="gift-description">{gift.description}</p>}
        
        <div className="gift-details">
          <div className="gift-price">${gift.price.toFixed(2)}</div>
          <div className="gift-store">
            <img src={getStoreLogo(gift.store)} alt={gift.store} className="store-logo" />
            <span>{gift.store.replace('_', ' ')}</span>
          </div>
        </div>

        <div 
          className="gift-status"
          style={{ backgroundColor: getStatusColor(gift.status) }}
        >
          {getStatusText(gift.status)}
        </div>

        {gift.productUrl && (
          <a 
            href={gift.productUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-product-btn"
          >
            View Product
          </a>
        )}
      </div>
    </div>
  );
};

// Main EventGiftsPage Component
const EventGiftsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  //const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [showAddGift, setShowAddGift] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEventAndGifts();
    }
  }, [eventId]);

  const fetchEventAndGifts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch event details
      const eventResponse = await fetch(`/api/events/${eventId}`);
      if (!eventResponse.ok) {
        throw new Error('Event not found');
      }
      const eventData = await eventResponse.json();
      setEvent(eventData);

      // Fetch gifts for this event
      const giftsResponse = await fetch(`/api/events/${eventId}/gifts`);
      if (giftsResponse.ok) {
        const giftsData = await giftsResponse.json();
        setGifts(giftsData);
      }
    } catch (err) {
      setError('Failed to load event and gifts');
      console.error('Error fetching event and gifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addGift = async (giftData: any) => {
    try {
      const response = await fetch(`/api/events/${eventId}/gifts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...giftData,
          eventId: parseInt(eventId!)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add gift');
      }

      // Refresh the gifts list
      fetchEventAndGifts();
      setShowAddGift(false);
    } catch (err) {
      setError('Failed to add gift');
      console.error('Error adding gift:', err);
    }
  };

  if (loading) {
    return (
      <div className="event-gifts-page">
        <div className="loading">Loading event gifts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-gifts-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-gifts-page">
        <div className="error-message">Event not found</div>
      </div>
    );
  }

  return (
    <div className="event-gifts-page">
      <div className="page-header">
        <h1>🎁 Gift Registry</h1>
        <h2>for {event.name}</h2>
        <p className="event-description">{event.description}</p>
        <p className="event-date">
          📅 {new Date(event.date).toLocaleDateString()} 
          {event.location && ` • 📍 ${event.location}`}
        </p>
      </div>

      <div className="gifts-section">
        <div className="section-header">
          <h3>Available Gifts ({gifts.length})</h3>
          <button 
            onClick={() => setShowAddGift(true)} 
            className="add-gift-btn"
          >
            + Add New Gift
          </button>
        </div>

        {showAddGift && (
          <AddGiftForm 
            onSubmit={addGift} 
            onCancel={() => setShowAddGift(false)} 
          />
        )}

        {gifts.length === 0 ? (
          <div className="no-gifts">
            <div className="no-gifts-icon">🎁</div>
            <h4>No gifts added yet</h4>
            <p>Be the first to suggest a gift for this event!</p>
            <button 
              onClick={() => setShowAddGift(true)} 
              className="add-first-gift-btn"
            >
              Add the First Gift
            </button>
          </div>
        ) : (
          <div className="gifts-grid">
            {gifts.map(gift => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventGiftsPage;