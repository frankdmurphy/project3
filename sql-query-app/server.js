const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());  // Enables CORS for all routes

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Use your MySQL username
    password: 'your_password',  // Use your MySQL password
    database: 'club'  // Replace with your actual database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database!');
    }
});

// Endpoint to execute SQL query
app.post('/execute-query', (req, res) => {
    const { query } = req.body;
    db.query(query, (err, results) => {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.send({ results });
        }
    });
});

// Endpoint to get all records from the club table
app.get('/team', (req, res) => {
    const query = 'SELECT * FROM team'; // SQL query to fetch all records from the 'club' table
    db.query(query, (err, results) => {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.send({ clubs: results });
        }
    });
});

// Endpoint to get all records from the club table
app.get('/players', (req, res) => {
    const query = 'SELECT * FROM player'; // SQL query to fetch all records from the 'club' table
    db.query(query, (err, results) => {
        if (err) {
            res.status(400).send({ error: err.message });
        } else {
            res.send({ players: results });
        }
    });
});

// Route to delete a player by ID
app.delete('/players/:PlayerID', (req, res) => {
    const playerId = req.params.PlayerID;
  
    // MySQL query to delete player by ID
    db.query('DELETE FROM player WHERE PlayerID = ?', [playerId], (err, result) => {
      if (err) {
        console.error('Error deleting player:', err);
        return res.status(500).send('Failed to delete player');
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).send('Player not found');
      }
  
      // Send success response
      res.status(200).send('Player deleted');
    });
  });

// POST route to create a new player
app.post('/players', (req, res) => {
    const { Player_Id, First_Name, Last_Name, Middle_Name, Phone, DOB, Age, City, State, Zip } = req.body;
  
    // SQL query to insert new player into the database
    const query = `INSERT INTO player (PlayerId, First_Name, Last_Name, Middle_Name, Phone, DOB, Age, City, State, Zip) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    // Using parameterized queries to prevent SQL injection
    db.query(query, [Player_Id, First_Name, Last_Name, Middle_Name, Phone, DOB, Age, City, State, Zip], (err, result) => {
      if (err) {
        console.error('Error inserting player:', err);
        return res.status(500).json({ error: 'Failed to create player' });
      }
  
      // Send a response back to the client
      res.status(201).json({ message: 'Player created successfully', playerId: result.insertId });
    });
  });
  

app.get('/hello', (req, res) => {
    res.send('Hello Worldx');
});


// Start the server
app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
