"use strict";
// ----------------------------------------------------------------
import { getAllBooks, getBookById, getBooksByIds, getBooksByGenre, getBooksBySearch } from '../../../database/elasticsearch/services/books';
import { tokenValidator } from '../../../database/redis/services/token';
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // ------------------------------Get All Books----------------------------------
    router.get(`${route}`, (req, res) => {
        let { authorization, agent } = req.headers
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        tokenValidator(authorization, agent, userId => {
            getAllBooks().then(response => {
                data.result = response
                return res.status(200).json(data)
            }).catch(err => {
                console.log("search-err", err)
                return res.status(400).json(error)
            })
        }, err => {
            switch (err) {
                case 400:
                    error.result = "Bad Request"
                    return res.status(400).json(error)
                case 401:
                    console.error("catch-err", err)
                    error.result = "token unauthorized"
                    return res.status(401).json(error)
            }
        }).catch(err => {
            console.error("catch-err", err)
            error.result = "token unauthorized"
            return res.status(401).json(error)
        })
    })
    // ---------------------------------Get Book by Id-------------------------------
    router.get(`${route}/book/:bookId`, (req, res) => {
        let { authorization, agent } = req.headers
        let { bookId } = req.params
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        tokenValidator(authorization, agent, userId => {
            getBookById(bookId).then(response => {
                data.result = response
                return res.status(200).json(data)
            }).catch(err => {
                return res.status(400).json(error)
            })
        }, err => {
            switch (err) {
                case 400:
                    error.result = "Bad Request"
                    return res.status(400).json(error)
                case 401:
                    console.error("catch-err", err)
                    error.result = "token unauthorized"
                    return res.status(401).json(error)
            }
        }).catch(err => {
            console.error("catch-err", err)
            error.result = "token unauthorized"
            return res.status(401).json(error)
        })
    })
    // ---------------------------------Get Books by Id-------------------------------
    router.get(`${route}/ids`, (req, res) => {
        let { authorization, agent } = req.headers
        let { ids } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        tokenValidator(authorization, agent, userId => {
            getBooksByIds(ids).then(response => {
                data.result = response
                return res.status(200).json(data)
            }).catch(err => {
                console.log("mget-err", err)
                return res.status(400).json(error)
            })
        }, err => {
            switch (err) {
                case 400:
                    error.result = "Bad Request"
                    return res.status(400).json(error)
                case 401:
                    console.error("catch-err", err)
                    error.result = "token unauthorized"
                    return res.status(401).json(error)
            }
        }).catch(err => {
            console.error("catch-err", err)
            error.result = "token unauthorized"
            return res.status(401).json(error)
        })
    })
    // ---------------------------------Get By Genre-------------------------------
    router.get(`${route}/genres`, (req, res) => {
        let { authorization, agent } = req.headers
        let { genres } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        tokenValidator(authorization, agent, userId => {
            getBooksByGenre(genres).then(response => {
                data.result = response
                return res.status(200).json(data)
            }).catch(err => {
                console.log("genre-err", err)
                return res.status(400).json(error)
            })
        }, err => {
            switch (err) {
                case 400:
                    error.result = "Bad Request"
                    return res.status(400).json(error)
                case 401:
                    console.error("catch-err", err)
                    error.result = "token unauthorized"
                    return res.status(401).json(error)
            }
        }).catch(err => {
            console.error("catch-err", err)
            error.result = "token unauthorized"
            return res.status(401).json(error)
        })

    })
    // ---------------------------------Search Books-------------------------------
    router.get(`${route}/search`, (req, res) => {
        let { authorization, agent } = req.headers
        let { query } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        tokenValidator(authorization, agent, userId => {
            getBooksBySearch(query).then(response => {
                data.result = response
                return res.status(200).json(data)
            }).catch(err => {
                console.log("search-err", err)
                return res.status(400).json(error)
            })
        }, err => {
            switch (err) {
                case 400:
                    error.result = "Bad Request"
                    return res.status(400).json(error)
                case 401:
                    console.error("catch-err", err)
                    error.result = "token unauthorized"
                    return res.status(401).json(error)
            }
        }).catch(err => {
            console.error("catch-err", err)
            error.result = "token unauthorized"
            return res.status(401).json(error)
        })
    })
}
// ----------------------------------------------------------------
export default { prepare }
