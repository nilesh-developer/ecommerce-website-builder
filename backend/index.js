import { configDotenv } from "dotenv";
import dbConnect from "./db/index.js";
import app from "./app.js";

configDotenv({
    path: "./.env"
})

dbConnect()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server port no. ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("Something went wrong", error)
})