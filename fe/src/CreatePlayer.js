import React, { useState } from 'react';

function CreatePlayer() {
  const [formData, setFormData] = useState({
    Player_Id: '',
    First_Name: '',
    Last_Name: '',
    Middle_Name: '',
    Phone: '',
    DOB: '',
    Age: '',
    City: '',
    State: '',
    Zip: ''
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Age || isNaN(formData.Age)) {
      setError('Please enter a valid age');
      return;
    }

    if (!formData.Player_Id || isNaN(formData.Player_Id)) {
      setError('Please enter a valid integer');
      return;
    }

    if (!formData.DOB) {
      setError('Date of Birth is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Player created successfully!');
        setFormData({
          Player_Id: '',
          First_Name: '',
          Last_Name: '',
          Middle_Name: '',
          Phone: '',
          DOB: '',
          Age: '',
          City: '',
          State: '',
          Zip: ''
        });

      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create player');
      }
    } catch (error) {
      console.error('Error creating player:', error);
      setError('Error creating player');
    }
  };

  return (
    <div>
      <h2>Create Player</h2>
      <form onSubmit={handleSubmit}>
      <div>
          <label>Player Id:</label>
          <input
            type="text"
            name="Player_Id"
            value={formData.Player_Id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="First_Name"
            value={formData.First_Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="Last_Name"
            value={formData.Last_Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Middle Name:</label>
          <input
            type="text"
            name="Middle_Name"
            value={formData.Middle_Name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>DOB:</label>
          <input
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="City"
            value={formData.City}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="State"
            value={formData.State}
            onChange={handleChange}
            maxLength={2}
            required
          />
        </div>
        <div>
          <label>Zip:</label>
          <input
            type="text"
            name="Zip"
            value={formData.Zip}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Create Player</button>
        </div>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default CreatePlayer;
