import { useState } from "react";
import '../styles/GiftAddPage.css';

// This interface now represents the data we will SEND to the API.
// The 'id' is removed as the database will generate it.
interface NewGiftPayload {
    name: string;
    recipient: string;
    notes?: string;
}

interface GiftAddPageProps {
  onReturnToLanding: () => void;
}

const GiftAddPage: React.FC<GiftAddPageProps> = ({ onReturnToLanding }) => {
  // 1. State for the form inputs (these are necessary)
  const [giftName, setGiftName] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [giftNotes, setGiftNotes] = useState<string>('');

  // 2. State for handling the API request status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 3. The form submission handler is now an async function
  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Prepare the data payload to send to the API
    const newGift: NewGiftPayload = {
      name: giftName,
      recipient: recipientName,
      notes: giftNotes,
    };

    try {
      // Send the data to your backend endpoint
      const response = await fetch('http://localhost:5000/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGift),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add gift');
      }

      // Handle success
      alert('Gift added successfully!');
      
      // Clear the form inputs after successful submission
      setGiftName('');
      setRecipientName('');
      setGiftNotes('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Handle any errors during the fetch
      setError(err.message);
      console.error('Failed to submit gift:', err);

    } finally {
      // This runs whether the request succeeded or failed
      setIsLoading(false);
    }
  };

  return (
    <div className="gift-inventory-container">
      <button onClick={onReturnToLanding}>&larr; Back to Landing</button>
      <h2>Add a Gift to the Inventory</h2>
      <form onSubmit={handleAddGift} className="gift-form">
        <div className="form-group">
          <label htmlFor="gift-name">Gift Name:</label>
          <input
            id="gift-name"
            type="text"
            value={giftName}
            onChange={(e) => setGiftName(e.target.value)}
            required
            disabled={isLoading} // Disable input while loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="recipient-name">Recipient:</label>
          <input
            id="recipient-name"
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
            disabled={isLoading} // Disable input while loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="gift-notes">Notes:</label>
          <textarea
            id="gift-notes"
            value={giftNotes}
            onChange={(e) => setGiftNotes(e.target.value)}
            disabled={isLoading} // Disable input while loading
          />
        </div>
        {/* The button now shows a loading state and is disabled during submission */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Gift'}
        </button>
        {/* Display an error message if the submission fails */}
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* The gift list display has been removed from this component.
        This component's only job is now to ADD a gift.
      */}
    </div>
  );
}

export default GiftAddPage;