import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/CreateEventPage.css";

interface EventFormData {
  name: string;
  description: string;
  date: string;
  location: string;
  type: "BIRTHDAY" | "WEDDING" | "ANNIVERSARY" | "HOLIDAY" | "OTHER";
}

function getStoredUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

const CreateEventPage: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    date: "",
    location: "",
    type: "BIRTHDAY"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user: contextUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const user = contextUser || getStoredUser();
    try {
      // Check if user is authenticated
      if (!user || !user.userId) {
        setError("Please login first");
        setIsLoading(false);
        return;
      }

      // Validate form
      if (!formData.name.trim() || !formData.description.trim() || !formData.date) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Create event
      const response = await eventAPI.createEvent(formData, user.userId);
      
      alert("🎉 Event created successfully! Check your email for the event key.");
      
      // Redirect to event detail page or organizer dashboard
      navigate(`/event/dashboard/${response.data.event.id}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h1>Create New Event</h1>
        <p>Set up your event and start adding gifts!</p>
      </div>

      <div className="create-event-card">
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="name">Event Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John's 30th Birthday Party"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Event Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event... (date, time, theme, etc.)"
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Event Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Event Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="BIRTHDAY">Birthday</option>
                <option value="WEDDING">Wedding</option>
                <option value="ANNIVERSARY">Anniversary</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Central Park, New York"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="create-event-btn"
            disabled={isLoading}
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
        </form>

        <div className="event-tips">
          <h3>💡 Tips for a Great Event</h3>
          <ul>
            <li>Choose a descriptive name that reflects your event</li>
            <li>Include date, time, and location in the description</li>
            <li>Select the appropriate event type for better categorization</li>
            <li>After creating the event, you can start adding gifts!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;