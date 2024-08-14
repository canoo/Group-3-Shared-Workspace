const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App and API running on port http://localhost:${PORT}`);
});


//api
const bodyParser = require('body-parser');
const fs = require('fs');
// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//get users
app.get('/api/users', (_, res) => {
  fs.readFile('database.json', (err, data) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      const users = JSON.parse(data);
      res.json({ data: users });
  });
});
// Adding a new user
app.post('/api/users', (req, res) => {
  const newUser = req.body;

  // Read the existing users
  fs.readFile('database.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const users = JSON.parse(data);

    // Add the new user
    users.push(newUser);

    // Write the updated users back to the file
    fs.writeFile('database.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ data: newUser, message: 'User added successfully' });
    });
  });
});

//get properties
app.get('/api/properties', (_, res) => {
  fs.readFile('properties.json', (err, data) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      const properties = JSON.parse(data);
      res.json({ data: properties });
  });
});

// Adding a new property
app.post('/api/properties', (req, res) => {
  const newProperty = req.body;

  // Read the existing properties
  fs.readFile('properties.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const properties = JSON.parse(data);

    // Add the new property
    properties.push(newProperty);

    // Write the updated properties back to the file
    fs.writeFile('properties.json', JSON.stringify(properties, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ data: newProperty, message: 'Property added successfully' });
    });
  });
});
