import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/GiftAddPage.css";
import { giftAPI, eventAPI } from "../services/api";

const GiftAddPage: React.FC = () => {
  const [giftName, setGiftName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [giftNotes, setGiftNotes] = useState("");
  const [price, setPrice] = useState(500);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Get eventId from URL params or location state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlEventId = searchParams.get('eventId');
    
    if (urlEventId) {
      setEventId(parseInt(urlEventId));
    } else if (location.state?.eventId) {
      setEventId(location.state.eventId);
    }
  }, [location]);

  // Fetch organizer's events if no eventId provided
  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.isOrganizer) {
            const response = await eventAPI.getEventsByOrganizer(user.userId);
            setEvents(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (!eventId) {
      fetchOrganizerEvents();
    }
  }, [eventId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventId) {
      setError("Please select an event");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", giftName);
    formData.append("recipient", recipientName);
    formData.append("notes", giftNotes);
    formData.append("price", price.toString());
    formData.append("eventId", eventId.toString());
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await giftAPI.addGift(formData);
      console.log("✅ Gift Added:", response);
      alert(response.data.message);
      
      // Reset form
      setGiftName("");
      setGiftNotes("");
      setPrice(500);
      setRecipientName("");
      setImageFile(null);
      setPreview(null);
      
      // Navigate back to event page or organizer dashboard
      navigate(`/event/${eventId}`);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add gift");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gift-page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="gift-card">
        <h2>Add Gift to Event</h2>

        {!eventId && events.length > 0 && (
          <div className="form-group">
            <label>Select Event</label>
            <select 
              value={eventId || ''} 
              onChange={(e) => setEventId(parseInt(e.target.value))}
              required
            >
              <option value="">Choose an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {eventId && (
          <form onSubmit={handleAddGift} className="gift-form">
            <div className="form-group">
              <label>Gift Name</label>
              <input
                type="text"
                value={giftName}
                onChange={(e) => setGiftName(e.target.value)}
                placeholder="Enter gift name"
                required
              />
            </div>

            <div className="form-group">
              <label>Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Who is this for?"
                required
              />
            </div>

            <div className="form-group">
              <label>Gift Price: ₹{price}</label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="price-slider"
              />
            </div>

            <div className="form-group">
              <label>Gift Picture</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={giftNotes}
                onChange={(e) => setGiftNotes(e.target.value)}
                placeholder="Add some notes or message..."
              />
            </div>

            <button type="submit" disabled={isLoading} className="gift-submit-btn">
              {isLoading ? "Adding..." : "Add Gift to Event"}
            </button>

            {error && <p className="error-message">{error}</p>}
          </form>
        )}

        {!eventId && events.length === 0 && (
          <div className="no-events-message">
            <p>You need to create an event first before adding gifts.</p>
            <button 
              onClick={() => navigate("/create-event")}
              className="create-event-btn"
            >
              Create Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftAddPage;