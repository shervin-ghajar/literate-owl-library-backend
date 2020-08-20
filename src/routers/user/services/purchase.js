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
    // --------------------------Get Purchased-----------------------
    // router.get(`${route}d`, (req, res) => {
    //     let { authorization, agent } = req.headers
    //     let error = {
    //         error: true,
    //         result: "token unauthorized"
    //     }
    //     let data = {
    //         error: false,
    //     }
    //     if (authorization && agent) {
    //         let authToken = authorization.slice(7, authorization.length)
    //         try {
    //             return jwt.verify(authToken, config.secret, (jwtErr, decoded) => {
    //                 if (!(decoded && 'token' in decoded)) {
    //                     console.error("jwtErr", jwtErr)
    //                     return res.status(401).json(error)
    //                 }
    //                 redisClient.get(decoded.token, (err, reply) => {
    //                     if (reply) {
    //                         let agentIndex = decoded.token.search(agent)
    //                         if (agentIndex != -1) {
    //                             let userId = decoded.token.slice(0, agentIndex - 1)
    //                             // elasticsearch get data with userId 
    //                             const esRequest = esClient.get({
    //                                 index: 'profile',
    //                                 id: userId,
    //                                 _source: ["purchased"]
    //                             })
    //                             esRequest.then(({ body }) => {
    //                                 if (body.found) {
    //                                     let { purchased } = body._source
    //                                     data.result = [...purchased]
    //                                     return res.status(200).json(data)
    //                                 }
    //                                 error.result = "Bad Request"
    //                                 return res.status(400).json(error)
    //                             }).catch(err => {
    //                                 console.error("error", err)
    //                                 error.result = "Bad Request"
    //                                 return res.status(400).json(error)
    //                             })
    //                         } else {
    //                             return res.status(401).json(error)
    //                         }
    //                     } else {
    //                         return res.status(401).json(error)
    //                     }
    //                 });
    //             });
    //         } catch (err) {
    //             console.error("catch-err", err)
    //             return res.status(401).json(error)
    //         }
    //     }
    //     else {
    //         error.result = "Bad Request"
    //         return res.status(400).json(error)
    //     }
    // })
    // --------------------------Purchase-----------------------
    router.post(`${route}/:bookId`, (req, res) => {
        let { bookId } = req.params
        let { authorization, agent } = req.headers
        let error = {
            error: true,
            result: "token unauthorized"
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
                                // elasticsearch check & get data with bookId 
                                const esGetBook = esClient.get({
                                    index: 'books',
                                    id: bookId,
                                    _source: ["price"]
                                })
                                esGetBook.then((bookRes) => {
                                    if (!bookRes.body.found) {
                                        error.result = "Bad Request"
                                        return res.status(400).json(error)
                                    }
                                    let { price } = bookRes.body._source
                                    // elasticsearch get data with userId 
                                    const esGetProile = esClient.get({
                                        index: 'profile',
                                        id: userId,
                                        _source: ["balance", "purchased"]
                                    })
                                    esGetProile.then((getProfileRes) => {
                                        if (!getProfileRes.body.found) {
                                            error.result = "Bad Request"
                                            return res.status(400).json(error)
                                        }
                                        let { balance, purchased } = getProfileRes.body._source
                                        let newBalance = Number(balance) - Number(price)
                                        let newPurchased = [bookId, ...purchased]
                                        console.log(balance, price, newBalance)
                                        if (newBalance >= 0) {
                                            const esUpdateRequest = esClient.update({
                                                index: 'profile',
                                                id: userId,
                                                body: {
                                                    doc: {
                                                        balance: newBalance,
                                                        purchased: newPurchased
                                                    }
                                                }
                                            })
                                            esUpdateRequest.then((updateProfileRes) => {
                                                console.log("body-update", updateProfileRes.body)
                                                data.result = "book purchased successfully"
                                                data.purchased = newPurchased
                                                data.balance = newBalance
                                                return res.status(200).json(data)
                                            }).catch((err) => {
                                                console.error("updateProfile-err", err)
                                            })
                                        } else {
                                            error.result = "Not Acceptable - balance is lower than book price"
                                            return res.status(406).json(error)
                                        }
                                    }).catch(err => {
                                        console.log("getProfile-err", err)
                                    })
                                }).catch(err => {
                                    console.log("books-err", err)
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
            error.result = "Bad Request"
            return res.status(400).json(error)
        }
    })
}
// ----------------------------------------------------------------
export default { prepare }
