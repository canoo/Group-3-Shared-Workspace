const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App and API running on http://localhost:${PORT}`);
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get users
app.get('/api/users', (_, res) => {
  fs.readFile('database.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const db = JSON.parse(data);
    res.json({ data: db.users || [] });
  });
});

// Adding a new user
app.post('/api/users', (req, res) => {
  const newUser = req.body;

  fs.readFile('database.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const db = JSON.parse(data);
    db.users = db.users || [];
    db.users.push(newUser);

    fs.writeFile('database.json', JSON.stringify(db, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ data: newUser, message: 'User added successfully' });
    });
  });
});

// Get properties
app.get('/api/properties', (_, res) => {
  fs.readFile('database.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const db = JSON.parse(data);
    res.json({ data: db.properties || [] });
  });
});

// Adding a new property
app.post('/api/properties', (req, res) => {
  const newProperty = req.body;

  fs.readFile('database.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const db = JSON.parse(data);
    db.properties = db.properties || [];
    db.properties.push(newProperty);

    fs.writeFile('database.json', JSON.stringify(db, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ data: newProperty, message: 'Property added successfully' });
    });
  });
});
