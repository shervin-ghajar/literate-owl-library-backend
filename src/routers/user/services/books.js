"use strict";
// ----------------------------------------------------------------
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })
// ----------------------------------------------------------------
const prepare = (router, route) => {
    router.get(`${route}`, async (req, res) => { // Get All Books
        let data = []
        let { body } = await client.search({
            index: 'books',
            size: 3,
            from: 0,
            body: {
                query: {
                    match_all: {}
                }
            }
        })
        let { hits } = body.hits
        hits.map((hit, i) => {
            let { _id, _source } = hit
            data[i] = Object.assign({ id: _id }, _source)
        })
        return res.status(200).json(data)
    })
    // ----------------------------------------------------------------
    router.get(`${route}/book/:book_id`, async (req, res) => { // Get Book by Id
        let data = []
        let { book_id } = req.params
        let { body } = await client.get({
            index: 'books',
            id: book_id,
        })
        let { _id, _source } = body
        data = Object.assign({ id: _id }, _source)
        return res.status(200).json(data)
    })
    // ----------------------------------------------------------------
    router.get(`${route}/genres`, async (req, res) => { // Get By Genre
        let data = []
        let { genre } = req.body
        let { body } = await client.search({
            index: 'books',
            size: 3,
            body: {
                query: {
                    match: {
                        genres: genre
                    }
                }
            }
        })
        let { hits } = body.hits
        hits.map((hit, i) => {
            let { _id, _source } = hit
            data[i] = Object.assign({ id: _id }, _source)
        })
        return res.status(200).json(data)
    })
    // ----------------------------------------------------------------
    router.get(`${route}/search`, async (req, res) => { // Search 
        let data = []
        let { query } = req.body
        let { body } = await client.search({
            index: 'books',
            size: 5,
            body: {
                query: {
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
                    function_score: {
                        query: { match_all: {} },
                        // boost: 5,
                        functions: [
                            {
                                filter: { match: { authors: query } },
                                random_score: {},
                                weight: 23
                            },
                            {
                                filter: { match: { title: query } },
                                weight: 42
                            }
                        ],
                        // max_boost: 42,
                        score_mode: "multiply",
                        boost_mode: "multiply",
                        // min_score: 42
                    }
                }
            }
        })
        let { hits, total } = body.hits
        if (total.value) {
            hits.map((hit, i) => {
                let { _id, _score, _source } = hit
                data[i] = Object.assign({ id: _id, _score }, _source)
            })
            return res.status(200).json(data)
        }
        return res.status(404).json(data)
    })
}
// ----------------------------------------------------------------
export default { prepare }
