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

// API Routes
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

// Property Routes
let books = [];

const loadBooks = () => {
  if (fs.existsSync('books.json')) {
    const data = fs.readFileSync('books.json');
    books = JSON.parse(data);
  }
};

const saveBook = () => {
  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
};

loadBooks();

app.get('/books', (req, res) => {
  res.json(books);
});

app.post('/add-book', (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  saveBook();
  res.redirect('/');
});

app.delete('/delete-book/:index', (req, res) => {
  const { index } = req.params;
  if (index >= 0 && index < books.length) {
    books.splice(index, 1);
    saveBook();
    res.status(200).send("Book deleted!");
  } else {
    res.status(404).send('Book not found');
  }
});

app.put('/update-book/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const updatedBook = req.body;

  if (index >= 0 && index < books.length) {
    books[index] = updatedBook;
    saveBook();
    res.status(200).send('Book updated successfully');
  } else {
    res.status(404).send('Book not found');
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
