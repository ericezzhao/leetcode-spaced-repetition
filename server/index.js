const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'lcanki.db'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        leetcodeId INTEGER NOT NULL,
        title TEXT NOT NULL,
        difficulty INTEGER NOT NULL,
        category TEXT NOT NULL,
        lastReviewed TEXT,
        nextReview TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Problems table ready');
      }
    });
  }
});

// Routes
app.get('/api/problems', (req, res) => {
  const now = new Date().toISOString();
  
  // First, update any problems that have passed their review time
  db.run(
    'UPDATE problems SET nextReview = NULL WHERE nextReview <= ?',
    [now],
    (err) => {
      if (err) {
        console.error('Error updating expired reviews:', err);
      }
      
      // Then fetch all problems
      db.all('SELECT * FROM problems ORDER BY nextReview ASC', [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    }
  );
});

app.post('/api/problems', (req, res) => {
  const { leetcodeId, title, difficulty, category } = req.body;
  
  if (!leetcodeId || !title || !difficulty || !category) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const now = new Date();
  // Set initial review to now so it appears in review queue immediately
  db.run(
    'INSERT INTO problems (leetcodeId, title, difficulty, category, lastReviewed, nextReview) VALUES (?, ?, ?, ?, ?, NULL)',
    [leetcodeId, title, difficulty, category, now.toISOString()],
    function(err) {
      if (err) {
        console.error('Error inserting problem:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.post('/api/problems/:id/rate', (req, res) => {
  const { id } = req.params;
  const { difficulty } = req.body;

  if (!difficulty || difficulty < 1 || difficulty > 5) {
    res.status(400).json({ error: 'Invalid difficulty rating' });
    return;
  }

  const now = new Date();
  let nextReview;

  // Calculate next review based on difficulty
  switch (difficulty) {
    case 1: // Rating 1
      nextReview = new Date(now.getTime() + 5 * 1000); break; // 5 seconds
    case 2: // Rating 2
      nextReview = new Date(now.getTime() + 60 * 60000); break; // 1 hour
    case 3: // Rating 3
      nextReview = new Date(now.getTime() + 6 * 60 * 60000); break; // 6 hours
    case 4: // Rating 4
      nextReview = new Date(now.getTime() + 24 * 60 * 60000); break; // 1 day
    case 5: // Rating 5
      nextReview = new Date(now.getTime() + 3 * 24 * 60 * 60000); break; // 3 days
  }

  db.run(
    'UPDATE problems SET lastReviewed = ?, nextReview = ? WHERE id = ?',
    [now.toISOString(), nextReview.toISOString(), id],
    (err) => {
      if (err) {
        console.error('Error updating problem:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

app.delete('/api/problems/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM problems WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting problem:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 