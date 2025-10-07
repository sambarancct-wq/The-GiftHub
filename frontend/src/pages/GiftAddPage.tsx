import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GiftAddPage.css";
import { giftAPI } from "../services/api";

const GiftAddPage: React.FC = () => {
  const [giftName, setGiftName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [giftNotes, setGiftNotes] = useState("");
  const [price, setPrice] = useState(500);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", giftName);
    formData.append("recipient", recipientName);
    formData.append("notes", giftNotes);
    formData.append("price", price.toString());
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await giftAPI.addGift(formData);
      console.log("✅ Gift Added:", response);
      alert(response.data.message);
      setGiftName("");
      setGiftNotes("");
      setPrice(500);
      setRecipientName("");
      setImageFile(null);
      setPreview(null);
      navigate("/gift/add");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add gift");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gift-page-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        &larr; Back
      </button>

      <div className="gift-card">
        <h2>Add a New Gift</h2>

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
            {isLoading ? "Adding..." : "Add Gift"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default GiftAddPage;
