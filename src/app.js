"use-strict";
// --------------------------------------------------------------------
import routes from './routers/routes';
// --------------------------------------------------------------------
Promise.resolve().then(async () => {
    await routes.prepare()
}).then(() => {
    // console.log("Server Up")
}).catch((err) => {
    console.log("Error routes.prepare()")
});