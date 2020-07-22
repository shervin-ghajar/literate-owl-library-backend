"use strict";
// ----------------------------------------------------------------
import { getAllBooks, getBookById, getBooksByIds, getBooksByGenre, getBooksBySearch } from '../../../database/elasticsearch/services/books';
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // ------------------------------Get All Books----------------------------------
    router.get(`${route}`, (req, res) => {
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        getAllBooks().then(resonse => {
            data.result = resonse
            return res.status(200).json(data)
        }).catch(err => {
            console.log("search-err", err)
            return res.status(400).json(error)
        })
    })
    // ---------------------------------Get Book by Id-------------------------------
    router.get(`${route}/book/:bookId`, (req, res) => {
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        let { bookId } = req.params
        getBookById(bookId).then(response => {
            data.result = response
            return res.status(200).json(data)
        }).catch(err => {
            return res.status(400).json(error)
        })
    })
    // ---------------------------------Get Books by Id-------------------------------
    router.get(`${route}/ids`, (req, res) => {
        let { ids } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        getBooksByIds(ids).then(response => {
            data.result = response
            return res.status(200).json(data)
        }).catch(err => {
            console.log("mget-err", err)
            return res.status(400).json(error)
        })
    })
    // ---------------------------------Get By Genre-------------------------------
    router.get(`${route}/genres`, (req, res) => {
        let { genres } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        getBooksByGenre(genres).then(response => {
            data.result = response
            return res.status(200).json(data)
        }).catch(err => {
            console.log("genre-err", err)
            return res.status(400).json(error)
        })
    })
    // ---------------------------------Search Books-------------------------------
    router.get(`${route}/search`, (req, res) => {
        let { query } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        getBooksBySearch(query).then(response => {
            data.result = response
            return res.status(200).json(data)
        }).catch(err => {
            console.log("search-err", err)
            return res.status(400).json(error)
        })
    })
}
// ----------------------------------------------------------------
export default { prepare }
