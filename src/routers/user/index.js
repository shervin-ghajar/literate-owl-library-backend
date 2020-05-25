"use strict";
// ----------------------------------------------------------------
import express from 'express';
// ----------------------------------------------------------------
import authenticationRouter from './services/authentication';
import profileRouter from './services/profile';
import booksRouter from './services/books';
import wishListRouter from './services/wishlist';
import purchasedRouter from './services/purchased';
// ----------------------------------------------------------------
const userRouter = () => {
    let router = express()
    // prepare routes
    authenticationRouter.prepare(router, "/authentication")
    profileRouter.prepare(router, "/profile")
    booksRouter.prepare(router, "/books")
    wishListRouter.prepare(router, "/wishlist")
    purchasedRouter.prepare(router, "/purchased")

    return router;
}
// ----------------------------------------------------------------
export default userRouter