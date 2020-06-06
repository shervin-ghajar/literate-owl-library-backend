"use strict";
// ----------------------------------------------------------------
import { Client } from '@elastic/elasticsearch';
const esClient = new Client({ node: 'http://localhost:9200' })
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // ------------------------------Get All Books----------------------------------
    router.get(`${route}`, async (req, res) => {
        let data = []
        let { body } = await esClient.search({
            index: 'books',
            size: 3,
            // from: 0,
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
    // ---------------------------------Get Book by Id-------------------------------
    router.get(`${route}/book/:bookId`, async (req, res) => {
        let data = []
        let { bookId } = req.params
        let { body } = await esClient.get({
            index: 'books',
            id: bookId,
        })
        let { _id, _source } = body
        data = Object.assign({ id: _id }, _source)
        return res.status(200).json(data)
    })
    // ---------------------------------Get By Genre-------------------------------
    router.get(`${route}/genres`, async (req, res) => {
        let data = []
        let { genres } = req.body
        let query = genres.map(genre => {
            return (
                { match: { genres: genre } }
            )
        })
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
        hits.map((hit, i) => {
            let { _id, _source } = hit
            data[i] = Object.assign({ id: _id }, _source)
        })
        return res.status(200).json(data)
    })
    // ---------------------------------Search Books-------------------------------
    router.get(`${route}/search`, async (req, res) => {
        let data = []
        let { query } = req.body
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
