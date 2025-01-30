const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists or is invalid" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
//  return res.status(300).json({message: "Yet to be implemented"});
});

/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  try {
    const booksList = JSON.stringify(books, null, 2);
    res.status(200).json(JSON.parse(booksList));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});
*/

// Task 10: Get all books using async/await
const getAllBooks = async () => {
  try {
    // Simulate API call with local data
    // In real scenario, this would be: await axios.get('api/books')
    return Promise.resolve(books);
  } catch (error) {
    throw new Error('Error fetching books');
  }
};

public_users.get('/', async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
      res.status(200).json(books[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book details" });
  }
  //  return res.status(300).json({message: "Yet to be implemented"});
 });
*/


// Task 11: Get book by ISBN using async/await
const getBookByISBN = async (isbn) => {
  try {
    // Simulate API call with local data
    // In real scenario: await axios.get(`api/books/${isbn}`)
    const book = books[isbn];
    if (!book) {
      throw new Error('Book not found');
    }
    return Promise.resolve(book);
  } catch (error) {
    throw error;
  }
};

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await getBookByISBN(isbn);
    res.status(200).json(book);
  } catch (error) {
    if (error.message === 'Book not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error retrieving book details' });
    }
  }
});


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  try {
    const authorName = req.params.author;
    const booksByAuthor = Object.values(books).filter(
      book => book.author.toLowerCase() === authorName.toLowerCase()
    );
    
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});


/*
// Helper function
const getBooksByAuthor = async (authorName) => {
  try {
    // Filter books by author (case-insensitive)
    const booksList = Object.values(books).filter(
      book => book.author.toLowerCase() === authorName.toLowerCase()
    );
    
    // If no books found, throw error
    if (booksList.length === 0) {
      throw new Error('No books found for this author');
    }
    
    // Wrap result in Promise
    return Promise.resolve(booksList);
  } catch (error) {
    throw error;
  }
};
*/

// Route handler
public_users.get('/author/:author', async (req, res) => {
  try {
    const authorName = req.params.author;
    const books = await getBooksByAuthor(authorName);
    res.status(200).json(books);
  } catch (error) {
    // Different response for "not found" vs other errors
    if (error.message === 'No books found for this author') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error retrieving books' });
    }
  }
});

/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  try {
    const bookTitle = req.params.title;
    const booksByTitle = Object.values(books).filter(
      book => book.title.toLowerCase().includes(bookTitle.toLowerCase())
    );
    
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});
*/

// Helper function
const getBooksByTitle = async (bookTitle) => {
  try {
    // Filter books by title (case-insensitive, partial match)
    const booksList = Object.values(books).filter(
      book => book.title.toLowerCase().includes(bookTitle.toLowerCase())
    );
    
    // If no books found, throw error
    if (booksList.length === 0) {
      throw new Error('No books found with this title');
    }
    
    // Wrap result in Promise
    return Promise.resolve(booksList);
  } catch (error) {
    throw error;
  }
};

// Route handler
public_users.get('/title/:title', async (req, res) => {
  try {
    const bookTitle = req.params.title;
    const books = await getBooksByTitle(bookTitle);
    res.status(200).json(books);
  } catch (error) {
    // Different response for "not found" vs other errors
    if (error.message === 'No books found with this title') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error retrieving books' });
    }
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
      res.status(200).json(books[isbn].reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
