"use strict";
// ----------------------------------------------------------------
import { Client } from '@elastic/elasticsearch';
const es_client = new Client({ node: 'http://localhost:9200' })
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // --------------------------Get Profile-----------------------
    router.get(`${route}`, async (req, res) => {
        // validate/find token owner(user_id)
        console.log(req.headers)
        let error, data
        if (email == "ssghajar@gmail.com") {
            const { body } = await es_client.get({
                index: 'profile',
                id: email
            })
            data = {
                error: false,
                message: {
                    username: "ssghajar",
                    email: email,
                    password: password,
                    token: "mpfjsdhf1lkj23HR130qe23QR2",
                }
            }
            return res.status(200).json(data)
        }
        error = {
            error: true,
            message: "token is unauthorized",
        }
        return res.status(401).json(error)
    })
    // --------------------------Update Profile-----------------------
    //ToDo 
}
// ----------------------------------------------------------------
export default { prepare }
