import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import CreatePlayer from './CreatePlayer';

function TeamsPlayers() {
  const [players, setPlayers] = useState([]); // Ensure initial state is an empty array
  const [teams, setTeams] = useState([]); // To store the list of teams
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { teamId } = useParams(); // Get teamId from URL parameters
  const [tradeTeamId, setTradeTeamId] = useState('');  // For storing the target team ID for trade
  const [playerIdToTrade, setPlayerIdToTrade] = useState(null);  // Player to be traded
  const [selectedTeamName, setSelectedTeamName] = useState(''); // For displaying current team name

  useEffect(() => {
    // Fetch players data from the API
    fetch(`http://localhost:3001/teams/${teamId}/players`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched players:", data); // Log the entire response for debugging
        if (data && data.length > 0) {
          setPlayers(data); // Update players state if data is valid
        } else {
          console.log('No players or empty players array:', data); // Log when no players are found
          setError('No players found for this team');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching players:', err);  // More specific error logging
        setError('Failed to fetch players');
        setLoading(false);
      });

    // Fetch team name to display it in the trade area
    fetch(`http://localhost:3001/teams/${teamId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.Team_Name) {
          setSelectedTeamName(data.Team_Name);
        }
      })
      .catch((err) => {
        console.error('Error fetching team name:', err);
        setError('Failed to fetch team name');
      });
  }, [teamId]); // Re-run this effect if teamId changes

  function handleDelete(playerId) {
    // Handle deleting a player
    fetch(`http://localhost:3001/players/${playerId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Update the players state by filtering out the deleted player
          setPlayers(prevPlayers => prevPlayers.filter(player => player.PlayerID !== playerId));
        } else {
          alert('Failed to delete player');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('Error deleting player');
      });
  }

  function handleTradeSubmit(e) {
    e.preventDefault();
  
    // Validation for team ID
    if (!tradeTeamId || isNaN(tradeTeamId)) {
      alert('Please enter a valid Team ID for trade');
      return;
    }
  
    // Validation for player ID
    if (!playerIdToTrade) {
      alert('Please select a player to trade');
      return;
    }
  
    // POST request to trade the player
    fetch('http://localhost:3001/trade-player', {  // Updated to the correct endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: playerIdToTrade,  // Adding player ID to the request body
        fromTeamId: teamId,  // Assuming teamId is the ID of the team the player is currently on
        toTeamId: tradeTeamId,      // The team to trade the player to
      }),
    })
      .then((response) => response.json())
      .catch((err) => {
        console.error('Error during trade:', err);
        alert('Error trading player');
      });
  }
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/teams">Teams view</Link>
          </li>
        </ul>
      </nav>

      <h1>Player List for Team {teamId} ({selectedTeamName})</h1>

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
            <th>Delete</th> {/* Only the Delete action */}
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
            <tr>
              <td colSpan="11" style={{ textAlign: 'center' }}>
                {error || 'No players found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Trade Player form */}
      <div>
        <h2>Trade Player</h2>
        <form onSubmit={handleTradeSubmit}>
          <p>Current Team: {selectedTeamName}</p>
          <label>
            Player ID to Trade:
            <input
              type="number"
              value={playerIdToTrade || ''}
              onChange={(e) => setPlayerIdToTrade(e.target.value)}
              placeholder="Enter Player ID to trade"
              required
            />
          </label>
          <br />
          <label>
            Target Team ID:
            <input
              type="number"
              value={tradeTeamId}
              onChange={(e) => setTradeTeamId(e.target.value)}
              placeholder="Enter Target Team ID"
              required
            />
          </label>
          <button type="submit">Trade Player</button>
        </form>
      </div>

      {/* Pass the teamId as a prop to CreatePlayer component */}
      <CreatePlayer teamId={teamId} />
    </div>
  );
}

export default TeamsPlayers;
