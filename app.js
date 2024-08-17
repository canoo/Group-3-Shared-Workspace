const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Property = require('./models/property');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/workspaceApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/property.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'property.html'));
});

app.get('/app.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});
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

//Retrieve the list of properties Erika

// API to get placeholder data
app.get('/api/placeholder-text', (req, res) => {
  const placeholderText = "Suggested Search"; // Replace with actual DB logic
  res.json({ placeholderText });
});
// Client-side JavaScript to fetch and update placeholder
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('/api/placeholder-text');
    const data = await response.json();
    const searchInput = document.querySelector(".topnav input[type='text']");
    if (data.placeholderText) {
      searchInput.setAttribute('placeholder', data.placeholderText);
    }
  } catch (error) {
    console.error('Error fetching placeholder text:', error);
  }
});
// add property accord whit the list erika
const loadProperty = () => {
  if (fs.existsSync(propertiesFilePath)) {
      const data = fs.readFileSync(propertiesFilePath);
      properties = JSON.parse(data);
  }
};

const saveProperty = () => {
  fs.writeFileSync(propertiesFilePath, JSON.stringify(properties, null, 2));
};

app.get('/property.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'property.html'));
});

app.get('/property', (req, res) => {
  console.log('Property fetched.');
  res.json(properties);
});

app.post('/add-property', (req, res) => {
  const { address, neighborhood, parking, transit, workspace, type,
      price, availability, availabilityDate, leaseTerm, sqft, seats, 
      smoking } = req.body;
  properties.push({
      address, neighborhood, parking, transit, workspace, type,
      price, availability, availabilityDate, leaseTerm, sqft, seats, 
      smoking
  });
  saveProperty();
  console.log(req.body);
  res.redirect('/');
});

app.delete('/delete-property/:index', (req, res) => {
  const { index } = req.params;
  if (index >= 0 && index < properties.length) {
      properties.splice(index, 1);
      saveProperty();
      res.status(200).send("Property deleted!");
  } else {
      res.status(404).send('Property not found');
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});