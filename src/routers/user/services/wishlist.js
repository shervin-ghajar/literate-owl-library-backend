"use strict";
// ----------------------------------------------------------------
import { config } from '../../../config';
import { Client } from '@elastic/elasticsearch';
const esClient = new Client({ node: 'http://localhost:9200' });
import redis from 'redis';
const redisClient = redis.createClient();
import jwt from 'jsonwebtoken';
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // --------------------------Get Wishlist--------------------------------
    router.get(`${route}`, async (req, res) => {
        // validate/find token owner(user_id)
        let { authorization, agent } = req.headers
        let error = {
            error: true,
            message: "token unauthorized"
        }
        let data = {
            error: false,
            message: []
        }
        if (authorization && agent) {
            let authToken = authorization.slice(7, authorization.length)
            try {
                return jwt.verify(authToken, config.secret, (jwtErr, decoded) => {
                    if (!(decoded && 'token' in decoded)) {
                        console.error("jwtErr", jwtErr)
                        return res.status(401).json(error)
                    }
                    redisClient.get(decoded.token, async (err, reply) => {
                        if (reply) {
                            let agentIndex = decoded.token.search(agent)
                            if (agentIndex != -1) {
                                let userId = decoded.token.slice(0, agentIndex - 1)
                                // elasticsearch get data with userId 
                                const esRequest = esClient.get({
                                    index: 'profile',
                                    id: userId,
                                    _source: ["wishlist"]
                                })
                                esRequest.then(({ body }) => {
                                    if (body.found) {
                                        let { wishlist } = body._source
                                        data.message = [...wishlist]
                                        return res.status(200).json(data)
                                    }
                                    error.message = "Bad Request"
                                    return res.status(400).json(error)
                                }).catch(err => {
                                    console.error("error", err)
                                    error.message = "Bad Request"
                                    return res.status(400).json(error)
                                })
                            } else {
                                return res.status(401).json(error)
                            }
                        } else {
                            return res.status(401).json(error)
                        }
                    });
                });
            } catch (err) {
                console.error("catch-err", err)
                return res.status(401).json(error)
            }
        }
        else {
            error.message = "Bad Request"
            return res.status(400).json(error)
        }
    })
    // --------------------------Add & Remove Wishlist--------------------------------
    router.post(`${route}/:bookId`, (req, res) => {
        let { bookId } = req.params
        let { authorization, agent } = req.headers
        let error = {
            error: true,
            message: "token unauthorized"
        }
        let data = {
            error: false,
        }
        if (authorization && agent) {
            let authToken = authorization.slice(7, authorization.length)
            try {
                return jwt.verify(authToken, config.secret, (jwtErr, decoded) => {
                    if (!(decoded && 'token' in decoded)) {
                        console.error("jwtErr", jwtErr)
                        return res.status(401).json(error)
                    }
                    redisClient.get(decoded.token, (err, reply) => {
                        if (reply) {
                            let agentIndex = decoded.token.search(agent)
                            if (agentIndex != -1) {
                                let userId = decoded.token.slice(0, agentIndex - 1)
                                // elasticsearch get data with userId 
                                const esGetRequest = esClient.get({
                                    index: 'profile',
                                    id: userId,
                                    _source: ["wishlist"]
                                })
                                esGetRequest.then(({ body }) => {
                                    let newWishList = []
                                    if (!body.found) {
                                        error.message = "Bad Request"
                                        return res.status(400).json(error)
                                    }
                                    let { wishlist } = body._source
                                    let isWishlisted = wishlist.some(el => el == bookId)
                                    newWishList = isWishlisted ? wishlist.filter(el => el != bookId) : [bookId, ...wishlist]
                                    const esUpdateRequest = esClient.update({
                                        index: 'profile',
                                        id: userId,
                                        body: {
                                            doc: {
                                                wishlist: newWishList
                                            }
                                        }
                                    })
                                    esUpdateRequest.then(({ body }) => {
                                        console.log("body-update", body)
                                        data.message = isWishlisted ? "removed" : "added"
                                        data.wishlist = newWishList
                                        return res.status(200).json(data)
                                    }).catch((err) => {
                                        console.error("error-update", err)
                                    })
                                }).catch(err => {
                                    console.error("error", err)
                                    error.message = "Bad Request"
                                    return res.status(400).json(error)
                                })
                            } else {
                                return res.status(401).json(error)
                            }
                        } else {
                            return res.status(401).json(error)
                        }
                    });
                });
            } catch (err) {
                console.error("catch-err", err)
                return res.status(401).json(error)
            }
        }
        else {
            error.message = "Bad Request"
            return res.status(400).json(error)
        }
    })
}
export default { prepare }
