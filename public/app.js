const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
//const port = 3000

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


// Propiedades PAOLA
app.use(express.urlencoded({ extended: true }));

const booksFilePath = path.join(__dirname, 'books.json')
var books = []

const loadBooks = () => {
    if (fs.existsSync(booksFilePath)) {
        const data = fs.readFileSync(booksFilePath)
        books = JSON.parse(data);
    }
}

const saveBook = () => {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2))

}

loadBooks()

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'property.html'))
})

app.get('/detailProperty.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detailProperty.html'))
})

app.get('/books', (req, res) => {
    console.log('Books fed.')
    res.json(books)
})

app.post('/add-book', (req, res) => {
    const { 
      address, 
      neighborhood, 
      parking, 
      transit, 
      workspace, 
      type, 
      price, 
      availability, 
      availabilityDate, 
      leaseTerm, 
      sqft, 
      seats, 
      smoking 
    } = req.body;
    books.push({
      address, 
      neighborhood, 
      parking, 
      transit, 
      workspace, 
      type, 
      price, 
      availability, 
      availabilityDate, 
      leaseTerm, 
      sqft, 
      seats, 
      smoking
    });
    saveBook()
    console.log(req.body)
    res.redirect('/');
})

app.delete('/delete-book/:index', (req, res) =>{
    const { index } = req.params
    if (index >= 0 && index < books.length) {
        books.splice(index, 1)
        saveBook()
        res.status(200).send("Book deleted!")
    }
    else {
        res.status(404).send('Book not found')
    }

})

app.get('/books/:index', (req, res) => {
  const { index } = req.params;
  const bookIndex = parseInt(index, 10); // Convertir el índice a un número entero

  if (bookIndex >= 0 && bookIndex < books.length) {
      res.json(books[bookIndex]);
  } else {
      res.status(404).send('Property not found');
  }
});

// actualizar propiedad PAOLA

app.use(express.json());

// Ruta para actualizar una propiedad
// Ruta para actualizar una propiedad
app.put('/update-book/:index', (req, res) => {
  const index = parseInt(req.params.index, 10); // Asegúrate de convertir el índice a número
  const updatedBook = req.body;

  fs.readFile(path.join(__dirname, 'books.json'), 'utf8', (err, data) => {
      if (err) return res.status(500).send('Error reading file');

      let books;
      try {
          books = JSON.parse(data);
      } catch (parseErr) {
          return res.status(500).send('Error parsing JSON');
      }

      if (index >= 0 && index < books.length) {
          books[index] = updatedBook;

          fs.writeFile(path.join(__dirname, 'books.json'), JSON.stringify(books, null, 2), (err) => {
              if (err) return res.status(500).send('Error writing file');
              res.status(200).send('Book updated successfully');
          });
      } else {
          res.status(404).send('Book not found');
      }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
