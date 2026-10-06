const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ============================================================
// TASK 7 - REGISTER NEW USER
// ============================================================

public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});
const BASE_URL = "http://localhost:5000";

// ============================================================
// GET ALL BOOKS
// ============================================================

public_users.get("/", (req, res) => {
    res.status(200).json(books);
});


// ============================================================
// GET BOOK BY ISBN
// ============================================================

public_users.get("/isbn/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.status(200).json(books[isbn]);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


// ============================================================
// GET BOOKS BY AUTHOR
// ============================================================

public_users.get("/author/:author", (req, res) => {

    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author
    );

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


// ============================================================
// GET BOOKS BY TITLE
// ============================================================

public_users.get("/title/:title", (req, res) => {

    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(
        (book) => book.title.toLowerCase().includes(title)
    );

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


// ============================================================
// GET REVIEWS FOR A BOOK
// ============================================================

public_users.get("/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({
            message: "ISBN is not found"
        });
    }
});


// ============================================================
// TASK 11 - AXIOS FUNCTIONS
// ============================================================

// Get all books using callback
function getAllBooks(callback) {

    axios
        .get(`${BASE_URL}/`)
        .then((response) => {
            callback(null, response.data);
        })
        .catch((error) => {
            callback(error, null);
        });
}


// Get book by ISBN using Promise
function getBookByISBN(isbn) {

    return new Promise((resolve, reject) => {

        axios
            .get(`${BASE_URL}/isbn/${isbn}`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });

    });
}


// Get books by author using async/await
async function getBooksByAuthor(author) {

    const response = await axios.get(
        `${BASE_URL}/author/${encodeURIComponent(author)}`
    );

    return response.data;
}


// Get books by title using async/await
async function getBooksByTitle(title) {

    const response = await axios.get(
        `${BASE_URL}/title/${encodeURIComponent(title)}`
    );

    return response.data;
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    general: public_users,

    getAllBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle
};

