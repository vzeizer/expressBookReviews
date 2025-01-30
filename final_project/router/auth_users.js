const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return username && username.length > 0 && !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.find(user => user.username === username && user.password === password);
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Create JWT token
    let accessToken = jwt.sign({
      username: username
    }, "access", { expiresIn: '1h' });

    // Store token in session
    req.session.authorization = {
      accessToken
    }

    return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;  // From JWT token

    if (!review) {
      return res.status(400).json({ message: "Review text is required" });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add or update review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ 
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews 
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating review" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.user.username; // Get username from JWT token

    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if user has a review for this book
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ 
      message: "Review deleted successfully",
      reviews: books[isbn].reviews 
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
