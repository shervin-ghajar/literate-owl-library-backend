"use strict";
// ----------------------------------------------------------------
import { getProfile, updateProfile } from '../../../database/elasticsearch/services/profile';
import { tokenValidator } from '../../../database/redis/services/token';
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
        tokenValidator(authorization, agent, userId => {
            getProfile(userId).then(response => {
                if (response) {
                    data.result = response
                    return res.status(200).json(data)
                }
                error.result = "Not Content"
                return res.status(204).json(error)
            }).catch(err => {
                console.warn(err)
                return res.status(400).json(error)
            })
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
        tokenValidator(authorization, agent, userId => {
            updateProfile(userId, username, password).then(response => {
                if (response) {
                    console.log("body-update", response)
                    data.result = "profile updated"
                    return res.status(200).json(data)
                }
            }).catch((err) => {
                console.error("error-update", err)
            })
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
