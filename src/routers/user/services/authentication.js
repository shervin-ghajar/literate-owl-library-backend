"use strict";
// ----------------------------------------------------------------
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // --------------------------Login-----------------------
    router.get(`${route}/login`, async (req, res) => {
        let { email, password } = req.body
        let error, data
        //validate email
        // check if the email exist
        const { body } = await client.get({
            index: 'profile',
            id: email
        })
        // if (email == "ssghajar@gmail.com") {
        //     //check password
        //     if (password == 1480) {
        //         let user_id = Math.floor((Date.now()) / 1000)
        //         data = {
        //             error: false,
        //             message: {
        //                 id: user_id,
        //                 username: "ssghajar",
        //                 email: email,
        //                 password: password,
        //                 token: "lakjsdhf1lkj23HR130qe944Q1",
        //             }
        //         }
        //         return res.status(200).json(data)
        //     }
        //     error = {
        //         error: true,
        //         message: "email or password is incorrect",
        //     }
        //     return res.status(403).json(error)
        // }
        // error = {
        //     error: true,
        //     message: "user not found",
        // }
        // return res.status(404).json(error)
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
                        body: {
                            username,
                            email,
                            password,
                        }
                    })
                    console.log(body)
                    await client.indices.refresh({ index: 'profile' })
                } catch (error) {
                    console.log("create", error)
                }
                let data = {
                    error: false,
                    message: {
                        username,
                        email,
                        password,
                        token: "lakjsdhf1lkj23HR130qe944Q1",
                    },
                }
                return res.status(201).json(error.statusCode)
            }
        }
    })
}
// ----------------------------------------------------------------
export default { prepare }
