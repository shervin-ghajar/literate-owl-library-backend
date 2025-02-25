"use strict";
// ----------------------------------------------------------------
import express from 'express';
// ----------------------------------------------------------------
import authenticationRouter from './services/authentication';
import profileRouter from './services/profile';
import balanceRouter from './services/balance';
import wishListRouter from './services/wishlist';
import purchaseRouter from './services/purchase';
// ----------------------------------------------------------------
const userRouter = () => {
    let router = express()
    // prepare routes
    authenticationRouter.prepare(router, "/authentication")
    profileRouter.prepare(router, "/profile")
    balanceRouter.prepare(router, "/balance")
    wishListRouter.prepare(router, "/wishlist")
    purchaseRouter.prepare(router, "/purchase")

    return router;
}
// ----------------------------------------------------------------
export default userRouter