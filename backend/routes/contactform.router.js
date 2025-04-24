import { Router } from "express";
import { submitForm } from "../controllers/contactform.controller.js";

const router = Router()

router.route("/submit-form").post(submitForm)

export { router as contactFormRouter }