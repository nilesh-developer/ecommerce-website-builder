import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createCategory, getCategory, getCategoryData, updateCategory } from "../controllers/category.controller.js";

const router = Router()

router.route("/create").post(upload.single("image"),createCategory)

router.route("/get-data/:storeId").get(getCategoryData)

router.route("/data/:id").get(getCategory)

router.route("/edit/:id").patch(upload.single("image"),updateCategory)

export { router as categoryRouter }