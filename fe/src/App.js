import React, { useEffect, useState } from 'react';
import CreatePlayer from './CreatePlayer';  // Adjust the path if needed

function App() {
  // State to store the list of players
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState(null);  // State for any errors

  useEffect(() => {
    // Fetch data from the /players endpoint
    fetch('http://localhost:3001/players')  // Replace with your correct backend URL
      .then(response => response.json())  // Parse the response as JSON
      .then(data => {
        console.log('Fetched players:', data); // Log the data to check its format
        setPlayers(data.players);  // Set players data in state
        setLoading(false);  // Turn off loading indicator
      })
      .catch((err) => {
        setError('Failed to fetch players');  // Handle errors
        setLoading(false);  // Stop loading
      });
  }, []);

  function handleDelete(playerId) {
    // Send DELETE request to backend with playerId
    fetch(`http://localhost:3001/players/${playerId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // If successful, filter out the deleted player from the players state
          setPlayers(players.filter(player => player.PlayerID !== playerId));
        } else {
          // Handle any errors
          alert('Failed to delete player');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('Error deleting player');
      });
  }
  
  

  // Render a loading message if the data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, display it
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>Player List</h1>
      
      {/* Display the players in a table */}
      <table border="1">
        <thead>
          <tr>
            <th>PlayerID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Middle Name</th>
            <th>Phone</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
          </tr>
        </thead>
        <tbody>
  {/* Check if there are players */}
  {players.length > 0 ? (
    // Map over the players array and display each player
    players.map((player, index) => (
      <tr key={index}>
        <td>{player.PlayerID}</td>
        <td>{player.First_Name}</td>
        <td>{player.Last_Name}</td>
        <td>{player.Middle_Name}</td>
        <td>{player.Phone}</td>
        <td>{player.DOB}</td>
        <td>{player.Age}</td>
        <td>{player.City}</td>
        <td>{player.State}</td>
        <td>{player.Zip}</td>
        <td>
          {/* Delete Button */}
          <button onClick={() => handleDelete(player.PlayerID)}>Delete</button>
        </td>
      </tr>
    ))
  ) : (
    // Display a message when no players exist
    <tr>
      <td colSpan="9" style={{ textAlign: 'center' }}>
        No players found
      </td>
    </tr>
  )}
</tbody>

      </table>
            <CreatePlayer />  {/* Render the CreatePlayer component here */}

    </div>
  );
}

export default App;
