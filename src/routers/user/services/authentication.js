"use strict";
// ----------------------------------------------------------------
import { getProfile, createProfile } from '../../../database/elasticsearch/services/profile';
import { tokenGenerator, deleteToken } from '../../../database/redis/services/token';
// ----------------------------------------------------------------
//Blowfish /https://www.tools4noobs.com/online_tools/encrypt/
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // ------------------------------Signup------------------------------
    router.post(`${route}/signup`, (req, res) => {
        let { username, email, password } = req.body
        let { agent } = req.headers
        let error = {
            error: true,
            result: "token unauthorized"
        }
        let data = {
            error: false,
            result: []
        }
        let hasProfileConflict = true
        // check if the user already exist
        getProfile(email, hasProfileConflict).then(hasConflict => {
            if (hasConflict) {
                error.result = "email already exists"
                return res.status(409).json(error)
            }
        }).catch(getProfileError => {
            if ("statusCode" in getProfileError && getProfileError.statusCode == 404) {
                // create user
                return createProfile(agent, email, username, password).then(token => {
                    data.result = { token }
                    return res.status(201).json(data)
                }).catch(err => {
                    console.log(err)
                    return res.status(500).json(data)
                })
            }
            error.result = "Bad Request"
            return res.status(400).json(error)
        })
    })
    // --------------------------Login-----------------------
    router.post(`${route}/login`, (req, res) => {
        let { agent } = req.headers
        let { email, password } = req.body
        let error = {
            error: true,
            result: "token unauthorized"
        }
        let data = {
            error: false,
            result: []
        }
        // validate email
        // check if the email exist
        getProfile(email).then(response => {
            // console.log("response", response, response.password !== password)
            if (response.password !== password) {
                error = {
                    error: true,
                    result: "user not found!"
                }
                return res.status(404).send(error) // actually status code must be 403
            }
            tokenGenerator(agent, response.email).then(token => {
                data.result = { token }
                return res.status(200).json(data)
            }).catch(err => {
                console.log("tokenGeneratorError", err)
                return;
            })
        }).catch(err => {
            console.log("getProfileError", err)
            error = {
                error: true,
                result: "user not found"
            }
            return res.status(404).send(error)
        })
    })
    // --------------------------Logout-----------------------
    router.post(`${route}/logout`, (req, res) => {
        let { authorization, agent } = req.headers
        let data
        let error = {
            error: true,
            result: "token unauthorized"
        }
        deleteToken(authorization, agent, response => {
            if (response) {
                data = {
                    error: false,
                    result: "you successfully loged out"
                }
                return res.status(200).json(data)
            }
        }, err => {
            switch (err) {
                case 400:
                    error.result = "Bad Request"
                    return res.status(400).json(error)
                case 401:
                    console.error("catch-err", err)
                    return res.status(401).json(error)
            }
        }).catch(err => {
            console.error("catch-err", err)
            return res.status(401).json(error)
        })
    })
}
// ----------------------------------------------------------------
export default { prepare }
