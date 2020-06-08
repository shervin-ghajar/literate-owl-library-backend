"use strict";
// ----------------------------------------------------------------
import { Client } from '@elastic/elasticsearch';
const esClient = new Client({ node: 'http://localhost:9200' })
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // ------------------------------Get All Books----------------------------------
    router.get(`${route}`, async (req, res) => {
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        try {
            let { body } = await esClient.search({
                index: 'books',
                size: 5,
                // from: 0,
                body: {
                    query: {
                        match_all: {}
                    }
                }
            })
            let { hits } = body.hits
            let books = []
            hits.map((hit, i) => {
                let { _id, _source } = hit
                books[i] = Object.assign({ id: _id }, _source)
            })
            data.result = books
            return res.status(200).json(data)
        } catch (err) {
            console.log("search-err", err)
            return res.status(400).json(error)
        }
    })
    // ---------------------------------Get Book by Id-------------------------------
    router.get(`${route}/book/:bookId`, async (req, res) => {
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        let { bookId } = req.params
        try {
            let { body } = await esClient.get({
                index: 'books',
                id: bookId,
            })
            let { _id, _source } = body
            if (body.found) {
                let book = Object.assign({ id: _id }, _source)
                data.result = book
                return res.status(200).json(data)
            }
            error.result = "book not found"
            return res.status(404).json(error)
        } catch (err) {
            console.log("get-err", err)
            return res.status(400).json(error)
        }
    })
    // ---------------------------------Get Books by Ids-------------------------------
    router.get(`${route}/ids`, async (req, res) => {
        let { ids } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        try {
            let { body } = await esClient.mget({
                index: 'books',
                body: {
                    ids: [...ids],
                }
            })
            let { docs } = body
            if (docs.length > 0) {
                let books = []
                docs.map((doc, i) => {
                    let { _id, _source } = doc
                    books[i] = Object.assign({ id: _id }, _source)
                })
                data.result = books
                return res.status(200).json(data)
            }
            error.result = "book not found"
            return res.status(404).json(error)
        } catch (err) {
            console.log("mget-err", err)
            return res.status(200).json(error)
        }
    })
    // ---------------------------------Get By Genre-------------------------------
    router.get(`${route}/genres`, async (req, res) => {
        let { genres } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        let query = genres.map(genre => {
            return (
                { match: { genres: genre } }
            )
        })
        try {
            let { body } = await esClient.search({
                index: 'books',
                size: 3,
                body: {
                    query: {
                        bool: {
                            must: query
                        }
                    }
                }
            })
            let { hits } = body.hits
            let books = []
            hits.map((hit, i) => {
                let { _id, _source } = hit
                books[i] = Object.assign({ id: _id }, _source)
            })
            data.result = books
            return res.status(200).json(data)
        } catch (err) {
            console.log("genre-err", err)
            return res.status(400).json(error)
        }
    })
    // ---------------------------------Search Books-------------------------------
    router.get(`${route}/search`, async (req, res) => {
        let { query } = req.body
        let data = {
            error: false,
            result: []
        }
        let error = {
            error: true,
            result: "Bad Request"
        }
        try {
            let { body } = await esClient.search({
                index: 'books',
                size: 5,
                body: {
                    query: {
                        query_string: {
                            fields: ["authors", "title^2"],
                            query,
                            minimum_should_match: 3
                        },

                        // multi_match: {
                        //     query,
                        //     fields: ["authors", "title^3"]
                        // }

                        // function_score: {
                        //     query: {
                        //         multi_match: {
                        //             query,
                        //             fields: [authors ^ 3, title]
                        //         }
                        //     },
                        //     boost: 5,
                        //     random_score: {},
                        //     boost_mode: multiply
                        // }

                        // function_score: {
                        //     query: { match_all: {} },
                        //     // boost: 5,
                        //     functions: [
                        //         {
                        //             filter: { match: { authors: query } },
                        //             random_score: {},
                        //             weight: 42
                        //         },
                        //         {
                        //             filter: { match: { title: query } },
                        //             weight: 23
                        //         }
                        //     ],
                        //     // max_boost: 42,
                        //     score_mode: "multiply",
                        //     boost_mode: "multiply",
                        //     // min_score: 42
                        // }
                    }
                }
            })
            let { hits, total } = body.hits
            if (total.value) {
                let books = []
                hits.map((hit, i) => {
                    let { _id, _score, _source } = hit
                    books[i] = Object.assign({ id: _id, _score }, _source)
                })
                data.result = books
                return res.status(200).json(data)
            }
            return res.status(404).json(data)
        } catch (err) {
            console.log("search-err", err)
            return res.status(404).json(error)
        }
    })
}
// ----------------------------------------------------------------
export default { prepare }
