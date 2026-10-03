const axios = require("axios");

const BASE_URL = "http://localhost:5000";

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

module.exports = {
    getAllBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle
};
