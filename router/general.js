const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/', function (req, res) {
    res.status(200).json(books); // books is expected to be a valid object
});

public_users.post("/register", (req, res) => {
    let { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
const axios = require('axios'); // Import Axios at the top

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/books'); // Replace with the actual backend endpoint
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});



 public_users.get('/isbn/:isbn', async function (req, res) {
    let isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/books/${isbn}`); // Replace with the actual backend endpoint
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found", error: error.message });
    }
});


  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    let author = req.params.author.toLowerCase();
    try {
        const response = await axios.get('http://localhost:5000/books'); // Replace with the actual backend endpoint
        const books = response.data;

        // Filter books by author
        const result = Object.values(books).filter(book => book.author.toLowerCase() === author);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});



// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    let title = req.params.title.toLowerCase();
    try {
        const response = await axios.get('http://localhost:5000/books'); // Replace with the actual backend endpoint
        const books = response.data;

        // Filter books by title
        const result = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn; // Get the ISBN from the request parameters
    let book = books[isbn]; // Retrieve the book based on the ISBN

    if (book && Object.keys(book.reviews).length > 0) {
        res.status(200).json(book.reviews); // Return the reviews for the book
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});


module.exports.general = public_users;
