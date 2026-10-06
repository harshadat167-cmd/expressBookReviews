const express = require('express');
const jwt = require('jsonwebtoken');

let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];


// ============================================================
// CHECK WHETHER USERNAME EXISTS
// ============================================================

const isValid = (username) => {

    return users.some((user) => {
        return user.username === username;
    });

};


// ============================================================
// CHECK USERNAME + PASSWORD
// ============================================================

const authenticatedUser = (username, password) => {

    return users.some((user) => {
        return (
            user.username === username &&
            user.password === password
        );
    });

};


// ============================================================
// TASK 8 - LOGIN
// ============================================================

regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid Login. Check username and password"
        });
    }

    const accessToken = jwt.sign(
        { username: username },
        "access",
        { expiresIn: "1h" }
    );

    req.session.authorization = {
        accessToken: accessToken,
        username: username
    };

    return res.status(200).json({
        message: "User successfully logged in"
    });

});


// ============================================================
// TASK 9 - ADD / UPDATE REVIEW
// ============================================================

regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.body.review;

    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "ISBN is not found"
        });
    }

    if (!review) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });

});


// ============================================================
// TASK 10 - DELETE REVIEW
// ============================================================

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "ISBN is not found"
        });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({
            message: "Review by this user not found"
        });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
    });

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
