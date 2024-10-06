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
  database: "movieverse_db"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

// GET endpoint untuk mendapatkan semua user
app.get('/cms/users', (req, res) => {
  const sql = 'SELECT * FROM user';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// GET endpoint untuk mendapatkan semua negara
app.get('/cms/countries', (req, res) => {
  const sql = 'SELECT * FROM country';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching country:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// GET endpoint untuk mendapatkan semua genre
app.get('/cms/genres', (req, res) => {
  const sql = 'SELECT id, name FROM genre'; // Query untuk mengambil id dan name dari tabel genre
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching genres:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results); // Kirim hasil query sebagai JSON
  });
});

// Starting the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});

