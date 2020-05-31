// "use strict";
// ----------------------------------------------------------------
import { config } from '../../../config';
import { Client } from '@elastic/elasticsearch';
const esClient = new Client({ node: 'http://localhost:9200' });
import redis from 'redis';
const redisClient = redis.createClient();
import jwt from 'jsonwebtoken';
// ----------------------------------------------------------------
const staticToken = "QclJtQLTjrmiDARMFnq73f8F0tQ5C7wT" //Blowfish /https://www.tools4noobs.com/online_tools/encrypt/
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // ------------------------------Signup------------------------------
    router.post(`${route}/signup`, async (req, res) => {
        let { username, email, password } = req.body
        try {
            // check if the user already exist
            const { body } = await esClient.get({
                index: 'profile',
                id: email
            })
            if (body.found) {
                let error = {
                    error: true,
                    message: "email already exists",
                }
                return res.status(409).json(error)
            }
        } catch (error) {
            // user not found 
            if ("statusCode" in error && error.statusCode == 404) {
                // create user
                try {
                    const { body } = await esClient.index({
                        index: 'profile',
                        id: email,
                        body: {
                            username,
                            email,
                            password,
                        }
                    })
                    await esClient.indices.refresh({ index: 'profile' })
                    let { _id, result } = body
                    if (result == 'created') {
                        let token = staticToken
                        let data = {
                            error: false,
                            token,
                        }
                        return res.status(201).json(data)
                    }
                } catch (error) {
                    console.log("create", error)
                }
            }
        }
    })
    // --------------------------Login-----------------------
    router.get(`${route}/login`, async (req, res) => {
        let { agent } = req.headers
        let { email, password } = req.body
        let error, data
        // validate email
        // check if the email exist
        try {
            const { body } = await esClient.get({
                index: 'profile',
                id: email
            })
            if (body.found) {
                let { _id, _source } = body
                if (_source.password === password) {
                    let key = `${_id}_${agent}`
                    console.log(key)
                    let token = jwt.sign({ token: key }, config.secret)
                    console.log(token)
                    redisClient.set(key, token)
                    data = {
                        error: false,
                        token
                    }
                    return res.status(200).json(data)
                }
                error = {
                    error: true,
                    message: "username or password is incorrect"
                }
                return res.status(404).json(error) // actually status code must be 403
            }
        } catch (error) {
            error = {
                error: true,
                message: "user not found"
            }
            return res.status(404).json(error)
        }
    })
    // --------------------------Logout-----------------------
    router.post(`${route}/logout`, (req, res) => {
        let { authorization, agent } = req.headers
        let data
        let error = {
            error: true,
            message: "token unauthorized"
        }
        if (authorization && agent) {
            let authToken = authorization.slice(7, authorization.length)
            //Todo Handle scenarios
            try {
                return jwt.verify(authToken, config.secret, (jwtErr, decoded) => {
                    console.log("decoded", decoded, decoded && 'token' in decoded)
                    if (!(decoded && 'token' in decoded)) {
                        console.error("jwtErr", jwtErr)
                        return res.status(401).json(error)
                    }
                    redisClient.del(decoded.token)
                    data = {
                        error: false,
                        message: "you successfuly loged out"
                    }
                    return res.status(200).json(data)
                });
            } catch (err) {
                console.error("err", err)
                error = {
                    error: true,
                    message: "token unauthorized"
                }
                return res.status(401).json(error)
            }
        } else {
            error = {
                error: true,
                message: "Bad Request"
            }
            return res.status(400).json(error)
        }
    })
}
// ----------------------------------------------------------------
export default { prepare }
