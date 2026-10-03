const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ===============================
// TASK 6/7: REGISTER NEW USER
// ===============================
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

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

    return res.status(201).json({
        message: "User successfully registered"
    });
});


// ===============================
// GET ALL BOOKS
// ===============================
public_users.get('/', async function (req, res) {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// ===============================
// GET BOOK BY ISBN
// ===============================
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(book);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book"
        });
    }
});


// ===============================
// GET BOOKS BY AUTHOR
// ===============================
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author.toLowerCase();

        const result = Object.values(books).filter(book =>
            book.author &&
            book.author.toLowerCase().includes(author)
        );

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// ===============================
// GET BOOKS BY TITLE
// ===============================
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();

        const result = Object.values(books).filter(book =>
            book.title &&
            book.title.toLowerCase().includes(title)
        );

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// ===============================
// GET BOOK REVIEW
// ===============================
public_users.get('/review/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(book.reviews || {});

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving review"
        });
    }
});


module.exports.general = public_users;
