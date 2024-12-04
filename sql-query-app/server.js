const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // replace with mysql username
  password: "your_password", // replace with mysql password
  database: "club",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database!");
  }
});

app.post("/trade-player", (req, res) => {
    const { playerId, fromTeamId, toTeamId } = req.body;
  
    // Check if the player is actually on the 'from' team
    const checkPlayerQuery = `SELECT * FROM player_team WHERE Player_ID = ? AND Team_ID = ?`;
    
    db.query(checkPlayerQuery, [playerId, fromTeamId], (err, results) => {
      if (err) {
        return res.status(500).send({ error: "Database error: " + err.message });
      }
  
      const deleteQuery = `DELETE FROM player_team WHERE Player_ID = ? AND Team_ID = ?`;
  
      db.query(deleteQuery, [playerId, fromTeamId], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).send({ error: "Failed to remove player from the current team" });
        }
  
        // Step 2: Add the player to the 'to' team
        const insertQuery = `INSERT INTO player_team (Player_ID, Team_ID) VALUES (?, ?)`;
  
        db.query(insertQuery, [playerId, toTeamId], (insertErr) => {
          if (insertErr) {
            return res.status(500).send({ error: "Failed to add player to the new team" });
          }
  
          // Successfully traded the player
          res.send({ message: "Player successfully traded", playerId, fromTeamId, toTeamId });
        });
      });
    });
  });
  


app.get("/players", (req, res) => {
  const query = "SELECT * FROM player";
  db.query(query, (err, results) => {
    if (err) {
      res.status(400).send({ error: err.message });
    } else {
      res.send({ players: results });
    }
  });
});

app.get("/teams", (req, res) => {
    const query = `
      SELECT t.*, subquery.Number_Of_Players
      FROM team t
      JOIN (
        SELECT pt.team_id, COUNT(*) AS Number_Of_Players
        FROM player_team pt
        GROUP BY pt.team_id
      ) subquery ON t.team_id = subquery.team_id
    `;
    db.query(query, (err, results) => {
      if (err) {
        res.status(400).send({ error: err.message });
      } else {
        res.send({ teams: results });
      }
    });
  });
  

app.get("/teams/:teamId/players", (req, res) => {
  const { teamId } = req.params;

  // SQL query to get players for the specified team
  const query = `
        SELECT p.PlayerID, p.First_Name, p.Last_Name, p.Middle_Name, p.Phone, p.DOB, p.Age, p.City, p.State, p.Zip
        FROM player p
        JOIN player_team pt ON p.PlayerID = pt.Player_ID
        WHERE pt.Team_ID = ?
    `;

  // Run the query with the teamId as the parameter
  db.query(query, [teamId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Error fetching players" });
    } else {
      res.json(results);
    }
  });
});

app.delete("/players/:PlayerID", (req, res) => {
  const playerId = req.params.PlayerID;

  db.query(
    "DELETE FROM player WHERE PlayerID = ?",
    [playerId],
    (err, result) => {
      if (err) {
        console.error("Error deleting player:", err);
        return res.status(500).send("Failed to delete player");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Player not found");
      }

      res.status(200).send("Player deleted");
    }
  );
});

app.post("/teams/:teamId/players", (req, res) => {
  const { teamId } = req.params;
  const {
    Player_Id,
    First_Name,
    Last_Name,
    Middle_Name,
    Phone,
    DOB,
    Age,
    City,
    State,
    Zip,
  } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    // Step 1: Insert the player into the 'player' table
    const playerQuery = `
        INSERT INTO player (PlayerID, First_Name, Last_Name, Middle_Name, Phone, DOB, Age, City, State, Zip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      playerQuery,
      [
        Player_Id,
        First_Name,
        Last_Name,
        Middle_Name,
        Phone,
        DOB,
        Age,
        City,
        State,
        Zip,
      ],
      (err, result) => {
        if (err) {
          // If there's an error in inserting the player, rollback the transaction
          console.error("Error inserting player:", err);
          return db.rollback(() => {
            return res.status(500).json({ error: "Failed to create player" });
          });
        }

        // Step 2: Insert the relationship into the 'player_team' table
        const playerTeamQuery = `
          INSERT INTO player_team (Player_ID, Team_ID)
          VALUES (?, ?)`;

        db.query(playerTeamQuery, [Player_Id, teamId], (err) => {
          if (err) {
            // If there's an error in inserting the relationship, rollback the transaction
            console.error("Error inserting player-team relationship:", err);
            return db.rollback(() => {
              return res
                .status(500)
                .json({ error: "Failed to assign player to team" });
            });
          }

          // Commit the transaction if both the player and the relationship were inserted successfully
          db.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return db.rollback(() => {
                return res
                  .status(500)
                  .json({ error: "Failed to commit transaction" });
              });
            }

            // Successfully created the player and linked to the team
            res
              .status(201)
              .json({
                message: "Player created and assigned to team successfully",
                Player_Id,
              });
          });
        });
      }
    );
  });
});

app.get("/hello", (req, res) => {
  res.send("Hello Worldx");
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
