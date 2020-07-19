import { Client } from '@elastic/elasticsearch';
const esClient = new Client({ node: 'http://localhost:9200' });
import { config } from '../../../config';
const index = config.elasticsearch.indices.book_index
//--------------------------------------------------------------------------------------------

async function getAllBooks() {
    try {
        let { body } = await esClient.search({
            index,
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
        return books
    } catch (error) {
        throw error
    }
}
//--------------------------------------------------------------------------------------------
async function getBookById(id) {
    try {
        let { body } = await esClient.get({
            index,
            id,
        })
        let { _id, _source } = body
        let book = Object.assign({ id: _id }, _source)
        return book
    } catch (error) {
        throw error
    }
}
//--------------------------------------------------------------------------------------------
async function getBooksByIds(ids) {
    try {
        let { body } = await esClient.mget({
            index,
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
            return books
        }
        throw "not found"
    } catch (error) {
        throw error
    }
}
//--------------------------------------------------------------------------------------------
async function getBooksByGenre(genres) {
    let query = genres.map(genre => {
        return (
            { match: { genres: genre } }
        )
    })
    try {
        let { body } = await esClient.search({
            index,
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
        return books
    } catch (err) {
        throw err
    }
}
//--------------------------------------------------------------------------------------------
async function getBooksBySearch(query) {
    try {
        let { body } = await esClient.search({
            index,
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
        let books = []
        if (total.value) {
            hits.map((hit, i) => {
                let { _id, _score, _source } = hit
                books[i] = Object.assign({ id: _id, _score }, _source)
            })
        }
        return books
    } catch (err) {
        throw err
    }
}
//--------------------------------------------------------------------------------------------


export {
    getAllBooks,
    getBookById,
    getBooksByIds,
    getBooksByGenre,
    getBooksBySearch
}