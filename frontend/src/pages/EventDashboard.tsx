import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/EventDashboard.css'

const EventDashboard: React.FC = () => {
  const { eventId } = useParams();
  const { user } = useAuth(); 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboard, setDashboard] = useState<any>(null);
  const [guestEmails, setGuestEmails] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && eventId) {
      fetchDashboard();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      // The user object is guaranteed to exist here if the effect runs
      const response = await fetch(`/api/events/dashboard/${eventId}?creatorId=${user?.userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard');
      }
      
      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const sendInvitations = async () => {
    if (!guestEmails.trim()) {
      alert('Please enter at least one email address');
      return;
    }

    const emails = guestEmails.split(',').map(email => email.trim()).filter(email => email);
    
    try {
      // The user object is guaranteed to exist here if the component renders
      const response = await fetch(`/api/events/${eventId}/invite?creatorId=${user?.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emails)
      });

      if (!response.ok) {
        throw new Error('Failed to send invitations');
      }

      alert('Invitations sent successfully!');
      setGuestEmails('');
      // Refresh dashboard to update counts
      fetchDashboard();
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations');
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!dashboard) return <div>No dashboard data found</div>;

  return (
    <div className="dashboard">
      <h1>Event Dashboard: {dashboard.event.name}</h1>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Attending</h3>
          <p>{dashboard.attendingCount}</p>
        </div>
        <div className="stat-card">
          <h3>Not Coming</h3>
          <p>{dashboard.declinedCount}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{dashboard.pendingCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Invited</h3>
          <p>{dashboard.totalInvited}</p>
        </div>
      </div>

      <div className="event-key">
        <h3>Event Key</h3>
        <div className="key-display">
          <code>{dashboard.event.eventKey}</code>
        </div>
        <p>Share this key with guests to find your event</p>
      </div>

      <div className="invite-section">
        <h3>Send Invitations</h3>
        <textarea
          value={guestEmails}
          onChange={(e) => setGuestEmails(e.target.value)}
          placeholder="Enter guest emails separated by commas"
          rows={4}
        />
        <button onClick={sendInvitations} disabled={!guestEmails.trim()}>
          Send Invitations
        </button>
      </div>
    </div>
  );
};

export default EventDashboard;