"use strict";
// ----------------------------------------------------------------
import express, { Router } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
// ----------------------------Routes-----------------------------
import userRouter from './user';
import booksRouter from './books';

// import authRouter from './authentication';
// ----------------------------------------------------------------
const BaseDomain = "/lol/api"
const prepare = () => {
    return listen();
}
// ----------------------------------------------------------------
const listen = () => {
    let app = express();
    // parse requests of content-type - application/json
    app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
    app.use(bodyParser.json({ limit: "1mb" }));
    // routes
    app.use(`${BaseDomain}/user`, userRouter()) //user route
    app.use(`${BaseDomain}/book`, booksRouter()) // books route
    app.use(`${BaseDomain}/book/image`, express.static('../images')) // book images

    // wrong 
    app.all('*', (req, res) => {
        console.log("---route not found---")
        let error = {
            error: true,
            result: "route not found"
        }
        res.status(404).json(error)
    })
    // CreateServer - Set Port Listener

    // let httpServer = http.createServer(app);
    let PORT = 3000
    app.listen(PORT, () => {
        console.log("Server is Up on Port " + PORT)
    })
}
// ----------------------------------------------------------------
export default { prepare }