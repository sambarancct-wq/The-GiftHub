import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/RSVPResponsePage.css';

const RSVPResponsePage: React.FC = () => {
  const { rsvpId } = useParams();
  const { response } = useParams(); // 'accepted' or 'declined'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    submitRSVP();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitRSVP = async () => {
    console.log("Submitting RSVP with", rsvpId, response);
    try {
      const res = await fetch(`http://localhost:8080/api/rsvp/${rsvpId}/respond?response=${response}`, {
        method: 'POST'
      });
      
      if (res.ok) {
        if (response === 'accepted') {
          setMessage('🎉 Thank you for confirming! You can now browse and add gifts.');
          setTimeout(() => {
            navigate('/search-event'); // Redirect to event search page
          }, 3000);
        } else {
          setMessage('😔 Thanks for letting us know. We\'ll miss you!');
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('Error submitting RSVP');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Submitting your response...</div>;

  return (
    <div className="rsvp-response">
      <h2>{message}</h2>
      {response === 'accepted' && (
        <p>Redirecting you to find the event and browse gifts...</p>
      )}
    </div>
  );
};

export default RSVPResponsePage;