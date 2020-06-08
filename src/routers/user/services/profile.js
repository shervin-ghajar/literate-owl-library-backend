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
    // --------------------------Get Profile-----------------------
    router.get(`${route}`, (req, res) => {
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
                                // elasticsearch get data with userId 
                                const esRequest = esClient.get({
                                    index: 'profile',
                                    id: userId,
                                    // _source: ["wishlist"]
                                })
                                esRequest.then(({ body }) => {
                                    if (body.found) {
                                        let { username, email, password, balance, wishlist, purchased } = body._source
                                        data.result = {
                                            username,
                                            email,
                                            password,
                                            balance,
                                            wishlist,
                                            purchased
                                        }
                                        return res.status(200).json(data)
                                    }
                                    error.result = "Not Content"
                                    return res.status(204).json(error)
                                }).catch(err => {
                                    console.error("error", err)
                                    error.result = "Bad Request"
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
            error.result = "Bad Request"
            return res.status(400).json(error)
        }
    })
    // --------------------------Update Profile-----------------------
    router.put(`${route}`, (req, res) => {
        let { username, password } = req.body
        let { authorization, agent } = req.headers
        let error = {
            error: true,
            result: "token unauthorized"
        }
        let data = {
            error: false,
        }
        if (authorization && agent && username && password) {
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
                                // elasticsearch update data with userId 
                                const esUpdateRequest = esClient.update({
                                    index: 'profile',
                                    id: userId,
                                    body: {
                                        doc: {
                                            username: username.trim(),
                                            password: password.trim()
                                        }
                                    }
                                })
                                esUpdateRequest.then(({ body }) => {
                                    console.log("body-update", body)
                                    data.result = "profile updated"
                                    return res.status(200).json(data)
                                }).catch((err) => {
                                    console.error("error-update", err)
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
