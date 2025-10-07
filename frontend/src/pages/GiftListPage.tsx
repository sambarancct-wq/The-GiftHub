// src/pages/GiftListPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Gift } from '../types';
import '../styles/GiftListPage.css';

const GiftListPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'available' | 'reserved' | 'purchased'>('all');

  // Sample data
  const sampleGifts: Gift[] = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      recipient: 'John Doe',
      price: 79.99,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      notes: 'Noise cancelling feature',
      createdAt: '2024-01-15T10:30:00',
      updatedAt: '2024-01-15T10:30:00'
    },
    {
      id: 2,
      name: 'Smart Watch',
      recipient: 'Sarah Smith',
      price: 199.99,
      status: 'RESERVED',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      notes: 'Water resistant, fitness tracking',
      createdAt: '2024-01-14T14:20:00',
      updatedAt: '2024-01-16T09:15:00'
    },
    {
      id: 3,
      name: 'Coffee Maker',
      recipient: 'Mike Johnson',
      price: 129.99,
      status: 'PURCHASED',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
      notes: 'Programmable, 12-cup capacity',
      createdAt: '2024-01-10T08:45:00',
      updatedAt: '2024-01-17T16:30:00'
    },
    {
      id: 4,
      name: 'Book Collection',
      recipient: 'Emily Davis',
      price: 45.50,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
      notes: 'Best seller novels',
      createdAt: '2024-01-12T11:20:00',
      updatedAt: '2024-01-12T11:20:00'
    },
    {
      id: 5,
      name: 'Perfume Set',
      recipient: 'Lisa Brown',
      price: 89.99,
      status: 'RESERVED',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
      notes: 'Luxury fragrance collection',
      createdAt: '2024-01-11T13:10:00',
      updatedAt: '2024-01-15T18:45:00'
    },
    {
      id: 6,
      name: 'Gaming Console',
      recipient: 'David Wilson',
      price: 299.99,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      notes: 'Latest model with 2 controllers',
      createdAt: '2024-01-09T16:30:00',
      updatedAt: '2024-01-09T16:30:00'
    }
  ];

  const filteredGifts = sampleGifts.filter(gift => {
    if (filter === 'all') return true;
    return gift.status === filter.toUpperCase();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return '#28a745';
      case 'RESERVED': return '#ffc107';
      case 'PURCHASED': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Available';
      case 'RESERVED': return 'Reserved';
      case 'PURCHASED': return 'Purchased';
      default: return status;
    }
  };

  return (
    <div className="gift-list-container">
      <div className="gift-list-header">
        <h1>Gift Registry</h1>
        <p>Manage and track all your gifts in one place</p>
        
        <div className="gift-list-actions">
          <Link to="/add-gift" className="add-gift-btn">
            + Add New Gift
          </Link>
          
          <div className="filter-controls">
            <span>Filter by:</span>
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
              onClick={() => setFilter('available')}
            >
              Available
            </button>
            <button 
              className={`filter-btn ${filter === 'reserved' ? 'active' : ''}`}
              onClick={() => setFilter('reserved')}
            >
              Reserved
            </button>
            <button 
              className={`filter-btn ${filter === 'purchased' ? 'active' : ''}`}
              onClick={() => setFilter('purchased')}
            >
              Purchased
            </button>
          </div>
        </div>
      </div>

      <div className="gift-stats">
        <div className="stat-card">
          <span className="stat-number">{sampleGifts.length}</span>
          <span className="stat-label">Total Gifts</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{sampleGifts.filter(g => g.status === 'AVAILABLE').length}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{sampleGifts.filter(g => g.status === 'RESERVED').length}</span>
          <span className="stat-label">Reserved</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{sampleGifts.filter(g => g.status === 'PURCHASED').length}</span>
          <span className="stat-label">Purchased</span>
        </div>
      </div>

      <div className="gifts-grid">
        {filteredGifts.map(gift => (
          <div key={gift.id} className="gift-card">
            <div className="gift-image">
              <img src={gift.image} alt={gift.name} />
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(gift.status) }}
              >
                {getStatusText(gift.status)}
              </div>
            </div>
            
            <div className="gift-info">
              <h3 className="gift-name">{gift.name}</h3>
              <p className="gift-recipient">For: {gift.recipient}</p>
              <p className="gift-price">${gift.price.toFixed(2)}</p>
              
              {gift.notes && (
                <p className="gift-notes">{gift.notes}</p>
              )}
              
              <div className="gift-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-reserve">
                  {gift.status === 'AVAILABLE' ? 'Reserve' : 
                   gift.status === 'RESERVED' ? 'Cancel Reserve' : 'Mark Available'}
                </button>
                <button className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGifts.length === 0 && (
        <div className="empty-state">
          <h3>No gifts found</h3>
          <p>Try changing your filter or add a new gift to get started.</p>
          <Link to="/add-gift" className="add-gift-btn">
            Add Your First Gift
          </Link>
        </div>
      )}
    </div>
  );
};

export default GiftListPage;