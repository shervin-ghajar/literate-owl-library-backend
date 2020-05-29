"use strict";
// ----------------------------------------------------------------
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })
const staticToken = "QclJtQLTjrmiDARMFnq73f8F0tQ5C7wT" //Blowfish /https://www.tools4noobs.com/online_tools/encrypt/
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // --------------------------Login-----------------------
    router.get(`${route}/login`, async (req, res) => {
        let { email, password } = req.body
        let error, data
        // validate email
        // check if the email exist
        try {
            const { body } = await client.get({
                index: 'profile',
                id: email
            })
            if (body.found) {
                let { _id, _source } = body
                if (_source.password === password) {
                    let token = staticToken
                    data = {
                        error: false,
                        user_id: _id,
                        token
                    }
                    return res.status(200).json(data)
                }
                error = {
                    error: true,
                    message: "username or password is incorrect"
                }
                return res.status(403).json(error)
            }
            console.log(body)
        } catch (error) {
            error = {
                error: true,
                message: "user not found"
            }
            return res.status(404).json(error)
        }
    })
    // ------------------------------Signup------------------------------
    router.post(`${route}/signup`, async (req, res) => {
        let { username, email, password } = req.body
        try {
            // check if the user already exist
            const { body } = await client.get({
                index: 'profile',
                id: email
            })
            if (body.found) {
                let error = {
                    error: true,
                    message: "this email already exist",
                }
                return res.status(409).json(error)
            }
        } catch (error) {
            // user not found 
            console.log("user not found ", error)
            if ("statusCode" in error && error.statusCode == 404) {
                // create user
                try {
                    const { body } = await client.index({
                        index: 'profile',
                        id: email,
                        body: {
                            username,
                            email,
                            password,
                        }
                    })
                    await client.indices.refresh({ index: 'profile' })
                    let { _id, result } = body
                    console.warn(123123, body.statusCode)
                    if (result == 'created') {
                        let token = staticToken
                        let data = {
                            error: false,
                            user_id: _id,
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
}
// ----------------------------------------------------------------
export default { prepare }
