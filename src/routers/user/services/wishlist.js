"use strict";
// ----------------------------------------------------------------
const prepare = (router, route) => {
    // --------------------------Get Wishlist--------------------------------
    router.get(`${route}`, async (req, res) => {
        // validate/find token owner(user_id)
        let data = []
        let { body } = await client.search({
            index: 'wishlist',
            size: 3,
            body: {
                query: {
                    match_all: {}
                }
            }
        })
        let { hits } = body.hits
        hits.map((hit, i) => {
            let { _id, _source } = hit
            data[i] = Object.assign({ id: _id }, _source)
        })
        return res.status(200).json(data)
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
