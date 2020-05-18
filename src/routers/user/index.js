"use strict";
// ----------------------------------------------------------------
import express from 'express';
// ----------------------------------------------------------------
import profileRouter from './services/profile';
import purchasedRouter from './services/purchased';
import wishListRouter from './services/wish_list';
// ----------------------------------------------------------------
const userRouter = () => {
    let router = express()
    // prepare routes
    profileRouter.prepare(router, "/profile")
    purchasedRouter.prepare(router, "/purchased")
    wishListRouter.prepare(router, "/wishlist")

    return router;
}
// ----------------------------------------------------------------
export default userRouter