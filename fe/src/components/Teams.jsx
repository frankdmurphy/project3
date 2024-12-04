import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

import '../styles/Teams.css'

function Teams() {
  const [teams, setTeams] = useState([]);  // Changed players to teams
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Initialize navigate function

  useEffect(() => {
    // Fetch teams data from the backend
    fetch("http://localhost:3001/teams")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched teams:", data);
        setTeams(data.teams);  // Set the teams data
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch teams");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleNavigate = (teamId) => {
    // Navigate to the players page for the selected team
    navigate(`/teams/${teamId}/players`);
  };

  return (
    <div className="Teams">
      <h1>Teams List</h1>

      {/* Display the teams in a table */}
      <table border="1">
        <thead>
          <tr>
            <th>Team ID</th>
            <th>Team Name</th>
            <th>Establishment Date</th>
            <th>Ranking</th>
            <th>Number of Players</th>
            <th>Games Won</th>
            <th>Win Rate</th>
            <th>Team Color</th>
            <th>Tournament</th>
            <th>Owner ID</th>
            <th>Stadium ID</th>
            <th>Action</th> {/* New column for the button */}
          </tr>
        </thead>
        <tbody>
          {/* Check if there are teams */}
          {teams.length > 0 ? (
            // Map over the teams array and display each team
            teams.map((team, index) => (
              <tr key={index}>
                <td>{team.Team_ID}</td>
                <td>{team.Team_Name}</td>
                <td>{team.EstablishmentDate}</td>
                <td>{team.Ranking}</td>
                <td>{team.Number_Of_Players}</td>
                <td>{team.Games_Won}</td>
                <td>{team.Win_Rate}</td>
                <td>{team.Team_Color}</td>
                <td>{team.Tournament}</td>
                <td>{team.Owner_ID}</td>
                <td>{team.Stadium_ID}</td>
                <td>
                  <button
                    onClick={() => handleNavigate(team.Team_ID)}  // Navigate to the players page for this team
                  >
                    View Players
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" style={{ textAlign: "center" }}>
                No teams found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Teams;
