"use strict";
// ----------------------------------------------------------------
const prepare = (router, route) => {
    router.get(`${route}/:userId`, (req, res) => {
        let { userId } = req.params
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
}
// ----------------------------------------------------------------
export default { prepare }
