import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVisit, allCustomers, allOrders, allPayouts, allStores, loginAdmin, noOfAllData } from "../controllers/admin.controller.js";

const router = Router()

router.route("/login").post(loginAdmin)

router.route("/add-visit").get(addVisit)

router.route("/get-number-data").get(verifyJwt,noOfAllData)

router.route("/get-all-orders").get(verifyJwt,allOrders)

router.route("/get-all-stores").get(verifyJwt,allStores)

router.route("/get-all-customers").get(verifyJwt,allCustomers)

router.route("/get-all-payouts").get(verifyJwt,allPayouts)

export {router as adminRouter}