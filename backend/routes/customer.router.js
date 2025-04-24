import { Router } from "express"
import { getCurrentCustomer, loginCustomer, registerCustomer, updatePassword, updateProfile } from "../controllers/customer.controller.js"
import { verifyCustomerJwt } from "../middlewares/customerauth.middleware.js"
const router = Router()

router.route("/register").post(registerCustomer)

router.route("/login").post(loginCustomer)

router.route("/current-customer").get(verifyCustomerJwt, getCurrentCustomer)

router.route("/update-profile").patch(verifyCustomerJwt,updateProfile)

router.route("/update-password").patch(verifyCustomerJwt,updatePassword)

export { router as customerRouter }