"use strict";
// ----------------------------------------------------------------
import { config } from '../../../config';
import { Client } from '@elastic/elasticsearch';
const es_client = new Client({ node: 'http://localhost:9200' });
import promisify from 'util';
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
                                return res.status(200).json(userId)
                            } else {
                                return res.status(401).json(error)
                            }
                        }
                    });
                });
            } catch (err) {
                console.error("catch-err", err)
                error = {
                    error: true,
                    message: "token unauthorized"
                }
                return res.status(401).json(error)
            }
        }
        else {
            error = {
                error: true,
                message: "Bad Request"
            }
            return res.status(400).json(error)
        }
    })
    // --------------------------Add Wishlist--------------------------------
    router.post(`${route}/add`, (req, res) => {
        let { book_data } = req.body
        // validate/find token owner(user_id)
        if (userId == 1) {
            userId = parseInt(userId)
            let data = {
                id: userId,
                name: "Shervin",
                high_score: 23
            }
        }
        return res.status(200).json(data)
    })
    // --------------------------Remove Wishlist--------------------------------
    router.post(`${route}/remove`, (req, res) => {
        let { userId } = req.params
        // validate/find token owner(user_id)
        if (userId == 1) {
            userId = parseInt(userId)
            let data = {
                id: userId,
                name: "Shervin",
                high_score: 23
            }
            return res.status(200).json(data)
        }
        let error = {
            status: 404,
            error: true,
            description: "user not found",
        }
        return res.status(404).json(error)
    })
    // -------------------------------------------------------------------------
}
export default { prepare }
