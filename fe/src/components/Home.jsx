import React from "react";
import { Route, Routes, Navigate  } from "react-router-dom";
import Teams from "./Teams";
import TeamsPlayers from "./TeamsPlayers";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/teams" />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:teamId/players" element={<TeamsPlayers />} />
      </Routes>
    </div>
  );
}

export default App;
