"use strict";
// ----------------------------------------------------------------
const prepare = (router, route) => {
    router.get(`${route}`, (req, res) => {
        return res.status(200).json(route + " route")
    })
}
// ----------------------------------------------------------------
export default { prepare }
