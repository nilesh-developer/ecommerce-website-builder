import { Router } from "express";
import { getAllPayouts, payoutRequest } from "../controllers/payout.controller.js";
const router = Router()

router.route("/request-payout").post(payoutRequest)

router.route("/get-payouts/:storeId").get(getAllPayouts)

export { router as payoutRouter }