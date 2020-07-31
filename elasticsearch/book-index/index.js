const csv = require('csv-parser')
const fs = require("fs")
const book_csv = "elasticsearch/book-index/book_data.csv"
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: 'http://localhost:9200'
})
//----------------------------------------------------------------------------------
var data_set = []
let bookData = []
fs.createReadStream(book_csv)
    .pipe(csv())
    .on('data', data => data_set.push(data))
    .on('end', async () => {
        data_set.map((result, index) => {
            let { book_authors, book_title, genres, book_desc, book_pages, book_rating, book_rating_count, image_url } = result
            let authors = book_authors.split("|")
            let pages = book_pages.match(/\d+/g)
            pages = pages ? parseInt(pages[0]) : getRandomYear(200, 800)
            genres = genres.split("|")
            let uniqueGenres = []
            book_desc = book_desc.length == 0 ? "No description provided for this book" : book_desc
            genres.forEach(genre => {
                uniqueGenres.some(element => element == genre) ? null : uniqueGenres.push(genre)
            })
            let price = getRandomPrice(50)
            let year = getRandomYear(1995, 2021)
            bookData[index] = Object.assign({}, { authors, title: book_title, desc: book_desc, genres: uniqueGenres, pages, rating: parseFloat(book_rating), rating_count: parseInt(book_rating_count), price, year, image_url })
        })
        let dataset = []
        for (let index = 0; index < bookData.length; index++) {
            dataset.push(bookData[index])
            if (index && ((index % 5000) == 0)) {
                // console.log("bulk", index, dataset.length)
                const body = dataset.flatMap(doc => [{ index: { _index: 'books' } }, doc])
                const { body: bulkResponse } = await client.bulk({ refresh: true, body })
                dataset = []
            }
            console.log(index, bookData.length)
        }
        const body = dataset.flatMap(doc => [{ index: { _index: 'books' } }, doc])
        const { body: bulkResponse } = await client.bulk({ refresh: true, body })
        console.log("Indexing Done")
    })
//----------------------------------------------------------------------------------
function getRandomPrice(max) {
    let random_num = parseInt(Math.random() * max);
    let random_digit = parseInt(Math.random() * 99);
    let randomDigit;
    if (random_digit >= 90) {
        randomDigit = 99;
    } else if (random_digit >= 80) {
        randomDigit = 89;
    } else if (random_digit >= 70) {
        randomDigit = 79;
    } else if (random_digit >= 60) {
        randomDigit = 69;
    } else if (random_digit >= 50) {
        randomDigit = 59;
    } else if (random_digit >= 40) {
        randomDigit = 49;
    } else if (random_digit >= 30) {
        randomDigit = 39;
    } else if (random_digit >= 24) {
        randomDigit = 29;
    } else if (random_digit >= 20) {
        randomDigit = 25;
    } else {
        randomDigit = "00";
    }
    let price = `${random_num}.${randomDigit}`;
    price = Number(price) > 6 ? price : "0";
    return price;
}
function getRandomYear(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}