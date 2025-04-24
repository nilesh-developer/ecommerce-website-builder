import { Router } from "express";
import {
    addCustomDomain,
    addUpi,
    businessdetails,
    changeCodStatus,
    changeRazorpayStatus,
    changeStoreStatus,
    changeUpiStatus,
    createStore,
    deleteStore,
    deleteUpiId,
    getCurrentStoreData,
    getCustomerData,
    storeData,
    updatePolicies,
    updateAboutPage,
    updateSocial,
    updateStoreName,
    uploadStoreImage
} from "../controllers/store.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/create-store").post(createStore)

router.route("/businessdetails").post(businessdetails)

router.route("/data").post(getCurrentStoreData)

router.route("/add-domain/:id").patch(addCustomDomain)

router.route("/update/basic/:id").patch(verifyJwt, updateStoreName)

router.route("/update/social/:id").patch(verifyJwt, updateSocial)

router.route("/update/policy/:id").patch(verifyJwt, updatePolicies)

router.route("/update/aboutpage/:id").patch(verifyJwt, updateAboutPage)

router.route("/update/status/:id").patch(verifyJwt, changeStoreStatus)

router.route("/delete/:id").delete(verifyJwt, deleteStore)

router.route("/subdomain/:subdomain").get(storeData)

router.route("/cod/change-status/:storeId").patch(changeCodStatus)

router.route("/razorpay/change-status/:storeId").patch(changeRazorpayStatus)

router.route("/upi/add/:storeId").patch(addUpi)

router.route("/upi/change-status/:storeId").patch(changeUpiStatus)

router.route("/upi/delete/:storeId").delete(deleteUpiId)

router.route("/upload/images").post(
    upload.fields([
        {
            name: "logo",
            maxCount: 1
        },
        {
            name: "favicon",
            maxCount: 1
        },
        {
            name: "banner",
            maxCount: 1
        },
        {
            name: "mobileBanner",
            maxCount: 1
        },
    ]), uploadStoreImage)

router.route("/customer-data/:storeId").get(getCustomerData)

export { router as storeRouter }