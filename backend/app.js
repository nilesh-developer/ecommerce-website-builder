import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

// Define the base domain you want to allow and allow all subdomains
// const allowedDomain = '.eazzy.store'; // Allow all subdomains of example.com

// Custom CORS options to allow subdomains
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (origin && (origin.endsWith(allowedDomain) || origin === `https://eazzy.store`)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true // Allow cookies and credentials to be sent
// };

// app.use(cors(corsOptions));
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.get("/test", (req, res) => {
    res.send("Test page");
})

import { userRouter } from "./routes/user.router.js";
import { storeRouter } from "./routes/store.router.js";
import { customerRouter } from "./routes/customer.router.js";
import { productRouter } from "./routes/product.router.js";
import { categoryRouter } from "./routes/category.router.js";
import { couponRouter } from "./routes/coupon.router.js";
import { orderRouter } from "./routes/order.router.js";
import { contactFormRouter } from "./routes/contactform.router.js";
import { subscriptionRouter } from "./routes/subscription.router.js";
import { adminRouter } from "./routes/admin.router.js";
import { payoutRouter } from "./routes/payout.router.js";

app.use("/api/user", userRouter)

app.use("/api/store", storeRouter)

app.use("/api/customer", customerRouter)

app.use("/api/product", productRouter)

app.use("/api/category", categoryRouter)

app.use("/api/coupon", couponRouter)

app.use("/api/contactform", contactFormRouter)

app.use("/api/order", orderRouter)

app.use("/api/subscription", subscriptionRouter)

app.use("/api/payout", payoutRouter)

app.use("/api/admin", adminRouter)

export default app;