/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventGiftsPage.css';

const user = JSON.parse(localStorage.getItem('user') || '{}');

interface Gift {
  plannedById:number;
  recipient: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image:string;
  imageUrl: string;
  productUrl: string;
  store: string;
  status: 'PLANNED' | 'CANCELLED' | 'PURCHASED';
  reservedBy?: {
    id: number;
    username: string;
  };
}

interface AddGiftFormProps {
  onSubmit: (giftData: any,imageFile:any) => void;
  onCancel: () => void;
}

interface GiftCardProps {
  gift: Gift;
  onRemove: (giftId: number) => void;
}

// AddGiftForm Component
const AddGiftForm: React.FC<AddGiftFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    recipient: '',
    imageUrl: '',
    productUrl: '',
    store: 'OTHER'
  });
  const [imageFile] = useState<File | null>(null);

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
      price: parseFloat(formData.price) || 0},
      imageFile);
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
            <label>Recipient *</label>
            <input name="recipient" value={formData.recipient} onChange={handleChange} required />
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
const GiftCard: React.FC<GiftCardProps> = ({ gift,onRemove }) => {
  const showRemove = user.userId && gift.plannedById === user.userId;
  const showConfirm = user.userId && gift.plannedById === user.userId;

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

  const handleConfirm = () => {
    fetch(`/api/gifts/${gift.id}/confirm` , {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body : JSON.stringify({ userId: user.userId }) 
    })
    .then(res => res.json())
    .then(_data => {
      window.location.reload();
    })
    .catch(err => {
      alert("Failed to confirm gift: " + err.message)
    });
  };

  return (
    <div className="gift-card">
      <div className="gift-image">
        {gift.image ? (
          <img src={gift.image} alt={gift.name} />
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

        <div className="gift-recipient">👤 <strong>For:</strong> {gift.recipient}</div>
        <div className="gift-planner">📝 <strong>Added by:</strong> {gift.plannedById || '-'}</div>
        <div className="gift-actions">
          {showRemove &&
            <button className="cancel-btn" onClick={() => onRemove(gift.id)}>
              Remove
            </button>
            }
          {showConfirm && 
            <button className='confirm-btn' onClick={handleConfirm}>
              Confirm Gift
            </button>
            }
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
      const giftsResponse = await fetch(`/api/gifts/event/${eventId}/user/${user.userId}`);
      if (giftsResponse.ok) {
        const giftsData = await giftsResponse.json();
        setGifts(giftsData);
        console.log(giftsData);
      }else {
        console.error('Failed to fetch gifts:', giftsResponse.status);
        setGifts([]); // Set empty array if no gifts found
      }
    } catch (err) {
      setError('Failed to load event and gifts');
      console.error('Error fetching event and gifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addGift = async (giftData: any, imageFile: any) => {
    try {
      // CORRECTED: Use the correct gift creation endpoint
      const formData = new FormData();
      formData.append('name', giftData.name);
      formData.append('recipient', giftData.recipient); // Default recipient
      formData.append('description', giftData.description || '');
      formData.append('price', giftData.price.toString());
      formData.append('store',giftData.store || 'OTHER');
      formData.append('eventId', eventId!);
      formData.append('plannedBy', user.userId);
      formData.append('productUrl', giftData.productUrl || '');

      // Add image if provided via URL
      if (imageFile) {
        // Convert image URL to blob (simplified approach)
        formData.append('image', imageFile);
      } else if (giftData.imageUrl) {
        formData.append('imageUrl', giftData.imageUrl);
      }

      const response = await fetch('/api/gifts', {
        method: 'POST',
        body: formData // Using FormData for multipart request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add gift');
      }

      // Refresh the gifts list
      fetchEventAndGifts();
      setShowAddGift(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add gift');
      console.error('Error adding gift:', err);
    }
  };

  const removeGift = async (giftId: any) => {
    try {
      const response = await fetch(`/api/gifts/${giftId}/user/${user.userId}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchEventAndGifts();
    } catch (err) {
      // Optionally set error
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
          <h3>Current Gifts ({gifts.length})</h3>
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
              <GiftCard key={gift.id} gift={gift} onRemove={removeGift}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventGiftsPage;