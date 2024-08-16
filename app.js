const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Load the database
let db = { users: [], properties: [] };

const loadDatabase = () => {
  if (fs.existsSync('database.json')) {
    const data = fs.readFileSync('database.json');
    db = JSON.parse(data);
  }
};

const saveDatabase = () => {
  fs.writeFileSync('database.json', JSON.stringify(db, null, 2));
};

loadDatabase();

// API Routes

// Get all users
app.get('/api/users', (_, res) => {
  res.json({ data: db.users });
});

// Add a new user
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  db.users.push(newUser);
  saveDatabase();
  res.json({ data: newUser, message: 'User added successfully' });
});

// Get all properties
app.get('/api/properties', (_, res) => {
  console.log('Fetching properties:', db.properties);  // Debugging
  res.json({ data: db.properties });
});

// Get a specific property by index
app.get('/api/properties/:index', (req, res) => {
  const { index } = req.params;
  if (index >= 0 && index < db.properties.length) {
    res.json(db.properties[index]);
  } else {
    res.status(404).send('Property not found');
  }
});

// Add a new property
app.post('/api/properties', (req, res) => {
  const newProperty = req.body;
  db.properties.push(newProperty);
  saveDatabase();
  res.json({ data: newProperty, message: 'Property added successfully' });
});

// Update a property by index
app.put('/api/properties/:index', (req, res) => {
  const { index } = req.params;
  const updatedProperty = req.body;

  if (index >= 0 && index < db.properties.length) {
    db.properties[index] = updatedProperty;
    saveDatabase();
    res.status(200).send('Property updated successfully');
  } else {
    res.status(404).send('Property not found');
  }
});

// Delete a property by index
app.delete('/api/properties/:index', (req, res) => {
  const { index } = req.params;
  if (index >= 0 && index < db.properties.length) {
    db.properties.splice(index, 1);
    saveDatabase();
    res.status(200).send('Property deleted successfully');
  } else {
    res.status(404).send('Property not found');
  }
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/detailProperty.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detailProperty.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});