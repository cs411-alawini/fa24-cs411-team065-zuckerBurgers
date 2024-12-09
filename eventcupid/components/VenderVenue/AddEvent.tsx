"use client";
import React, { useState, useEffect } from 'react';

function AddEvent() {
  const [eventName, setEventName] = useState<string>('');
  const [venueId, setVenueId] = useState<number | string>('');
  const [organizerId, setOrganizerId] = useState<number | null>(null);
  const [eventType, setEventType] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [budget, setBudget] = useState<number | string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const generateRandomEventId = () => {
    const timestamp = Date.now() % 1000000; // Use only the last 6 digits of the timestamp
    const randomPart = Math.floor(Math.random() * 1000); // Add up to 3 random digits
    return timestamp + randomPart;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("user_id");
      const numericUserId = storedUserId ? Number(storedUserId) : null;
      setOrganizerId(numericUserId); // Update the state
      console.log("Organizer ID in add event form localStorage:", storedUserId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName || !venueId || !organizerId || !eventType || !eventDate || !budget || !description) {
      setError('Please fill out all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const eventId = generateRandomEventId();

    try {
      const response = await fetch('http://127.0.0.1:5000/events/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          event_name: eventName,
          venue_id: parseInt(venueId as string, 10), // Parse to an integer
          organizer_id: organizerId,
          event_type: eventType,
          event_date: eventDate,
          budget: parseFloat(budget as string), // Parse to a number
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      const data = await response.json();
      setSuccess(data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#2C2C2C', color: '#E0E0E0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
      <h2 style={{ color: '#FFFFFF', textAlign: 'center' }}>Add New Event</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="eventName" style={{ display: 'block', color: '#D1D1D1' }}>Event Name:</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #444', borderRadius: '5px', backgroundColor: '#3A3A3A', color: '#E0E0E0' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="venueId" style={{ display: 'block', color: '#D1D1D1' }}>Venue ID:</label>
          <input
            type="number"
            id="venueId"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #444', borderRadius: '5px', backgroundColor: '#3A3A3A', color: '#E0E0E0' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="organizerId" style={{ display: 'block', color: '#D1D1D1' }}>Organizer ID:</label>
          <input
            type="number"
            id="organizerId"
            value={organizerId || ''}
            readOnly
            style={{ width: '100%', padding: '10px', border: '1px solid #444', borderRadius: '5px', backgroundColor: '#3A3A3A', color: '#E0E0E0' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="eventType" style={{ display: 'block', color: '#D1D1D1' }}>Event Type:</label>
          <input
            type="text"
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #444', borderRadius: '5px', backgroundColor: '#3A3A3A', color: '#E0E0E0' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="eventDate" style={{ display: 'block', color: '#D1D1D1' }}>Event Date:</label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #444', borderRadius: '5px', backgroundColor: '#3A3A3A', color: '#E0E0E0' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="budget" style={{ display: 'block', color: '#D1D1D1' }}>Budget:</label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #444', borderRadius: '5px', backgroundColor: '#3A3A3A', color: '#E0E0E0' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="description" style={{ display: 'block', color: '#D1D1D1' }}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #444', borderRadius: '5px', backgroundColor: '#3A3A3A', color: '#E0E0E0' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontSize: '1em',
          }}
          disabled={loading}
        >
          {loading ? 'Adding Event...' : 'Add Event'}
        </button>
      </form>

      {error && <p style={{ color: '#FF4C4C', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: '#28A745', textAlign: 'center', marginTop: '10px' }}>{success}</p>}
    </div>
  );
}

export default AddEvent;
