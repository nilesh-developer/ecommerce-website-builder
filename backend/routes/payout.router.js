import { Router } from "express";
import { addPayoutTransactionDetails, getAllPayouts, getPayoutData, getStorePayouts, payoutRequest, updatePayoutStatus } from "../controllers/payout.controller.js";
const router = Router()

router.route("/request-payout").post(payoutRequest)

router.route("/get-payouts/:storeId").get(getStorePayouts)

router.route("/get-all-payouts").get(getAllPayouts)

router.route("/data/:id").get(getPayoutData)

router.route("/update-status").post(updatePayoutStatus)

router.route("/add-transaction-details").post(addPayoutTransactionDetails)

export { router as payoutRouter }