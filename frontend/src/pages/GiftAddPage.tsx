import { useState } from "react";
import '../styles/GiftAddPage.css';

interface Gift{
    id: number,
    name: string,
    recipient: string,
    notes?: string;
}

interface GiftInventoryProps {
  onReturnToLanding: () => void;
}

const GiftAddPage: React.FC<GiftInventoryProps> = ({onReturnToLanding}) => {
    const [gifts,setGifts] = useState<Gift[]>([]);
    // State for the form inputs
    const [giftName, setGiftName] = useState<string>('');
    const [recipientName, setRecipientName] = useState<string>('');
    const [giftNotes, setGiftNotes] = useState<string>('');

    const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission
    if (giftName.trim() && recipientName.trim()) {
      const newGift: Gift = {
        id: Date.now(), // Use a unique ID (e.g., timestamp)
        name: giftName,
        recipient: recipientName,
        notes: giftNotes,
      };
      setGifts([...gifts, newGift]); // Add the new gift to the list
      setGiftName(''); // Clear the form inputs
      setRecipientName('');
      setGiftNotes('');
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="gift-notes">Notes:</label>
          <textarea
            id="gift-notes"
            value={giftNotes}
            onChange={(e) => setGiftNotes(e.target.value)}
          />
        </div>
        <button type="submit">Add Gift</button>
      </form>

      <div className="gifts-list-container">
        <h3>Gift List</h3>
        {gifts.length === 0 ? (
          <p>No gifts added yet.</p>
        ) : (
          <ul className="gifts-list">
            {gifts.map((gift) => (
              <li key={gift.id} className="gift-item">
                <strong>{gift.name}</strong> for {gift.recipient}
                {gift.notes && <span className="gift-notes"> ({gift.notes})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GiftAddPage;