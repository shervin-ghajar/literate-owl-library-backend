"use strict";
// ----------------------------------------------------------------
import { getAllBooks, getScrollableBooks, getBookById, getBooksByIds, getBooksByGenre, getBooksBySearch } from '../../../database/elasticsearch/services/books';
import { tokenValidator } from '../../../database/redis/services/token';
// ----------------------------------------------------------------
const prepare = (router) => {
    // ------------------------------Get All Books----------------------------------
    router.get("", (req, res) => {
        let { authorization, agent } = req.headers
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        getAllBooks().then(response => {
            data.result = response
            return res.status(200).json(data)
        }).catch(err => {
            console.log("search-err", err)
            return res.status(400).json(error)
        })
        // tokenValidator(authorization, agent, userId => {
        // }, err => {
        //     switch (err) {
        //         case 400:
        //             error.result = "Bad Request"
        //             return res.status(400).json(error)
        //         case 401:
        //             console.error("catch-err", err)
        //             error.result = "token unauthorized"
        //             return res.status(401).json(error)
        //     }
        // }).catch(err => {
        //     console.error("catch-err", err)
        //     error.result = "token unauthorized"
        //     return res.status(401).json(error)
        // })
    })
    // ------------------------------Get Scrollable Books----------------------------------
    router.post("/scroll", (req, res) => {
        let { authorization, agent } = req.headers
        let { queryType, scrollId, genres } = req.body
        console.warn(genres)
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        getScrollableBooks(queryType, scrollId, genres).then(response => {
            data.result = response
            return res.status(200).json(data)
        }).catch(err => {
            console.log("search-err", err)
            return res.status(400).json(error)
        })
        // tokenValidator(authorization, agent, () => {
        // }, err => {
        //     switch (err) {
        //         case 400:
        //             error.result = "Bad Request"
        //             return res.status(400).json(error)
        //         case 401:
        //             console.error("catch-err", err)
        //             error.result = "token unauthorized"
        //             return res.status(401).json(error)
        //     }
        // }).catch(err => {
        //     console.error("catch-err", err)
        //     error.result = "token unauthorized"
        //     return res.status(401).json(error)
        // })
    })
    // ---------------------------------Get Books by Ids-------------------------------
    router.post("/ids", (req, res) => {
        let { authorization, agent } = req.headers
        let { ids } = req.body
        console.warn(ids)
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
        // tokenValidator(authorization, agent, () => {
        // }, err => {
        //     switch (err) {
        //         case 400:
        //             error.result = "Bad Request"
        //             return res.status(400).json(error)
        //         case 401:
        //             console.error("catch-err", err)
        //             error.result = "token unauthorized"
        //             return res.status(401).json(error)
        //     }
        // }).catch(err => {
        //     console.error("catch-err", err)
        //     error.result = "token unauthorized"
        //     return res.status(401).json(error)
        // })
    })
    // ---------------------------------Get By Genre-------------------------------
    router.get("/genres", (req, res) => {
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
    router.post("/search", (req, res) => {
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
        getBooksBySearch(query).then(response => {
            data.result = response
            return res.status(200).json(data)
        }).catch(err => {
            console.log("search-err", err)
            return res.status(400).json(error)
        })
        // tokenValidator(authorization, agent, userId => {
        // }, err => {
        //     switch (err) {
        //         case 400:
        //             error.result = "Bad Request"
        //             return res.status(400).json(error)
        //         case 401:
        //             console.error("catch-err", err)
        //             error.result = "token unauthorized"
        //             return res.status(401).json(error)
        //     }
        // }).catch(err => {
        //     console.error("catch-err", err)
        //     error.result = "token unauthorized"
        //     return res.status(401).json(error)
        // })
    })
}
// ----------------------------------------------------------------
export default { prepare }
