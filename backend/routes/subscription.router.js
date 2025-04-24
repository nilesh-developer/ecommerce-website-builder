import { Router } from "express";
import { createTransaction, getUserTransaction } from "../controllers/subscription.controller.js";
const router = Router()

router.route("/create").post(createTransaction)

router.route("/user-transaction/:userId").get(getUserTransaction)

export { router as subscriptionRouter }