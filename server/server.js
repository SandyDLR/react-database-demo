const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite setup
const db = new sqlite3.Database('./questions.db'); // Saves the database to a file

// Create tables and add initial data
db.serialize(() => {
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    db.run('CREATE TABLE questions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, question TEXT)');
    
    // Insert sample users
    db.run('INSERT INTO users (name) VALUES (?)', ['User A']);
    db.run('INSERT INTO users (name) VALUES (?)', ['User B']);

    // Insert sample questions for User A
    db.run('INSERT INTO questions (user_id, question) VALUES (?, ?)', [1, 'What is your favorite color?']);
    db.run('INSERT INTO questions (user_id, question) VALUES (?, ?)', [1, 'What is your dream job?']);

    // Insert sample questions for User B
    db.run('INSERT INTO questions (user_id, question) VALUES (?, ?)', [2, 'What is your favorite movie?']);
    db.run('INSERT INTO questions (user_id, question) VALUES (?, ?)', [2, 'Where would you like to travel?']);
});

// Fetch all users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Fetch questions for a specific user
app.get('/questions/:userId', (req, res) => {
    const { userId } = req.params;
    db.all('SELECT * FROM questions WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
