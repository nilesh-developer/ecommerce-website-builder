import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVisit, allCustomers, allOrders, allPayouts, allStores, changeAdminPassword, getCustomerData, getPayoutDetails, getStoreData, loginAdmin, noOfAllData } from "../controllers/admin.controller.js";

const router = Router()

router.route("/login").post(loginAdmin)

router.route("/add-visit").get(addVisit)

router.route("/get-number-data").get(verifyJwt, noOfAllData)

router.route("/get-all-orders").get(verifyJwt, allOrders)

router.route("/get-all-stores").get(verifyJwt, allStores)

router.route("/get-all-customers").get(verifyJwt, allCustomers)

router.route("/get-all-payouts").get(verifyJwt, allPayouts)

router.route("/get-store-data/:id").get(verifyJwt, getStoreData)

router.route("/get-customer-data/:id").get(verifyJwt, getCustomerData)

router.route("/get-payout-details/:id").get(verifyJwt, getPayoutDetails)

router.route("/change-password").patch(verifyJwt, changeAdminPassword)

export { router as adminRouter }