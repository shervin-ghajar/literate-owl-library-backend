"use strict";
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // --------------------------Get Profile-----------------------
    router.get(`${route}`, (req, res) => {
        // validate/find token owner(user_id)
        let error, data
        if (email == "ssghajar@gmail.com") {
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
}
// ----------------------------------------------------------------
export default { prepare }
