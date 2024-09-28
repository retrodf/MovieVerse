const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();0
app.use(cors()); 
app.use(express.json()); 

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "movieverse."
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

app.get('/cms/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.get('/cms/countries',  (req, res) => {
  const sql = 'SELECT * FROM countries';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching countries:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


// Starting the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});

