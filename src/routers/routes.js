"use strict";
// ----------------------------------------------------------------
import express, { Router } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
// ----------------------------Routes-----------------------------
import userRouter from './user';
// ----------------------------------------------------------------
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
    app.use("/user", userRouter())
    // CreateServer - Set Port Listener

    // let httpServer = http.createServer(app);
    let PORT = 3000
    app.listen(PORT, () => {
        console.log("Port Set on " + PORT)
    })
}
// ----------------------------------------------------------------
export default { prepare }