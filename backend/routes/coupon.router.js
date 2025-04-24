import { Router } from "express";
import { checkCoupon, createCoupon, deleteCoupon, editCoupon, getCouponData, getSingleCouponData } from "../controllers/coupon.controller.js";
const router = Router()

router.route("/create").post(createCoupon)

router.route("/data/:id").get(getSingleCouponData)

router.route("/get-data/:storeid").get(getCouponData)

router.route("/edit/:id").patch(editCoupon)

router.route("/delete/:id").delete(deleteCoupon)

router.route("/check").post(checkCoupon)

export { router as couponRouter }