"use strict";
// ----------------------------------------------------------------
import express from 'express';
// ----------------------------------------------------------------
import profileRouter from './services/profile';
import booksRouter from './services/books';
import purchasedRouter from './services/purchased';
import wishListRouter from './services/wishlist';
// ----------------------------------------------------------------
const userRouter = () => {
    let router = express()
    // prepare routes
    profileRouter.prepare(router, "/profile")
    booksRouter.prepare(router, "/books")
    purchasedRouter.prepare(router, "/purchased")
    wishListRouter.prepare(router, "/wishlist")

    return router;
}
// ----------------------------------------------------------------
export default userRouter